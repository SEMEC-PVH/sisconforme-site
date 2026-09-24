import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  workers: 1,
  reporter: [["list"]],
  use: { channel: "chrome", deviceScaleFactor: 1 },
  webServer: {
    command: "python -m http.server 4173 --directory out",
    url: "http://localhost:4173/",
    reuseExistingServer: true,
  },
});
