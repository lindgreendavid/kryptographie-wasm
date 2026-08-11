# Spec 002 - Caesar

## Ziel

Benutzer können Texte mit einer Caesar-Verschiebung verschlüsseln und entschlüsseln.

## Benutzeranforderungen

Text eingeben, Schlüssel 1 bis 25 wählen, Ergebnis erhalten.

## Funktionale Anforderungen

- Verschlüsseln und Entschlüsseln
- Alphabetdarstellung für den gewählten Schlüssel
- Nichtalphabetische Zeichen bleiben erhalten

## Technische Anforderungen

Rust-Modul `caesar.rs`, WASM-Exports in `lib.rs`, JavaScript nur für DOM-Verbindung.

## Fehlerfälle

Schlüssel außerhalb 1 bis 25 wird abgelehnt.

## Tests

`ABC` mit Schlüssel 3 ergibt `DEF`; Roundtrip wird geprüft.

## Akzeptanzkriterien

Hin- und Rückverschlüsselung funktioniert ohne Seitenreload.

## Definition of Done

Rust-Code, Tests, HTML-Seite und JS-Brücke sind vorhanden.

