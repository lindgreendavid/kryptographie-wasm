# ADR 006: Browser- und WCAG-Tests mit Playwright

## Status

Angenommen

## Kontext

Rust-Tests beweisen nicht, dass WASM, JavaScript und DOM im Browser korrekt zusammenspielen. Eine reine HTML-Strukturprüfung erkennt außerdem keine automatisierbaren Barrierefreiheitsprobleme wie unzureichende Kontraste oder ungültige ARIA-Zustände.

## Entscheidung

Playwright führt reproduzierbare End-to-End-Tests in Chromium aus. `@axe-core/playwright` prüft jede Seite nach den automatisierbaren Regeln der WCAG-Stufen A und AA. Der CI-Workflow speichert bei Bedarf einen HTML-Bericht als kurzlebiges Artefakt.

## Folgen

- zentrale Benutzerwege werden an der realen Browsergrenze geprüft;
- eine manipulierte AES-GCM-Nachricht darf auch in der Oberfläche keinen Klartext liefern;
- Node-Abhängigkeiten werden durch `package-lock.json` reproduzierbar;
- manuelle Tastatur-, Screenreader- und visuelle Prüfungen bleiben erforderlich.
