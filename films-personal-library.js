import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.2";

const SUPABASE_URL = "https://wbuyglftsgldasawsllt.supabase.co";
const SUPABASE_KEY = "sb_publishable_GJt9mKuvro43J_iJZduL6w_3SWPPAfG";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const lang = document.documentElement.lang || "en";
const PAGE_SIZE = 6;

const copy = {
  ar: {
    tab: "قائمتي", heading: "قائمتي السينمائية", intro: "مساحة خاصة لتنظيم ما تريد مشاهدته وما بدأت بمتابعته.",
    all: "كل الحالات", watchlist: "قائمة المشاهدة", watching: "أتابعه حالياً", watched: "شاهدته", upcoming: "قادم", dropped: "متوقف عنه",
    notAdded: "＋ أضف إلى قائمتي", statusLabel: "حالة المشاهدة", remove: "إزالة من قائمتي",
    empty: "قائمتك فارغة حالياً. أضف الأعمال من بطاقاتها في المكتبة.", loading: "جارٍ تحميل قائمتك…",
    failed: "تعذّر تحميل قائمتك حالياً.", saved: "تم حفظ التغيير.", saveFailed: "تعذّر حفظ التغيير. حاول مرة أخرى.",
    showing: (a,b,n)=>`عرض ${a}–${b} من ${n}`, previous:"السابق", next:"التالي", page:"الصفحة",
    noResults:"لا توجد أعمال بهذه الحالة.", private:"قائمة خاصة بحسابك"
  },
  en: {
    tab:"My List", heading:"My Cinema List", intro:"A private space to organize what you plan to watch and what you're following.",
    all:"All statuses", watchlist:"Watchlist", watching:"Currently watching", watched:"Watched", upcoming:"Upcoming", dropped:"Dropped",
    notAdded:"＋ Add to my list", statusLabel:"Watch status", remove:"Remove from my list",
    empty:"Your list is empty. Add titles using the controls on cards in the library.", loading:"Loading your list…",
    failed:"Your list could not be loaded right now.", saved:"Your change was saved.", saveFailed:"Could not save that change. Try again.",
    showing:(a,b,n)=>`Showing ${a}–${b} of ${n}`, previous:"Previous", next:"Next", page:"Page",
    noResults:"No titles in this status.", private:"Private to your account"
  },
  ru: {
    tab:"Мой список", heading:"Мой список кино", intro:"Личное пространство для планирования просмотров и отслеживания сериалов.",
    all:"Все статусы", watchlist:"В планах", watching:"Смотрю сейчас", watched:"Просмотрено", upcoming:"Скоро", dropped:"Отложено",
    notAdded:"＋ Добавить в мой список", statusLabel:"Статус просмотра", remove:"Удалить из списка",
    empty:"Список пока пуст. Добавляйте фильмы с помощью элементов на карточках библиотеки.", loading:"Загрузка списка…",
    failed:"Не удалось загрузить список.", saved:"Изменение сохранено.", saveFailed:"Не удалось сохранить изменение. Попробуйте ещё раз.",
    showing:(a,b,n)=>`Показано ${a}–${b} из ${n}`, previous:"Назад", next:"Далее", page:"Страница",
    noResults:"В этом статусе пока нет фильмов.", private:"Доступно только вашему аккаунту"
  }
};
const t = copy[lang] || copy.en;
const statuses = ["watchlist","watching","watched","upcoming","dropped"];
let session = null;
let entries = [];
let searchQuery = "";
let currentPage = 1;

const $ = id => document.getElementById(id);
const statusLabel = value => t[value] || value;

function normalize(value) {
  return String(value || "").normalize("NFKC").trim().toLocaleLowerCase();
}
function getCardData(card) {
  const section = card.closest("#watched, #series");
  if (!section) return null;
  const title = card.querySelector(".movie-title-link, h3")?.textContent?.trim();
  if (!title) return null;
  const links = Array.from(card.querySelectorAll("a[href]")).map(a => a.href);
  const imdb = card.dataset.imdbId || links.map(url => url.match(/imdb\.com\/title\/(tt\d+)/i)?.[1]).find(Boolean) || null;
  const tmdb = card.dataset.tmdbId || links.map(url => url.match(/themoviedb\.org\/(?:movie|tv)\/(\d+)/i)?.[1]).find(Boolean) || null;
  const traktLink = links.find(url => url.includes("/films/trakt/"));
  const traktId = card.dataset.traktId || (traktLink ? new URL(traktLink).searchParams.get("id") : null);
  const detailLink = card.querySelector("a.movie-title-link[href], a.poster-link[href]");
  let slug = null;
  try { slug = new URL(detailLink?.href || location.href).pathname.match(/\/films\/([^/]+)/)?.[1] || null; } catch {}
  const mediaType = section.id === "series" ? "series" : "movie";
  const yearText = Array.from(card.querySelectorAll(".movie-meta span")).map(node => node.textContent.trim()).find(value => /^\d{4}$/.test(value));
  const ratingText = card.querySelector(".movie-rating span")?.textContent?.trim();
  const image = card.querySelector("img.movie-poster");
  const poster = image?.currentSrc || image?.src || image?.dataset.src || "";
  const mediaKey = imdb ? "imdb:" + mediaType + ":" + imdb : tmdb ? "tmdb:" + mediaType + ":" + tmdb : traktId ? "trakt:" + mediaType + ":" + traktId : slug && slug !== "trakt" ? "slug:" + mediaType + ":" + slug : "title:" + mediaType + ":" + normalize(title).slice(0,180) + ":" + (yearText || "0");
  return {
    media_key: mediaKey, media_type: mediaType, title: title.slice(0,300),
    release_year: yearText ? Number(yearText) : null,
    imdb_id: imdb, tmdb_id: tmdb ? Number(tmdb) : null, trakt_id: traktId ? Number(traktId) : null,
    imdb_rating: ratingText && Number.isFinite(Number(ratingText)) ? Number(ratingText) : null,
    poster_url: poster ? new URL(poster, location.href).href : null,
    detail_url: detailLink?.href || null
  };
}
function makeStatusSelect(value, label, isLibraryCard = false) {
  const select = document.createElement("select");
  select.className = "sodo-personal-status";
  select.setAttribute("aria-label", label || t.statusLabel);
  const none = document.createElement("option");
  none.value = ""; none.textContent = isLibraryCard ? t.remove : t.notAdded;
  select.append(none);
  statuses.forEach(status => {
    const option = document.createElement("option");
    option.value = status; option.textContent = statusLabel(status);
    select.append(option);
  });
  select.value = value || "";
  return select;
}
function attachCardControls() {
  if (!session) return;
  document.querySelectorAll("#watched .movie-card, #series .movie-card").forEach(card => {
    const data = getCardData(card);
    const info = card.querySelector(".movie-card-info");
    if (!data || !info) return;
    let control = info.querySelector(".sodo-personal-status");
    if (!control) {
      control = makeStatusSelect("", t.statusLabel);
      control.dataset.mediaKey = data.media_key;
      info.append(control);
      control.addEventListener("change", () => saveCardStatus(control, data));
    }
    const existing = entries.find(item => item.media_key === data.media_key);
    control.value = existing?.status || "";
  });
}
function showMessage(message, error = false) {
  const node = $("sodo-personal-message");
  if (!node) return;
  node.textContent = message || "";
  node.dataset.error = error ? "true" : "false";
}
async function saveCardStatus(control, data) {
  if (!session || control.disabled) return;
  const previous = entries.find(item => item.media_key === data.media_key);
  const nextStatus = control.value;
  control.disabled = true;
  try {
    if (!nextStatus) {
      const { error } = await supabase.from("sodo_user_library").delete()
        .eq("user_id", session.user.id).eq("media_key", data.media_key);
      if (error) throw error;
    } else {
      const payload = {
        ...data, user_id: session.user.id, status: nextStatus,
        watched_at: nextStatus === "watched" ? (previous?.watched_at || new Date().toISOString()) : null,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from("sodo_user_library")
        .upsert(payload, { onConflict: "user_id,media_key" });
      if (error) throw error;
    }
    await loadEntries();
    showMessage(t.saved);
  } catch (error) {
    control.value = previous?.status || "";
    showMessage(t.saveFailed, true);
    console.error("SODO personal library save:", error);
  } finally {
    control.disabled = false;
  }
}
function buildLibraryCard(item) {
  const card = document.createElement("article");
  card.className = "movie-card sodo-personal-card";
  const posterLink = document.createElement("a");
  posterLink.className = "poster-link";
  if (item.detail_url) {
    const localized = item.detail_url.replace(/\/sodo\/(?:ar|en|ru)\//, "/sodo/" + lang + "/");
    posterLink.href = localized;
    posterLink.target = "_blank";
    posterLink.rel = "noopener noreferrer";
  }
  if (item.poster_url) {
    const image = document.createElement("img");
    image.className = "movie-poster";
    image.src = item.poster_url;
    image.alt = item.title + " poster";
    image.loading = "lazy";
    image.decoding = "async";
    posterLink.append(image);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "sodo-personal-placeholder";
    placeholder.textContent = item.title;
    posterLink.append(placeholder);
  }
  const info = document.createElement("div");
  info.className = "movie-card-info";
  const heading = document.createElement("h3");
  const title = document.createElement("span");
  title.textContent = item.title;
  heading.append(title);
  const meta = document.createElement("div");
  meta.className = "movie-meta";
  if (item.release_year) {
    const year = document.createElement("span"); year.textContent = String(item.release_year); meta.append(year);
  }
  if (item.imdb_rating !== null && item.imdb_rating !== undefined) {
    const rating = document.createElement("span"); rating.className = "movie-rating"; rating.textContent = Number(item.imdb_rating).toFixed(1); meta.append(rating);
  }
  const status = makeStatusSelect(item.status, t.statusLabel, true);
  status.addEventListener("change", async () => {
    const old = item.status;
    status.disabled = true;
    try {
      if (!status.value) {
        const { error } = await supabase.from("sodo_user_library").delete().eq("user_id",session.user.id).eq("media_key",item.media_key);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sodo_user_library").update({
          status: status.value,
          watched_at: status.value === "watched" ? (item.watched_at || new Date().toISOString()) : null,
          updated_at: new Date().toISOString()
        }).eq("user_id",session.user.id).eq("media_key",item.media_key);
        if (error) throw error;
      }
      await loadEntries();
      showMessage(t.saved);
    } catch (error) {
      status.value = old;
      showMessage(t.saveFailed,true);
      console.error("SODO personal library update:",error);
    } finally { status.disabled = false; }
  });
  info.append(heading,meta,status);
  card.append(posterLink,info);
  return card;
}
function renderLibrary() {
  const section = $("my-library");
  const grid = $("sodo-personal-grid");
  const filter = $("sodo-personal-filter");
  const nav = $("sodo-personal-pagination");
  if (!section || !grid || !filter || !nav) return;
  const status = filter.value || "all";
  const filtered = entries.filter(item => (status === "all" || item.status === status)
    && (!searchQuery || normalize(item.title).includes(searchQuery)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  grid.replaceChildren();
  filtered.slice(start, start + PAGE_SIZE).forEach(item => grid.append(buildLibraryCard(item)));
  nav.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "sodo-personal-empty";
    empty.textContent = entries.length ? t.noResults : t.empty;
    grid.append(empty);
  } else {
    const summary = document.createElement("span");
    summary.className = "movie-pagination-summary";
    summary.textContent = t.showing(start + 1, Math.min(start + PAGE_SIZE, filtered.length), filtered.length);
    const controls = document.createElement("div");
    controls.className = "movie-pagination-controls";
    const button = (label, target, disabled, current=false) => {
      const node = document.createElement("button");
      node.type = "button"; node.textContent = label; node.disabled = disabled;
      if (current) node.setAttribute("aria-current","page");
      node.addEventListener("click",()=>{currentPage=target;renderLibrary();});
      return node;
    };
    controls.append(button("‹",currentPage-1,currentPage===1));
    const startPage = Math.max(1,Math.min(currentPage-2,pageCount-4));
    const endPage = Math.min(pageCount,startPage+4);
    for(let page=startPage;page<=endPage;page++) controls.append(button(String(page),page,false,page===currentPage));
    controls.append(button("›",currentPage+1,currentPage===pageCount));
    nav.append(summary,controls);
  }
  const count = $("sodo-personal-count");
  if (count) count.textContent = String(entries.length);
}
async function loadEntries() {
  if (!session) return;
  const { data, error } = await supabase.from("sodo_user_library").select("*")
    .eq("user_id",session.user.id).order("updated_at",{ascending:false});
  if (error) throw error;
  entries = data || [];
  const tabCount = document.querySelector("[data-sodo-private-tab] span:last-child");
  if (tabCount) tabCount.textContent = String(entries.length).padStart(2, "0");
  attachCardControls();
  renderLibrary();
}
async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    session = data.session;
  } catch (error) {
    session = null;
    console.warn("SODO personal library session:", error);
  }
  const section = $("my-library");
  const tab = document.querySelector("[data-sodo-private-tab]");
  if (!session) {
    entries = [];
    const tabCount = document.querySelector("[data-sodo-private-tab] span:last-child");
    if (tabCount) tabCount.textContent = "00";
    if (section) section.hidden = true;
    if (tab) tab.hidden = true;
    document.querySelectorAll(".sodo-personal-status").forEach(node => node.remove());
    const grid = $("sodo-personal-grid");
    if (grid) grid.replaceChildren();
    const count = $("sodo-personal-count");
    if (count) count.textContent = "0";
    showMessage("");
    return;
  }
  if (section) section.hidden = false;
  if (tab) tab.hidden = false;
  const filter = $("sodo-personal-filter");
  if (filter && !filter.dataset.bound) {
    filter.dataset.bound = "true";
    filter.addEventListener("change",()=>{currentPage=1;renderLibrary();});
  }
  showMessage(t.loading);
  try { await loadEntries(); showMessage(""); }
  catch (error) { showMessage(t.failed,true); console.error("SODO personal library load:",error); }
}
function init() {
  const section = $("my-library");
  if (!section) return;
  const filter = $("sodo-personal-filter");
  if (filter) {
    filter.replaceChildren();
    [["all",t.all],...statuses.map(value=>[value,statusLabel(value)])].forEach(([value,label])=>{
      const option=document.createElement("option"); option.value=value; option.textContent=label; filter.append(option);
    });
  }
  document.addEventListener("sodo:cinema-cards-updated",attachCardControls);
  document.addEventListener("sodo:cinema-search",event=>{
    searchQuery=normalize(event.detail?.query||""); currentPage=1; renderLibrary();
  });
  supabase.auth.onAuthStateChange((_event,nextSession)=>{
    session=nextSession;
    queueMicrotask(()=>refreshSession());
  });
  refreshSession();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
