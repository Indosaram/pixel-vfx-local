$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-texture-loader.js','test/wire-texture-loader.test.js','qa/wire-texture-loader.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-texture-loader-inputs.json'
cmd /c "bun test test/wire-texture-loader.test.js > evidence\wire-texture-loader.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-texture-loader.exit'
Write-Output "TAG=WIRE_TEXTURE_LOADER EXIT=$code"
exit $code
