# Spec 003 - Skytale

## Ziel

Benutzer können das Transpositionsverfahren Skytale praktisch ausprobieren.

## Benutzeranforderungen

Text und Spaltenzahl eingeben, verschlüsseln, entschlüsseln und Zeichenanordnung ansehen.

## Funktionale Anforderungen

- Spaltenzahl 2 bis 30
- Verschlüsselung durch spaltenweises Auslesen
- Entschlüsselung mit derselben Spaltenzahl
- HTML-Tabelle zur Anordnung

## Technische Anforderungen

Rust-Modul `skytale.rs`; Tabelle wird als JSON aus WASM an JavaScript geliefert.

## Fehlerfälle

Ungültige Spaltenzahl erzeugt deutsche Fehlermeldung.

## Tests

Mehrere Spaltenwerte, Roundtrip und ungültige Werte.

## Akzeptanzkriterien

Unvollständige letzte Zeilen werden korrekt behandelt.

## Definition of Done

Verfahren, Tabelle, Tests und Dokumentation sind vorhanden.

