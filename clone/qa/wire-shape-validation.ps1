$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-shape-validation.js','test/wire-shape-validation.test.js','qa/wire-shape-validation.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-shape-validation-inputs.json'
cmd /c "bun test test/wire-shape-validation.test.js > evidence\wire-shape-validation.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-shape-validation.exit'
Write-Output "TAG=WIRE_SHAPE_VALIDATION EXIT=$code"
exit $code
