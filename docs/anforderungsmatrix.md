# Anforderungs- und Nachweismatrix

Stand: 23.08.2026. Prioritäten: **Muss**, **Soll**, **Kann**.

## Funktionale Anforderungen

| ID    | Anforderung                                                                           | Prio | Status    | Code-Nachweis                                  | Test-Nachweis                                         |
| ----- | ------------------------------------------------------------------------------------- | ---- | --------- | ---------------------------------------------- | ----------------------------------------------------- |
| F-001 | Startseite verlinkt alle fünf Verfahren.                                              | Muss | umgesetzt | `web/index.html`                               | Navigation und Console in `e2e/kryptographie.spec.js` |
| F-002 | Ansicht Hell, Dunkel oder Cyber ist auswählbar und wird lokal gespeichert.            | Soll | umgesetzt | `web/js/theme.js`                              | Theme-Persistenz und axe in drei Ansichten            |
| F-010 | Caesar ver- und entschlüsselt mit Schlüsseln 1–25.                                    | Muss | umgesetzt | `src/crypto/caesar.rs`                         | Unit-, Integration- und E2E-Roundtrip                 |
| F-011 | Caesar erhält Nicht-ASCII-Zeichen unverändert und zeigt das verschobene Alphabet.     | Muss | umgesetzt | `caesar.rs`, `web/js/caesar.js`                | Unicode-/Grenztests                                   |
| F-020 | Skytale ver- und entschlüsselt mit 2–30 Spalten.                                      | Muss | umgesetzt | `src/crypto/skytale.rs`                        | Integration- und E2E-Roundtrip                        |
| F-021 | Skytale zeigt die Zeichenmatrix und behandelt unvollständige letzte Zeilen.           | Soll | umgesetzt | `skytale_table`, `web/js/skytale.js`           | kurze-, Unicode- und Restzeilentests                  |
| F-030 | Substitution nutzt ein gültiges Geheimalphabet mit 26 eindeutigen A–Z-Zeichen.        | Muss | umgesetzt | `src/crypto/substitution.rs`                   | Positiv-/Negativtests                                 |
| F-031 | Beispiel- und kryptographisch zufälliges Alphabet sind auswählbar.                    | Soll | umgesetzt | `substitution_random_alphabet`                 | Permutations- und E2E-Test                            |
| F-040 | AES-256-GCM erzeugt Schlüssel und Nonce, verschlüsselt und entschlüsselt UTF-8.       | Muss | umgesetzt | `src/crypto/aead/aes_gcm.rs`                   | Roundtrips, NIST-Vektor, E2E                          |
| F-041 | AES lehnt falsche Größen, Base64, Schlüssel und Manipulation ohne Klartext ab.        | Muss | umgesetzt | Werttypen, `CryptoError`                       | Rust-Negativtests und E2E-Tagmanipulation             |
| F-050 | ChaCha20-Poly1305 erzeugt Schlüssel und Nonce, verschlüsselt und entschlüsselt UTF-8. | Muss | umgesetzt | `src/crypto/aead/chacha20_poly1305.rs`         | Roundtrips, RFC-8439-Vektor, E2E                      |
| F-051 | ChaCha lehnt falsche Größen, Base64, Schlüssel und Manipulation ohne Klartext ab.     | Muss | umgesetzt | Werttypen, `CryptoError`                       | Rust-Negativtests und E2E-Tagmanipulation             |
| F-060 | Verfahren zeigen Lade- und verständliche Fehlerzustände.                              | Muss | umgesetzt | `web/js/dom.js`, verfahrensspezifische Brücken | E2E-Validierungsfälle und Console-Test                |

## Qualitätsanforderungen

| ID    | Qualitätsziel                              | Messkriterium                                      | Status  | Nachweis                                      |
| ----- | ------------------------------------------ | -------------------------------------------------- | ------- | --------------------------------------------- |
| Q-001 | Rust ist alleinige Fachlogik.              | 5/5 Verfahren in Rust, 0 in JavaScript             | erfüllt | `src/crypto/`, `web/js/`                      |
| Q-002 | Sichere eigene Rust-Schicht.               | 0 eigene `unsafe`-Blöcke                           | erfüllt | `#![forbid(unsafe_code)]`, Messskript         |
| Q-003 | Öffentliche Rust-API dokumentiert.         | `missing_docs` als Fehler                          | erfüllt | `#![deny(missing_docs)]`, Rustdoc-Gate        |
| Q-004 | Hohe Core-Testabdeckung.                   | mindestens 85 % Lines                              | erfüllt | 98,82 % Lines in `reports/coverage/`          |
| Q-005 | Kernflows funktionieren im realen Browser. | alle E2E-Tests grün                                | erfüllt | 18/18 Playwright-Tests                        |
| Q-006 | Automatisierbare Barrierefreiheit.         | 0 axe-Verstöße WCAG A/AA                           | erfüllt | 6 Seiten × 3 Ansichten                        |
| Q-007 | Mobile Darstellung.                        | kein horizontaler Dokument-Overflow bei 390 px     | erfüllt | Playwright-Viewporttest                       |
| Q-008 | Webqualität.                               | Lighthouse P/A/BP/SEO ≥ 90, A = 100                | erfüllt | jeweils 100 auf Startseite und AES            |
| Q-009 | Statische Codequalität.                    | Prettier, ESLint, Typecheck, rustfmt, Clippy grün  | erfüllt | `npm run test:all`, CI                        |
| Q-010 | Reproduzierbarer Build.                    | festgelegte Toolchains und Lockfiles               | erfüllt | Rust 1.97.1, wasm-pack 0.14.0, Cargo/npm lock |
| Q-011 | Lieferkettenschutz.                        | Audits, Updates und gepinnte Actions               | erfüllt | Security-Workflow, Dependabot, SHA-Pinning    |
| Q-012 | Keine unnötige Backendabhängigkeit.        | statische Auslieferung; 0 Netzaufrufe je Operation | erfüllt | Pages-Workflow und Browserarchitektur         |

## Traceability-Regel

Eine Muss-Anforderung gilt erst als abgeschlossen, wenn Implementierung, automatisierter Nachweis und
Dokumentation vorhanden sind. Änderungen an einer Anforderung müssen deshalb mindestens Spec,
Testfall und Matrix gemeinsam aktualisieren.
