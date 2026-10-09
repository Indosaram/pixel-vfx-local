$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/library.js','test/library.test.js','test/definition-boundary.test.js','qa/u01-definition-green.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/definition-green-inputs.json'
cmd /c "bun test test/library.test.js test/definition-boundary.test.js > evidence\definition-green.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/definition-green.exit'
Write-Output "TAG=DEFINITION_GREEN EXIT=$code"
exit $code
