#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --locked
wasm-pack build --target web --out-dir web/pkg

echo "Build erfolgreich. Die Website liegt im Ordner web/."

