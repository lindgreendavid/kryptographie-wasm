#!/usr/bin/env python3
"""Ermittelt die in der Rust-Entscheidungsdokumentation verwendeten Kennzahlen."""

from __future__ import annotations

import gzip
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent


def matching_files(directory: str, suffix: str) -> list[Path]:
    return sorted((PROJECT_ROOT / directory).rglob(f"*{suffix}"))


def line_count(paths: list[Path]) -> int:
    return sum(len(path.read_text(encoding="utf-8").splitlines()) for path in paths)


def occurrences(paths: list[Path], pattern: str) -> int:
    expression = re.compile(pattern, re.MULTILINE)
    return sum(
        len(expression.findall(path.read_text(encoding="utf-8"))) for path in paths
    )


def print_group(label: str, paths: list[Path]) -> None:
    print(f"{label}: {len(paths)} Dateien, {line_count(paths)} Zeilen")


def main() -> None:
    rust_source = matching_files("src", ".rs")
    rust_integration_tests = matching_files("tests", ".rs")
    browser_javascript = matching_files("web/js", ".js")
    end_to_end_tests = matching_files("e2e", ".js")
    all_rust = rust_source + rust_integration_tests

    print_group("Rust unter src/", rust_source)
    print_group("Rust-Integrationstests", rust_integration_tests)
    print_group("JavaScript-Brücke", browser_javascript)
    print_group("Browser-Tests", end_to_end_tests)
    print(f"Rust-Tests: {occurrences(all_rust, r'^\s*#\[test\]')}")
    print(
        "WASM-Exportfunktionen: "
        f"{occurrences([PROJECT_ROOT / 'src/lib.rs'], r'^pub fn ')}"
    )
    print(f"unsafe-Blöcke im eigenen Rust-Code: {occurrences(all_rust, r'unsafe\s*\{')}")

    for artifact_name in ("krypto_wasm_bg.wasm", "krypto_wasm.js"):
        artifact = PROJECT_ROOT / "web/pkg" / artifact_name
        if artifact.exists():
            content = artifact.read_bytes()
            compressed = gzip.compress(content, compresslevel=9, mtime=0)
            print(
                f"{artifact.relative_to(PROJECT_ROOT)}: {len(content)} Byte roh, "
                f"{len(compressed)} Byte gzip"
            )


if __name__ == "__main__":
    main()
