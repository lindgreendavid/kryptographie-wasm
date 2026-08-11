# Version 1.2.0 – Architektur und Qualität

Diese Version vertieft die Abgabequalität, ohne den didaktischen Funktionsumfang unnötig zu vergrößern.

## Wichtigste Änderungen

- strukturiertes Rust-Fehlermodell statt frei verteilter Zeichenketten;
- `Key32`, `Nonce12` und `AuthTag16` als validierte AEAD-Werttypen;
- gemeinsame AEAD-Infrastruktur bei weiterhin getrennten AES- und ChaCha-Modulen;
- offizielle Known-Answer-Tests für AES-256-GCM und ChaCha20-Poly1305;
- typisiertes WASM-Ergebnisobjekt statt JSON-Zwischenschritt;
- Browser-Rundläufe, Manipulationstest und automatisierte WCAG-A/AA-Prüfung;
- RustSec, Dependabot und auf vollständige Commit-SHAs festgelegte Actions;
- Bedrohungsmodell, neue Architekturentscheidungen und aktualisierte Projektdokumentation;
- annotierte Git-Tags und ein veröffentlichtes GitHub-Release.
- ausführliche quantitative Begründung der Rust-/WebAssembly-Architektur.

Die Anwendung bleibt eine Lernanwendung und ist nicht für die Verarbeitung realer Geheimnisse vorgesehen.
