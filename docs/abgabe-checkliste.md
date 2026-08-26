# Abgabe-Checkliste

**Team:** David Lindgreen (E039), Viktor Edelmann (E045) · **Stand:** 23.08.2026

## Working Code

- [x] fünf Verfahren ver- und entschlüsseln über Rust/WASM
- [x] Roundtrips für Unicode, Emoji, Whitespace, Mehrzeilen- und Langtext
- [x] NIST- und RFC-8439-Known-Answer-Tests
- [x] AEAD-Manipulation liefert keinen Klartext
- [x] Lade-, Validierungs- und Fehlerzustände sichtbar
- [x] responsive Oberfläche, Tastaturfokus und drei Ansichten
- [x] keine Browser-Console-Fehler
- [x] Release-WASM-Build reproduzierbar

## Quality Gates

- [x] rustfmt
- [x] Clippy mit `-D warnings`
- [x] 27/27 Rust-Tests
- [x] Rustdoc mit `missing_docs` als Fehler
- [x] Rust Coverage 98,82 % Lines, Gate ≥ 85 %
- [x] Prettier
- [x] ESLint einschließlich JSDoc
- [x] TypeScript strict checkJs
- [x] Webstruktur-/Label-/Linkprüfung
- [x] 18/18 Playwright-/axe-Tests
- [x] Lighthouse Desktop zweimal 100/100/100/100
- [x] npm audit: 0 bekannte Schwachstellen

## Dokumentation

- [x] README mit Installation, Build, Test, Architektur und Grenzen
- [x] Projekt-/Architekturdokumentation stimmt mit Code und Metriken überein
- [x] Anforderungs- und Nachweismatrix
- [x] sechs Specs mit IDs, Priorität, Status und Testbezug
- [x] ADRs, Bedrohungsmodell, Teststrategie und Quellen
- [x] transparente KI-Nutzung und Promptnachweis
- [x] Demo-Drehbuch und kritische Prüfungsfragen
- [x] DOCX-Bericht erzeugt, 11 Seiten in Word gerendert und visuell geprüft
- [x] PDF-Bericht erzeugt und seitenweise geprüft
- [x] DOCX-Barrierefreiheitsprüfung ohne hohe, mittlere oder niedrige Befunde
- [ ] tatsächliche Ist-Stunden von David und Viktor ergänzen
- [ ] Ist-Stunden anschließend in DOCX/PDF synchronisieren

## Abgabeartefakte

- [x] technischer DOCX-Bericht erzeugt; nach ergänzten Ist-Stunden erneut erzeugen
- [x] technischer PDF-Bericht erzeugt; nach ergänzten Ist-Stunden erneut erzeugen
- [x] 9 Folien als PPTX und PDF mit PowerPoint geöffnet, gerendert und final geprüft
- [x] Working-Code-ZIP ohne `node_modules/`, `target/` und generierte Reports erstellt
- [x] SHA-256-Prüfsumme zum Working-Code-ZIP erstellt
- [ ] endgültigen Commit/Tag/Deployment-Stand in Bericht eintragen
- [ ] alle drei Artefakte vor dem 26.08.2026, 14:30 Uhr hochladen

## Präsentation am 27.08.2026

- [x] Sieben-Minuten-Drehbuch mit Zwei-Minuten-Live-Demo
- [x] Offline-Fallback und erwartete Prüfungsfragen vorbereitet
- [ ] Technik-Check mit tatsächlichem Präsentationsgerät
- [ ] mindestens zwei gestoppte Probeläufe ≤ 7:00 Minuten

## Final Freeze

- [x] `npm ci` aus dem Lockfile, 0 bekannte Schwachstellen
- [x] `npx playwright install chromium`
- [x] `npm run test:all`
- [x] ZIP testweise entpackt, `npm ci`, WASM-Build, Webprüfung und Server-Smoke-Test bestanden
- [x] ZIP-Inhalt auf Abhängigkeiten und generierte Build-/Reportordner geprüft
- [x] Projekt und ZIP-Quellen auf typische Secret-Muster und `.env`-Dateien geprüft

Technisch ist der Stand geprüft. Nicht automatisch erfüllbar sind persönliche Ist-Stunden, der
finale Git-/Upload-Schritt und die reale Präsentationsprobe; diese Punkte bleiben deshalb ehrlich
offen.
