# ADR 004 - ChaCha20-Poly1305 über RustCrypto

## Status

Akzeptiert

## Kontext

Das Projekt soll um ChaCha20-Poly1305 erweitert werden. Wie bei AES soll kein modernes kryptografisches Verfahren selbst implementiert werden.

## Entscheidung

Das Projekt verwendet `chacha20poly1305` aus dem RustCrypto-Ökosystem.

## Konsequenzen

ChaCha20-Poly1305 wird als modernes authentifiziertes Verfahren neben AES-GCM demonstriert. Schlüssel, Nonce und Authentifizierungstag müssen korrekt behandelt werden.
