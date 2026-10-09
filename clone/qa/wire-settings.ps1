$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-settings.js','test/wire-settings.test.js','qa/wire-settings.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-settings-inputs.json'
cmd /c "bun test test/wire-settings.test.js > evidence\wire-settings.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-settings.exit'
Write-Output "TAG=WIRE_SETTINGS EXIT=$code"
exit $code
