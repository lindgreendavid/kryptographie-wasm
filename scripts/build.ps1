$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

npm run test:rust
if ($LASTEXITCODE -ne 0) {
    throw "Rust-Qualitätsprüfung fehlgeschlagen."
}

npm run build
if ($LASTEXITCODE -ne 0) {
    throw "WebAssembly-Build fehlgeschlagen."
}

npm run verify:web
if ($LASTEXITCODE -ne 0) {
    throw "Statische Webprüfung fehlgeschlagen."
}

Write-Host "Build erfolgreich. Die Website liegt im Ordner web/."
