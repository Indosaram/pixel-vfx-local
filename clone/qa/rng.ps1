$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/rng'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath 'src/curves.js', 'test/curves-rng.test.js' |
  Select-Object Path, Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.json')
cmd /c "bun test test/curves-rng.test.js > evidence\rng\tests.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii (Join-Path $receiptDir 'tests.exit')
Write-Output "TAG=RNG EXIT=$code"
exit $code
