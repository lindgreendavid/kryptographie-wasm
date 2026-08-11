#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [[ ! -f web/pkg/krypto_wasm.js ]]; then
    echo "WASM-Paket fehlt. Build wird gestartet ..."
    ./scripts/build.sh
fi

echo "Lokaler Server: http://127.0.0.1:8080/index.html"
echo "Beenden mit Strg+C."
exec python3 -m http.server 8080 --bind 127.0.0.1 --directory web

