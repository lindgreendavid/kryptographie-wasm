# KI-Nutzung

Dieses Projekt wurde mit Unterstützung von Codex erstellt.

Die KI wurde eingesetzt für:

- Strukturierung der Anforderungen
- Erstellung des Rust/WASM-Grundgerüsts
- Formulierung kompakter Dokumentation
- Umsetzung der HTML-, CSS- und JavaScript-Dateien
- Erstellung von Tests und CI
- Rekonstruktion einer feingranularen Git-Historie aus sechs Ordnerständen
- statische Qualitätsprüfung und Korrektur widersprüchlicher Dokumentationsangaben
- Ausarbeitung des strukturierten Fehlermodells, der Browserprüfungen und des Bedrohungsmodells

Die fachliche Verantwortung, Prüfung und Freigabe bleiben beim Projektbearbeiter. Besonders sicherheitsrelevante Punkte wie AES und ChaCha20-Poly1305 wurden nicht selbst implementiert, sondern über etablierte RustCrypto-Bibliotheken eingebunden.

Die rekonstruierte Git-Historie wird in `docs/versionshistorie.md` ausdrücklich als Rekonstruktion gekennzeichnet. Es wurden keine historischen Datumsangaben oder ursprünglichen Commits erfunden.

Offizielle NIST-, IETF- und Werkzeugdokumentationen dienten als überprüfbare Grundlage für Testvektoren und CI-Konfiguration. Generierte Änderungen wurden durch statische Prüfungen, Tests und GitHub Actions validiert; die Verantwortung für Verständnis und Abgabe verbleibt bei den Bearbeitern.
