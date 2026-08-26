# Technologie-Stack

| Bereich            | Technologie / Version                          | Zweck                                                |
| ------------------ | ---------------------------------------------- | ---------------------------------------------------- |
| Frontend           | HTML5, CSS3, Vanilla JavaScript ES-Module      | zugängliche, frameworkfreie Mehrseiten-UI            |
| Typprüfung         | TypeScript 7 strict checkJs + JSDoc            | Typprüfung des vorhandenen JavaScript ohne Migration |
| Systemnahe Logik   | Rust 1.97.1, Edition 2021                      | Fachlogik, Validierung und Fehlerdomäne              |
| WASM               | wasm-bindgen, wasm-pack 0.14.0                 | Browser-Bindings und Release-Build                   |
| Kryptographie      | aes-gcm 0.10, chacha20poly1305 0.10            | etablierte AEAD-Primitive                            |
| Zufall / Kodierung | getrandom 0.2 / base64 0.22                    | Browserentropie und Textdarstellung binärer Werte    |
| Paketmanagement    | Cargo + Cargo.lock, npm + package-lock.json    | reproduzierbare Abhängigkeiten                       |
| Rust-Qualität      | rustfmt, Clippy, Rustdoc, cargo-llvm-cov 0.9.0 | Stil, Lint, API-Doku, Coverage                       |
| Web-Qualität       | Prettier 3.9.6, ESLint 10.9.0                  | Format- und Regelprüfung einschließlich JSDoc        |
| Browsertests       | Playwright 1.62.1, axe-core 4.12.1             | reale WASM-Flows, Responsive, WCAG                   |
| Audit              | Lighthouse 13.4.1                              | Performance, Accessibility, Best Practices, SEO      |
| Automation         | GitHub Actions, Dependabot, RustSec            | Quality Gates, Lieferkette, Pages                    |
| Hosting            | GitHub Pages                                   | statische Auslieferung ohne Backend                  |

## Buildprofile und Artefakte

Das Rust-Releaseprofil verwendet `opt-level = "s"`, Link-Time-Optimization, eine Codegen-Unit und
`panic = "abort"`. wasm-pack führt zusätzlich wasm-opt aus. Das Release-WASM ist 87.993 Byte roh
und 35.663 Byte gzip-komprimiert; die erzeugten Bindings sind 26.535 bzw. 4.583 Byte.

## Bewusste Nichtentscheidungen

Kein Vite/Bundler: Sechs statische Seiten und kleine ES-Module benötigen kein Bundle. Kein
Frontend-Framework: Es existiert kein komplexer globaler Zustand. Kein Backend: Kryptographie läuft
lokal, und die Demo soll keine Texte oder Schlüssel übertragen. Diese Abgrenzung verringert
Fehlerfläche und Installationsaufwand.

Die ausführliche [Rust-Entscheidung](rust-entscheidung.md) und die ADRs dokumentieren Alternativen
und Konsequenzen.
