# ADR 001 - Rust und WebAssembly

## Status

Akzeptiert

## Kontext

Die Aufgabenstellung verlangt sichtbare Rust-Nutzung und WebAssembly im Browser.

## Entscheidung

Die kryptografische Fachlogik wird in Rust implementiert und über `wasm-bindgen` exportiert.

## Konsequenzen

JavaScript bleibt klein. Der Build benötigt `wasm-pack` und einen lokalen HTTP-Server.

