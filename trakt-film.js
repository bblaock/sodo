const SUPABASE_URL = "https://wbuyglftsgldasawsllt.supabase.co";
const SUPABASE_KEY = "sb_publishable_GJt9mKuvro43J_iJZduL6w_3SWPPAfG";
const lang = document.documentElement.lang || "en";
const labels = {
  ar: {
    year:"السنة", rating:"تقييم Trakt", language:"اللغة الأصلية", status:"حالة العمل",
    genre:"النوع", director:"المخرج", cast:"طاقم التمثيل", runtime:"المدة",
    certification:"التصنيف العمري", episodes:"عدد الحلقات",
    notFound:"لم نعثر على هذا العمل في مكتبة SODO.", loadError:"تعذّر تحميل تفاصيل العمل حالياً.", poster:"ملصق", imdb:"فتح صفحة IMDb"
  },
  en: {
    year:"Year", rating:"Trakt rating", language:"Original language", status:"Work status",
    genre:"Genre", director:"Director", cast:"Cast", runtime:"Runtime",
    certification:"Certification", episodes:"Episodes",
    notFound:"This title could not be found in the SODO library.", loadError:"Could not load title details right now.", poster:"poster", imdb:"Open IMDb page"
  },
  ru: {
    year:"Год", rating:"Рейтинг Trakt", language:"Язык оригинала", status:"Статус",
    genre:"Жанр", director:"Режиссёр", cast:"Актёры", runtime:"Длительность",
    certification:"Возрастной рейтинг", episodes:"Эпизоды",
    notFound:"Не удалось найти это произведение в библиотеке SODO.", loadError:"Не удалось загрузить информацию.", poster:"постер", imdb:"Открыть страницу IMDb"
  }
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

function addMeta(label, value, imdbId) {
  if (value === null || value === undefined || value === "") return;
  const item = document.createElement("div");
  item.className = "meta-item";
  const caption = document.createElement("span");
  caption.className = "meta-label";
  caption.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = String(value);
  item.append(caption, strong);
  if (imdbId) {
    const link = document.createElement("a");
    link.className = "imdb-icon";
    link.href = "https://www.imdb.com/title/" + encodeURIComponent(imdbId) + "/";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", t.imdb);
    link.title = "IMDb";
    const image = document.createElement("img");
    image.src = "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/3840px-IMDB_Logo_2016.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail";
    image.alt = "IMDb";
    image.loading = "lazy";
    image.decoding = "async";
    link.append(image);
    item.append(link);
  }
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

    // Keep the exact metadata hierarchy used by manually authored SODO detail pages.
    addMeta(t.rating, item.rating !== null && item.rating !== undefined ? Number(item.rating).toFixed(1) + "/10" : null, item.imdb_id);
    addMeta(t.year, item.year);
    addMeta(t.language, item.language || item.original_language);
    addMeta(t.status, item.status);

    // The detail list follows the manual page order; only available source fields are shown.
    addDetail(t.genre, item.genres);
    addDetail(t.director, item.director);
    addDetail(t.cast, (item.cast || []).map(person => person.character ? person.name + " (" + person.character + ")" : person.name));
    addDetail(t.runtime, item.runtime ? item.runtime + " min" : null);
    addDetail(t.certification, item.certification);
    addDetail(t.episodes, kind === "series" ? item.episode_count : null);
  } catch (error) {
    console.error("SODO title details:", error);
    showError(t.loadError);
  }
}
load();
