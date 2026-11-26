module.exports = {
  ci: {
    collect: {
      startServerCommand: "node tools/serve-sodo.js",
      startServerReadyPattern: "SODO test server listening",
      url: [
        "http://127.0.0.1:4173/sodo/",
        "http://127.0.0.1:4173/sodo/thoughts/",
        "http://127.0.0.1:4173/sodo/films/",
        "http://127.0.0.1:4173/sodo/projects/",
      ],
      numberOfRuns: 1,
      settings: { chromeFlags: "--no-sandbox" },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.60 }],
        "categories:accessibility": ["warn", { minScore: 0.80 }],
        "categories:best-practices": ["warn", { minScore: 0.80 }],
        "categories:seo": ["warn", { minScore: 0.80 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
