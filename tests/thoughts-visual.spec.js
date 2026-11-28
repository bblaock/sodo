const { test, expect } = require("@playwright/test");

const languages = ["ar", "en", "ru"];
const coverUrl = "https://i.ibb.co/8LXftpWc/2253-A760-05-F7-4211-9-B74-03875386-B7-B2.png";

async function expectImageLoaded(image) {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(
    () => image.evaluate(img => ({
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    })),
    { message: "The original Thoughts cover image should load in the browser", timeout: 20000 }
  ).toMatchObject({ complete: true, naturalWidth: expect.any(Number), naturalHeight: expect.any(Number) });
  const dimensions = await image.evaluate(img => ({
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight
  }));
  expect(dimensions.naturalWidth).toBeGreaterThan(0);
  expect(dimensions.naturalHeight).toBeGreaterThan(0);
}

test("Thoughts featured cover loads and fits the mobile and desktop layouts", async ({ page }, testInfo) => {
  for (const language of languages) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/sodo/${language}/thoughts/`);

    const cover = page.locator(".featured-image img");
    await expect(cover).toHaveCount(1);
    await expect(cover).toHaveAttribute("src", coverUrl);
    await expectImageLoaded(cover);

    const mobileLayout = await page.locator(".featured").evaluate(element => {
      const card = element.getBoundingClientRect();
      const image = element.querySelector(".featured-image").getBoundingClientRect();
      return {
        cardWidth: card.width,
        imageWidth: image.width,
        imageHeight: image.height,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth
      };
    });
    expect(mobileLayout.cardWidth).toBeGreaterThan(0);
    expect(mobileLayout.imageWidth).toBeGreaterThan(0);
    expect(mobileLayout.imageHeight).toBeGreaterThan(0);
    expect(mobileLayout.documentWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth);

    if (language === "ar") {
      const mobileShot = await page.screenshot({ fullPage: true });
      await testInfo.attach("thoughts-ar-mobile-listing", {
        body: mobileShot,
        contentType: "image/png"
      });
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(cover).toBeVisible();
    const desktopLayout = await page.locator(".featured").evaluate(element => {
      const card = element.getBoundingClientRect();
      const image = element.querySelector(".featured-image").getBoundingClientRect();
      return {
        cardWidth: card.width,
        imageWidth: image.width,
        imageHeight: image.height,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth
      };
    });
    expect(desktopLayout.cardWidth).toBeGreaterThan(0);
    expect(desktopLayout.imageWidth).toBeGreaterThan(0);
    expect(desktopLayout.imageHeight).toBeGreaterThan(0);
    expect(desktopLayout.documentWidth).toBeLessThanOrEqual(desktopLayout.viewportWidth);

    if (language === "ar") {
      const desktopShot = await page.screenshot({ fullPage: true });
      await testInfo.attach("thoughts-ar-desktop-listing", {
        body: desktopShot,
        contentType: "image/png"
      });
    }
  }
});

test("Thoughts article uses only the original cover image and no removed inline illustrations", async ({ page }, testInfo) => {
  for (const language of languages) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/sodo/${language}/thoughts/what-if-ww2/`);

    const articleImages = page.locator(".thought-illustration img");
    await expect(articleImages).toHaveCount(1);
    await expect(articleImages).toHaveAttribute("src", coverUrl);
    await expectImageLoaded(articleImages);

    await expect(page.locator('img[src*="inline-diplomacy"], img[src*="inline-science"], img[src*="inline-paths"]')).toHaveCount(0);
    await expect(page.locator(".article-body .thought-illustration")).toHaveCount(0);

    const mobileLayout = await page.locator(".thought-illustration img").evaluate(img => ({
      imageWidth: img.getBoundingClientRect().width,
      imageHeight: img.getBoundingClientRect().height,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    }));
    expect(mobileLayout.imageWidth).toBeGreaterThan(0);
    expect(mobileLayout.imageHeight).toBeGreaterThan(0);
    expect(mobileLayout.documentWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth);

    if (language === "ar") {
      const mobileShot = await page.screenshot({ fullPage: true });
      await testInfo.attach("thoughts-ar-mobile-article", {
        body: mobileShot,
        contentType: "image/png"
      });
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(articleImages).toBeVisible();
    const desktopWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(desktopWidth).toBeLessThanOrEqual(1440);

    if (language === "ar") {
      const desktopShot = await page.screenshot({ fullPage: true });
      await testInfo.attach("thoughts-ar-desktop-article", {
        body: desktopShot,
        contentType: "image/png"
      });
    }
  }
});
