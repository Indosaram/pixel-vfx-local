$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-curves.js','test/wire-curves.test.js','qa/wire-scalar.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-scalar-inputs.json'
cmd /c "bun test test/wire-curves.test.js > evidence\wire-scalar.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-scalar.exit'
Write-Output "TAG=WIRE_SCALAR EXIT=$code"
exit $code
