# Warum Rust die Programmiersprache der Wahl ist

## 1. Kurzentscheidung

Rust ist für dieses Projekt nicht lediglich eine Vorgabe oder ein technisches Experiment. Die Sprache passt besonders gut zu einer Kryptographie-Lernanwendung, weil sie vier Anforderungen gleichzeitig erfüllt:

1. speicher- und typsichere Fachlogik;
2. direkte Kompilierung zu WebAssembly;
3. etablierte Implementierungen moderner Verfahren über RustCrypto;
4. reproduzierbare, streng prüfbare Builds mit Cargo, rustfmt und Clippy.

Die Entscheidung lautet deshalb: **Die gesamte Kryptographielogik wird in Rust implementiert.** HTML und CSS beschreiben die Oberfläche. Das unvermeidbare JavaScript lädt WebAssembly, liest DOM-Eingaben und zeigt Ergebnisse an; es implementiert **kein einziges Kryptographieverfahren**.

## 2. Was „Rust als Sprache der Wahl“ konkret bedeutet

| Verantwortung | Rust | JavaScript | HTML/CSS |
| --- | ---: | ---: | ---: |
| Caesar, Skytale und Substitution | 100 % | 0 % | 0 % |
| AES-256-GCM und ChaCha20-Poly1305 | 100 % | 0 % | 0 % |
| Schlüssel-, Nonce- und Tagvalidierung | 100 % | 0 % | 0 % |
| strukturiertes Fehlermodell | 100 % | 0 % | 0 % |
| DOM-Ereignisse und Ergebnisanzeige | 0 % | 100 % | Struktur und Gestaltung |

„Nur Rust“ wäre für eine normale Browseroberfläche technisch irreführend: Der Browser benötigt HTML, CSS und eine kleine JavaScript-Brücke. Entscheidend ist die Architekturgrenze. Sicherheits- und verfahrensrelevante Regeln liegen ausschließlich in Rust; JavaScript darf diese Regeln weder duplizieren noch umgehen.

## 3. Direkt am Projekt gemessene Kennzahlen

Stand der Messung ist Version 1.2.0. Die Werte werden mit `python3 scripts/measure_project.py` reproduziert. Für die Artefaktgrößen muss zuvor der Release-Build erzeugt worden sein.

| Kennzahl | Messwert | Bedeutung |
| --- | ---: | --- |
| Rust-Dateien unter `src/` | 10 | klar getrennte Domänen-, AEAD- und WASM-Module |
| Rust-Zeilen unter `src/` | 884 | Fachlogik und modulnahe Tests |
| Rust-Integrationstestzeilen | 211 | öffentliche API aus Sicht eines Verbrauchers geprüft |
| Rust-Zeilen insgesamt | 1.095 | rund doppelt so viel wie JavaScript einschließlich E2E-Tests |
| JavaScript-Zeilen unter `web/js/` | 443 | Browserintegration, Ansicht und DOM-Anbindung |
| JavaScript-E2E-Testzeilen | 47 | Playwright- und WCAG-Prüfungen |
| Rust-Tests | 15 | Beispiele, Roundtrips, Grenzen, Manipulation und Testvektoren |
| Browser- und WCAG-Tests | 8 | vollständiger Weg über WASM, JavaScript und DOM |
| exportierte WASM-Funktionen | 16 | kleine, kontrollierte Browser-API |
| `unsafe`-Blöcke im eigenen Rust-Code | **0** | zusätzlich durch `#![forbid(unsafe_code)]` erzwungen |
| in JavaScript implementierte Kryptoverfahren | **0 von 5** | eine einzige fachliche Quelle statt Doppelimplementierung |
| Backendprozesse | **0** | Verschlüsselung läuft vollständig lokal im Browser |
| Netzwerkanfragen je Kryptographieoperation | **0** | Klartext und Schlüssel werden nicht an einen Server gesendet |
| direkte Rust-Abhängigkeiten | 7 | bewusst kleiner, über `Cargo.lock` fixierter Umfang |

Das veröffentlichte Release-Artefakt wurde zusätzlich bytegenau gemessen:

| Browserartefakt | Rohgröße | deterministisch gzip-komprimiert |
| --- | ---: | ---: |
| `krypto_wasm_bg.wasm` | 87.957 Byte | 35.606 Byte |
| erzeugte JavaScript-Bindings | 26.339 Byte | 4.490 Byte |
| Summe | 114.296 Byte | 40.096 Byte |

Die komprimierte Rust-/WASM-Laufzeit einschließlich Bindings bleibt damit bei rund **39,2 KiB**. Diese Messung belegt die konkrete Größe dieses Projekts; sie ist kein pauschaler Geschwindigkeitsvergleich mit anderen Sprachen.

## 4. Quantitative Nutzwertanalyse

Um die Sprachwahl prüfbar zu machen, werden sechs projektspezifische Kriterien gewichtet. Jede Sprache erhält pro Kriterium 0 bis 5 Punkte. Der gewichtete Wert berechnet sich als:

\[
\text{Gesamtwert} = \sum \left(\frac{\text{Bewertung}}{5} \times \text{Gewicht}\right)
\]

| Kriterium | Gewicht | Rust | TypeScript | C++ | Python |
| --- | ---: | ---: | ---: | ---: | ---: |
| Speicher- und Typsicherheit | 25 % | 5 | 3 | 1 | 3 |
| Eignung für WebAssembly und statisches Hosting | 20 % | 5 | 2 | 4 | 2 |
| Abdeckung beider moderner Verfahren | 20 % | 5 | 3 | 4 | 4 |
| vorhersehbare Laufzeiteigenschaften | 15 % | 5 | 3 | 5 | 1 |
| Domänenmodellierung und Testbarkeit | 10 % | 5 | 4 | 3 | 3 |
| reproduzierbares Standardwerkzeug | 10 % | 5 | 4 | 3 | 3 |
| **Gewichteter Gesamtwert** | **100 %** | **100** | **60** | **64** | **54** |

In dieser projektbezogenen Analyse liegt Rust:

- **36 Prozentpunkte** vor C++, der zweitplatzierten Alternative;
- **40 Prozentpunkte** vor TypeScript;
- **46 Prozentpunkte** vor Python.

Relativ zum jeweiligen Ausgangswert entspricht das einem höheren Nutzwert von 56,3 % gegenüber C++, 66,7 % gegenüber TypeScript und 85,2 % gegenüber Python. Diese Prozentwerte sind Ergebnisse der offengelegten Entscheidungsmatrix und ausdrücklich **keine allgemeinen Laufzeitbenchmarks**.

## 5. Begründung der Bewertungen

### 5.1 Speicher- und Typsicherheit

Rust prüft Besitz, Lebensdauer und Ausleihen von Speicher zur Übersetzungszeit. Das Ownership-Modell liefert Speichersicherheitsgarantien ohne Garbage Collector. Im Projekt verstärken `Key32`, `Nonce12`, `AuthTag16` und `CryptoError` diese Spracheigenschaften: Nach erfolgreicher Konstruktion kann ein Schlüssel nicht versehentlich 31 Byte und ein Tag nicht 15 Byte enthalten.

TypeScript und Python verwalten Speicher sicherer als C++, prüfen aber einen Teil der Typbedingungen erst zur Laufzeit beziehungsweise verlieren Typinformationen an Browser- und Bibliotheksgrenzen. C++ bietet sehr hohe Kontrolle, legt die korrekte Speicherverwaltung aber stärker in die Verantwortung der Entwickelnden.

### 5.2 WebAssembly und statisches Hosting

Rust unterstützt `wasm32-unknown-unknown` direkt. `wasm-bindgen` bildet Strings, Fehler, Funktionen und Ergebnisobjekte kontrolliert zwischen Rust und JavaScript ab. Das Ziel `web` von `wasm-pack` ist ohne Frontend-Bundler direkt im Browser nutzbar. Dadurch genügen GitHub Pages und ein statischer HTTP-Server; ein Python-, Node- oder Java-Backend entfällt vollständig.

Die offizielle Rust-WebAssembly-Dokumentation nennt als Eigenschaften vorhersehbare Leistung ohne Garbage-Collector-Pausen, kleine Binärdateien ohne eingebetteten Garbage Collector und automatisch erzeugbare Bindings. C++ kann ebenfalls effizient nach WebAssembly kompiliert werden, benötigt aber eine weniger sichere eigene Domänenschicht. TypeScript läuft bereits direkt im Browser, erfüllt aber gerade nicht das Ziel einer typisierten WebAssembly-Fachlogik. Python benötigt für den Browser eine zusätzliche Laufzeit wie Pyodide und erhöht damit Architektur- und Ladeumfang.

### 5.3 Kryptographie-Ökosystem

RustCrypto stellt AES-GCM und ChaCha20-Poly1305 als getrennte, typisierte Bibliotheken bereit. Das Projekt implementiert keine moderne Chiffre selbst, sondern nur Validierung, Datenfluss und didaktische Darstellung. Beide Verfahren werden mit offiziellen NIST- beziehungsweise RFC-Vektoren geprüft.

Die standardisierte Web-Crypto-API führt AES-GCM, aber kein ChaCha20-Poly1305. Eine reine Browser-API-Lösung würde deshalb entweder den Verfahrensumfang reduzieren oder eine weitere JavaScript-Bibliothek und damit zwei unterschiedliche Kryptographieschnittstellen benötigen. RustCrypto hält beide modernen Verfahren hinter derselben kontrollierten Rust-Grenze.

### 5.4 Laufzeitverhalten

Kryptographie verarbeitet Bytes, Schlüssel und Puffer. Rust kompiliert diese Operationen vorab zu WebAssembly, ohne dass im Rust-Teil ein Garbage Collector oder Just-in-Time-Compiler benötigt wird. Das unterstützt vorhersehbares Verhalten und kleine Laufzeitartefakte.

Bewusst wird **nicht** behauptet, Rust sei in jeder Browseroperation um einen festen Faktor schneller als JavaScript oder C++. Ein belastbarer Geschwindigkeitsvergleich würde identische Implementierungen, Warm-up-Phasen, mehrere Browser und statistische Wiederholungen erfordern. Der belegte Vorteil dieses Projekts besteht in Sicherheit, einheitlicher Implementierung, reproduzierbarer Übersetzung und der gemessenen kleinen Artefaktgröße.

### 5.5 Wartbarkeit und Fehlerbehandlung

Rust erzwingt die Behandlung von `Result`-Werten. `CryptoError` trennt ungültige Schlüssel, Nonces, Tags, Base64-Daten, UTF-8 und Authentifizierungsfehler fachlich. Musterabgleiche werden vom Compiler auf Vollständigkeit geprüft. Änderungen an einem Fehlerzustand werden dadurch an allen betroffenen Stellen sichtbar.

Cargo bündelt Abhängigkeitsauflösung, Tests, Dokumentation und Builds. `Cargo.lock`, Rust 1.97.1, rustfmt, Clippy mit `-D warnings`, RustSec und Dependabot bilden einen durchgängigen, reproduzierbaren Prüfpfad.

## 6. Externe Sicherheitszahlen richtig eingeordnet

Die Sprachwahl lässt sich nicht allein aus diesem kleinen Projekt statistisch beweisen. Große reale Codebasen liefern jedoch Hinweise auf die Sicherheitswirkung speichersicherer Sprachen:

- Google berichtet für Android, dass der Anteil speicherbezogener Sicherheitslücken innerhalb von sechs Jahren von **76 % auf 24 %** sank. Das sind 52 Prozentpunkte beziehungsweise rund **68,4 % relative Reduktion**. Google führt die Entwicklung auf den Wechsel zu speichersicheren Sprachen und Safe-Coding-Praktiken zurück.
- Google berichtet außerdem für neuen Android-Code eine etwa **1.000-fach niedrigere Dichte speicherbezogener Schwachstellen** in Rust gegenüber C und C++.

Diese Werte stammen aus Android und werden nicht als Messwerte dieses Hochschulprojekts ausgegeben. Sie begründen, warum Speichersicherheit bei sicherheitsnaher Software ein hoch gewichtetes Auswahlkriterium ist. Der direkt messbare Projektnachweis bleibt: **0 eigene `unsafe`-Blöcke**.

## 7. Warum die Alternativen nicht gewählt wurden

| Alternative | Stärke | Ausschlaggebender Nachteil im Projekt |
| --- | --- | --- |
| TypeScript/JavaScript | direkte Browserausführung und einfache DOM-Anbindung | keine standardisierte ChaCha20-Poly1305-Abdeckung; Fachlogik wäre nicht als Rust/WASM-Schicht isoliert |
| C++/Emscripten | sehr hohe Leistung und WebAssembly-Unterstützung | geringere standardmäßige Speichersicherheit und komplexerer sicherer Integrationsaufwand |
| Python/Pyodide | gut lesbar und großes Bibliotheksangebot | zusätzliche Browserlaufzeit, größerer Auslieferungsumfang und geringere Eignung für byteorientierte Kernlogik |

Die Alternativen sind nicht grundsätzlich schlechte Sprachen. Sie erreichen nur für die konkrete Kombination aus Kryptographie, WebAssembly, statischem Hosting, Typsicherheit und Lehre einen niedrigeren gewichteten Nutzwert.

## 8. Kosten und Grenzen der Rust-Entscheidung

- Ownership und Borrowing erzeugen eine höhere anfängliche Lernkurve.
- Der Build benötigt Rust, das WASM-Target und `wasm-pack`.
- Jede Browserfunktion braucht eine bewusst gestaltete WASM-Grenze.
- Der Browser lädt zusätzlich zur Oberfläche rund 39,2 KiB komprimierte WASM-Laufzeit und Bindings.
- Rust verhindert Speicherfehler im sicheren Sprachanteil, aber keine falschen Algorithmen, schwachen Schlüsselkonzepte oder fachlichen Logikfehler.

Diese Kosten sind im Projekt vertretbar, weil Build und Prüfung automatisiert sind, die Grenze nur 16 Exportfunktionen umfasst und die Sicherheits- sowie Lernziele direkt von Rusts Typsystem profitieren.

## 9. Fazit

Rust gewinnt die offengelegte Nutzwertanalyse mit **100 von 100 Punkten** und mindestens **36 Prozentpunkten Abstand** zur nächsten betrachteten Alternative. Wichtiger als der Punktwert ist der überprüfbare Architekturgewinn: fünf Verfahren besitzen genau eine Fachimplementierung, null davon liegen in JavaScript, alle modernen Eingaben werden durch Rust-Typen validiert, eigener unsicherer Rust-Code ist verboten und die gesamte Anwendung funktioniert ohne Backend.

Damit ist Rust für dieses Projekt die fachlich und technisch begründete Sprache der Wahl – nicht aufgrund eines pauschalen „Rust ist immer schneller“, sondern aufgrund der nachgewiesenen Kombination aus Speichersicherheit, WebAssembly-Eignung, Kryptographie-Ökosystem, Testbarkeit und reproduzierbarer Auslieferung.
