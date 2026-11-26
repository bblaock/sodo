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
    season: "الموسم", episode: "الحلقة", details: "التفاصيل", synopsis: "القصة", genres: "التصنيفات", cast: "طاقم التمثيل", status: "الحالة", runtime: "المدة", certification: "التصنيف العمري", trailer: "الإعلان", homepage: "الموقع الرسمي",
    syncSummary: (movies, episodes, enriched, pending) => `مزامنة Trakt: ${movies} فيلم · ${episodes} حلقة · ${enriched} عمل اكتملت بياناته${pending ? ` · المتبقي ${pending}` : ""}`,
    noMovies: "لم يُرجع Trakt سجلات أفلام في هذه المزامنة. تحقق من قائمة الأفلام المشاهدة في حساب Trakt."
  },
  en: {
    heading: "My watched library",
    account: "Open SODO account", connect: "Connect Trakt from your account page to show your activity here.",
    movies: "Movies I have watched", series: "Series I have watched",
    empty: "No watch history in this section yet.", loading: "Loading your watched library…",
    failed: "Could not load the watched library right now.",
    watchedLabel: "Watched via Trakt", watched: "Watched", episodes: "episodes", last: "Last watched",
    season: "Season", episode: "Episode", details: "Details", synopsis: "Synopsis", genres: "Genres", cast: "Cast", status: "Status", runtime: "Runtime", certification: "Certification", trailer: "Trailer", homepage: "Official site",
    syncSummary: (movies, episodes, enriched, pending) => `Trakt sync: ${movies} movies · ${episodes} episodes · ${enriched} titles enriched${pending ? ` · ${pending} remaining` : ""}`,
    noMovies: "Trakt returned no watched-movie records in this sync. Check the watched movies list in your Trakt account."
  },
  ru: {
    heading: "Моя коллекция просмотренного",
    account: "Открыть аккаунт SODO", connect: "Подключите Trakt на странице аккаунта, чтобы увидеть просмотры здесь.",
    movies: "Просмотренные фильмы", series: "Просмотренные сериалы",
    empty: "В этом разделе пока нет просмотров.", loading: "Загрузка моей коллекции…",
    failed: "Не удалось загрузить коллекцию прямо сейчас.",
    watchedLabel: "Просмотрено через Trakt", watched: "Просмотрено", episodes: "эпизодов", last: "Последний просмотр",
    season: "Сезон", episode: "Серия", details: "Подробности", synopsis: "Описание", genres: "Жанры", cast: "Актёры", status: "Статус", runtime: "Длительность", certification: "Возрастной рейтинг", trailer: "Трейлер", homepage: "Официальный сайт",
    syncSummary: (movies, episodes, enriched, pending) => `Синхронизация Trakt: ${movies} фильмов · ${episodes} эпизодов · ${enriched} карточек дополнено${pending ? ` · осталось ${pending}` : ""}`,
    noMovies: "Trakt не вернул записи о просмотренных фильмах. Проверьте список просмотренных фильмов в аккаунте Trakt."
  }
};
const t = copy[lang] || copy.en;

function addStyles() {
  if (document.getElementById("trakt-private-styles")) return;
  const style = document.createElement("style");
  style.id = "trakt-private-styles";
  style.textContent = `
    .trakt-sync-summary{margin:12px 0;padding:9px 12px;border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:11px;line-height:1.6;text-align:center}
    .trakt-sync-summary.is-warning{border-color:var(--accent);color:var(--accent)}
    .trakt-imported-details{margin-top:10px;color:var(--muted);font-size:11px;line-height:1.6;text-align:start}
    .trakt-imported-details summary{cursor:pointer;color:var(--accent);font-weight:650;text-align:center}
    .trakt-imported-details p{margin:7px 0}
    .trakt-imported-details strong{color:var(--text)}
    .trakt-imported-details a{color:var(--accent);text-decoration:underline;text-underline-offset:3px;margin-inline-end:8px}
    .trakt-poster-placeholder{display:flex;align-items:center;justify-content:center;padding:14px;background:radial-gradient(ellipse at 50% 35%,#303d26 0%,#171e14 48%,#0b0e0a 100%);color:var(--accent);font-weight:800;text-align:center;overflow-wrap:anywhere}
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

function cardYear(card) {
  const value = card.querySelector('.movie-meta span')?.textContent || '';
  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}
function manualIds(card) {
  const links = Array.from(card.querySelectorAll('a[href]')).map(link => link.href);
  const imdb = card.dataset.imdbId || links.map(url => url.match(/imdb\.com\/title\/(tt\d+)/i)?.[1]).find(Boolean) || null;
  const tmdb = card.dataset.tmdbId || links.map(url => url.match(/themoviedb\.org\/(?:movie|tv)\/(\d+)/i)?.[1]).find(Boolean) || null;
  return { imdb: imdb ? String(imdb) : null, tmdb: tmdb ? String(tmdb) : null };
}
function findManualCard(cards, item) {
  const incomingImdb = item.imdb_id ? String(item.imdb_id) : null;
  if (incomingImdb) {
    const match = cards.find(card => manualIds(card).imdb === incomingImdb);
    if (match) return match;
  }
  const incomingTmdb = item.tmdb_id ? String(item.tmdb_id) : null;
  if (incomingTmdb) {
    const match = cards.find(card => manualIds(card).tmdb === incomingTmdb);
    if (match) return match;
  }
  const title = normalize(item.title);
  return cards.find(card => {
    if (!title || normalize(card.querySelector('h3')?.textContent) !== title) return false;
    const year = cardYear(card);
    return !item.year || !year || Number(item.year) === year;
  });
}
function createImportedCard(item, kind) {
  const title = item.title || (kind === 'movie' ? 'Untitled movie' : 'Untitled series');
  const card = document.createElement('article');
  card.className = 'movie-card trakt-imported-card';
  card.dataset.traktImported = 'true';
  const target = 'https://trakt.tv/' + (kind === 'movie' ? 'movies/' : 'shows/') + encodeURIComponent(item.trakt_id || title);
  const posterLink = document.createElement('a');
  posterLink.className = 'poster-link';
  posterLink.href = target; posterLink.target = '_blank'; posterLink.rel = 'noopener noreferrer';
  if (item.poster_url) {
    const image = document.createElement('img');
    image.className = 'movie-poster'; image.src = item.poster_url; image.alt = title + ' poster';
    image.loading = 'lazy'; image.decoding = 'async'; posterLink.append(image);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'movie-poster trakt-poster-placeholder'; placeholder.textContent = title; posterLink.append(placeholder);
  }
  const info = document.createElement('div'); info.className = 'movie-card-info';
  const heading = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.className = 'movie-title-link'; titleLink.href = target; titleLink.target = '_blank';
  titleLink.rel = 'noopener noreferrer'; titleLink.textContent = title; heading.append(titleLink);
  const meta = document.createElement('div'); meta.className = 'movie-meta';
  addMeta(meta, item.year);
  if (kind === 'series' && item.episode_count) addMeta(meta, item.episode_count + ' ' + t.episodes);
  if (item.rating) addMeta(meta, Number(item.rating).toFixed(1) + '/10');
  if (item.runtime) addMeta(meta, item.runtime + ' min');
  if (item.certification) addMeta(meta, item.certification);
  info.append(heading, meta);
  card.append(posterLink, info);
  return card;
}
function renderItems(section, items, kind) {
  const grid = section?.querySelector('.movie-grid');
  if (!grid) return;
  const manualCards = Array.from(grid.querySelectorAll('.movie-card:not([data-trakt-imported])'));
  for (const item of items) {
    const manual = findManualCard(manualCards, item);
    if (manual) continue;
    if (findManualCard(Array.from(grid.querySelectorAll('[data-trakt-imported]')), item)) continue;
    grid.append(createImportedCard(item, kind));
  }
}
function renderSyncSummary(result) {
  const section = document.getElementById('watched');
  if (!section || !result) return;
  const note = document.createElement('p');
  note.className = 'trakt-sync-summary';
  const movies = Number(result.watched_movie_items || 0);
  const episodes = Number(result.history_episode_rows_seen || 0);
  const enriched = Number(result.metadata_updated || 0);
  const pending = Number(result.metadata_pending || 0);
  note.textContent = t.syncSummary(movies, episodes, enriched, pending);
  if (movies === 0 && Number(result.history_movie_rows_seen || 0) === 0) {
    note.classList.add('is-warning');
    note.append(document.createTextNode(' — ' + t.noMovies));
  }
  const grid = section.querySelector('.movie-grid');
  section.insertBefore(note, grid || section.firstChild);
}
function clearPanels() {
  document.querySelectorAll('[data-trakt-imported]').forEach(node => node.remove());
  document.querySelectorAll('.trakt-watch-badge, .trakt-sync-summary, .trakt-imported-details').forEach(node => node.remove());
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
      const refreshed = await supabase.auth.refreshSession(); session = refreshed.data.session;
    }
  } catch { session = null; }
  addStyles();
  if (session?.access_token) {
    try {
      const status = await callFunction('status', session.access_token);
      if (status.connected) {
        await callFunction('sync', session.access_token);
      }
    } catch (error) { console.warn('SODO Trakt sync:', error); }
  }
  try {
    const history = await callFunction('public-history');
    renderItems(document.getElementById('watched'), history.movies || [], 'movie');
    renderItems(document.getElementById('series'), history.series || [], 'series');
  } catch (error) {
    console.error('SODO public watch library:', error);
    document.documentElement.dataset.traktHistoryError = 'true';
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
  document.documentElement.dataset.traktHistoryReady = "true";
}
supabase.auth.onAuthStateChange(() => { queueMicrotask(refresh); });
refresh();
