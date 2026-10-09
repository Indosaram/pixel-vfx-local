$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-module-validation.js','src/wire-value-validation.js','test/wire-module-validation.test.js','qa/wire-module-validation.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-module-validation-inputs.json'
cmd /c "bun test test/wire-module-validation.test.js > evidence\wire-module-validation.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-module-validation.exit'
Write-Output "TAG=WIRE_MODULE_VALIDATION EXIT=$code"
exit $code
