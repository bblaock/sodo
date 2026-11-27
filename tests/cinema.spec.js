const { test, expect } = require("@playwright/test");

const locales = ["ar", "en", "ru"];

async function mockPublicHistory(page, includeImports = true) {
  await page.route("https://wbuyglftsgldasawsllt.supabase.co/functions/v1/trakt-sync", async route => {
    const origin = route.request().headers().origin || "*";
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Headers": "authorization, apikey, content-type",
          "Access-Control-Allow-Methods": "POST, OPTIONS"
        }
      });
      return;
    }
    await route.fulfill({
      status: 200,
      headers: { "Access-Control-Allow-Origin": origin, "Content-Type": "application/json" },
      body: JSON.stringify({
        movies: includeImports ? [{ title: "Cinema QA Imported Film", year: 2024, trakt_id: 991001 }] : [],
        series: includeImports ? [{ title: "Cinema QA Imported Series", year: 2023, trakt_id: 991002, episode_count: 4 }] : []
      })
    });
  });
}

for (const language of locales) {
  test(`Cinema cards remain keyboard accessible, including Trakt imports (${language})`, async ({ page }) => {
    await mockPublicHistory(page);
    await page.goto(`/sodo/${language}/films/#watched`);
    await page.waitForFunction(() => document.documentElement.dataset.traktHistoryReady === "true");

    const curated = page.locator("#watched .movie-card").first();
    await expect(curated).toHaveAttribute("role", "link");
    await expect(curated).toHaveAttribute("tabindex", "0");
    await expect(curated).toHaveAttribute("aria-label", /.+/);

    const imported = page.locator("#watched .trakt-imported-card").filter({ hasText: "Cinema QA Imported Film" });
    await expect(imported).toHaveAttribute("role", "link");
    await expect(imported).toHaveAttribute("tabindex", "0");
    await expect(imported).toHaveAttribute("aria-label", /.+/);

    const importedSeries = page.locator("#series .trakt-imported-card").filter({ hasText: "Cinema QA Imported Series" });
    await expect(importedSeries).toHaveAttribute("role", "link");
    await expect(importedSeries).toHaveAttribute("tabindex", "0");
  });

  test(`Cinema search trims whitespace and pagination stays synchronized (${language})`, async ({ page }) => {
    await mockPublicHistory(page, false);
    await page.goto(`/sodo/${language}/films/#watched`);
    await page.waitForFunction(() => document.documentElement.dataset.traktHistoryReady === "true");

    const search = page.locator("#sodo-cinema-search-input");
    await search.fill("  Coco  ");
    await expect(page.locator(".sodo-cinema-search-count")).toContainText("1");
    await expect(page.locator("#watched .movie-pagination-summary")).toContainText("1");

    await search.fill("no-such-cinema-title-987");
    await expect(page.locator(".sodo-cinema-search-empty")).toBeVisible();
    await expect(page.locator(".sodo-cinema-search-count")).toContainText("0");

    await search.fill("");
    await expect(page.locator(".sodo-cinema-search-empty")).toBeHidden();
    await expect(page.locator("#watched .movie-pagination-summary")).toContainText("8");
    await page.locator("#watched .movie-pagination-controls button:last-child").click();
    await expect(page.locator("#watched .movie-pagination-summary")).toContainText("7");
  });

}
