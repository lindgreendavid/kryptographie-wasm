$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

if (-not (Test-Path "$ProjectRoot\web\pkg\krypto_wasm.js")) {
    Write-Host "WASM-Paket fehlt. Build wird gestartet..."
    wasm-pack build --target web --out-dir web/pkg
}

$Port = 8080

$Url = "http://127.0.0.1:$Port/index.html"
if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "Die Anwendung scheint bereits unter $Url zu laufen."
    Start-Process $Url
    return
}

Write-Host "Lokaler Server startet unter $Url"
Write-Host "Projektordner: $ProjectRoot"
Write-Host "Zum Beenden Strg+C druecken."
Start-Process $Url

Set-Location "$ProjectRoot\web"

if (Get-Command py -ErrorAction SilentlyContinue) {
    py -3 -m http.server $Port --bind 127.0.0.1
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $Port --bind 127.0.0.1
} else {
    throw "Python wurde nicht gefunden. Bitte Python installieren oder einen anderen lokalen HTTP-Server im Ordner web starten."
}
