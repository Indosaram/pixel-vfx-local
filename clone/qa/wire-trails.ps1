$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-trails.js','src/wire-state.js','src/wire-color.js','src/wire-curves.js','test/wire-trails.test.js','qa/wire-trails.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-trails-inputs.json'
cmd /c "bun test test/wire-trails.test.js > evidence\wire-trails.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-trails.exit'
Write-Output "TAG=WIRE_TRAILS EXIT=$code"
exit $code
