$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/library.js','test/definition-boundary.test.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/definition-red-inputs.json'
cmd /c "bun test test/definition-boundary.test.js > evidence\definition-red.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/definition-red.exit'
Write-Output "TAG=DEFINITION_RED EXIT=$code"
exit $code
