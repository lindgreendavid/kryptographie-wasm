# KI-gestützte Entwicklung

## Einsatz und Verantwortung

Codex auf Basis von GPT-5 unterstützte Anforderungsstrukturierung, Code- und Architekturreview,
Rust-/WASM-Implementierung, Testentwurf, Tooling, Dokumentation und Abgabevorbereitung. Die
Bearbeiter bleiben für fachliches Verständnis, Auswahl, Ausführung der Tests und Freigabe
verantwortlich.

KI wurde nicht als Autoritätsquelle für Kryptographie verwendet. Moderne Primitive stammen aus
RustCrypto; NIST, RFC 8439 und offizielle Werkzeugdokumentation liefern die überprüfbaren
Referenzen.

## Arbeitsweise

1. Anforderungen aus Kursunterlagen, Specs und aktuellem Projektstand priorisieren.
2. Erwartete Inputs, Outputs, Fehlerfälle und Akzeptanzkriterien dokumentieren.
3. kleine, klar begrenzte Änderungen umsetzen.
4. Rustfmt, Clippy, Rustdoc, Tests, Coverage, Lint, Typecheck, E2E, axe und Lighthouse ausführen.
5. nur gemessene Ergebnisse dokumentieren; Widersprüche korrigieren.

## Konkrete Prüf- und Korrekturbeispiele

| KI-Vorschlag / Problem                    | Kontrolle                                                                     | Korrektur                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Lighthouse-CI über ein zusätzliches Paket | `npm audit` meldete 10 Schwachstellen                                         | Paket entfernt; direkter Lighthouse-Runner mit 0 Audit-Funden                  |
| neuestes wasm-pack 0.15.0 verwenden       | Installation scheiterte auf Windows ARM an fehlender ring/clang-Unterstützung | nachweislich funktionierendes wasm-pack 0.14.0 in lokalem Build und CI gepinnt |
| Rust-Coverage direkt auf ARM messen       | LLVM erzeugte leere Symbolnamen                                               | dokumentierter automatischer x86_64-Mess-Fallback; 98,82 % Lines               |
| Playwright maximal parallel ausführen     | sechs Worker führten lokal zu Ressourcen-Time-outs                            | zwei Worker plus echte Ladezustände; 18/18 stabil bestanden                    |
| vorhandener Servermarker                  | Healthcheck suchte Text, der nicht mehr existierte                            | eindeutiger realer `<title>`-Marker und erneute Lighthouse-Prüfung             |

Diese Beispiele zeigen den Kontrollmechanismus: Ein generierter Vorschlag gilt nicht als Ergebnis,
bevor er durch Build, Test oder Primärquelle bestätigt wurde.

## Promptnachweis und Datenschutz

Die für die Abschlussphase gelieferten Master-, Audit- und Dokumentationsprompts liegen unter
`ai/prompts/`; das Sitzungsprotokoll unter `ai/2026-08-23-codex.md`. Zugangsdaten, Schlüssel,
Systemprompts und interne Toolausgaben werden nicht protokolliert.

## Grenzen

Prompts und generierte Texte beweisen weder Eigenleistung noch Korrektheit. Deshalb verweist die
Dokumentation auf Code, Tests und Reports. Persönliche Ist-Stunden, mündliches Verständnis und die
finale Abgabefreigabe können nicht durch KI ersetzt oder glaubwürdig erfunden werden.
