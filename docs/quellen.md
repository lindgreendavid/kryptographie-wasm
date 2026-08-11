# Quellen

## Standards und Spezifikationen

- National Institute of Standards and Technology: [FIPS 197 – Advanced Encryption Standard](https://csrc.nist.gov/pubs/fips/197/final), aktualisierte Ausgabe 2023.
- National Institute of Standards and Technology: [SP 800-38D – Galois/Counter Mode](https://csrc.nist.gov/pubs/sp/800/38/d/final), 2007.
- IETF: [RFC 8439 – ChaCha20 and Poly1305 for IETF Protocols](https://www.rfc-editor.org/rfc/rfc8439.html), 2018.

## Eingesetzte Bibliotheken und Werkzeuge

- RustCrypto: [`aes-gcm`](https://docs.rs/aes-gcm/)
- RustCrypto: [`chacha20poly1305`](https://docs.rs/chacha20poly1305/)
- Rust and WebAssembly Working Group: [`wasm-bindgen`-Leitfaden](https://rustwasm.github.io/docs/wasm-bindgen/)
- Rust-Dokumentation: [`getrandom`](https://docs.rs/getrandom/)
- Rust-Projekt: [Ownership und Speichersicherheit ohne Garbage Collector](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
- Rust-Projekt: [Rust und WebAssembly](https://rust-lang.org/what/wasm/)
- W3C: [Web Cryptography Level 2 – Algorithmusübersicht](https://www.w3.org/TR/webcrypto/), Entwurf 2025.
- Google Security Blog: [Eliminating Memory Safety Vulnerabilities at the Source](https://security.googleblog.com/2024/09/eliminating-memory-safety-vulnerabilities-Android.html), 2024.
- Google Security Blog: [Rust in Android: move fast and fix things](https://security.googleblog.com/2025/11/rust-in-android-move-fast-fix-things.html), 2025.
- Microsoft: [Playwright – Accessibility testing](https://playwright.dev/docs/accessibility-testing)
- Deque Systems: [`axe-core`](https://github.com/dequelabs/axe-core)
- Rust Secure Code Working Group: [RustSec Advisory Database](https://rustsec.org/)
- GitHub: [Dependabot-Konfiguration](https://docs.github.com/de/code-security/dependabot/working-with-dependabot/dependabot-options-reference)

## Einordnung klassischer Verfahren

Die Beschreibungen von Caesar, Skytale und monoalphabetischer Substitution dienen der didaktischen Einordnung. Die Anwendung macht ausdrücklich kenntlich, dass diese Verfahren für heutige Sicherheitszwecke ungeeignet sind.
