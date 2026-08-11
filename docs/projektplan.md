# Projektplan

## Ausgangslage

Als Ausgangsmaterial lagen sechs Arbeitsstände `v1` bis `v6` ohne separates Bewertungsraster vor. Die Stände wurden zunächst inventarisiert und miteinander verglichen. Da bereits frühe Ordner mehrere Verfahren enthielten, wurde die fachliche Entwicklung für Git transparent und feingranular rekonstruiert.

## Ziele

- fünf Verfahren mit Ver- und Entschlüsselung
- Rust als alleinige Fachlogik und WebAssembly als Browser-Schnittstelle
- verständliche, deutschsprachige Oberfläche
- reproduzierbarer Build auf Windows, macOS und Linux
- automatisierte Qualitätsprüfung und öffentliche Live-Demo
- nachvollziehbare Dokumentation und Versionsgeschichte

## Arbeitspakete

| Phase | Ergebnis |
| --- | --- |
| 1. Analyse | Dateiinventar und Vergleich der sechs Stände |
| 2. Fachliche Trennung | ein Entwicklungsschritt je Verfahren |
| 3. Härtung | Validierung, Zufall, Fehlerbehandlung und Manipulationstests |
| 4. Oberfläche | Navigation, Ansichten, responsive und semantische Elemente |
| 5. Dokumentation | README, Spezifikationen, ADRs, Architektur und Quellen |
| 6. Automatisierung | lokale Skripte, CI und GitHub Pages |
| 7. Abnahme | vollständiger Qualitätslauf und öffentliche Funktionsprüfung |

## Risiken und Maßnahmen

| Risiko | Maßnahme |
| --- | --- |
| moderne Kryptographie fehlerhaft selbst implementiert | etablierte RustCrypto-Bibliotheken verwenden |
| unübersichtliche Versionssprünge | Verfahren und technische Änderungen einzeln committen |
| Unterschiede zwischen lokaler und veröffentlichter Version | identische Befehle in Skripten und GitHub Actions |
| Build-Artefakte blähen das Repository auf | `target/` und `web/pkg/` ignorieren und reproduzierbar erzeugen |
| Demonstration wird als produktionssicher missverstanden | Sicherheitsstatus und Projektgrenzen sichtbar dokumentieren |

## Abschlusskriterien

Der Stand gilt als abgabefähig, wenn CI und Pages erfolgreich sind, alle fünf Verfahren in der Live-Demo funktionieren, keine Geheimnisse oder Build-Artefakte versioniert sind und die Abgabe-Checkliste vollständig erfüllt ist.
