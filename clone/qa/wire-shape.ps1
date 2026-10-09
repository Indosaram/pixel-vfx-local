$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-shape.js','test/wire-shape.test.js','qa/wire-shape.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-shape-inputs.json'
cmd /c "bun test test/wire-shape.test.js > evidence\wire-shape.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-shape.exit'
Write-Output "TAG=WIRE_SHAPE EXIT=$code"
exit $code
