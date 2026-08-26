# Teststrategie

## Ziel und Testpyramide

Die Qualität wird auf der jeweils günstigsten wirksamen Ebene geprüft:

1. **Rust-Unit- und Integrationstests** belegen Fachregeln, Fehlerdomäne und offizielle Vektoren.
2. **WASM-API-Tests** prüfen die öffentlich exportierte Form und typisierte AEAD-Ergebnisse.
3. **statische Webprüfungen** erkennen kaputte Verweise, doppelte IDs, Label-Fehler und Syntax-/Typfehler.
4. **Playwright** prüft reale Browserflows über HTML, JavaScript, generierte Bindings und WASM.
5. **axe und Lighthouse** messen automatisierbare Barrierefreiheit und Webqualität.

Mocks werden für Kernflows bewusst nicht verwendet.

## Rust-Testmatrix

| Bereich           | Positivfälle                                | Grenz- und Negativfälle                                          |
| ----------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| Caesar            | bekanntes Beispiel und Roundtrip            | 0/26, leer, Whitespace, Unicode, Emoji, mehrzeilig               |
| Skytale           | Roundtrips, Restzeilen und Matrix           | Spalten außerhalb 2–30, kurz, leer, Unicode                      |
| Substitution      | Beispiel-/Zufallsalphabet, Roundtrip        | Länge, Nicht-A–Z, Dopplung, fehlender Buchstabe                  |
| AES-256-GCM       | UTF-8-Roundtrips und NIST-Vektor            | Base64, Größen, falscher Schlüssel, Cipher/Nonce/Tag manipuliert |
| ChaCha20-Poly1305 | UTF-8-Roundtrips und RFC-8439-Vektor        | Base64, Größen, falscher Schlüssel, Cipher/Nonce/Tag manipuliert |
| Fehlerdomäne      | jede Variante besitzt verständliche Meldung | unvollständiges AEAD-Ergebnis und UTF-8-Fehler                   |
| WASM-API          | alle klassischen und modernen Exports       | typisierte Felder und Fehlerübersetzung                          |

Ergebnis: **27/27 Rust-Tests bestanden**. Die Coverage beträgt **95,99 % Regions**,
**97,62 % Functions** und **98,82 % Lines**. Die CI-Schranke liegt bei 85 % Lines.

## Browser- und Accessibility-Matrix

Die 18 Playwright-Tests prüfen:

- Roundtrips aller fünf Verfahren mit Unicode und Mehrzeilentext;
- manipulierte Tags bei AES-GCM und ChaCha20-Poly1305;
- verständliche Skytale-/Substitutionsfehler;
- Theme-Persistenz;
- Navigation, aktiven Link, Sprunglink und Tastaturfokus;
- alle sechs Seiten bei 390 Pixeln ohne horizontalen Dokument-Overflow;
- alle Seiten ohne Browser-Console-Fehler;
- axe WCAG A/AA auf sechs Seiten in Hell, Dunkel und Cyber.

Playwright speichert bei Fehlern Screenshot und Video; im CI-Retry zusätzlich einen Trace. Zwei
Worker vermeiden Ressourcenflakiness auf Windows ARM. Es gibt keine festen Sleeps.

## Statische und visuelle Gates

| Gate                 | Befehl                                                     | Ziel                                                    |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| HTML/Verweise/Labels | `npm run verify:web`                                       | sechs vollständige Seiten und gültige lokale Referenzen |
| Format               | `npm run format:check`                                     | einheitlicher JS/CSS/HTML/Markdown/YAML-Stil            |
| JS/JSDoc             | `npm run lint`                                             | ESLint ohne Fehler                                      |
| Typen                | `npm run typecheck`                                        | TypeScript strict checkJs ohne Fehler                   |
| Rustformat           | `cargo fmt --check`                                        | kanonischer Rust-Stil                                   |
| Rustlint             | `cargo clippy --all-targets --all-features -- -D warnings` | keine Clippy-Warnungen                                  |
| API-Doku             | `cargo rustdoc --lib --locked -- -D missing-docs`          | öffentliche API vollständig dokumentiert                |
| Lighthouse           | `npm run lighthouse`                                       | Desktop P/A/BP/SEO ≥ 90, Accessibility 100              |

Lighthouse erreichte auf Startseite und AES **100/100/100/100**. Die Messbedingung ist das
Lighthouse-Desktopprofil auf dem lokalen Release-Build.

## Reproduktion

```bash
npm ci
npx playwright install chromium
npm run test:all
```

Einzelberichte:

```bash
npm run coverage:rust
npm run coverage:rust:lcov
npm run test:e2e
npm run lighthouse
```

Unter Windows führt `scripts/test.ps1`, unter Linux/macOS `scripts/test.sh` denselben Pfad aus.

## Grenzen

Coverage beweist ausgeführte Zeilen, nicht kryptographische Sicherheit. Axe deckt nur
automatisierbare WCAG-Regeln ab. Nicht automatisiert sind ein vollständiger Screenreader-Test,
Firefox/WebKit und pixelgenaue visuelle Regression. Diese Punkte sind für den eng begrenzten
Lehrumfang bewusst als manuelle bzw. spätere Erweiterung dokumentiert.
