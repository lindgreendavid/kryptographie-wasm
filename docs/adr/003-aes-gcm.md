# ADR 003 - AES-GCM über RustCrypto

## Status

Akzeptiert

## Kontext

AES darf nicht selbst implementiert werden. Das Verfahren soll modern und geprüft sein.

## Entscheidung

Das Projekt verwendet `aes-gcm` aus dem RustCrypto-Ökosystem.

## Konsequenzen

Verschlüsselung und Authentifizierung werden über eine etablierte Bibliothek umgesetzt. Schlüssel, Nonce und Tag müssen korrekt behandelt werden.
