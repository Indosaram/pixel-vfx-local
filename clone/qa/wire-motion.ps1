$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-motion.js','src/wire-curves.js','test/wire-motion.test.js','qa/wire-motion.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-motion-inputs.json'
cmd /c "bun test test/wire-motion.test.js > evidence\wire-motion.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-motion.exit'
Write-Output "TAG=WIRE_MOTION EXIT=$code"
exit $code
