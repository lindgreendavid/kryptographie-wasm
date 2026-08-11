# ADR 001 - Rust und WebAssembly

## Status

Akzeptiert

## Kontext

Die Aufgabenstellung verlangt sichtbare Rust-Nutzung und WebAssembly im Browser. Kryptographische Fachlogik benötigt zusätzlich strikte Eingabevalidierung, sichere Speicherzugriffe, etablierte Bibliotheken und reproduzierbare Tests.

## Entscheidung

Die gesamte kryptographische Fachlogik wird in Rust implementiert und über `wasm-bindgen` exportiert. JavaScript bleibt auf DOM-Anbindung und Darstellung begrenzt. Eine quantitative Begründung einschließlich Alternativen und Projektmesswerten steht in [`docs/rust-entscheidung.md`](../rust-entscheidung.md).

## Konsequenzen

Rust liefert Speichersicherheit ohne Garbage Collector, typisierte Fehler und einen direkten WebAssembly-Build. JavaScript bleibt klein. Der Build benötigt dafür `wasm-pack`, das WASM-Target und einen lokalen HTTP-Server.
