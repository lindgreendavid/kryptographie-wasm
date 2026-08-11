# Kryptographie mit Rust und WebAssembly

Dieses Hochschulprojekt entwickelt eine deutschsprachige Lernanwendung für Kryptographie. Die Verfahren werden bewusst schrittweise implementiert, getestet und dokumentiert.

## Aktueller Stand

- Rust-Projekt und WebAssembly-Schnittstelle angelegt
- Statische Weboberfläche vorbereitet
- Lokaler Build- und Startprozess eingerichtet
- Caesar-Verschlüsselung mit Validierung, Roundtrip-Tests und interaktiver Alphabetdarstellung
- Skytale als Transpositionsverfahren mit dynamischer Tabellenansicht
- Monoalphabetische Substitution mit Alphabetvalidierung und Zufallsgenerator
- AES-256-GCM mit zufälligem Schlüssel, Nonce und Authentifizierungstag
- Umschaltbare Hell- und Dunkelansicht mit lokaler Speicherung
- Aktive Navigation, sichtbare Tastaturfoki und verbesserte Statusmeldungen

Weitere Kryptographieverfahren folgen in getrennten, nachvollziehbaren Commits.

## Voraussetzungen

- Rust (stable)
- `wasm-pack`
- Python 3 für den lokalen Webserver

## Build und Start unter Windows

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
```

Anschließend ist die Anwendung unter `http://127.0.0.1:8080/index.html` erreichbar.
