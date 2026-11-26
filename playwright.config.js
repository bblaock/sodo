const { defineConfig } = require("@playwright/test");

const liveBaseURL = process.env.BASE_URL;
const config = {
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: liveBaseURL || "http://127.0.0.1:4173",
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  }
};

if (!liveBaseURL) {
  config.webServer = {
    command: "node tools/serve-sodo.js",
    url: "http://127.0.0.1:4173/sodo/",
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  };
}

module.exports = defineConfig(config);
