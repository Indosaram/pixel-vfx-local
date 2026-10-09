$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$inputs = @('src/curves.js', 'src/wire-curves.js', 'src/wire-color.js', 'test/wire-curve-boundary.test.js', 'spec/fixtures/f01-wire-input.json', 'qa/wire-curve-boundary.ps1')
Get-FileHash -Algorithm SHA256 -LiteralPath $inputs | Select-Object Path,Hash |
  ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-curve-boundary-inputs.json'
cmd /c "bun test test/wire-curve-boundary.test.js > evidence\wire-curve-boundary.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-curve-boundary.exit'
Write-Output "TAG=WIRE_CURVE_BOUNDARY EXIT=$code"
exit $code
