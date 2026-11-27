const { test, expect } = require("@playwright/test");

const languages = [
  ["ar", "قصة عربية تلقائية"],
  ["en", "Automatic English synopsis"],
  ["ru", "Автоматическое русское описание"],
];

for (const [language, synopsis] of languages) {
  test(\`Trakt detail uses the site's localized synopsis (\${language})\`, async ({ page }) => {
    await page.route("**/functions/v1/trakt-sync", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          movies: [{
            trakt_id: 999999,
            title: "Localization Test",
            year: 2026,
            imdb_id: "tt9999999",
            overview: "English fallback synopsis",
            tagline: "",
            translations: {
              ar: { overview: "قصة عربية تلقائية" },
              en: { overview: "Automatic English synopsis" },
              ru: { overview: "Автоматическое русское описание" }
            },
            poster_url: null,
            rating: 8,
            genres: [],
            runtime: 100,
            certification: null,
            status: "released",
            cast: []
          }],
          series: []
        })
      });
    });

    await page.goto(\`/sodo/\${language}/films/trakt/?kind=movie&id=999999\`);
    await expect(page.locator("#trakt-overview")).toHaveText(synopsis);
  });
}
