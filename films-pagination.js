document.addEventListener("DOMContentLoaded", function () {
  const PAGE_SIZE = 6;
  const language = document.documentElement.lang || "en";
  const copy = {
    ar: {
      label: "صفحات المكتبة",
      previous: "السابق",
      next: "التالي",
      page: "الصفحة",
      showing: (from, to, total) => `عرض ${from}–${to} من ${total}`
    },
    en: {
      label: "Collection pages",
      previous: "Previous page",
      next: "Next page",
      page: "Page",
      showing: (from, to, total) => `Showing ${from}–${to} of ${total}`
    },
    ru: {
      label: "Страницы коллекции",
      previous: "Предыдущая страница",
      next: "Следующая страница",
      page: "Страница",
      showing: (from, to, total) => `Показано ${from}–${to} из ${total}`
    }
  }[language] || {
    label: "Collection pages",
    previous: "Previous page",
    next: "Next page",
    page: "Page",
    showing: (from, to, total) => `Showing ${from}–${to} of ${total}`
  };

  const collections = [
    { section: document.querySelector("#watched"), paginate: true },
    { section: document.querySelector("#series"), paginate: true }
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

  const normalize = value => String(value || "").normalize("NFKC").trim().toLocaleLowerCase();
  let searchQuery = "";
  let sortMode = "featured";

  collections.forEach(({ section, paginate }) => {
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

    function makeButton(label, ariaLabel, page, disabled, current = false) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.setAttribute("aria-label", ariaLabel);
      button.disabled = disabled;
      if (current) button.setAttribute("aria-current", "page");
      button.addEventListener("click", function () {
        if (disabled || page === currentPage) return;
        currentPage = page;
        renderPage();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return button;
    }

    function updatePaginationControls(filteredCount, pageCount, firstIndex) {
      if (!paginate || filteredCount === 0) {
        if (pagination) pagination.remove();
        pagination = null;
        return;
      }
      if (!pagination) {
        pagination = document.createElement("nav");
        pagination.className = "movie-pagination";
        pagination.setAttribute("aria-label", copy.label);
        pagination.setAttribute("aria-live", "polite");
        grid.insertAdjacentElement("afterend", pagination);
      }
      pagination.replaceChildren();

      const summary = document.createElement("span");
      summary.className = "movie-pagination-summary";
      summary.textContent = copy.showing(
        firstIndex + 1,
        Math.min(firstIndex + PAGE_SIZE, filteredCount),
        filteredCount
      );
      summary.setAttribute("aria-live", "polite");
      summary.dir = language === "ar" ? "rtl" : "ltr";

      const controls = document.createElement("div");
      controls.className = "movie-pagination-controls";
      controls.appendChild(makeButton("‹", copy.previous, currentPage - 1, currentPage === 1));

      const visiblePageCount = Math.min(pageCount, 5);
      let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
      let endPage = Math.min(pageCount, startPage + visiblePageCount - 1);
      startPage = Math.max(1, endPage - visiblePageCount + 1);

      for (let page = startPage; page <= endPage; page += 1) {
        controls.appendChild(makeButton(
          String(page),
          copy.page + " " + page,
          page,
          false,
          page === currentPage
        ));
      }

      controls.appendChild(makeButton("›", copy.next, currentPage + 1, currentPage === pageCount));
      pagination.append(summary, controls);
    }

    function renderPage() {
      const filtered = getFilteredCards();
      const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      currentPage = Math.min(currentPage, pageCount);
      const first = (currentPage - 1) * PAGE_SIZE;
      const visibleSet = new Set(filtered.slice(first, first + PAGE_SIZE));
      cards.forEach(card => {
        const visible = visibleSet.has(card);
        card.hidden = !visible;
        if (visible && window.location.hash === "#" + section.id) {
          loadPoster(card, card === filtered[first]);
        }
      });
      updatePaginationControls(filtered.length, pageCount, first);
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
    section.dataset.posterPageSize = String(PAGE_SIZE);
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
    document.addEventListener("sodo:cinema-cards-updated", () => {
      const currentCards = Array.from(grid.querySelectorAll(":scope > .movie-card"));
      currentCards.forEach(card => {
        if (!originalOrder.has(card)) originalOrder.set(card, originalOrder.size);
      });
      cards = currentCards;
      if (sortMode !== "featured") applySort();
      else renderPage();
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
