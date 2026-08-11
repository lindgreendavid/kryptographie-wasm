# Änderungsprotokoll

Alle wesentlichen Projektstände werden über fokussierte Commits und direkt verlinkte Versionsmeilensteine nachvollziehbar gemacht.

## 1.2.0 – Architektur und Qualität

- strukturiertes Fehlermodell und validierte AEAD-Werttypen
- gemeinsame AEAD-Infrastruktur ohne Vermischung der Verfahren
- offizielle Known-Answer-Tests nach NIST und RFC 8439
- typisiertes WASM-Ergebnis statt JSON-Zwischenschritt
- Playwright-End-to-End- und automatisierbare WCAG-A/AA-Tests
- RustSec, Dependabot und vollständig SHA-gepinnte GitHub Actions
- Bedrohungsmodell, neue ADRs und automatisierte Release-Tags

## 1.1.0 – Bewertungsreife Abgabe

- Rust 1.97.1 und Paketversion reproduzierbar festgelegt
- AEAD-Manipulationstests auf gültige, byteweise veränderte Daten präzisiert
- JavaScript-Syntax und Formularzuordnungen in die automatische Prüfung aufgenommen
- semantische Ausgabeelemente und Sprunglinks ergänzt
- Architektur-, Test- und Bewertungsdokumentation vertieft
- GitHub-Pages-Live-Demo erfolgreich veröffentlicht

## 1.0.1 – Abgabeangaben

- David Lindgreen (E039) und Viktor Edelmann (E045) als Bearbeiter ergänzt
- Provadis Hochschule, Frankfurt am Main, als Hochschule ergänzt
- Prof. Dr. Olaf Grebner als Prüfer ergänzt

## 1.0.0 – Abgabeversion

- vollständige deutsche Projekt-, Architektur- und Testdokumentation
- automatisierte Rust-, WebAssembly- und Webstruktur-Prüfungen
- reproduzierbarer GitHub-Pages-Build
- plattformübergreifende Build-, Test- und Startskripte
- korrigierte Zählung von fünf Kryptographieverfahren

## 0.9.0 – Härtung

- unverzerrte Zufallsauswahl für Substitutionsalphabete
- explizite Fehlerweitergabe bei fehlendem Zufall
- zusätzliche Nonce- und Manipulationstests
- robuste Theme-Speicherung bei blockiertem `localStorage`
- ergänzte Rust-Dokumentationskommentare

## 0.8.0 – ChaCha20-Poly1305

- zweites modernes authentifiziertes Verfahren
- eigene Rust-, WebAssembly-, JavaScript- und HTML-Komponenten

## 0.5.0 bis 0.7.0 – Oberflächenentwicklung

- Hell-/Dunkelansicht
- aktive Navigation und Tastaturfokus
- Cyber-Ansicht und einheitlicher Footer

## 0.1.0 bis 0.4.0 – Fachliche Entwicklung

- Caesar, Skytale und monoalphabetische Substitution einzeln eingeführt
- AES-256-GCM anschließend als erstes modernes Verfahren ergänzt

## 0.0.1 – Projektgrundlage

- Rust-/WebAssembly-Struktur, Weboberfläche und lokale Skripte
