# Tech-Stack

| Bereich | Technologie |
| --- | --- |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Systemnahe Logik | Rust 1.97.1, Edition 2021 |
| Browserintegration | WebAssembly |
| Bridge | wasm-bindgen |
| Kryptografie | aes-gcm, chacha20poly1305 / RustCrypto |
| Zufall | getrandom |
| Kodierung | base64 |
| Paketverwaltung | Cargo |
| Tests | cargo test, Python-Strukturprüfung, Node.js-Syntaxprüfung |
| Formatierung | rustfmt |
| Linting | clippy |
| CI | GitHub Actions |
| Bereitstellung | GitHub Pages |
| Versionsverwaltung | Git |

Es werden keine Frontend-Frameworks, keine Datenbank und kein Backend verwendet.

Die Rust-Version und das WASM-Target sind in `rust-toolchain.toml` festgelegt. Abhängigkeiten werden über `Cargo.lock` reproduzierbar aufgelöst. Das Release-Profil ist auf eine kleine WebAssembly-Ausgabe mit Link-Time-Optimierung ausgerichtet.
