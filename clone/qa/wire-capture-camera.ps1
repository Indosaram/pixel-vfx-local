$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-capture-camera.js','test/wire-capture-camera.test.js','qa/wire-capture-camera.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-capture-camera-inputs.json'
cmd /c "bun test test/wire-capture-camera.test.js > evidence\wire-capture-camera.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-capture-camera.exit'
Write-Output "TAG=WIRE_CAPTURE_CAMERA EXIT=$code"
exit $code
