import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.2";

const SUPABASE_URL = "https://wbuyglftsgldasawsllt.supabase.co";
const SUPABASE_KEY = "sb_publishable_GJt9mKuvro43J_iJZduL6w_3SWPPAfG";
const FUNCTION_URL = SUPABASE_URL + "/functions/v1/trakt-sync";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const lang = document.documentElement.lang || "en";

const copy = {
  ar: {
    heading: "مكتبتي السينمائية",
    account: "فتح حساب SODO", connect: "اربط حساب Trakt من صفحة حسابك لعرض المشاهدات هنا.",
    movies: "الأفلام التي شاهدتها", series: "المسلسلات التي شاهدتها",
    empty: "لا توجد مشاهدات مسجلة في هذا القسم بعد.", loading: "جارٍ تحميل مكتبتك السينمائية…",
    failed: "تعذّر تحميل المكتبة السينمائية حالياً.",
    watchedLabel: "تمت مشاهدته عبر Trakt", watched: "تمت مشاهدته", episodes: "حلقة", last: "آخر مشاهدة",
    season: "الموسم", episode: "الحلقة"
  },
  en: {
    heading: "My watched library",
    account: "Open SODO account", connect: "Connect Trakt from your account page to show your activity here.",
    movies: "Movies I have watched", series: "Series I have watched",
    empty: "No watch history in this section yet.", loading: "Loading your watched library…",
    failed: "Could not load the watched library right now.",
    watchedLabel: "Watched via Trakt", watched: "Watched", episodes: "episodes", last: "Last watched",
    season: "Season", episode: "Episode"
  },
  ru: {
    heading: "Моя коллекция просмотренного",
    account: "Открыть аккаунт SODO", connect: "Подключите Trakt на странице аккаунта, чтобы увидеть просмотры здесь.",
    movies: "Просмотренные фильмы", series: "Просмотренные сериалы",
    empty: "В этом разделе пока нет просмотров.", loading: "Загрузка моей коллекции…",
    failed: "Не удалось загрузить коллекцию прямо сейчас.",
    watchedLabel: "Просмотрено через Trakt", watched: "Просмотрено", episodes: "эпизодов", last: "Последний просмотр",
    season: "Сезон", episode: "Серия"
  }
};
const t = copy[lang] || copy.en;

function addStyles() {
  if (document.getElementById("trakt-private-styles")) return;
  const style = document.createElement("style");
  style.id = "trakt-private-styles";
  style.textContent = `
    .trakt-private-panel{margin-top:30px;padding-top:22px;border-top:1px solid var(--border)}
    .trakt-private-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px}
    .trakt-private-heading h3{margin:0;color:var(--text);font-size:16px;font-weight:650}
    .trakt-private-label{display:inline-flex;align-items:center;border:1px solid var(--accent);border-radius:999px;padding:3px 8px;color:var(--accent);font-size:9px;letter-spacing:1px}
    .trakt-private-note{margin:8px 0 0;color:var(--accent);font-size:10px;text-align:center}
    .trakt-private-message{margin:12px 0;color:var(--muted);font-size:13px}
    .trakt-private-message a{color:var(--accent);text-decoration:underline;text-underline-offset:3px}
    .trakt-private-poster{display:flex;aspect-ratio:2/3;align-items:center;justify-content:center;overflow:hidden;border-radius:8px;padding:14px;background:radial-gradient(ellipse at 50% 35%,#303d26 0%,#171e14 48%,#0b0e0a 100%);color:var(--accent);font-size:clamp(12px,2vw,18px);font-weight:800;text-align:center;overflow-wrap:anywhere}
    .trakt-private-poster span{display:block;max-width:100%;text-shadow:0 2px 14px #000}
    .trakt-private-meta{display:flex;justify-content:center;flex-wrap:wrap;gap:6px;color:var(--muted);font-size:10px;line-height:1.5;text-align:center}
    .trakt-private-meta span{overflow-wrap:anywhere}
    .trakt-private-card{cursor:default!important}
    .trakt-private-card:hover{transform:none}
    [dir="rtl"] .trakt-private-heading{flex-direction:row}
  `;
  document.head.appendChild(style);
}

function messageNode(text, withAccountLink = false) {
  const p = document.createElement("p");
  p.className = "trakt-private-message";
  p.textContent = text + (withAccountLink ? " " : "");
  if (withAccountLink) {
    const link = document.createElement("a");
    link.href = "/sodo/account/";
    link.textContent = t.account;
    p.appendChild(link);
  }
  return p;
}

function makePanel(section, kind) {
  const panel = document.createElement("div");
  panel.className = "trakt-private-panel";
  panel.dataset.traktPrivatePanel = kind;
  const header = document.createElement("div");
  header.className = "trakt-private-heading";
  const title = document.createElement("h3");
  title.textContent = t.heading + " — " + (kind === "movie" ? t.movies : t.series);
  const label = document.createElement("span");
  label.className = "trakt-private-label";
  label.textContent = t.watchedLabel;
  header.append(title, label);
  panel.append(header);
  section.append(panel);
  return panel;
}

function addMeta(parent, value) {
  if (value === null || value === undefined || value === "") return;
  const span = document.createElement("span");
  span.textContent = String(value);
  parent.append(span);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function normalize(value) {
  return String(value || "").normalize("NFKC").trim().toLocaleLowerCase();
}

function renderItems(panel, items, kind) {
  const grid = document.createElement("div");
  grid.className = "movie-grid trakt-private-grid";
  const existingCards = Array.from(panel.closest(".cinema-section").querySelectorAll(":scope > .movie-grid:not(.trakt-private-grid) .movie-card"));
  for (const item of items) {
    const title = item.title || (kind === "movie" ? "Untitled movie" : "Untitled series");
    const existing = existingCards.find(card => normalize(card.querySelector("h3")?.textContent) === normalize(title));
    const count = kind === "movie" ? null : item.episode_count;
    const countText = kind === "movie" ? t.watched : count + " " + t.episodes;
    const metaText = [item.year, countText].filter(Boolean);

    if (existing) {
      const info = existing.querySelector(".movie-card-info");
      if (info && !info.querySelector(".trakt-private-note")) {
        const note = document.createElement("p");
        note.className = "trakt-private-note";
        note.textContent = t.watchedLabel + " · " + countText;
        info.append(note);
      }
      continue;
    }

    const card = document.createElement("article");
    card.className = "movie-card trakt-private-card";
    const poster = document.createElement("div");
    poster.className = "trakt-private-poster";
    const posterTitle = document.createElement("span");
    posterTitle.textContent = title;
    poster.append(posterTitle);
    const info = document.createElement("div");
    info.className = "movie-card-info";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const meta = document.createElement("div");
    meta.className = "trakt-private-meta";
    metaText.forEach(value => addMeta(meta, value));
    if (kind === "series" && item.last_season !== null && item.last_episode !== null) {
      addMeta(meta, t.season + " " + item.last_season + " · " + t.episode + " " + item.last_episode);
    }
    const badge = document.createElement("div");
    badge.className = "trakt-private-note";
    badge.textContent = t.watchedLabel;
    info.append(heading, meta, badge);
    card.append(poster, info);
    grid.append(card);
  }
  if (grid.children.length) panel.append(grid);
  else panel.append(messageNode(t.empty));
}

function clearPanels() {
  document.querySelectorAll(".trakt-private-panel").forEach(node => node.remove());
  document.querySelectorAll(".trakt-private-note").forEach(node => node.remove());
}

async function callFunction(action, accessToken = null) {
  const requestHeaders = { "Content-Type": "application/json", "apikey": SUPABASE_KEY };
  if (accessToken) requestHeaders.Authorization = "Bearer " + accessToken;
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ action })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Request failed");
  return result;
}

async function loadPrivateHistory() {
  clearPanels();
  let session = null;
  try {
    const result = await supabase.auth.getSession();
    session = result.data.session;
    if (session && session.expires_at && session.expires_at < Math.floor(Date.now() / 1000) + 60) {
      const refreshed = await supabase.auth.refreshSession();
      session = refreshed.data.session;
    }
  } catch { session = null; }

  addStyles();
  const sections = { movie: document.getElementById("watched"), series: document.getElementById("series") };
  const panels = {};
  for (const kind of ["movie", "series"]) {
    if (sections[kind]) panels[kind] = makePanel(sections[kind], kind);
  }
  for (const panel of Object.values(panels)) panel.append(messageNode(t.loading));

  if (session?.access_token) {
    try {
      const status = await callFunction("status", session.access_token);
      if (status.connected) await callFunction("sync", session.access_token);
    } catch (error) { console.warn("SODO Trakt sync:", error); }
  }

  try {
    const history = await callFunction("public-history");
    for (const kind of ["movie", "series"]) {
      const panel = panels[kind];
      if (!panel) continue;
      panel.querySelector(".trakt-private-message")?.remove();
      renderItems(panel, kind === "movie" ? (history.movies || []) : (history.series || []), kind);
    }
  } catch (error) {
    for (const panel of Object.values(panels)) {
      panel.querySelector(".trakt-private-message")?.remove();
      panel.append(messageNode(t.failed));
    }
    console.error("SODO public watch library:", error);
  }
}

let isLoading = false;
let refreshPending = false;
async function refresh() {
  if (isLoading) {
    refreshPending = true;
    return;
  }
  isLoading = true;
  do {
    refreshPending = false;
    await loadPrivateHistory();
  } while (refreshPending);
  isLoading = false;
}
supabase.auth.onAuthStateChange(() => { queueMicrotask(refresh); });
refresh();
document.documentElement.dataset.traktHistoryReady = "true";
