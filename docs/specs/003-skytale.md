# Spec 003 - Skytale

## Ziel

Benutzer können das Transpositionsverfahren Skytale praktisch ausprobieren.

**IDs:** F-020, F-021, F-060 · **Priorität:** Muss/Soll · **Status:** umgesetzt

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

Mehrere Spaltenwerte, kurze und leere Texte, Unicode/Emoji, Restzeilen, Roundtrip und ungültige
Werte; zusätzlich Browservalidierung und Mobile-Layout.

## Akzeptanzkriterien

Unvollständige letzte Zeilen werden korrekt behandelt.

## Definition of Done

Verfahren, Tabelle, Tests und Dokumentation sind vorhanden.
