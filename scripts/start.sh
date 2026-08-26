#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [[ ! -f web/pkg/krypto_wasm.js ]]; then
    echo "WASM-Paket fehlt. Build wird gestartet ..."
    ./scripts/build.sh
fi

if [[ ! -d node_modules ]]; then
    npm ci
fi

URL="http://127.0.0.1:8080/index.html"
if curl --silent --fail "$URL" | grep --quiet "<title>Kryptographie</title>"; then
    echo "Die geprüfte Anwendung läuft bereits unter $URL."
    if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1 || true; fi
    if command -v open >/dev/null 2>&1; then open "$URL"; fi
    exit 0
fi

npm run serve &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT INT TERM

for _ in $(seq 1 80); do
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
        echo "Der lokale Server wurde unerwartet beendet." >&2
        exit 1
    fi
    if curl --silent --fail "$URL" | grep --quiet "<title>Kryptographie</title>"; then
        break
    fi
    sleep 0.25
done

if ! curl --silent --fail "$URL" | grep --quiet "<title>Kryptographie</title>"; then
    echo "Die Anwendung war nach 20 Sekunden nicht erreichbar." >&2
    exit 1
fi

if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1 || true; fi
if command -v open >/dev/null 2>&1; then open "$URL"; fi

echo "Lokaler Server: http://127.0.0.1:8080/index.html"
echo "Beenden mit Strg+C."
wait "$SERVER_PID"
