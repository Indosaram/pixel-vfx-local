$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/*.js','test/wire-capture-driver.test.js','qa/wire-capture-driver.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-capture-driver-inputs.json'
cmd /c "bun test test/wire-capture-driver.test.js > evidence\wire-capture-driver.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-capture-driver.exit'
Write-Output "TAG=WIRE_CAPTURE_DRIVER EXIT=$code"
exit $code
