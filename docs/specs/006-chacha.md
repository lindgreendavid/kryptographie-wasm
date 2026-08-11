# Spec 006 - ChaCha20-Poly1305

## Ziel

ChaCha20-Poly1305 ergänzt AES-GCM als zweites modernes authentifiziertes Verfahren.

## Benutzeranforderungen

Schlüssel erzeugen, Klartext verschlüsseln, Geheimtext mit Nonce und Tag entschlüsseln.

## Funktionale Anforderungen

- 32-Byte-Schlüssel als Base64
- Kryptografisch zufälliger Schlüssel
- Kryptografisch zufällige 12-Byte-Nonce
- Ausgabe von Geheimtext, Nonce und Authentifizierungstag
- Manipulierte Daten werden abgelehnt

## Technische Anforderungen

ChaCha20-Poly1305 wird über `chacha20poly1305` aus RustCrypto verwendet. Keine eigene Implementierung.

## Fehlerfälle

Ungültiger Schlüssel, falsche Nonce, falscher Tag und manipulierte Daten ergeben deutsche Fehlermeldungen.

## Tests

Roundtrip, falscher Schlüssel, manipulierte Daten und fehlerhafte Nonce.

## Akzeptanzkriterien

Bei Authentifizierungsfehlern wird kein Klartext ausgegeben.

## Definition of Done

RustCrypto-Integration, UI, Tests und Dokumentation sind vorhanden.

