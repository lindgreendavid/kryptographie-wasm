import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import * as chromeLauncher from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportDirectory = path.join(projectRoot, "reports", "lighthouse");
const serverScript = path.join(projectRoot, "node_modules", "http-server", "bin", "http-server");
const baseUrl = "http://127.0.0.1:8080";
const targets = [
    { name: "startseite", url: `${baseUrl}/index.html` },
    { name: "aes", url: `${baseUrl}/aes.html` },
];
/** @type {Record<string, number>} */
const thresholds = {
    accessibility: 1,
    "best-practices": 0.9,
    performance: 0.9,
    seo: 0.9,
};

/**
 * Wartet, bis der lokale Webserver die Projekt-Startseite ausliefert.
 *
 * @returns {Promise<void>} Erfüllt sich, sobald die Anwendung erreichbar ist.
 */
async function waitForServer() {
    for (let attempt = 0; attempt < 80; attempt += 1) {
        try {
            const response = await fetch(`${baseUrl}/index.html`);
            const body = await response.text();
            if (response.ok && body.includes("<title>Kryptographie</title>")) {
                return;
            }
        } catch {
            // Der Server befindet sich noch in der Startphase.
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("Der Lighthouse-Webserver war nach 20 Sekunden nicht erreichbar.");
}

await fs.mkdir(reportDirectory, { recursive: true });

const server = spawn(
    process.execPath,
    [serverScript, "web", "-a", "127.0.0.1", "-p", "8080", "-c-1", "--silent"],
    { cwd: projectRoot, stdio: "ignore" },
);

/** @type {Awaited<ReturnType<typeof chromeLauncher.launch>> | undefined} */
let chrome;
try {
    await waitForServer();
    chrome = await chromeLauncher.launch({
        chromePath: chromium.executablePath(),
        chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
    });

    /** @type {Record<string, Record<string, number>>} */
    const summary = {};
    let thresholdFailed = false;

    for (const target of targets) {
        const result = await lighthouse(
            target.url,
            {
                logLevel: "error",
                onlyCategories: Object.keys(thresholds),
                output: ["html", "json"],
                port: chrome.port,
            },
            desktopConfig,
        );
        if (!result) {
            throw new Error(`Lighthouse lieferte für ${target.url} kein Ergebnis.`);
        }

        const reports = Array.isArray(result.report) ? result.report : [result.report];
        const htmlReport = reports[0];
        const jsonReport = reports[1];
        if (!htmlReport || !jsonReport) {
            throw new Error(`Lighthouse-Berichte für ${target.url} sind unvollständig.`);
        }

        await fs.writeFile(path.join(reportDirectory, `${target.name}.html`), htmlReport, "utf8");
        await fs.writeFile(path.join(reportDirectory, `${target.name}.json`), jsonReport, "utf8");

        /** @type {Record<string, number>} */
        const targetSummary = {};
        summary[target.name] = targetSummary;
        for (const [category, minimum] of Object.entries(thresholds)) {
            const score = result.lhr.categories[category]?.score ?? 0;
            targetSummary[category] = score;
            thresholdFailed ||= score < minimum;
        }
    }

    await fs.writeFile(
        path.join(reportDirectory, "summary.json"),
        `${JSON.stringify(summary, null, 2)}\n`,
        "utf8",
    );
    console.log("Lighthouse-Ergebnisse:", JSON.stringify(summary, null, 2));

    if (thresholdFailed) {
        throw new Error("Mindestens ein Lighthouse-Mindestwert wurde unterschritten.");
    }
} finally {
    if (chrome) {
        try {
            await chrome.kill();
        } catch (error) {
            console.warn(
                `Chrome wurde beendet; das temporäre Profil ließ sich nicht löschen: ${error}`,
            );
        }
    }
    server.kill();
}
