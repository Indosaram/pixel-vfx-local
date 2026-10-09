$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-library-mix.js','test/wire-library-mix.test.js','qa/wire-library-mix.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-library-mix-inputs.json'
cmd /c "bun test test/wire-library-mix.test.js > evidence\wire-library-mix.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-library-mix.exit'
Write-Output "TAG=WIRE_LIBRARY_MIX EXIT=$code"
exit $code
