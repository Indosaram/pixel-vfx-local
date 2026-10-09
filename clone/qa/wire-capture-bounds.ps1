$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-capture-bounds.js','test/wire-capture-bounds.test.js','qa/wire-capture-bounds.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-capture-bounds-inputs.json'
cmd /c "bun test test/wire-capture-bounds.test.js > evidence\wire-capture-bounds.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-capture-bounds.exit'
Write-Output "TAG=WIRE_CAPTURE_BOUNDS EXIT=$code"
exit $code
