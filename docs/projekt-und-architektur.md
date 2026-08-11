# Projekt- und Architekturdokumentation

## 1. Anforderungen und Ziele

Ziel ist eine kleine Webanwendung zum Thema Kryptographie. Benutzer können fünf Verfahren ausprobieren und Texte verschlüsseln sowie entschlüsseln.

## 2. Themensteckbrief

Das Projekt behandelt Caesar, Skytale, einfache Substitution, AES-GCM und ChaCha20-Poly1305. Die ersten drei Verfahren sind historisch und didaktisch, AES-GCM und ChaCha20-Poly1305 sind moderne authentifizierte Verfahren.

## 3. Technik-Stack

HTML5, CSS3, Vanilla JavaScript, Rust, WebAssembly, wasm-bindgen, aes-gcm, chacha20poly1305, Cargo, rustfmt, clippy und GitHub Actions.

## 4. Frontend-Struktur

Im Ordner `web/` liegen sechs Hauptseiten: `index.html`, `caesar.html`, `skytale.html`, `substitution.html`, `aes.html` und `chacha.html`. Eine gemeinsame CSS-Datei steuert das klassische Layout. `theme.js` ergänzt die wählbaren Ansichten Hell, Dunkel und Cyber.

## 5. Rust/WASM-Struktur

Die Rust-Logik liegt in `src/crypto/`. Jedes Verfahren besitzt ein eigenes Modul. `src/lib.rs` stellt die WASM-Exports bereit.

## 6. Komponenten

- HTML: Struktur und Formulare
- CSS: klassisches Layout, responsive Umbrüche
- JavaScript: Initialisierung des WASM-Moduls, DOM-Ereignisse und Ansichtsauswahl
- Rust: Verschlüsselung, Entschlüsselung und Validierung

## 7. Interaktion der Komponenten

Beim Klick auf einen Button liest JavaScript die Eingaben aus, ruft eine WASM-Funktion auf und schreibt das Ergebnis zurück in die Seite.

## 8. Modularisierung

Die Verfahren sind getrennt: `caesar.rs`, `skytale.rs`, `substitution.rs`, `aes.rs` und `chacha.rs`. Dadurch sind Tests und Präsentation pro Verfahren möglich.

## 9. State Management

Es gibt kein komplexes State Management. Der Zustand liegt in den Formularfeldern der jeweiligen Seite. Nur die gewählte Ansicht Hell, Dunkel oder Cyber wird über `localStorage` gespeichert.

## 10. Routing

Routing erfolgt über klassische HTML-Links zwischen sechs Dateien. Es gibt kein SPA-Routing.

## 11. Persistenz

Es gibt keine fachliche Persistenz. Texte, Schlüssel und Ergebnisse werden nicht gespeichert. Nur die Anzeigeauswahl wird lokal im Browser behalten.

## 12. Konfiguration

Die Konfiguration ist minimal: `Cargo.toml` für Rust-Abhängigkeiten sowie Shell- und PowerShell-Skripte für Build, Test und Start.

## 13. Implementierung der Fachlogik

Caesar verschiebt ASCII-Buchstaben. Skytale ordnet Zeichen tabellarisch an. Substitution validiert ein 26-stelliges Geheimalphabet. AES-GCM und ChaCha20-Poly1305 nutzen RustCrypto und einen sicheren Zufallszahlengenerator.

## 14. Frontend/WASM-Integration

`wasm-pack build --target web --out-dir web/pkg` erzeugt das Browserpaket. Die JS-Dateien importieren `web/pkg/krypto_wasm.js`.

## 15. Tooling

Die Skripte in `scripts/` kapseln Build, Test, Webprüfung und lokalen Start für Windows, macOS und Linux.

## 16. Tests

Die Datei `tests/crypto_tests.rs` prüft Beispiele, Roundtrips und Fehlerfälle. Zusätzlich werden Formatierung, Linting und WASM-Build geprüft.

## 17. KI-gestützter Entwicklungsprozess

Codex wurde zur Umsetzung und Dokumentation eingesetzt. Die fehlenden externen Quellen wurden nicht erfunden, sondern im README transparent erwähnt.

## 18. Projektplanung

Die Planung liegt in `docs/projektplan.md`.

## 19. Herausforderungen

Wichtig war die saubere Trennung: JavaScript darf nur verbinden, während Rust die eigentliche Logik übernimmt. Bei AES und ChaCha20-Poly1305 mussten etablierte Verfahren statt Eigenimplementierungen verwendet werden.

## 20. Lessons Learned

Die wichtigsten Erkenntnisse stehen in `docs/lessons-learned.md`.
