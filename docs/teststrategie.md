# Teststrategie

## Ziel

Die Prüfungen decken vier Ebenen ab: fachliche Korrektheit der Rust-Logik, Übereinstimmung mit offiziellen Testvektoren, Integrität des Browser-Builds und Qualität der realen Browseroberfläche.

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
| Known-Answer | AES-256-GCM nach NIST und ChaCha20-Poly1305 nach RFC 8439 | Abweichende Bytes oder Tags beenden den Test |
| Browser | Caesar-Rundlauf und AES-GCM-Manipulation über WASM und DOM | bei ungültigem Tag bleibt die Klartextausgabe leer |
| Barrierefreiheit | axe-core auf allen sechs Seiten | automatisierbare WCAG-A/AA-Verstöße |

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
npm ci
npx playwright install chromium
npm run test:e2e
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

Die Tests beweisen die korrekte Einbindung im definierten Projektumfang, nicht die generelle Sicherheit eines produktiven Kryptosystems. Axe kann nur einen Teil der WCAG-Regeln automatisieren. Nicht automatisiert sind vollständige Screenreader-, Cross-Browser- und visuelle Regressionstests.
