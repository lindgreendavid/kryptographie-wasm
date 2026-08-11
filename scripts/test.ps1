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

Write-Host "Alle Tests und Prüfungen waren erfolgreich."
