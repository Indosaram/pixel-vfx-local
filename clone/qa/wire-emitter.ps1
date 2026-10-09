$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-emitter.js','src/wire-schedule.js','src/wire-spawn.js','src/wire-motion.js','src/wire-shape.js','src/wire-color.js','src/wire-curves.js','test/wire-emitter.test.js','test/wire-schedule.test.js','test/wire-spawn.test.js','qa/wire-emitter.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-emitter-inputs.json'
cmd /c "bun test test/wire-emitter.test.js test/wire-schedule.test.js test/wire-spawn.test.js > evidence\wire-emitter.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-emitter.exit'
Write-Output "TAG=WIRE_EMITTER EXIT=$code"
exit $code
