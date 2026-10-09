$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/metadata-u11'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath 'src/export.js', 'test/export.test.js' |
  Select-Object Path, Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.json')
cmd /c "bun test test/export.test.js > evidence\metadata-u11\tests.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii (Join-Path $receiptDir 'tests.exit')
Write-Output "TAG=METADATA EXIT=$code"
exit $code
