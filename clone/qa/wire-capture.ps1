$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-capture.js','src/wire-capture-pixels.js','src/wire-capture-bounds.js','src/wire-capture-camera.js','test/wire-capture.test.js','qa/wire-capture.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-capture-inputs.json'
cmd /c "bun test test/wire-capture.test.js > evidence\wire-capture.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-capture.exit'
Write-Output "TAG=WIRE_CAPTURE EXIT=$code"
exit $code
