document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector("#watched .movie-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(":scope > .movie-card"));
  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(cards.length / pageSize));
  const pagination = document.createElement("nav");
  pagination.className = "movie-pagination";
  pagination.setAttribute("aria-label", "Movie pages");
  grid.insertAdjacentElement("afterend", pagination);

  let currentPage = 1;

  function renderPage() {
    const first = (currentPage - 1) * pageSize;
    cards.forEach((card, index) => {
      card.hidden = index < first || index >= first + pageSize;
    });

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
        document.querySelector("#watched").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      pagination.appendChild(button);
    }
  }

  renderPage();
});