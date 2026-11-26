document.addEventListener("DOMContentLoaded", function () {
  const collections = [
    { section: document.querySelector("#watched"), pageSize: 9, paginate: true },
    { section: document.querySelector("#series"), pageSize: 9, paginate: false },
  ].filter(item => item.section);

  function loadPoster(card, prioritize) {
    const image = card.querySelector("img.movie-poster");
    if (!image || image.getAttribute("src")) return;

    image.addEventListener("error", function () {
      const fallback = image.dataset.fallback;
      if (fallback && !image.dataset.fallbackTried) {
        image.dataset.fallbackTried = "true";
        image.src = fallback;
      }
    }, { once: true });

    image.loading = prioritize ? "eager" : "lazy";
    image.decoding = "async";
    if (prioritize) image.fetchPriority = "high";

    const source = image.dataset.src;
    if (source) {
      image.src = source;
      delete image.dataset.src;
    }
  }

  collections.forEach(({ section, pageSize, paginate }) => {
    const grid = section.querySelector(":scope > .movie-grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(":scope > .movie-card"));
    const effectivePageSize = paginate ? pageSize : Math.max(cards.length, 1);
    const pageCount = Math.max(1, Math.ceil(cards.length / effectivePageSize));
    let currentPage = 1;
    let pagination = null;

    if (paginate && pageCount > 1) {
      pagination = document.createElement("nav");
      pagination.className = "movie-pagination";
      pagination.setAttribute("aria-label", "Movie pages");
      grid.insertAdjacentElement("afterend", pagination);
    }

    function renderPage() {
      const first = (currentPage - 1) * effectivePageSize;
      cards.forEach((card, index) => {
        const visible = index >= first && index < first + effectivePageSize;
        card.hidden = !visible;
        if (visible && window.location.hash === "#" + section.id) loadPoster(card, index === first);
      });

      if (!pagination) return;
      pagination.replaceChildren();
      for (let page = 1; page <= pageCount; page += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(page);
        button.setAttribute("aria-label", "Page " + page);
        if (page === currentPage) button.setAttribute("aria-current", "page");
        button.addEventListener("click", function () {
          currentPage = page;
          renderPage();
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        pagination.appendChild(button);
      }
    }

    renderPage();
    section.dataset.posterGridReady = "true";
    section.dataset.posterPageSize = String(effectivePageSize);
    section.dataset.posterPagination = paginate ? "true" : "false";
  });

  function activateVisibleCollection() {
    const target = document.querySelector(window.location.hash);
    if (!target || !target.matches("#watched, #series")) return;
    if (target.dataset.posterGridReady === "true") {
      const grid = target.querySelector(":scope > .movie-grid");
      if (grid) {
        const visibleCards = Array.from(grid.querySelectorAll(":scope > .movie-card:not([hidden])"));
        visibleCards.forEach((card, index) => loadPoster(card, index === 0));
      }
    }
  }

  window.addEventListener("hashchange", activateVisibleCollection);
  activateVisibleCollection();
});
