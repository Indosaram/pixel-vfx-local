$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-schedule.js','src/wire-curves.js','test/wire-schedule.test.js','qa/wire-schedule.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-schedule-inputs.json'
cmd /c "bun test test/wire-schedule.test.js > evidence\wire-schedule.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-schedule.exit'
Write-Output "TAG=WIRE_SCHEDULE EXIT=$code"
exit $code
