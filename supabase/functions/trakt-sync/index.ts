import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TRAKT_CLIENT_ID = "_T6j_nnJftnEGLtgQ-E1iWD7EuSjVOv7e-e0x5Z5IPw";
const REDIRECT_URI = "https://bblaock.github.io/sodo/";
const ORIGIN = "https://bblaock.github.io";
const PUBLIC_WATCH_HISTORY_USER_ID = "f720934d-a7de-4d49-bf01-9fccfc99eb32";
const TRAKT_API = "https://api.trakt.tv";
const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const headers = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
const publicJson = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "public, max-age=60, s-maxage=300" } });
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
const unhex = (s: string) => new Uint8Array((s.match(/.{1,2}/g) || []).map(x => parseInt(x, 16)));
const sha256 = async (s: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
async function encryptionKey() {
  const { data, error } = await db.rpc("sodo_trakt_encryption_key");
  if (error || !data) throw new Error("Token encryption key is unavailable");
  const raw = unhex(String(data));
  if (raw.length !== 32) throw new Error("Token encryption key has an invalid length");
  return await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function encryptToken(token: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await encryptionKey(), new TextEncoder().encode(token)));
  const combined = new Uint8Array(iv.length + encrypted.length);
  combined.set(iv); combined.set(encrypted, iv.length);
  return hex(combined);
}
async function decryptToken(cipherHex: string) {
  const combined = unhex(cipherHex);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, await encryptionKey(), ciphertext);
  return new TextDecoder().decode(plain);
}
async function saveTokens(userId: string, tokens: any) {
  const [access, refresh] = await Promise.all([encryptToken(tokens.access_token), encryptToken(tokens.refresh_token)]);
  const expiresAt = new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString();
  const { error } = await db.rpc("sodo_trakt_store_credentials", {
    p_user_id: userId, p_access_hex: access, p_refresh_hex: refresh,
    p_expires_at: expiresAt, p_scope: String(tokens.scope || ""),
  });
  if (error) throw new Error("Could not securely store Trakt credentials");
}
async function userFromRequest(req: Request) {
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("Sign in to your SODO account first");
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) throw new Error("Your SODO session is invalid or expired");
  return data.user;
}
async function credentials(userId: string) {
  const { data, error } = await db.rpc("sodo_trakt_get_credentials", { p_user_id: userId });
  if (error) throw new Error("Could not read Trakt connection");
  if (!data?.access_hex || !data?.refresh_hex) return null;
  return data;
}
async function validAccessToken(userId: string, creds: any) {
  if (new Date(creds.expires_at).getTime() > Date.now() + 5 * 60 * 1000) return await decryptToken(creds.access_hex);
  const refresh = await decryptToken(creds.refresh_hex);
  const response = await fetch(TRAKT_API + "/oauth/token", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh, client_id: TRAKT_CLIENT_ID, redirect_uri: REDIRECT_URI, grant_type: "refresh_token" }),
  });
  if (!response.ok) throw new Error("Trakt session expired; reconnect your Trakt account");
  const tokens = await response.json();
  await saveTokens(userId, tokens);
  return tokens.access_token as string;
}
async function traktFetch(path: string, accessToken: string) {
  const response = await fetch(TRAKT_API + path, {
    headers: { Authorization: "Bearer " + accessToken, "trakt-api-key": TRAKT_CLIENT_ID, "trakt-api-version": "2" },
  });
  if (!response.ok) throw new Error("Trakt API request failed (" + response.status + ")");
  return response;
}
function historyRows(items: any[], userId: string) {
  return items.flatMap((entry: any) => {
    const watchedAt = entry.watched_at;
    if (entry.type === "movie" && entry.movie?.ids?.trakt) {
      const m = entry.movie;
      return [{ user_id: userId, trakt_id: m.ids.trakt, media_type: "movie", title: m.title, year: m.year ?? null, watched_at: watchedAt, imdb_id: m.ids.imdb ?? null, tmdb_id: m.ids.tmdb ?? null }];
    }
    if (entry.type === "episode" && entry.episode?.ids?.trakt) {
      const e = entry.episode, s = entry.show || {};
      return [{ user_id: userId, trakt_id: e.ids.trakt, media_type: "episode", title: e.title, year: s.year ?? null, watched_at: watchedAt, imdb_id: s.ids?.imdb ?? null, tmdb_id: s.ids?.tmdb ?? null, show_trakt_id: s.ids?.trakt ?? null, show_title: s.title ?? null, season_number: e.season ?? null, episode_number: e.number ?? null }];
    }
    return [];
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.headers.get("Origin") && req.headers.get("Origin") !== ORIGIN) return json({ error: "Origin not allowed" }, 403);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }
  const action = String(body.action || "");
  try {
    if (action === "public-history") {
      const { data: rows, error } = await db.from("sodo_watch_history")
        .select("media_type,trakt_id,title,year,watched_at,show_trakt_id,show_title")
        .eq("user_id", PUBLIC_WATCH_HISTORY_USER_ID)
        .order("watched_at", { ascending: false }).limit(5000);
      if (error) throw new Error("Could not read the public SODO watch library");
      const movies = new Map<number, any>();
      const series = new Map<string, any>();
      for (const row of rows || []) {
        if (row.media_type === "movie") {
          const key = Number(row.trakt_id);
          if (!movies.has(key)) movies.set(key, { title: row.title, year: row.year });
        } else if (row.media_type === "episode" && row.show_title) {
          const key = String(row.show_trakt_id || row.show_title);
          const item = series.get(key) || { title: row.show_title, year: row.year, episode_ids: new Set<number>() };
          item.episode_ids.add(Number(row.trakt_id));
          series.set(key, item);
        }
      }
      return publicJson({
        movies: Array.from(movies.values()),
        series: Array.from(series.values()).map(({ title, year, episode_ids }) => ({ title, year, episode_count: episode_ids.size })),
      });
    }
    if (action === "callback") {
      if (!body.code || !body.state) return json({ error: "Missing Trakt authorization code or state" }, 400);
      const stateHash = hex(await sha256(String(body.state)));
      const { data: session, error } = await db.rpc("sodo_trakt_take_oauth_session", { p_state_hash: stateHash });
      if (error || !session?.user_id) return json({ error: "Trakt authorization expired or state was invalid. Start again." }, 400);
      const tokenResponse = await fetch(TRAKT_API + "/oauth/token", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: body.code, client_id: TRAKT_CLIENT_ID, redirect_uri: session.redirect_uri, grant_type: "authorization_code", code_verifier: session.code_verifier }),
      });
      if (!tokenResponse.ok) return json({ error: "Trakt authorization could not be completed" }, 400);
      const tokens = await tokenResponse.json();
      await saveTokens(session.user_id, tokens);
      return json({ connected: true, redirect_to: REDIRECT_URI + "?trakt=connected" });
    }

    const user = await userFromRequest(req);
    if (action === "start") {
      const random = (n: number) => crypto.getRandomValues(new Uint8Array(n));
      const verifier = b64url(random(48));
      const state = b64url(random(32));
      const challenge = b64url(await sha256(verifier));
      const { error } = await db.rpc("sodo_trakt_create_oauth_session", {
        p_state_hash: hex(await sha256(state)), p_user_id: user.id,
        p_code_verifier: verifier, p_redirect_uri: REDIRECT_URI,
        p_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });
      if (error) throw new Error("Could not start secure Trakt authorization");
      const url = new URL("https://trakt.tv/oauth/authorize");
      url.search = new URLSearchParams({ response_type: "code", client_id: TRAKT_CLIENT_ID, redirect_uri: REDIRECT_URI, state, code_challenge: challenge, code_challenge_method: "S256" }).toString();
      return json({ authorization_url: url.toString() });
    }
    if (action === "status") {
      const creds = await credentials(user.id);
      const { data: sync } = await db.rpc("sodo_trakt_get_sync_state", { p_user_id: user.id });
      return json({ connected: !!creds, last_synced_at: sync?.last_synced_at ?? null, last_error: sync?.last_error ?? null });
    }
    if (action === "disconnect") {
      const { error } = await db.rpc("sodo_trakt_disconnect", { p_user_id: user.id });
      if (error) throw new Error("Could not disconnect Trakt");
      return json({ connected: false });
    }
    if (action === "history") {
      const { data: rows, error } = await db
        .from("sodo_watch_history")
        .select("media_type,trakt_id,title,year,watched_at,show_trakt_id,show_title,season_number,episode_number")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false })
        .limit(5000);
      if (error) throw new Error("Could not read your private watch history");

      const movies = new Map<number, any>();
      const series = new Map<string, any>();
      for (const row of rows || []) {
        if (row.media_type === "movie") {
          const key = Number(row.trakt_id);
          const item = movies.get(key) || {
            title: row.title, year: row.year, last_watched_at: row.watched_at,
          };
          if (new Date(row.watched_at).getTime() > new Date(item.last_watched_at).getTime()) item.last_watched_at = row.watched_at;
          movies.set(key, item);
        } else if (row.media_type === "episode" && row.show_title) {
          const key = String(row.show_trakt_id || row.show_title);
          const item = series.get(key) || {
            title: row.show_title, year: row.year, episode_ids: new Set<number>(),
            last_watched_at: row.watched_at, last_season: row.season_number,
            last_episode: row.episode_number,
          };
          item.episode_ids.add(Number(row.trakt_id));
          if (new Date(row.watched_at).getTime() > new Date(item.last_watched_at).getTime()) {
            item.last_watched_at = row.watched_at;
            item.last_season = row.season_number;
            item.last_episode = row.episode_number;
          }
          series.set(key, item);
        }
      }
      return json({
        movies: Array.from(movies.values())
          .map(({ title, year, last_watched_at }) => ({ title, year, last_watched_at }))
          .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime()),
        series: Array.from(series.values())
          .map(({ title, year, episode_ids, last_watched_at, last_season, last_episode }) => ({
            title, year, episode_count: episode_ids.size, last_watched_at, last_season, last_episode,
          }))
          .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime()),
      });
    }
    if (action === "sync") {
      const creds = await credentials(user.id);
      if (!creds) return json({ error: "Trakt is not connected yet" }, 409);
      const accessToken = await validAccessToken(user.id, creds);
      const activityResponse = await traktFetch("/sync/last_activities", accessToken);
      const activities = await activityResponse.json();

      // Trakt's watched list is separate from watch history. Import it on every sync
      // so a movie marked Watched is not missed when last_activities is unchanged.
      let watchedMovieTotal = 0;
      let watchedPage = 1;
      let watchedPageCount = 1;
      do {
        const response = await traktFetch("/sync/watched/movies?page=" + watchedPage + "&limit=250", accessToken);
        watchedPageCount = Number(response.headers.get("x-pagination-page-count") || 1);
        const items = await response.json();
        if (!Array.isArray(items) || items.length === 0) break;
        const rows = items.flatMap((entry: any) => {
          const movie = entry.movie;
          const watchedAt = entry.last_watched_at || entry.last_updated_at;
          if (!movie?.ids?.trakt || !watchedAt) return [];
          return [{
            user_id: user.id, trakt_id: movie.ids.trakt, media_type: "movie",
            title: movie.title, year: movie.year ?? null, watched_at: watchedAt,
            imdb_id: movie.ids.imdb ?? null, tmdb_id: movie.ids.tmdb ?? null,
          }];
        });
        for (let i = 0; i < rows.length; i += 500) {
          const { data, error } = await db.from("sodo_watch_history")
            .upsert(rows.slice(i, i + 500), {
              onConflict: "user_id,media_type,trakt_id,watched_at", ignoreDuplicates: true,
            })
            .select("trakt_id");
          if (error) throw new Error("Could not save watched movies from Trakt");
          watchedMovieTotal += data?.length || 0;
        }
        if (watchedPage >= watchedPageCount) break;
        watchedPage++;
      } while (watchedPage <= 1000);

      const { data: previousState } = await db.rpc("sodo_trakt_get_sync_state", { p_user_id: user.id });
      const activitiesUnchanged = previousState?.last_activities &&
        JSON.stringify(previousState.last_activities) === JSON.stringify(activities);
      if (activitiesUnchanged) {
        const now = new Date().toISOString();
        const { error } = await db.rpc("sodo_trakt_set_sync_state", {
          p_user_id: user.id, p_last_activities: activities, p_last_synced_at: now, p_last_error: null,
        });
        if (error) throw new Error("Could not save sync status");
        return json({
          synced: watchedMovieTotal > 0, unchanged: watchedMovieTotal === 0,
          imported: watchedMovieTotal, last_synced_at: now,
        });
      }

      let total = watchedMovieTotal, page = 1, pageCount = 100;
      do {
        const response = await traktFetch("/sync/history?page=" + page + "&limit=100", accessToken);
        pageCount = Math.min(Number(response.headers.get("x-pagination-page-count") || 100), 100);
        const items = await response.json();
        if (!Array.isArray(items) || items.length === 0) break;
        const rows = historyRows(items, user.id);
        for (let i = 0; i < rows.length; i += 500) {
          const { error } = await db.from("sodo_watch_history").upsert(rows.slice(i, i + 500), { onConflict: "user_id,media_type,trakt_id,watched_at", ignoreDuplicates: true });
          if (error) throw new Error("Could not save private watch history");
        }
        total += rows.length;
        if (items.length < 100) break;
        page++;
      } while (page <= pageCount);
      const now = new Date().toISOString();
      const { error } = await db.rpc("sodo_trakt_set_sync_state", { p_user_id: user.id, p_last_activities: activities, p_last_synced_at: now, p_last_error: null });
      if (error) throw new Error("Could not save sync status");
      return json({ synced: true, imported: total, last_synced_at: now });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return json({ error: message }, 400);
  }
});