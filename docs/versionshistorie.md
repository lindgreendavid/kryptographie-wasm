# Rekonstruierte Versionshistorie

## Ausgangslage

Als Ausgangsmaterial lagen sechs Ordnerstände `v1` bis `v6` vor. Bereits `v1` enthielt Caesar, Skytale, Substitution und AES-GCM. Eine direkte Übernahme dieser Ordner als sechs Git-Commits hätte deshalb keine glaubwürdige fachliche Entwicklung gezeigt.

## Vorgehen

Die Git-Historie wurde am 11. August 2026 aus den vorhandenen Ständen rekonstruiert. Die ursprünglichen Ordner wurden analysiert, aber nicht als parallele Kopien in das Repository übernommen. Stattdessen wurde eine lineare, jederzeit lesbare Entwicklung aufgebaut:

1. technische Projektgrundlage
2. Caesar
3. Skytale
4. monoalphabetische Substitution
5. AES-256-GCM
6. Oberflächenentwicklung in drei Schritten
7. ChaCha20-Poly1305
8. Härtung, Dokumentation und Automatisierung

## Commit-Regeln

- Ein Commit verfolgt genau ein fachliches oder technisches Ziel.
- Neue Verfahren erhalten jeweils Rust-Modul, WASM-Export, UI-Anbindung und Tests im selben Feature-Commit.
- Commit-Nachrichten folgen dem Muster `typ(bereich): beschreibung`.
- Annotierte Tags markieren vorführbare Meilensteine.
- Es wurden keine historischen Datumsangaben erfunden.
- Die Rekonstruktion wird ausdrücklich dokumentiert und nicht als ursprünglicher Entstehungsverlauf ausgegeben.

## Zusammenhang mit den gelieferten Ordnern

Die Ordner `v3` bis `v5` dokumentierten vor allem die Oberflächenentwicklung. `v6` ergänzte ChaCha20-Poly1305. Diese erkennbaren Änderungen wurden in eigenständige Commits überführt. Die bereits in `v1` enthaltenen Verfahren wurden für die Git-Historie fachlich getrennt.

## Ergebnis

Der Verlauf lässt sich mit folgenden Befehlen prüfen:

```bash
git log --graph --decorate --oneline --all
git tag --list --sort=version:refname
git show v0.1.0
git diff v0.3.0..v0.4.0
```

