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
  page.on("response", response => {
    if (response.url().startsWith(new URL(page.context()._options.baseURL || "http://127.0.0.1:4173").origin) &&
        response.status() >= 400) {
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
    await expect(page.locator("body")).toHaveClass(/site-ready/);
  }

  expect(pageErrors, "uncaught JavaScript errors across localized routes").toEqual([]);
  expect(failedResources, "failed same-origin resources across localized routes").toEqual([]);
});

test("language switching changes URL, document language, direction, and visible copy", async ({ page }) => {
  await page.goto("/sodo/en/");
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
    const links = page.locator("header nav a[href]");
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
