$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-effect.js','src/wire-emitter.js','src/wire-schedule.js','src/wire-spawn.js','src/wire-motion.js','src/wire-shape.js','src/wire-color.js','src/wire-curves.js','src/curves.js','test/wire-effect.test.js','qa/wire-effect.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-effect-inputs.json'
cmd /c "bun test test/wire-effect.test.js > evidence\wire-effect.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-effect.exit'
Write-Output "TAG=WIRE_EFFECT EXIT=$code"
exit $code
