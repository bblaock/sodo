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
    let rest = url.pathname.slice(base.length);
    if (supported.includes(rest.split("/")[0]) || /^(assets\/|site\.js|language-router\.js)/.test(rest)) return value;
    if (rest === "projects" || rest.startsWith("projects/")) rest = rest.replace(/^projects(?=\/|$)/, "books");
    return localeRoot(language) + rest + url.search + url.hash;
  };
  // The shared site.js owns language-menu interactions and navigates to the
  // equivalent locale route. This router only establishes URL locale state
  // and localizes internal links, avoiding competing capture-phase handlers.
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href^="/sodo/"]').forEach((anchor) => {
      anchor.setAttribute("href", localize(anchor.getAttribute("href")));
    });
  });
})();