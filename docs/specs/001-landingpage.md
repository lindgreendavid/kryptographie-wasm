# Spec 001 - Landingpage

## Ziel

Die Startseite zeigt das Thema Kryptographie und führt zu den fünf Verfahren.

**IDs:** F-001, F-002, Q-006, Q-007 · **Priorität:** Muss/Soll · **Status:** umgesetzt

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

Playwright prüft Navigation, aktiven Link, Sprunglink, Theme-Persistenz, 390-Pixel-Layout,
Console-Fehler und axe WCAG A/AA in allen drei Ansichten.

## Akzeptanzkriterien

Alle fünf Boxen sind anklickbar und führen auf die passende Seite.

## Definition of Done

HTML, CSS, Navigation und Serverhinweis sind vorhanden.
