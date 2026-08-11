# Teststrategie

## Rust-Tests

Die zentrale Fachlogik wird mit `cargo test` geprüft:

- Caesar: Beispiel, Entschlüsselung, Roundtrip, ungültiger Schlüssel
- Skytale: Verschlüsselung, Roundtrip, ungültige Spaltenzahl
- Substitution: gültige und ungültige Alphabete, Verschlüsselung, Entschlüsselung, Roundtrip
- AES-GCM: Verschlüsselung, Entschlüsselung, falscher Schlüssel, manipulierte Daten, ungültige Nonce
- ChaCha20-Poly1305: Verschlüsselung, Entschlüsselung, falscher Schlüssel, manipulierte Daten, ungültige Nonce

## Qualitätsprüfungen

```powershell
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
wasm-pack build --target web --out-dir web/pkg
python3 scripts/verify_web.py
```

Die Webprüfung kontrolliert interne Verweise, doppelte IDs, Sprache, Seitentitel und genau eine Hauptüberschrift pro HTML-Datei.

## Manuelle Webprüfung

Nach dem Build wird `web/` über einen lokalen HTTP-Server geöffnet. Geprüft werden Navigation, je ein Hin- und Rückweg pro Verfahren und die grobe mobile Darstellung.
