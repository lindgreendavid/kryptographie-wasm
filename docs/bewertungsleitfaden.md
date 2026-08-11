# Bewertungs- und Vorführungsleitfaden

Dieser Leitfaden ermöglicht eine kompakte Prüfung des Projekts ohne Vorwissen über die Ordnerstruktur.

## Empfohlene Prüfung in fünf Minuten

1. **Überblick:** README, Verfahrenstabelle und Architektur ansehen.
2. **Klassisches Verfahren:** In der Live-Demo Caesar mit Schlüssel 3 und `ABC` ausführen. Erwartet wird `DEF`.
3. **Modernes Verfahren:** Bei AES einen Schlüssel erzeugen, Text verschlüsseln und wieder entschlüsseln.
4. **Integrität:** Im AES-Tag ein Zeichen ändern. Die Entschlüsselung muss ohne Klartext mit einer Authentifizierungsfehlermeldung enden.
5. **Nachweise:** Grünen GitHub-Actions-Lauf, Teststrategie und feingranulare Versionsmeilensteine öffnen.

## Bewertungsrelevante Nachweise

| Aspekt | Nachweis im Repository |
| --- | --- |
| Aufgabenverständnis | fünf getrennte Spezifikationen und Landingpage-Spezifikation unter `docs/specs/` |
| Fachliche Struktur | ein Rust-Modul je Verfahren unter `src/crypto/` |
| Trennung der Verantwortlichkeiten | `src/lib.rs` als WASM-Grenze, kleine Dateien unter `web/js/` |
| Korrektheit | Unit-Tests, offizielle Testvektoren und Playwright-Szenarien |
| moderne Kryptographie | RustCrypto-Einbindung, ADR 003 und ADR 004, Primärquellen |
| Fehlerbehandlung | `CryptoError`, AEAD-Werttypen, deutsche UI-Meldungen und Negativtests |
| Reproduzierbarkeit | `rust-toolchain.toml`, `Cargo.lock`, `scripts/` und GitHub Actions |
| Barrierearme Struktur | Labels, Ausgaben, Sprunglink, Tastaturfokus und WCAG-A/AA-Prüfung |
| Sicherheitsreflexion | `docs/bedrohungsmodell.md`, RustSec und gepinnte CI-Actions |
| Versionsverwaltung | ein eigener Meilenstein pro Verfahren und transparente Rekonstruktionsdokumentation |
| Reflexion | Projektgrenzen, Lessons Learned und KI-Nutzung |

## Erwartete Lernergebnisse

Nach der Vorführung sollen folgende Unterschiede verständlich sein:

- Substitution verändert Zeichenwerte, Transposition verändert Positionen.
- Historische Verfahren verschleiern Text, bieten aber keine zeitgemäße Sicherheit.
- Moderne AEAD-Verfahren verbinden Vertraulichkeit und Integritätsprüfung.
- Schlüssel, Nonce und Authentifizierungstag besitzen unterschiedliche Aufgaben.
- WebAssembly erlaubt eine klare Grenze zwischen Browseroberfläche und typisierter Rust-Logik.

## Wichtiger Transparenzhinweis

Die Versionsgeschichte wurde am 11. August 2026 aus sechs gelieferten Ordnerständen rekonstruiert. Sie ist fachlich getrennt, aber nicht als ursprünglich zeitlicher Entstehungsverlauf ausgegeben. Details stehen in `docs/versionshistorie.md`.
