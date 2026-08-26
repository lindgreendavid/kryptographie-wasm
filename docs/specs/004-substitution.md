# Spec 004 - Substitution

## Ziel

Benutzer können eine einfache monoalphabetische Substitution nutzen.

**IDs:** F-030, F-031, F-060 · **Priorität:** Muss/Soll · **Status:** umgesetzt

## Benutzeranforderungen

Geheimalphabet eingeben, Beispielalphabet einsetzen, optional zufälliges Alphabet erzeugen.

## Funktionale Anforderungen

- Genau 26 Buchstaben
- Nur A-Z
- Keine Dopplungen
- Verschlüsseln und Entschlüsseln
- Klassische Alphabet-Tabelle

## Technische Anforderungen

Validierung und Fachlogik liegen in Rust.

## Fehlerfälle

Zu kurze Alphabete, doppelte Buchstaben und fehlende Buchstaben werden gemeldet.

## Tests

Gültige, zufällige und ungültige Alphabete, Unicode/Emoji, Verschlüsselung, Entschlüsselung,
Roundtrip und verständliche Browserfehler.

## Akzeptanzkriterien

Ungültige Eingaben führen nicht zu fehlerhaften Ergebnissen.

## Definition of Done

Validierung, Verfahren, Tabelle, Buttons und Tests sind vorhanden.
