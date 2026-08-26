# Demo-Drehbuch – 7 Minuten

Ziel: Architekturkompetenz und zwei aussagekräftige Nutzerflüsse zeigen, nicht jede Schaltfläche.

## Vorbereitung

- `npm ci`, `npm run build` und `npm run test:all` spätestens vor dem Technik-Check ausführen.
- App über `scripts/start.ps1` starten; keine `file://`-URL verwenden.
- Browserzoom 100 %, Benachrichtigungen aus, AES- und Caesar-Tab vorab öffnen.
- Eingabetext in Zwischenablage: `Hallo WASM 👋\nIntegrität bleibt prüfbar.`
- Offline-Fallback: Screenshots/Folien 4–7 und lokaler Playwright-/Lighthouse-Bericht.

## Ablauf

| Zeit      | Inhalt             | Sprechziel / Aktion                                                                                                |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 0:00–0:35 | Problem und Ziel   | Fünf Verfahren vergleichen; Fachlogik liegt vollständig in Rust/WASM.                                              |
| 0:35–1:10 | Stack              | HTML/CSS/ES-Module → wasm-bindgen → Rust → RustCrypto. Kein Backend.                                               |
| 1:10–1:45 | Architektur        | UI liest Eingaben; Rust validiert und rechnet; Ergebnis oder strukturierter Fehler kommt zurück.                   |
| 1:45–2:20 | Demo Caesar        | Schlüssel 3, `ABC äöü` → `DEF äöü`; zurück entschlüsseln. Nicht-ASCII bleibt erhalten.                             |
| 2:20–3:20 | Demo AES Roundtrip | Schlüssel erzeugen, vorbereiteten Unicode-/Mehrzeilentext verschlüsseln und entschlüsseln. Nonce und Tag erklären. |
| 3:20–3:50 | Demo Integrität    | Ein Zeichen im Tag ändern; Entschlüsselung muss scheitern und darf keinen Klartext zeigen.                         |
| 3:50–4:40 | Rust/WASM-Detail   | `Key32`, `Nonce12`, `AuthTag16`, `CryptoError`, kein eigenes AES.                                                  |
| 4:40–5:30 | Qualität           | 27 Rust-Tests, 98,82 % Lines, 18 Browser-/WCAG-Tests, Lighthouse 100.                                              |
| 5:30–6:15 | Prozess            | Specs → Tests → Implementierung → Gates; zwei echte KI-Korrekturbeispiele nennen.                                  |
| 6:15–6:45 | Grenzen            | Lehrdemo, sichtbare Schlüssel, kein produktives Nonce-/Key-Management, historische Verfahren unsicher.             |
| 6:45–7:00 | Schluss            | Eine Fachlogik, kleine WASM-Grenze, messbare Qualität.                                                             |

## Demo-Akzeptanzkriterien

- beide Roundtrips liefern exakt den ursprünglichen Text;
- manipuliertes AES-Tag erzeugt eine verständliche Meldung und leere Klartextausgabe;
- kein Reload, kein Console-Fehler und keine Eingabe über `file://`;
- spätestens bei 3:50 die Live-Demo verlassen, damit die Präsentation im Zeitlimit bleibt.

## Notfallplan

1. Lädt WASM nicht: URL/Server prüfen und sofort auf Screenshot/Folie wechseln.
2. Browser hängt: keine Fehlersuche vor Publikum; Folie mit dem bereits bestandenen E2E-Flow nutzen.
3. Zeit läuft: Skytale/Substitution nicht live zeigen; sie sind in Matrix und Testnachweisen belegt.
