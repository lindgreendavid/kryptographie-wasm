# ADR 005: Strukturierte Fehler und kryptographische Werttypen

## Status

Angenommen

## Kontext

Freie Fehlertexte und rohe Byte-Vektoren erlauben, dass fachlich unterschiedliche Fehler nur über Zeichenketten unterschieden werden und falsche Längen tief in Bibliotheksaufrufen auffallen.

## Entscheidung

Die Rust-Domäne verwendet `CryptoError` als gemeinsame Fehleraufzählung. AEAD-Schlüssel, Nonces und Tags werden nach dem Dekodieren in `Key32`, `Nonce12` und `AuthTag16` überführt. Erst danach ruft die Domäne RustCrypto auf. An der WASM-Grenze werden Fehler kontrolliert in deutsche Meldungen übersetzt.

## Folgen

- Tests können konkrete Fehlerzustände statt Textfragmente prüfen.
- Längenbedingungen sind zentral und typnah dokumentiert.
- AES-GCM und ChaCha20-Poly1305 teilen sichere Infrastruktur, bleiben aber fachlich getrennte Module.
- Die JavaScript-Seite erhält ein typisiertes Ergebnisobjekt statt eines JSON-Strings.
