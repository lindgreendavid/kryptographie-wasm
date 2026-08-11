# Spec 001 - Landingpage

## Ziel

Die Startseite zeigt das Thema Kryptographie und führt zu den fünf Verfahren.

## Benutzeranforderungen

Benutzer sollen Caesar, Skytale, Substitution, AES-GCM und ChaCha20-Poly1305 direkt auswählen können.

## Funktionale Anforderungen

- Große Überschrift "Kryptographie"
- Drei historische Boxen nebeneinander auf Desktop
- Zwei Boxen für moderne Verfahren darunter
- Kurzer Grundbegriffstext
- Auswahl zwischen heller, dunkler und Cyber-Ansicht über Buttons

## Technische Anforderungen

HTML und CSS ohne Framework. Navigation über normale Links. Die Ansichtsauswahl wird über `theme.js` eingebunden.

## Fehlerfälle

Bei direktem `file://`-Aufruf zeigt die Startseite einen Hinweis zum lokalen Server.

## Tests

Navigation und responsive Umbruch manuell prüfen.

## Akzeptanzkriterien

Alle fünf Boxen sind anklickbar und führen auf die passende Seite.

## Definition of Done

HTML, CSS, Navigation und Serverhinweis sind vorhanden.
