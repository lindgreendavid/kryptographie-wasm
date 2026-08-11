import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Caesar verschlüsselt und entschlüsselt einen Text", async ({ page }) => {
    await page.goto("/caesar.html");
    await page.locator("#caesar-plain").fill("Hallo Welt");
    await page.locator("#caesar-shift").selectOption("3");
    await page.locator("#caesar-encrypt").click();

    await expect(page.locator("#caesar-cipher-output")).toHaveText("Kdoor Zhow");
    await page.locator("#caesar-decrypt").click();
    await expect(page.locator("#caesar-plain-output")).toHaveText("Hallo Welt");
});

test("AES-GCM lehnt ein manipuliertes Tag ab", async ({ page }) => {
    await page.goto("/aes.html");
    await page.locator("#aes-generate-key").click();
    await page.locator("#aes-plain").fill("Integrität ist wichtig");
    await page.locator("#aes-encrypt-button").click();
    await expect(page.locator("#aes-cipher-output")).not.toBeEmpty();

    const tag = await page.locator("#aes-tag").inputValue();
    const firstCharacter = tag.startsWith("A") ? "B" : "A";
    await page.locator("#aes-tag").fill(`${firstCharacter}${tag.slice(1)}`);
    await page.locator("#aes-decrypt-button").click();

    await expect(page.locator("#aes-plain-output")).toBeEmpty();
    await expect(page.locator("#aes-message")).toContainText("nicht authentifiziert");
});

for (const path of [
    "index.html",
    "caesar.html",
    "skytale.html",
    "substitution.html",
    "aes.html",
    "chacha.html",
]) {
    test(`${path} erfüllt die automatisierbaren WCAG-Prüfungen`, async ({ page }) => {
        await page.goto(`/${path}`);
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();

        expect(results.violations).toEqual([]);
    });
}
