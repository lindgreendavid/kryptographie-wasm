$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

npm ci
if ($LASTEXITCODE -ne 0) {
    throw "Installation der Node-Abhängigkeiten fehlgeschlagen."
}

cargo llvm-cov --version
if ($LASTEXITCODE -ne 0) {
    throw "cargo-llvm-cov fehlt. Installation: cargo install cargo-llvm-cov --version 0.9.0 --locked"
}

npx playwright install chromium
if ($LASTEXITCODE -ne 0) {
    throw "Installation von Chromium für Playwright fehlgeschlagen."
}

npm run test:all
if ($LASTEXITCODE -ne 0) {
    throw "Der vollständige Qualitätslauf ist fehlgeschlagen."
}

Write-Host "Alle Tests, Qualitätsprüfungen und Berichte waren erfolgreich."
