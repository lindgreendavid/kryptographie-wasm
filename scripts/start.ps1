$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

if (-not (Test-Path "$ProjectRoot\web\pkg\krypto_wasm.js")) {
    Write-Host "WASM-Paket fehlt. Build wird gestartet..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "WebAssembly-Build fehlgeschlagen."
    }
}

$Port = 8080
$Url = "http://127.0.0.1:$Port/index.html"

function Test-KryptographieApp {
    try {
        $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        return $Response.StatusCode -eq 200 -and $Response.Content.Contains("<title>Kryptographie</title>")
    } catch {
        return $false
    }
}

if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
    if (Test-KryptographieApp) {
        Write-Host "Die geprüfte Anwendung läuft bereits unter $Url."
        Start-Process $Url
        return
    }
    throw "Port $Port wird von einem anderen Dienst verwendet. Bitte den Port freigeben."
}

if (-not (Test-Path "$ProjectRoot\node_modules")) {
    npm ci
    if ($LASTEXITCODE -ne 0) {
        throw "Installation der Node-Abhängigkeiten fehlgeschlagen."
    }
}

$NpmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
$Server = Start-Process -FilePath $NpmCommand -ArgumentList @("run", "serve") -WorkingDirectory $ProjectRoot -WindowStyle Hidden -PassThru

try {
    $Ready = $false
    for ($Attempt = 0; $Attempt -lt 80; $Attempt++) {
        if ($Server.HasExited) {
            throw "Der lokale Server wurde unerwartet beendet."
        }
        if (Test-KryptographieApp) {
            $Ready = $true
            break
        }
        Start-Sleep -Milliseconds 250
    }

    if (-not $Ready) {
        throw "Die Anwendung war nach 20 Sekunden nicht erreichbar."
    }

    Write-Host "Lokaler Server: $Url"
    Write-Host "Zum Beenden dieses Fensters Strg+C drücken."
    Start-Process $Url
    Wait-Process -Id $Server.Id
} finally {
    if (-not $Server.HasExited) {
        Stop-Process -Id $Server.Id
    }
}
