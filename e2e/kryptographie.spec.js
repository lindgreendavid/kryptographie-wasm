import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
    "index.html",
    "caesar.html",
    "skytale.html",
    "substitution.html",
    "aes.html",
    "chacha.html",
];
const unicodeText = "Grüße aus Rust 🔐\nZeile 2 mit ß und 123";

/**
 * Verändert ein Base64-Zeichen, ohne das Format ungültig zu machen.
 *
 * @param {string} value - Originalwert.
 * @returns {string} Manipulierter Base64-Wert.
 */
function manipulateBase64(value) {
    const firstCharacter = value.startsWith("A") ? "B" : "A";
    return firstCharacter + value.slice(1);
}

test("Caesar verschlüsselt und entschlüsselt einen Text", async ({ page }) => {
    await page.goto("/caesar.html");
    await page.locator("#caesar-plain").fill("Hallo Welt");
    await page.locator("#caesar-shift").selectOption("3");
    await page.locator("#caesar-encrypt").click();

    await expect(page.locator("#caesar-cipher-output")).toHaveText("Kdoor Zhow");
    await page.locator("#caesar-decrypt").click();
    await expect(page.locator("#caesar-plain-output")).toHaveText("Hallo Welt");
});

test("Skytale erhält Unicode und Mehrzeilentext", async ({ page }) => {
    await page.goto("/skytale.html");
    await page.locator("#skytale-columns").fill("7");
    await page.locator("#skytale-plain").fill(unicodeText);
    await page.locator("#skytale-encrypt").click();
    await expect(page.locator("#skytale-cipher-output")).not.toBeEmpty();
    await page.locator("#skytale-decrypt").click();
    await expect(page.locator("#skytale-plain-output")).toHaveText(unicodeText);
});

test("Substitution erhält Unicode und Mehrzeilentext", async ({ page }) => {
    await page.goto("/substitution.html");
    await page.locator("#substitution-example").click();
    await page.locator("#substitution-plain").fill(unicodeText);
    await page.locator("#substitution-encrypt").click();
    await expect(page.locator("#substitution-cipher-output")).not.toBeEmpty();
    await page.locator("#substitution-decrypt").click();
    await expect(page.locator("#substitution-plain-output")).toHaveText(unicodeText);
});

for (const algorithm of ["aes", "chacha"]) {
    test(algorithm.toUpperCase() + " erhält Unicode und Mehrzeilentext", async ({ page }) => {
        await page.goto("/" + algorithm + ".html");
        await page.locator("#" + algorithm + "-generate-key").click();
        await page.locator("#" + algorithm + "-plain").fill(unicodeText);
        await page.locator("#" + algorithm + "-encrypt-button").click();
        await expect(page.locator("#" + algorithm + "-cipher-output")).not.toBeEmpty();
        await page.locator("#" + algorithm + "-decrypt-button").click();
        await expect(page.locator("#" + algorithm + "-plain-output")).toHaveText(unicodeText);
    });
}

test("AES-GCM lehnt ein manipuliertes Tag ab", async ({ page }) => {
    await page.goto("/aes.html");
    await page.locator("#aes-generate-key").click();
    await page.locator("#aes-plain").fill("Integrität ist wichtig");
    await page.locator("#aes-encrypt-button").click();
    await expect(page.locator("#aes-cipher-output")).not.toBeEmpty();

    const tag = await page.locator("#aes-tag").inputValue();
    await page.locator("#aes-tag").fill(manipulateBase64(tag));
    await page.locator("#aes-decrypt-button").click();

    await expect(page.locator("#aes-plain-output")).toBeEmpty();
    await expect(page.locator("#aes-message")).toContainText("nicht authentifiziert");
});

test("ChaCha20-Poly1305 lehnt ein manipuliertes Tag ab", async ({ page }) => {
    await page.goto("/chacha.html");
    await page.locator("#chacha-generate-key").click();
    await page.locator("#chacha-plain").fill("Authentifizierungstest");
    await page.locator("#chacha-encrypt-button").click();
    const tag = await page.locator("#chacha-tag").inputValue();
    await page.locator("#chacha-tag").fill(manipulateBase64(tag));
    await page.locator("#chacha-decrypt-button").click();
    await expect(page.locator("#chacha-plain-output")).toBeEmpty();
    await expect(page.locator("#chacha-message")).toContainText("nicht authentifiziert");
});

test("Ungültige Skytale- und Substitutionseingaben werden verständlich erklärt", async ({
    page,
}) => {
    await page.goto("/skytale.html");
    await page.locator("#skytale-columns").fill("1");
    await page.locator("#skytale-encrypt").click();
    await expect(page.locator("#skytale-message")).toContainText("zwischen 2 und 30");

    await page.goto("/substitution.html");
    await page.locator("#substitution-alphabet").fill("AAAAAAAAAAAAAAAAAAAAAAAAAA");
    await page.locator("#substitution-encrypt").click();
    await expect(page.locator("#substitution-message")).toContainText("mehrfach");
});

test("Theme-Auswahl bleibt nach einem Reload erhalten", async ({ page }) => {
    await page.goto("/index.html");
    await page.getByRole("button", { name: "Cyber" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "cyber");
    await expect(page.getByRole("button", { name: "Cyber" })).toHaveAttribute(
        "aria-pressed",
        "true",
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "cyber");
});

test("Navigation, aktiver Link und Sprunglink sind tastaturtauglich", async ({ page }) => {
    await page.goto("/caesar.html");
    await expect(page.locator('.topnav a[aria-current="page"]')).toHaveAttribute(
        "href",
        "caesar.html",
    );
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Direkt zum Inhalt" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#hauptinhalt")).toBeFocused();
});

test("Alle Seiten bleiben bei 390 Pixeln ohne horizontalen Dokument-Overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of pages) {
        await page.goto("/" + path);
        const hasOverflow = await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(hasOverflow, path).toBe(false);
    }
});

test("Alle Seiten laden ohne Console-Fehler", async ({ page }) => {
    /** @type {string[]} */
    const errors = [];
    page.on("console", (message) => {
        if (message.type() === "error") {
            errors.push(message.text());
        }
    });

    for (const path of pages) {
        await page.goto("/" + path);
    }
    expect(errors).toEqual([]);
});

for (const path of pages) {
    test(path + " erfüllt WCAG A/AA in allen drei Ansichten", async ({ page }) => {
        await page.goto("/" + path);
        for (const theme of ["Hell", "Dunkel", "Cyber"]) {
            await page.getByRole("button", { name: theme }).click();
            const results = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
                .analyze();
            expect(results.violations, path + " / " + theme).toEqual([]);
        }
    });
}
