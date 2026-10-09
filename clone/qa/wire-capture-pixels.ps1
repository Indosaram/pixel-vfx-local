$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-capture-pixels.js','test/wire-capture-pixels.test.js','qa/wire-capture-pixels.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-capture-pixels-inputs.json'
cmd /c "bun test test/wire-capture-pixels.test.js > evidence\wire-capture-pixels.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-capture-pixels.exit'
Write-Output "TAG=WIRE_CAPTURE_PIXELS EXIT=$code"
exit $code
