const { test, expect } = require("@playwright/test");

const languages = ["ar", "en", "ru"];
const filmSlugs = [
  "13reasonswhy", "blackbox", "breakingbad", "daredevil",
  "daredevilbornagain", "gameofthrones", "heartofthebeast",
  "hope", "luckystrike", "mebeforeyou", "theboys", "trakt"
];
const sectionRoutes = ["", "about/", "thoughts/", "films/", "projects/"];
const localeRoutes = languages.flatMap(language => [
  ...sectionRoutes.map(route => ({ language, path: `/sodo/${language}/${route}` })),
  ...filmSlugs.map(slug => ({ language, path: `/sodo/${language}/films/${slug}/` }))
]);

test("all localized routes load with the correct document language and direction", async ({ page }) => {
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


test("public Trakt history merges into the existing SODO film and series grids and opens details in a new tab", async ({ page }) => {
  await page.context().route("https://wbuyglftsgldasawsllt.supabase.co/functions/v1/trakt-sync", async route => {
    const origin = route.request().headers().origin || "*";
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
      return;
    }
    const payload = {
      movies: [
        { title: "Hope", year: 2026, trakt_id: 101 },
        { title: "The Batman", year: 2022, trakt_id: 102, imdb_id: "tt1877830", runtime: 176, certification: "PG-13", status: "Released", poster_url: "https://wbuyglftsgldasawsllt.supabase.co/storage/v1/object/public/sodo-posters/movie/102.webp", overview: "A masked vigilante investigates corruption in Gotham.", genres: ["Crime", "Drama"], rating: 7.8, cast: [{ name: "Robert Pattinson", character: "Bruce Wayne" }] }
      ],
      series: [{ title: "MobLand", year: 2025, trakt_id: 103, episode_count: 20, overview: "A crime family story.", poster_url: "https://wbuyglftsgldasawsllt.supabase.co/storage/v1/object/public/sodo-posters/show/103.webp" }]
    };
    await route.fulfill({ status: 200, headers: { "Access-Control-Allow-Origin": origin, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  });
  await page.goto("/sodo/en/films/#watched");
  await page.waitForFunction(() => document.documentElement.dataset.traktHistoryReady === "true");
  const hope = page.locator("#watched .movie-card:has(a[href=\"./hope/\"])");
  await expect(hope).toHaveCount(1);
  await expect(hope.locator(".trakt-watch-badge")).toHaveCount(0);
  await expect(page.locator("#watched .trakt-imported-card h3")).toContainText("The Batman");
  await expect(page.locator("#watched .trakt-imported-card .movie-poster")).toHaveAttribute("src", "https://wbuyglftsgldasawsllt.supabase.co/storage/v1/object/public/sodo-posters/movie/102.webp");
  const batman = page.locator("#watched .trakt-imported-card").filter({ has: page.locator("h3", { hasText: "The Batman" }) });
  await expect(batman.locator(".trakt-imported-details")).toHaveCount(0);
  await expect(batman.locator(".movie-card-info .movie-meta")).toContainText("2022");
  await expect(batman.locator(".movie-poster")).toHaveAttribute("alt", "The Batman poster");
  await expect(batman.locator(".poster-link")).toHaveAttribute("href", "/sodo/en/films/trakt/?kind=movie&id=102");
  await expect(batman.locator(".poster-link")).toHaveAttribute("target", "_blank");
  await expect(batman.locator(".movie-title-link")).toHaveAttribute("href", "/sodo/en/films/trakt/?kind=movie&id=102");
  await expect(batman.locator(".movie-title-link")).toHaveAttribute("target", "_blank");
  await expect(page.locator("#series .trakt-imported-card h3")).toContainText("MobLand");
  await expect(page.locator("#series .trakt-imported-card")).toContainText("20 episodes");
  await expect(page.locator("#series .trakt-imported-card .trakt-imported-details")).toHaveCount(0);
  await expect(page.locator("#series .trakt-imported-card .trakt-watch-badge")).toHaveCount(0);
  await page.locator("#sodo-welcome-overlay").evaluate(el => el.remove()).catch(() => {});
  const [detailPage] = await Promise.all([
    page.context().waitForEvent("page"),
    batman.locator(".poster-link").click()
  ]);
  await detailPage.waitForLoadState();
  await expect(detailPage).toHaveURL(url => {
    const parsed = new URL(url);
    return parsed.pathname === "/sodo/en/films/trakt/" &&
      parsed.searchParams.get("kind") === "movie" &&
      parsed.searchParams.get("id") === "102";
  });
  await expect(detailPage.locator("#trakt-title")).toHaveText("The Batman");
  await expect(detailPage.locator("#trakt-overview")).toContainText("A masked vigilante");
  await expect(detailPage.locator("#trakt-meta .meta-label")).toContainText(["Trakt rating", "Year", "Work status"]);
  await expect(detailPage.locator("#trakt-meta .meta-item")).toHaveCount(3);
  await expect(detailPage.locator("#trakt-meta .imdb-icon")).toHaveAttribute("href", "https://www.imdb.com/title/tt1877830/");
  await expect(detailPage.locator(".details-panel h2")).toHaveText("Film details");
  await expect(detailPage.locator("#trakt-details")).toContainText("Crime · Drama");
  await expect(detailPage.locator("#trakt-details")).toContainText("176 min");
  await expect(detailPage.locator("#trakt-details")).toContainText("PG-13");
  await expect(detailPage.locator("#trakt-watch-badge")).toHaveCount(0);
  await expect(detailPage.locator(".trakt-private-panel")).toHaveCount(0);
  await expect(detailPage.locator(".trakt-sync-summary")).toHaveCount(0);
});

test("signed-in SODO owner syncs Trakt before public history is rendered", async ({ page }) => {
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
        ? { synced: true, imported: 22, watched_movie_items: 2, watched_movie_rows_inserted: 2, history_movie_rows_seen: 2, history_episode_rows_seen: 20, metadata_updated: 2, metadata_pending: 0 }
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
  await expect(page.locator("#series .trakt-imported-card h3")).toHaveText("MobLand");
  await expect(page.locator("#series .trakt-imported-card")).toContainText("20 episodes");
  await expect(page.locator("#watched .trakt-imported-card h3")).toHaveText("The Batman");
  await expect(page.locator("#watched .trakt-imported-card h3")).toHaveText("The Batman");
  await expect(page.locator("#watched .trakt-imported-card .movie-meta")).toContainText("2022");
  await expect(page.locator("#watched .movie-card h3").filter({ hasText: /^Hope$/ })).toHaveCount(1);
  await expect(page.locator('#watched .movie-card:has(a[href="./hope/"]) .trakt-watch-badge')).toHaveCount(0);
  await expect(page.locator("#watched .trakt-imported-card .trakt-imported-details")).toHaveCount(0);
  await expect(page.locator("#series .trakt-imported-card .trakt-imported-details")).toHaveCount(0);
  await expect(page.locator(".trakt-watch-badge")).toHaveCount(0);
  await expect(page.locator(".trakt-sync-summary")).toHaveCount(0);
});


test("private SODO account shows detailed Trakt sync counts only in the account view", async ({ page }) => {
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
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
      return;
    }
    const action = route.request().postDataJSON().action;
    const payload = action === "status"
      ? { connected: true, last_synced_at: "2026-11-26T17:45:16.212Z" }
      : { synced: true, imported: 20, watched_movie_items: 0, watched_movie_rows_inserted: 0, watched_movie_missing_timestamp: 0, history_movie_rows_seen: 0, history_episode_rows_seen: 20, metadata_updated: 1, metadata_pending: 0 };
    await route.fulfill({
      status: 200,
      headers: { "Access-Control-Allow-Origin": origin, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  });

  await page.goto("/sodo/account/");
  await expect(page.locator("#account-panel")).toBeVisible();
  await expect(page.locator("#message")).toBeVisible();
  await expect(page.locator("#message")).toContainText("أفلام قائمة Trakt: 0");
  await expect(page.locator("#message")).toContainText("أفلام سجل المشاهدة: 0");
  await expect(page.locator("#message")).toContainText("الحلقات: 20");
  await expect(page.locator("#message")).toContainText("بيانات الأعمال المحدثة: 1");
});


test("private SODO account does not attempt Trakt sync while disconnected", async ({ page }) => {
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

  let syncCalls = 0;
  await page.route("https://wbuyglftsgldasawsllt.supabase.co/functions/v1/trakt-sync", async route => {
    const origin = route.request().headers().origin || "*";
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
      return;
    }
    const action = route.request().postDataJSON().action;
    if (action === "sync") syncCalls++;
    const payload = action === "status" ? { connected: false } : { error: "Trakt is not connected yet" };
    await route.fulfill({
      status: action === "status" ? 200 : 409,
      headers: { "Access-Control-Allow-Origin": origin, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  });

  await page.goto("/sodo/account/");
  await expect(page.locator("#account-panel")).toBeVisible();
  await expect(page.locator("#connect")).toBeVisible();
  await expect(page.locator("#sync")).toBeHidden();
  await expect(page.locator("#message")).toBeHidden();
  expect(syncCalls).toBe(0);
});


test("cinema story heading is localized as القصة and manual film links open in a new tab", async ({ page }) => {
  await page.goto("/sodo/en/films/");
  const joker = page.locator("#watched .movie-card").filter({ has: page.locator('a[href="./joker/"]') });
  await expect(joker.locator(".poster-link")).toHaveAttribute("target", "_blank");
  await expect(joker.locator(".movie-title-link")).toHaveAttribute("target", "_blank");

  await page.goto("/sodo/ar/films/joker/");
  await expect(page.locator(".story-block h2")).toHaveText("القصة");

  await page.route("https://wbuyglftsgldasawsllt.supabase.co/functions/v1/trakt-sync", async route => {
    const origin = route.request().headers().origin || "*";
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
      return;
    }
    await route.fulfill({
      status: 200,
      headers: { "Access-Control-Allow-Origin": origin, "Content-Type": "application/json" },
      body: JSON.stringify({ movies: [{ title: "The Batman", trakt_id: 102, overview: "قصة باتمان", year: 2022 }], series: [] })
    });
  });
  await page.goto("/sodo/ar/films/trakt/?kind=movie&id=102");
  await expect(page.locator(".story-block h2")).toHaveText("القصة");
});


test("localized SODO Chat pages load with private sign-in and no attachment controls", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  const supabaseStub = `export function createClient(){return {auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}}}`;
  await page.route("https://esm.sh/@supabase/supabase-js@2", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: supabaseStub
  }));

  for (const language of languages) {
    const response = await page.goto(`/sodo/${language}/chat/`);
    expect(response, `missing Chat document for ${language}`).not.toBeNull();
    expect(response.status(), `Chat HTTP status for ${language}`).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("html")).toHaveAttribute("dir", language === "ar" ? "rtl" : "ltr");
    await expect(page.locator(".intro h1")).toBeVisible();
    await expect(page.locator("#auth-panel")).toBeVisible();
    await expect(page.locator("#signin")).toBeVisible();
    await expect(page.locator("#signup")).toBeVisible();
    await expect(page.locator("input[type='file']")).toHaveCount(0);
    await expect(page.locator(".locale-switch a")).toHaveCount(3);
  }

  expect(pageErrors, "uncaught JavaScript errors on localized Chat pages").toEqual([]);
});
