# Zeitnachweis – retrospektiv rekonstruierte Schätzung

## Einordnung

Die Kursvorgabe sieht ungefähr 40 Stunden je Studierendem und damit 80 Teamstunden vor. Während
der Bearbeitung wurde kein durchgängiges minutengenaues Zeiterfassungssystem geführt. Die folgenden
Ist-Zeiten sind deshalb eine **retrospektive Schätzung in Viertelstunden**, die aus den vom Team
beschriebenen Aufgaben und Verantwortlichkeiten rekonstruiert wurde. Sie ist kein nachträglich
behauptetes Live-Protokoll und muss vor der Abgabe von Viktor Edelmann und David Lindgreen gemeinsam
bestätigt oder korrigiert werden.

Da die Präsentation laut Terminplan erst am 27.08.2026 stattfindet, sind die dafür angesetzten Zeiten
bis zur tatsächlichen Durchführung vorläufige Schätzwerte. Sie dürfen erst danach als endgültige
Ist-Zeiten bestätigt werden.

Nach der beschriebenen tatsächlichen Aufgabenverteilung übernahm Viktor den deutlich größeren
Entwicklungsanteil und arbeitete entsprechend mehr als die vorgesehenen 40 Stunden. David
konzentrierte sich auf die Einrichtung und Pflege des GitHub-Repositories, das Hochladen der von
Viktor erstellten Projektversionen sowie die Vorbereitung und Durchführung des Vortrags. David wird
nicht als Ersteller der Präsentationsfolien ausgewiesen; sein Beitrag war das Einarbeiten in die
Inhalte, das Proben und das Halten der Präsentation.

## Zusammenfassung nach Arbeitspaketen

| Arbeitspaket                                | Plan Team [h] | David Ist [h] | Viktor Ist [h] | Team Ist [h] | Erläuterung der tatsächlichen Verteilung                                                                                                                        |
| ------------------------------------------- | ------------: | ------------: | -------------: | -----------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anforderungen, Recherche und Planung        |         10,00 |          1,25 |          13,25 |        14,50 | Viktor recherchierte Verfahren, Funktionsweisen, Fachbegriffe und historischen Kontext; David unterstützte die organisatorische Abstimmung.                     |
| Frontend, UI und UX                         |         16,00 |          0,25 |          17,25 |        17,50 | Viktor verantwortete Aufbau, Bedienkonzept, Gestaltung, Benutzerführung und Überarbeitung der Oberfläche; David prüfte einen veröffentlichten Zwischenstand.    |
| Rust-/WASM-Fachlogik                        |         24,00 |          0,00 |          21,75 |        21,75 | Viktor setzte die historischen und modernen Verfahren, Validierung, Werttypen und WASM-Schnittstellen um.                                                       |
| Integration, Fehlerbehandlung und Versionen |         10,00 |          0,25 |           9,50 |         9,75 | Viktor verband Frontend und WASM, bearbeitete Fehlerzustände und erstellte die verschiedenen Entwicklungsstände; David prüfte die hochzuladende Struktur.       |
| Tests, Tooling, GitHub und Bereitstellung   |         12,00 |         16,00 |           5,75 |        21,75 | Viktor prüfte und korrigierte die Implementierung; David richtete GitHub ein, lud wiederholt Versionen hoch und pflegte Repository, Actions und Bereitstellung. |
| Dokumentation und Präsentation              |          8,00 |          5,50 |           5,25 |        10,75 | Viktor lieferte fachliche Inhalte und Erklärungen; David arbeitet sich in die Präsentation ein, probt sie und übernimmt den Vortrag.                            |
| **Gesamt**                                  |     **80,00** |     **23,25** |      **72,75** |    **96,00** | Der rekonstruierte Aufwand liegt 16 Stunden über dem Plan und bildet die ungleiche Aufgabenverteilung transparent ab.                                           |

Damit entfallen nach dieser Rekonstruktion rund **75,8 %** der Teamzeit auf Viktor und rund
**24,2 %** auf David. Mit **96,00 Teamstunden** liegt der geschätzte Ist-Aufwand um 16,00 Stunden
über dem Plan. Viktor überschreitet den persönlichen Richtwert von 40 Stunden aufgrund seines
überwiegenden Entwicklungsanteils deutlich. David bleibt trotz der zusätzlichen Aufwände für GitHub,
Versionierung und Vortrag unter diesem Richtwert.

## Detaillierter Tätigkeitsnachweis – Viktor Edelmann

|               Nr. | Tätigkeit                                                        |  Zeit [h] | Ergebnis / Beitrag                                                                                          |
| ----------------: | ---------------------------------------------------------------- | --------: | ----------------------------------------------------------------------------------------------------------- |
|                 1 | Themenabgrenzung, Anforderungen und grundlegende Projektplanung  |      2,75 | Umfang mit fünf Verfahren, Browseranwendung und Rust-/WASM-Schwerpunkt ausgearbeitet                        |
|                 2 | Recherche zu Caesar, Skytale und monoalphabetischer Substitution |      4,25 | Funktionsweisen, Grenzen und historischer Hintergrund der antiken Verfahren verstanden und aufbereitet      |
|                 3 | Recherche zu AES-GCM und ChaCha20-Poly1305                       |      4,50 | moderner Hintergrund, Schlüssel, Nonce, Tag, Authentifizierung und Sicherheitsgrenzen erarbeitet            |
|                 4 | Recherche und Aufbereitung kryptografischer Fachbegriffe         |      1,75 | Begriffe wie Klartext, Geheimtext, Schlüssel, Transposition, Substitution und AEAD verständlich beschrieben |
|                 5 | UI-/UX-Konzeption und visuelle Gestaltung                        |      4,75 | Bedienabläufe, Navigation, Seitenstruktur, Darstellung und Nutzerführung festgelegt                         |
|                 6 | Umsetzung der HTML-, CSS- und JavaScript-Oberfläche              |      8,25 | Startseite und fünf Verfahrensseiten mit Eingaben, Ausgaben und Erklärbereichen erstellt                    |
|                 7 | Responsive Design, Ansichten und Barrierefreiheit                |      4,25 | mobile Darstellung, Hell-/Dunkel-/Cyber-Ansichten, Fokusführung und zugängliche Bedienelemente umgesetzt    |
|                 8 | Implementierung der historischen Verfahren in Rust               |      7,75 | Caesar, Skytale und Substitution einschließlich Validierung und Unicode-Verhalten umgesetzt                 |
|                 9 | Einbindung der modernen Kryptografie mit RustCrypto              |      7,00 | AES-256-GCM und ChaCha20-Poly1305 mit Schlüssel-, Nonce- und Tagbehandlung integriert                       |
|                10 | WASM-Schnittstelle, Werttypen und Fehlerdomäne                   |      7,00 | Rust-Fachlogik über dokumentierte Exports angebunden und verständliche Fehlerbehandlung erstellt            |
|                11 | Frontend-/WASM-Integration und Ladezustände                      |      4,75 | reale Browseraufrufe, Ergebnisübernahme, Initialisierung und deaktivierte Controls umgesetzt                |
|                12 | Fehlersuche, Überarbeitung und Erstellung der Projektversionen   |      4,75 | verschiedene Entwicklungsstände erstellt, getestet und für die Übergabe an GitHub vorbereitet               |
|                13 | Tests, Qualitätskontrolle und technische Korrekturen             |      5,75 | Roundtrips, Negativfälle, Manipulation, Browserabläufe und Qualitätsprobleme geprüft bzw. korrigiert        |
|                14 | Fachliche Dokumentation und Erklärtexte                          |      5,25 | Funktionsweise, Historie, moderne Hintergründe, Fachbegriffe sowie UI-/UX-Entscheidungen dokumentiert       |
| **Gesamt Viktor** |                                                                  | **72,75** | überwiegende Konzeption, Recherche, Implementierung, Gestaltung und fachliche Dokumentation                 |

## Detaillierter Tätigkeitsnachweis – David Lindgreen

|              Nr. | Tätigkeit                                                              |  Zeit [h] | Ergebnis / Beitrag                                                                                       |
| ---------------: | ---------------------------------------------------------------------- | --------: | -------------------------------------------------------------------------------------------------------- |
|                1 | organisatorische Abstimmung und Repository-Vorbereitung                |      1,25 | Rahmen für die gemeinsame Ablage, Versionsübergabe und Veröffentlichung abgestimmt                       |
|                2 | technische Prüfung eines zu veröffentlichenden Zwischenstands          |      0,50 | Oberfläche und Projektstruktur vor einem Versionsupload punktuell kontrolliert                           |
|                3 | Einrichtung des GitHub-Repositories                                    |      4,75 | Repository, grundlegende Struktur, Zugriffe und notwendige Einstellungen eingerichtet                    |
|                4 | wiederholtes Hochladen und Pflegen der von Viktor erstellten Versionen |      7,00 | Entwicklungsstände übernommen, eingeordnet, hochgeladen und im Repository aktualisiert                   |
|                5 | GitHub Pages, Actions und finaler Repository-Abgleich                  |      4,25 | Bereitstellung, Workflow-Zustände, Links und Übereinstimmung mit den lokalen Versionen geprüft           |
|                6 | Einarbeitung in die Präsentationsinhalte                               |      2,50 | Funktionsweise, Architektur, Demoablauf und zentrale Qualitätsnachweise für den Vortrag vorbereitet      |
|                7 | Präsentationsproben und vorgesehene Durchführung des Vortrags          |      3,00 | Ablauf und Live-Demo proben und Vortrag am 27.08.2026 halten; bis dahin vorläufiger Schätzwert           |
| **Gesamt David** |                                                                        | **23,25** | GitHub-Setup, wiederholte Versionsuploads, Bereitstellung sowie Vorbereitung und Halten der Präsentation |

## Bestätigung vor der Abgabe

Die vorstehenden Viertelstundenwerte sind eine plausible Rekonstruktion aus den beschriebenen
Aufgaben. Vor der Verwendung als offizieller Ist-Nachweis sollten beide Teammitglieder insbesondere
prüfen, ob einzelne Tätigkeiten fehlten, parallel ausgeführt wurden oder zeitlich anders zu bewerten
sind.

| Bestätigung                                                                 | Datum | Unterschrift / Freigabe |
| --------------------------------------------------------------------------- | ----- | ----------------------- |
| Viktor Edelmann bestätigt bzw. korrigiert die eigene Tätigkeitsaufstellung. |       |                         |
| David Lindgreen bestätigt bzw. korrigiert die eigene Tätigkeitsaufstellung. |       |                         |

Erst nach dieser Bestätigung sollten die Werte unverändert in den finalen DOCX-/PDF-Bericht
übernommen werden.
