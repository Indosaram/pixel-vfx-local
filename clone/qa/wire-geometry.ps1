$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-geometry.js','test/wire-geometry.test.js','qa/wire-geometry.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-geometry-inputs.json'
cmd /c "bun test test/wire-geometry.test.js > evidence\wire-geometry.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-geometry.exit'
Write-Output "TAG=WIRE_GEOMETRY EXIT=$code"
exit $code
