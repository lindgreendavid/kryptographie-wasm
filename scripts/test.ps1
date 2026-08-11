$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
wasm-pack build --target web --out-dir web/pkg

Write-Host "Alle Tests und Prüfungen waren erfolgreich."

