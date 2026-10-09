$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-grade.js','test/wire-grade.test.js','qa/wire-grade.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-grade-inputs.json'
cmd /c "bun test test/wire-grade.test.js > evidence\wire-grade.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-grade.exit'
Write-Output "TAG=WIRE_GRADE EXIT=$code"
exit $code
