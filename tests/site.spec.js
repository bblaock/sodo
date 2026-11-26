const { test, expect } = require("@playwright/test");

const routes = [
  { path: "/sodo/", label: "home" },
  { path: "/sodo/thoughts/", label: "thoughts" },
  { path: "/sodo/films/", label: "cinema" },
  { path: "/sodo/projects/", label: "projects" },
  { path: "/sodo/films/breakingbad/", label: "series detail" },
];

for (const route of routes) {
  test(`${route.label} page renders without runtime errors`, async ({ page }) => {
    const pageErrors = [];
    const localFailures = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    page.on("response", response => {
      if (response.url().startsWith("http://127.0.0.1:4173/") && response.status() >= 400) {
        localFailures.push(`${response.status()} ${response.url()}`);
      }
    });

    const response = await page.goto(route.path);
    expect(response, "navigation should return a document response").not.toBeNull();
    expect(response.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("title")).not.toHaveText("");
    await expect(page.locator("header a.logo").first()).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();

    expect(pageErrors, "uncaught browser runtime errors").toEqual([]);
    expect(localFailures, "missing same-origin resources").toEqual([]);
  });
}

test("cinema keeps Films and Series as separate destinations", async ({ page }) => {
  await page.goto("/sodo/films/");
  await expect(page.locator("#films")).toHaveCount(1);
  await expect(page.locator("#series")).toHaveCount(1);
  await expect(page.locator(".cinema-tabs a")).toHaveCount(2);
});

test("primary navigation points to the SODO sections", async ({ page }) => {
  await page.goto("/sodo/");
  const links = page.locator("header nav a");
  await expect(links).toHaveCount(5);
  await expect(page.locator('header nav a[href="/sodo/films/"]')).toHaveCount(1);
  await expect(page.locator('header nav a[href="/sodo/thoughts/"]')).toHaveCount(1);
  await expect(page.locator('header nav a[href="/sodo/projects/"]')).toHaveCount(1);
});

test("mobile layout does not create horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const route of ["/sodo/", "/sodo/films/", "/sodo/projects/"]) {
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content, `horizontal overflow on ${route}`).toBeLessThanOrEqual(dimensions.viewport + 1);
  }
});
