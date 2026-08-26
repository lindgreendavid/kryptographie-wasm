# Wahrscheinliche Prüfungsfragen und Antwortanker

1. **Warum Rust statt nur JavaScript?**
   Kursfokus systemnah/WASM, eine typisierte Fachdomäne, RustCrypto für beide AEAD-Verfahren,
   native Tests und 0 eigene unsafe-Blöcke. Die UI benötigt weiterhin bewusst kleines JavaScript.

2. **Was bringt WebAssembly hier fachlich?**
   Eine klare, kompilierte Grenze: Browserdarstellung außen, testbare Fachlogik innen. Der Gewinn ist
   Architektur und Typsicherheit, nicht eine unbelegte pauschale Geschwindigkeitsbehauptung.

3. **Warum keine eigene AES-Implementierung?**
   Moderne Primitive selbst zu implementieren wäre sicherheitskritisch und außerhalb des Scopes.
   RustCrypto wird eingebunden; offizielle Vektoren prüfen die konkrete Integration.

4. **Was ist der Unterschied zwischen Base64 und Verschlüsselung?**
   Base64 kodiert Bytes verlustfrei für Textfelder und bietet keine Geheimhaltung. AES/ChaCha
   transformieren Daten mit Schlüssel und Authentifizierung.

5. **Warum müssen Nonces eindeutig sein?**
   Wiederverwendung mit demselben Schlüssel kann AEAD-Sicherheit zerstören. Die Demo nutzt sichere
   Zufallswerte; produktiv wäre zusätzlich ein belastbares Eindeutigkeitskonzept nötig.

6. **Was prüft der Authentifizierungstag?**
   Integrität und Authentizität von Geheimtext/zugehörigen Daten. Bei Änderung darf kein Klartext
   freigegeben werden; genau das belegen Negativ- und E2E-Tests.

7. **Wie werden Fehler über WASM transportiert?**
   Rust erzeugt `CryptoError`; `src/lib.rs` übersetzt erst an der Grenze in verständliche
   JavaScript-Fehler. Die UI zeigt sie in Live-Regionen.

8. **Wie ist Ownership sichtbar genutzt?**
   Werttypen besitzen validierte Bytearrays; Ergebniswerte werden eindeutig erzeugt und übergeben.
   Leihgaben vermeiden unnötige Besitzwechsel in der Core-Logik.

9. **Warum mehrseitiges HTML statt SPA?**
   Sechs kleine unabhängige Lernseiten brauchen kein Client-Routing oder globales State-Framework.
   Normale Links sind robust, direkt adressierbar und zugänglich.

10. **Was bedeutet 98,82 % Coverage?**
    Nahezu alle Rust-Zeilen liefen in Tests. Das ist ein starker Ausführungsnachweis, aber kein
    mathematischer Sicherheitsbeweis und kein Ersatz für sinnvolle Assertions.

11. **Warum sind nur Chromium-Tests automatisiert?**
    Der Kernscope priorisiert einen stabilen realen Browserpfad. Firefox/WebKit sind eine bekannte
    spätere Erweiterung; semantisches HTML und Standards reduzieren das Risiko.

12. **Was prüft axe nicht?**
    Beispielsweise vollständige Screenreader-Verständlichkeit, Qualität von Alternativtexten im
    Kontext und alle kognitiven Aspekte. Daher wird nur „automatisierbare WCAG-Regeln“ behauptet.

13. **Wie wurde KI kontrolliert?**
    Anforderungen und Prompts sind dokumentiert; Vorschläge mussten ausführbare Gates bestehen.
    Fehlvorschläge zu Abhängigkeit, Toolversion, Coverage und Testparallelität wurden nach Messung
    korrigiert.

14. **Warum ist die Git-Historie rekonstruiert?**
    Sechs Ordnerstände wurden fachlich geordnet. Diese Darstellung erhöht Lesbarkeit, wird aber
    transparent nicht als ursprünglicher zeitlicher Entwicklungsverlauf ausgegeben.

15. **Was wäre für Produktion als Nächstes nötig?**
    Bedrohungsanalyse je Anwendung, geheimes Key-Management, garantiertes Nonce-Konzept, AAD,
    sichere Löschung/Telemetrieentscheidung, Mehrbrowser-/Screenreader-Tests und externes Audit.
