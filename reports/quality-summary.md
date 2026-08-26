# Quality Summary

Messstand: 23.08.2026, Version 1.2.0, lokaler Release-Build.

| Gate | Ergebnis |
| --- | --- |
| rustfmt | PASS |
| Clippy `-D warnings` | PASS |
| Rust-Tests | PASS – 27/27 |
| Rustdoc `missing_docs` | PASS |
| Rust Coverage | PASS – 95,99 % Regions, 97,62 % Functions, 98,82 % Lines |
| Prettier | PASS |
| ESLint mit JSDoc-Regeln | PASS |
| TypeScript strict checkJs | PASS |
| Web-Strukturprüfung | PASS – 6 Seiten |
| WASM-Release-Build | PASS |
| Playwright / axe | PASS – 18/18 |
| Lighthouse Desktop Startseite | PASS – P100 / A100 / BP100 / SEO100 |
| Lighthouse Desktop AES | PASS – P100 / A100 / BP100 / SEO100 |
| npm audit | PASS – 0 bekannte Schwachstellen |

Windows ARM meldet beim MSVC-Linker eine lokalisierte informative stdout-Zeile. Clippy selbst ist
warnungsfrei. Die Coverage-Messung nutzt wegen eines LLVM-Profilfehlers des ARM-Targets
automatisiert das x86_64-Rust-Ziel.
