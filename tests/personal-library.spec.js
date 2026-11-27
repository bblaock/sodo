const { test, expect } = require("@playwright/test");

for (const language of ["ar", "en", "ru"]) {
  test(`personal watchlist stays private for signed-out visitors (${language})`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`/sodo/${language}/films/`);
    await expect(page.locator("#my-library")).toBeHidden();
    await expect(page.locator("[data-sodo-private-tab]")).toBeHidden();
    await expect(page.locator(".sodo-personal-status")).toHaveCount(0);
    await expect(page.locator("#watched .movie-card").first()).toBeVisible();
    await expect(page.locator("#series .movie-card").first()).toBeAttached();
    await expect(page.locator(".movie-pagination").first()).toBeAttached();
    expect(errors).toEqual([]);
  });
}
