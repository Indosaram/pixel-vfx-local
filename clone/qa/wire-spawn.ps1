$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-spawn.js','src/wire-schedule.js','src/wire-shape.js','src/wire-color.js','src/wire-curves.js','test/wire-spawn.test.js','qa/wire-spawn.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-spawn-inputs.json'
cmd /c "bun test test/wire-spawn.test.js > evidence\wire-spawn.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-spawn.exit'
Write-Output "TAG=WIRE_SPAWN EXIT=$code"
exit $code
