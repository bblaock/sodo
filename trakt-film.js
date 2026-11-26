const SUPABASE_URL = "https://wbuyglftsgldasawsllt.supabase.co";
const SUPABASE_KEY = "sb_publishable_GJt9mKuvro43J_iJZduL6w_3SWPPAfG";
const lang = document.documentElement.lang || "en";
const labels = {
  ar: {year:"سنة الإصدار",rating:"تقييم Trakt",genres:"التصنيفات",cast:"طاقم التمثيل",runtime:"المدة",certification:"التصنيف العمري",status:"الحالة",episodes:"عدد الحلقات",tagline:"عبارة العمل",notFound:"لم نعثر على هذا العمل في مكتبة SODO.",loadError:"تعذّر تحميل تفاصيل العمل حالياً.",poster:"ملصق"},
  en: {year:"Year",rating:"Trakt rating",genres:"Genres",cast:"Cast",runtime:"Runtime",certification:"Certification",status:"Status",episodes:"Episodes",tagline:"Tagline",notFound:"This title could not be found in the SODO library.",loadError:"Could not load title details right now.",poster:"poster"},
  ru: {year:"Год",rating:"Оценка Trakt",genres:"Жанры",cast:"Актёры",runtime:"Длительность",certification:"Возрастной рейтинг",status:"Статус",episodes:"Эпизоды",tagline:"Слоган",notFound:"Не удалось найти это произведение в библиотеке SODO.",loadError:"Не удалось загрузить информацию.",poster:"постер"}
};
const t = labels[lang] || labels.en;
const params = new URLSearchParams(location.search);
const kind = params.get("kind") === "series" ? "series" : "movie";
const id = params.get("id");
const titleNode = document.getElementById("trakt-title");
const overviewNode = document.getElementById("trakt-overview");
const posterNode = document.getElementById("trakt-poster");
const metaNode = document.getElementById("trakt-meta");
const detailsNode = document.getElementById("trakt-details");
const errorNode = document.getElementById("trakt-error");
function addMeta(value) {
  if (value === null || value === undefined || value === "") return;
  const item = document.createElement("div");
  item.className = "meta-item";
  const strong = document.createElement("strong");
  strong.textContent = String(value);
  item.append(strong);
  metaNode.append(item);
}
function addDetail(label, value) {
  if (value === null || value === undefined || value === "" || (Array.isArray(value) && !value.length)) return;
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = Array.isArray(value) ? value.join(" · ") : String(value);
  detailsNode.append(dt, dd);
}
function showError(message) {
  errorNode.textContent = message;
  errorNode.hidden = false;
  document.querySelector(".film-layout").hidden = true;
}
async function load() {
  if (!id || !/^\d+$/.test(id)) return showError(t.notFound);
  try {
    const response = await fetch(SUPABASE_URL + "/functions/v1/trakt-sync", {
      method: "POST",
      headers: {"Content-Type":"application/json","apikey":SUPABASE_KEY},
      body: JSON.stringify({action:"public-history"})
    });
    if (!response.ok) throw new Error("History request failed");
    const library = await response.json();
    const items = kind === "movie" ? (library.movies || []) : (library.series || []);
    const item = items.find(entry => String(entry.trakt_id) === id);
    if (!item) return showError(t.notFound);
    const title = item.title || "";
    titleNode.textContent = title;
    document.title = title + " — SODO";
    overviewNode.textContent = item.overview || item.tagline || "";
    if (item.poster_url) {
      posterNode.src = item.poster_url;
      posterNode.alt = title + " " + t.poster;
    } else {
      posterNode.hidden = true;
    }
    addMeta(item.year);
    if (item.rating !== null && item.rating !== undefined) addMeta(Number(item.rating).toFixed(1) + "/10");
    addDetail(t.year, item.year);
    addDetail(t.tagline, item.tagline);
    addDetail(t.genres, item.genres);
    addDetail(t.cast, (item.cast || []).map(person => person.character ? person.name + " (" + person.character + ")" : person.name));
    addDetail(t.runtime, item.runtime ? item.runtime + " min" : null);
    addDetail(t.certification, item.certification);
    addDetail(t.status, item.status);
    addDetail(t.episodes, kind === "series" ? item.episode_count : null);
  } catch (error) {
    console.error("SODO title details:", error);
    showError(t.loadError);
  }
}
load();
