$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/emission-current'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath 'src/emitter.js', 'src/curves.js', 'test/emission.test.js' |
  Select-Object Path, Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.json')
cmd /c "bun test test/emission.test.js > evidence\emission-current\tests.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii (Join-Path $receiptDir 'tests.exit')
Write-Output "TAG=U03 EXIT=$code"
exit $code
