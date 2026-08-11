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
| Paketverwaltung | Cargo, npm mit Lockdateien |
| Tests | cargo test, NIST-/RFC-Vektoren, Playwright, axe-core, Python-Strukturprüfung |
| Formatierung | rustfmt |
| Linting | clippy |
| CI | GitHub Actions |
| Sicherheitsprüfung | RustSec, Dependabot, SHA-gepinnte Actions |
| Bereitstellung | GitHub Pages |
| Versionsverwaltung | Git |

Es werden keine Frontend-Frameworks, keine Datenbank und kein Backend verwendet.

Die Rust-Version und das WASM-Target sind in `rust-toolchain.toml` festgelegt. Abhängigkeiten werden über `Cargo.lock` reproduzierbar aufgelöst. Das Release-Profil ist auf eine kleine WebAssembly-Ausgabe mit Link-Time-Optimierung ausgerichtet.

Die ausführliche [Rust-Entscheidung](rust-entscheidung.md) dokumentiert Anforderungen, messbare Projektkennzahlen, eine gewichtete Alternativenbewertung und die Grenzen der Sprachwahl.
