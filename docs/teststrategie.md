# Teststrategie

## Ziel

Die Prüfungen decken drei Ebenen ab: fachliche Korrektheit der Rust-Logik, Integrität des Browser-Builds und strukturelle Qualität der statischen Oberfläche.

## Automatisierte Testmatrix

| Bereich | Positivfall | Negativ- und Grenzfälle |
| --- | --- | --- |
| Caesar | bekanntes Beispiel und Roundtrip | Schlüssel 0 und 26 |
| Skytale | bekanntes Beispiel und Roundtrips mit Restzeilen | Spaltenzahl außerhalb 2–30 |
| Substitution | gültiges Beispiel- und Zufallsalphabet, Roundtrip | falsche Länge und doppelte Buchstaben |
| AES-256-GCM | UTF-8-Roundtrip, Schlüssel-/Nonce-/Taggrößen | falscher Schlüssel, ungültige Nonce, veränderter Geheimtext, Nonce und Tag |
| ChaCha20-Poly1305 | UTF-8-Roundtrip, Schlüssel-/Nonce-/Taggrößen | falscher Schlüssel, ungültige Nonce, veränderter Geheimtext, Nonce und Tag |
| HTML | sechs Seiten, Sprache, Titel, H1, `main`, eindeutige IDs und gültige lokale Verweise | fehlende Ziele, doppelte IDs und veraltete Verfahrenszahl |
| Formulare | ID und zugeordnetes Label für jedes Ein-/Ausgabefeld | Label ohne Ziel oder Ziel ohne Label |
| JavaScript | Syntaxprüfung aller Module mit Node.js | Syntaxfehler beendet den Prüfpfad |

Die Manipulationstests ändern ein Byte und kodieren anschließend wieder gültiges Base64. Damit wird tatsächlich die AEAD-Authentifizierung geprüft und nicht lediglich ein Fehler des Base64-Decoders ausgelöst.

## Vollständiger Prüfpfad

```bash
./scripts/test.sh
```

Der Skriptpfad entspricht den wesentlichen Schritten in GitHub Actions:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --locked
wasm-pack build --target web --out-dir web/pkg
python3 scripts/verify_web.py
find web/js -name '*.js' -type f -print0 | xargs -0 -n1 node --check
```

Unter Windows stellt `scripts/test.ps1` denselben Prüfpfad bereit.

## Manuelle Abnahme

Nach dem Build wird `web/` über `scripts/start.sh` oder `scripts/start.ps1` geöffnet. Manuell geprüft werden:

1. Navigation mit Maus und Tastatur;
2. Sprunglink und sichtbarer Fokus;
3. je ein Hin- und Rückweg pro Verfahren;
4. Fehlermeldung nach Veränderung eines AEAD-Tags;
5. Hell-, Dunkel- und Cyber-Ansicht;
6. grobe Darstellung bei Desktop- und Mobilbreite.

## Grenzen

Die Tests beweisen die korrekte Einbindung im definierten Projektumfang, nicht die generelle Sicherheit eines produktiven Kryptosystems. Nicht automatisiert sind vollständige Screenreader-, Cross-Browser- und visuelle Regressionstests.
