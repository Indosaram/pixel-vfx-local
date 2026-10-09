$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-instances.js','src/wire-state.js','src/wire-color.js','src/wire-curves.js','test/wire-instances.test.js','qa/wire-instances.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-instances-inputs.json'
cmd /c "bun test test/wire-instances.test.js > evidence\wire-instances.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-instances.exit'
Write-Output "TAG=WIRE_INSTANCES EXIT=$code"
exit $code
