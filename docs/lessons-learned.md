# Lessons Learned

- Rust eignet sich gut, um kryptografische Fachlogik klar von der Oberfläche zu trennen.
- WebAssembly benötigt einen lokalen HTTP-Server; direktes Öffnen per `file://` ist für solche Projekte unzuverlässig.
- Historische Verschlüsselungen sind didaktisch nützlich, aber keine realistische Sicherheit für moderne Kommunikation.
- AES-GCM zeigt, dass moderne Verschlüsselung nicht nur Geheimhaltung, sondern auch Authentifizierung liefern muss.
- ChaCha20-Poly1305 zeigt, dass moderne authentifizierte Verschlüsselung nicht nur auf AES basiert.
- Eine einfache Architektur ist für ein Prüfungsprojekt leichter erklärbar als ein modernes Frontend-Framework.

