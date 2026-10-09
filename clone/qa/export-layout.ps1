# Bounded U11 sheet-layout targeted test: task-owned receipt dir, input hashes, log, exit.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/layout-review'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath 'src/export/sheet-layout.js', 'test/export-layout.test.js', 'src/timing.js', 'src/settings.js', 'qa/export-layout.ps1', 'spec/fixtures/sheet-layout.json' |
  Select-Object Path, Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.json')
cmd /c "bun test test/export-layout.test.js > evidence\layout-review\tests.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii (Join-Path $receiptDir 'tests.exit')
Write-Output "TAG=EXPORT_LAYOUT EXIT=$code"
exit $code
