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

## Einordnung klassischer Verfahren

Die Beschreibungen von Caesar, Skytale und monoalphabetischer Substitution dienen der didaktischen Einordnung. Die Anwendung macht ausdrücklich kenntlich, dass diese Verfahren für heutige Sicherheitszwecke ungeeignet sind.

