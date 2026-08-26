import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    outputDir: "./test-results",
    fullyParallel: true,
    timeout: 45_000,
    workers: 2,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: [["line"], ["html", { open: "never", outputFolder: "reports/e2e" }]],
    use: {
        baseURL: "http://127.0.0.1:8080",
        screenshot: "only-on-failure",
        trace: "on-first-retry",
        video: "retain-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run serve:test",
        reuseExistingServer: false,
        timeout: 120_000,
        url: "http://127.0.0.1:8080/index.html",
    },
});
