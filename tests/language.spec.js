const { test, expect } = require("@playwright/test");

const languages = ["ar", "en", "ru"];
const filmSlugs = [
  "13reasonswhy", "blackbox", "breakingbad", "daredevil",
  "daredevilbornagain", "gameofthrones", "heartofthebeast",
  "hope", "luckystrike", "mebeforeyou", "theboys"
];
const sectionRoutes = ["", "about/", "thoughts/", "films/", "projects/"];
const localeRoutes = languages.flatMap(language => [
  ...sectionRoutes.map(route => ({ language, path: `/sodo/${language}/${route}` })),
  ...filmSlugs.map(slug => ({ language, path: `/sodo/${language}/films/${slug}/` }))
]);

test("all 48 localized routes load with the correct document language and direction", async ({ page }) => {
  const pageErrors = [];
  const failedResources = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  const origin = new URL(process.env.BASE_URL || "http://127.0.0.1:4173").origin;
  page.on("response", response => {
    const url = new URL(response.url());
    if (url.origin === origin && url.pathname.startsWith("/sodo/") && response.status() >= 400) {
      failedResources.push(`${response.status()} ${response.url()}`);
    }
  });

  for (const route of localeRoutes) {
    const response = await page.goto(route.path);
    expect(response, `missing document response for ${route.path}`).not.toBeNull();
    expect(response.status(), `HTTP status for ${route.path}`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", route.language);
    await expect(page.locator("html")).toHaveAttribute("dir", route.language === "ar" ? "rtl" : "ltr");
    await expect(page.locator(".language-code")).toHaveText(route.language.toUpperCase());
    await expect(page.locator(".language-trigger")).toBeVisible();
    await expect(page.locator("html")).toHaveClass(/site-ready/);
  }

  expect(pageErrors, "uncaught JavaScript errors across localized routes").toEqual([]);
  expect(failedResources, "failed same-origin resources across localized routes").toEqual([]);
});

test("language switching changes URL, document language, direction, and visible copy", async ({ page }) => {
  await page.goto("/sodo/en/");
  await page.locator(".sodo-welcome-close").click();
  await expect(page.locator("#sodo-welcome-overlay")).toHaveCount(0);
  await expect(page.locator('[data-i18n="heroText"]')).toHaveText(
    "A space for ideas, culture, cinema, and creative exploration. Somewhere between what we think and what we create."
  );

  const selectLanguage = async (language, expectedText, direction) => {
    await page.locator(".language-trigger").click();
    const option = page.locator(`.language-option[data-lang="${language}"]`);
    await expect(option).toHaveAttribute("href", `/sodo/${language}/`);
    await option.click();

    await expect(page).toHaveURL(new RegExp(`/sodo/${language}/$`));
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("html")).toHaveAttribute("dir", direction);
    await expect(page.locator(".language-code")).toHaveText(language.toUpperCase());
    await expect(page.locator('[data-i18n="heroText"]')).toHaveText(expectedText);
  };

  await selectLanguage(
    "ru",
    "Пространство для идей, культуры, кино и творчества. Место между тем, что мы думаем, и тем, что создаём.",
    "ltr"
  );
  await selectLanguage(
    "ar",
    "مساحة للأفكار والثقافة والسينما والاستكشاف الإبداعي. مكان ما بين ما نفكر فيه وما نصنعه.",
    "rtl"
  );
  await selectLanguage(
    "en",
    "A space for ideas, culture, cinema, and creative exploration. Somewhere between what we think and what we create.",
    "ltr"
  );
});

test("switching language preserves the current section and film detail route", async ({ page }) => {
  await page.goto("/sodo/en/films/theboys/");
  await page.locator(".sodo-welcome-close").click();
  await expect(page.locator("#sodo-welcome-overlay")).toHaveCount(0);
  await page.locator(".language-trigger").click();
  const russian = page.locator('.language-option[data-lang="ru"]');
  await expect(russian).toHaveAttribute("href", "/sodo/ru/films/theboys/");
  await russian.click();
  await expect(page).toHaveURL(/\/sodo\/ru\/films\/theboys\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");

  await page.locator(".language-trigger").click();
  const arabic = page.locator('.language-option[data-lang="ar"]');
  await expect(arabic).toHaveAttribute("href", "/sodo/ar/films/theboys/");
  await arabic.click();
  await expect(page).toHaveURL(/\/sodo\/ar\/films\/theboys\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
});

test("localized primary navigation stays inside the active locale", async ({ page }) => {
  for (const language of languages) {
    await page.goto(`/sodo/${language}/`);
    const links = page.locator("header nav a[href]:not(.language-option):not(.logo)");
    const hrefs = await links.evaluateAll(items => items.map(item => item.getAttribute("href")));
    for (const href of hrefs) {
      if (href && href.startsWith("/sodo/")) {
        expect(href, `wrong locale navigation target on ${language}`).toMatch(
          new RegExp(`^/sodo/${language}/`)
        );
      }
    }
  }
});


test("private Trakt history stays hidden from signed-out visitors", async ({ page }) => {
  await page.goto("/sodo/en/films/");
  await page.waitForFunction(() => document.documentElement.dataset.traktHistoryReady === "true");
  await expect(page.locator(".trakt-private-panel")).toHaveCount(0);
});


test("signed-in SODO account receives private Trakt history in Cinema", async ({ page }) => {
  await page.addInitScript(() => {
    const now = Math.floor(Date.now() / 1000);
    localStorage.setItem("sb-wbuyglftsgldasawsllt-auth-token", JSON.stringify({
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: now + 3600,
      user: { id: "test-user", aud: "authenticated", role: "authenticated", email: "test@example.com" }
    }));
  });

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
    const action = route.request().postDataJSON().action;
    const payload = action === "status"
      ? { connected: true }
      : action === "sync"
        ? { synced: true, imported: 0 }
        : {
            movies: [
              { title: "The Batman", year: 2022, last_watched_at: "2026-11-20T18:00:00Z" },
              { title: "Hope", year: 2026, last_watched_at: "2026-11-21T18:00:00Z" }
            ],
            series: [{
              title: "MobLand",
              year: 2025,
              episode_count: 20,
              last_watched_at: "2026-11-26T15:33:00Z",
              last_season: 1,
              last_episode: 6
            }]
          };
    await route.fulfill({
      status: 200,
      headers: { "Access-Control-Allow-Origin": origin, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  });

  await page.goto("/sodo/en/films/#series");
  await page.waitForFunction(() => document.documentElement.dataset.traktHistoryReady === "true");
  await expect(page.locator("#series .trakt-private-card h3")).toHaveText("MobLand");
  await expect(page.locator("#series .trakt-private-card")).toContainText("20 episodes");
  await expect(page.locator("#watched .trakt-private-card h3")).toHaveText("The Batman");
  await expect(page.locator("#watched .trakt-private-card")).toContainText("Watched");
  await expect(page.locator("#watched .movie-card h3").filter({ hasText: /^Hope$/ })).toHaveCount(1);
  await expect(page.locator("#watched .movie-card").filter({ has: page.locator(".trakt-private-note") })).toContainText("PRIVATE · TRAKT");
});
