$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-library.js','src/wire-library-mix.js','test/wire-library.test.js','qa/wire-library.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-library-inputs.json'
cmd /c "bun test test/wire-library.test.js > evidence\wire-library.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-library.exit'
Write-Output "TAG=WIRE_LIBRARY EXIT=$code"
exit $code
