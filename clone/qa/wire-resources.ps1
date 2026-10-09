$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-resources.js','test/wire-resources.test.js','qa/wire-resources.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-resources-inputs.json'
cmd /c "bun test test/wire-resources.test.js > evidence\wire-resources.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-resources.exit'
Write-Output "TAG=WIRE_RESOURCES EXIT=$code"
exit $code
