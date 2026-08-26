[CmdletBinding()]
param(
    [string]$ArchivePath = '',
    [ValidateRange(1024, 65535)]
    [int]$Port = 8091
)

$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if (-not $ArchivePath) {
    $ArchivePath = Join-Path $projectRoot 'docs\abgabe\Kryptographie-WASM-Working-Code-v1.2.0.zip'
}
$archive = (Resolve-Path -LiteralPath $ArchivePath).Path

$tempBase = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath()).TrimEnd('\') + '\'
$verificationRoot = [System.IO.Path]::GetFullPath(
    (Join-Path $tempBase ('krypto-submission-' + [System.Guid]::NewGuid().ToString('N')))
)
if (-not $verificationRoot.StartsWith($tempBase, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Ungültiges temporäres Ziel: $verificationRoot"
}

[System.IO.Directory]::CreateDirectory($verificationRoot) | Out-Null
$sourceRoot = Join-Path $verificationRoot 'kryptographie-wasm-1.2.0'
$server = $null

try {
    Expand-Archive -LiteralPath $archive -DestinationPath $verificationRoot
    if (-not (Test-Path -LiteralPath (Join-Path $sourceRoot 'Cargo.toml'))) {
        throw 'Das Archiv enthält nicht die erwartete Projektstruktur.'
    }

    Push-Location $sourceRoot
    try {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) {
            throw 'npm ci im entpackten Archiv ist fehlgeschlagen.'
        }

        & npm.cmd run build
        if ($LASTEXITCODE -ne 0) {
            throw 'Der WASM-Build im entpackten Archiv ist fehlgeschlagen.'
        }

        & npm.cmd run verify:web
        if ($LASTEXITCODE -ne 0) {
            throw 'Die Webstrukturprüfung im entpackten Archiv ist fehlgeschlagen.'
        }

        $node = (Get-Command node.exe).Source
        $server = Start-Process `
            -FilePath $node `
            -ArgumentList @(
                'node_modules/http-server/bin/http-server',
                'web',
                '-a',
                '127.0.0.1',
                '-p',
                $Port,
                '-c-1',
                '--silent'
            ) `
            -WorkingDirectory $sourceRoot `
            -WindowStyle Hidden `
            -PassThru

        $url = "http://127.0.0.1:$Port/index.html"
        $served = $false
        for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
            try {
                $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2
                if ($response.StatusCode -eq 200 -and $response.Content.Contains('<title>Kryptographie</title>')) {
                    $served = $true
                    break
                }
            }
            catch {
                # Der Prozess kann während der ersten Iterationen noch starten.
            }
            Start-Sleep -Milliseconds 250
        }
        if (-not $served) {
            throw 'Die Startseite aus dem entpackten Archiv war nicht erreichbar.'
        }

        Write-Output 'ZIP_NPM_CI=PASS'
        Write-Output 'ZIP_WASM_BUILD=PASS'
        Write-Output 'ZIP_WEB_VERIFY=PASS'
        Write-Output 'ZIP_SERVER_SMOKE=PASS'
    }
    finally {
        Pop-Location
    }
}
finally {
    if ($server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
        $null = $server.WaitForExit(5000)
    }

    $resolvedVerificationRoot = [System.IO.Path]::GetFullPath($verificationRoot)
    if (-not $resolvedVerificationRoot.StartsWith($tempBase, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Das temporäre Löschziel liegt außerhalb des Temp-Verzeichnisses: $resolvedVerificationRoot"
    }
    if ([System.IO.Directory]::Exists($resolvedVerificationRoot)) {
        [System.IO.Directory]::Delete($resolvedVerificationRoot, $true)
    }
}
