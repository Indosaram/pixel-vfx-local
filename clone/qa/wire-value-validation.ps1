$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-value-validation.js','test/wire-value-validation.test.js','qa/wire-value-validation.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-value-validation-inputs.json'
cmd /c "bun test test/wire-value-validation.test.js > evidence\wire-value-validation.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-value-validation.exit'
Write-Output "TAG=WIRE_VALUE_VALIDATION EXIT=$code"
exit $code
