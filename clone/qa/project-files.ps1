$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/project-files.js','src/wire-library.js','src/wire-library-mix.js','src/wire-resources.js','test/project-files.test.js','qa/project-files.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/project-files-inputs.json'
cmd /c "bun test test/project-files.test.js > evidence\project-files.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/project-files.exit'
Write-Output "TAG=PROJECT_FILES EXIT=$code"
exit $code
