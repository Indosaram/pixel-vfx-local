$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-color.js','test/wire-color.test.js','qa/wire-color.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-color-inputs.json'
cmd /c "bun test test/wire-color.test.js > evidence\wire-color.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-color.exit'
Write-Output "TAG=WIRE_COLOR EXIT=$code"
exit $code
