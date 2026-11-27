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

  const normalize = value => String(value || "").normalize("NFKC").toLocaleLowerCase();
  let searchQuery = "";
  let sortMode = "featured";

  collections.forEach(({ section, pageSize, paginate }) => {
    const grid = section.querySelector(":scope > .movie-grid");
    if (!grid) return;
    let cards = Array.from(grid.querySelectorAll(":scope > .movie-card"));
    const originalOrder = new Map(cards.map((card, index) => [card, index]));
    let currentPage = 1;
    let pagination = null;

    function getFilteredCards() {
      if (!searchQuery) return cards;
      return cards.filter(card => normalize(card.textContent).includes(searchQuery));
    }

    function updatePaginationControls(pageCount) {
      if (!paginate || pageCount <= 1) {
        if (pagination) pagination.remove();
        pagination = null;
        return;
      }
      if (!pagination) {
        pagination = document.createElement("nav");
        pagination.className = "movie-pagination";
        pagination.setAttribute("aria-label", "Movie pages");
        grid.insertAdjacentElement("afterend", pagination);
      }
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

    function renderPage() {
      const filtered = getFilteredCards();
      const effectivePageSize = paginate ? pageSize : Math.max(filtered.length, 1);
      const pageCount = Math.max(1, Math.ceil(filtered.length / effectivePageSize));
      currentPage = Math.min(currentPage, pageCount);
      const first = (currentPage - 1) * effectivePageSize;
      const visibleSet = new Set(filtered.slice(first, first + effectivePageSize));
      cards.forEach((card) => {
        const visible = visibleSet.has(card);
        card.hidden = !visible;
        if (visible && window.location.hash === "#" + section.id) {
          loadPoster(card, card === filtered[first]);
        }
      });
      updatePaginationControls(pageCount);
    }

    function applySort() {
      const title = card => normalize(card.querySelector("h3")?.textContent);
      const year = card => Number((card.querySelector(".movie-meta")?.textContent || "").match(/\d{4}/)?.[0] || 0);
      const rating = card => Number(card.querySelector(".movie-rating span")?.textContent || 0);
      cards.sort((a, b) => {
        if (sortMode === "title") return title(a).localeCompare(title(b));
        if (sortMode === "year") return year(b) - year(a) || title(a).localeCompare(title(b));
        if (sortMode === "rating") return rating(b) - rating(a) || title(a).localeCompare(title(b));
        return originalOrder.get(a) - originalOrder.get(b);
      });
      cards.forEach(card => grid.appendChild(card));
      currentPage = 1;
      renderPage();
    }

    renderPage();
    section.dataset.posterGridReady = "true";
    section.dataset.posterPageSize = String(pageSize);
    section.dataset.posterPagination = paginate ? "true" : "false";

    document.addEventListener("sodo:cinema-search", event => {
      searchQuery = normalize(event.detail?.query || "");
      currentPage = 1;
      renderPage();
    });
    document.addEventListener("sodo:cinema-sort", event => {
      sortMode = event.detail?.sort || "featured";
      applySort();
    });
  });

  function activateVisibleCollection() {
    const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
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
