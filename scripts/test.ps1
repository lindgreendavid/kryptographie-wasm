$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --locked
wasm-pack build --target web --out-dir web/pkg

if (Get-Command py -ErrorAction SilentlyContinue) {
    py -3 scripts/verify_web.py
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python scripts/verify_web.py
} else {
    throw "Python wurde für die Webprüfung nicht gefunden."
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js wurde für die JavaScript-Syntaxprüfung nicht gefunden."
}

Get-ChildItem -Path web/js -Filter *.js | ForEach-Object {
    node --check $_.FullName
    if ($LASTEXITCODE -ne 0) {
        throw "JavaScript-Syntaxprüfung fehlgeschlagen: $($_.Name)"
    }
}

npm ci
if ($LASTEXITCODE -ne 0) {
    throw "Installation der Browser-Testabhängigkeiten fehlgeschlagen."
}

npx playwright install chromium
if ($LASTEXITCODE -ne 0) {
    throw "Installation von Chromium für Playwright fehlgeschlagen."
}

npm run test:e2e
if ($LASTEXITCODE -ne 0) {
    throw "Browser- oder WCAG-Test fehlgeschlagen."
}

Write-Host "Alle Tests und Prüfungen waren erfolgreich."
