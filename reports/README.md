# Generierte Qualitätsberichte

Dieser Ordner enthält reproduzierbare lokale Nachweise und wird nicht als handgeschriebener
Quellcode bewertet.

| Ordner / Datei | Erzeugung | Inhalt |
| --- | --- | --- |
| `coverage/html/` | `npm run coverage:rust` | navigierbarer Rust-Coverage-Report |
| `coverage/lcov.info` | `npm run coverage:rust:lcov` | maschinenlesbare Coverage |
| `e2e/` | `npm run test:e2e` | Playwright-HTML-Bericht |
| `lighthouse/` | `npm run lighthouse` | HTML/JSON für Startseite und AES |
| `quality-summary.md` | manuell aus finalem Lauf aktualisiert | kompakter Abgabenachweis |

Berichte werden in CI als Artefakt hochgeladen. Sie sind über `.gitignore` von normalen Commits
ausgeschlossen, weil sie jederzeit aus dem geprüften Quellstand neu erzeugt werden können.
