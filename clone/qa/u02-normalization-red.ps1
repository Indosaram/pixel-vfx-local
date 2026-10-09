$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/curves.js','src/emitter.js','test/emission.test.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/red-inputs.json'
cmd /c "bun test test/emission.test.js --test-name-pattern normalized > evidence\normalization-red.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/normalization-red.exit'
Write-Output "TAG=NORMALIZATION_RED EXIT=$code"
exit $code
