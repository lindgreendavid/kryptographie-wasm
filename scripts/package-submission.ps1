[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputDirectory = Join-Path $projectRoot 'docs\abgabe'
$zipPath = Join-Path $outputDirectory 'Kryptographie-WASM-Working-Code-v1.2.0.zip'
$checksumPath = "$zipPath.sha256.txt"

$excludedDirectories = @(
    '.git',
    'node_modules',
    'target',
    'test-results',
    'playwright-report',
    '__pycache__',
    '.pytest_cache',
    'docs/abgabe',
    'web/pkg',
    'reports/coverage',
    'reports/e2e',
    'reports/lighthouse',
    'reports/presentation',
    'reports/document'
)

$excludedFiles = @(
    '.DS_Store',
    'Thumbs.db'
)

function Test-IsExcluded {
    param([Parameter(Mandatory)][string]$RelativePath)

    $normalized = $RelativePath.Replace('\', '/').TrimStart('/')
    if ($excludedFiles -contains [System.IO.Path]::GetFileName($normalized)) {
        return $true
    }

    foreach ($directory in $excludedDirectories) {
        if ($normalized -eq $directory -or $normalized.StartsWith("$directory/", [System.StringComparison]::OrdinalIgnoreCase)) {
            return $true
        }
    }

    return $false
}

function Get-ProjectRelativePath {
    param([Parameter(Mandatory)][string]$FullName)

    $baseUri = [System.Uri]::new($projectRoot.TrimEnd('\') + '\')
    $fileUri = [System.Uri]::new($FullName)
    return [System.Uri]::UnescapeDataString($baseUri.MakeRelativeUri($fileUri).ToString()).Replace('/', '\')
}

[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

$files = Get-ChildItem -LiteralPath $projectRoot -File -Recurse -Force |
    Where-Object {
        $relativePath = Get-ProjectRelativePath -FullName $_.FullName
        -not (Test-IsExcluded -RelativePath $relativePath)
    } |
    Sort-Object FullName

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$stream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
try {
    $archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
    try {
        foreach ($file in $files) {
            $relativePath = (Get-ProjectRelativePath -FullName $file.FullName).Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $archive,
                $file.FullName,
                "kryptographie-wasm-1.2.0/$relativePath",
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
    }
    finally {
        $archive.Dispose()
    }
}
finally {
    $stream.Dispose()
}

$hash = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath $checksumPath -Encoding utf8 -Value "$hash  $([System.IO.Path]::GetFileName($zipPath))"

$zipInfo = Get-Item -LiteralPath $zipPath
Write-Output "ZIP=$($zipInfo.FullName)"
Write-Output "FILES=$($files.Count)"
Write-Output "BYTES=$($zipInfo.Length)"
Write-Output "SHA256=$hash"
