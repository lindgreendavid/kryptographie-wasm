import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    outputDir: "./test-results",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI
        ? [["line"], ["html", { open: "never" }]]
        : "line",
    use: {
        baseURL: "http://127.0.0.1:8080",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "python3 -m http.server 8080 --directory web",
        url: "http://127.0.0.1:8080/index.html",
        reuseExistingServer: !process.env.CI,
    },
});
