(function () {
  "use strict";

  const language = document.documentElement.lang || "en";
  const labels = {
    ar: title => "فتح تفاصيل " + title,
    en: title => "Open details for " + title,
    ru: title => "Открыть подробности: " + title
  };
  const labelFor = labels[language] || labels.en;

  function enhanceCards(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const cards = [];
    if (scope.matches && scope.matches(".movie-card")) cards.push(scope);
    cards.push(...scope.querySelectorAll(".movie-card"));

    cards.forEach(card => {
      const link = card.querySelector(".poster-link[href]");
      if (!link || card.dataset.sodoCardNavigation === "true") return;
      card.dataset.sodoCardNavigation = "true";
      card.dataset.cardHref = link.getAttribute("href");
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      const title = card.querySelector("h3")?.textContent?.trim();
      card.setAttribute("aria-label", labelFor(title || link.getAttribute("aria-label") || "details"));
    });
  }

  function navigateFromCard(card) {
    const link = card?.querySelector(".poster-link[href]");
    if (link) window.location.href = link.href;
  }

  document.addEventListener("click", event => {
    const card = event.target.closest(".movie-card");
    if (!card || event.target.closest("a, button, input, select, textarea")) return;
    navigateFromCard(card);
  });

  document.addEventListener("keydown", event => {
    const card = event.target.closest(".movie-card[role='link']");
    if (!card || event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    navigateFromCard(card);
  });

  document.addEventListener("sodo:cinema-cards-updated", event => {
    const section = event.detail?.sectionId ? document.getElementById(event.detail.sectionId) : null;
    enhanceCards(section || document);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => enhanceCards(), { once: true });
  } else {
    enhanceCards();
  }
})();
