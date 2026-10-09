$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-material-validation.js','test/wire-material-validation.test.js','qa/wire-material-validation.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-material-validation-inputs.json'
cmd /c "bun test test/wire-material-validation.test.js > evidence\wire-material-validation.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-material-validation.exit'
Write-Output "TAG=WIRE_MATERIAL_VALIDATION EXIT=$code"
exit $code
