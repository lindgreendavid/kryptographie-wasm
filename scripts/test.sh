#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

npm ci

if ! cargo llvm-cov --version >/dev/null 2>&1; then
    echo "cargo-llvm-cov fehlt. Installation: cargo install cargo-llvm-cov --version 0.9.0 --locked" >&2
    exit 1
fi

npx playwright install chromium --with-deps
npm run test:all

echo "Alle Tests, Qualitätsprüfungen und Berichte waren erfolgreich."
