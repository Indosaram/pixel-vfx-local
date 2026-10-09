$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-state.js','src/wire-color.js','src/wire-curves.js','test/wire-state.test.js','qa/wire-state.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-state-inputs.json'
cmd /c "bun test test/wire-state.test.js > evidence\wire-state.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-state.exit'
Write-Output "TAG=WIRE_STATE EXIT=$code"
exit $code
