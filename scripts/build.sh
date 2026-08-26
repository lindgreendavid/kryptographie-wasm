#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

npm run test:rust
npm run build
npm run verify:web

echo "Build erfolgreich. Die Website liegt im Ordner web/."
