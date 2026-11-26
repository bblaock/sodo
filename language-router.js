(() => {
  "use strict";
  const base = "/sodo/";
  const supported = ["ar", "en", "ru"];
  const parts = location.pathname.split("/").filter(Boolean);
  const language = supported.includes(parts[1]) ? parts[1] : "ar";
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  try { localStorage.setItem("sodo-language", language); } catch (_) {}

  const localeRoot = (code) => base + code + "/";
  const localizedCurrentPath = (next) => {
    const rest = location.pathname.slice(base.length).split("/");
    if (supported.includes(rest[0])) rest.shift();
    return localeRoot(next) + rest.join("/") + location.search + location.hash;
  };
  const localize = (value) => {
    if (!value || value.startsWith("#") || /^(mailto:|tel:|javascript:|https?:|data:)/i.test(value)) return value;
    const url = new URL(value, location.origin);
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return value;
    const rest = url.pathname.slice(base.length);
    if (supported.includes(rest.split("/")[0]) || /^(assets\/|site\.js|language-router\.js)/.test(rest)) return value;
    return localeRoot(language) + rest + url.search + url.hash;
  };
  const bindLanguageChoice = (event) => {
    const option = event.target.closest(".language-option[data-lang]");
    if (!option) return;
    const next = option.dataset.lang;
    if (!supported.includes(next) || next === language) return;
    event.preventDefault();
    event.stopPropagation();
    location.href = localizedCurrentPath(next);
  };

  document.addEventListener("pointerup", bindLanguageChoice, true);
  document.addEventListener("click", bindLanguageChoice, true);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href^="/sodo/"]').forEach((anchor) => {
      anchor.setAttribute("href", localize(anchor.getAttribute("href")));
    });
    const selector = document.querySelector("#site-language");
    if (selector) {
      selector.value = language;
      selector.addEventListener("change", () => {
        const next = supported.includes(selector.value) ? selector.value : "ar";
        location.href = localizedCurrentPath(next);
      }, true);
    }
  });
})();