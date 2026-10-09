$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-scene.js','src/wire-effect.js','src/wire-emitter.js','src/wire-schedule.js','src/wire-spawn.js','src/wire-motion.js','src/wire-shape.js','src/wire-color.js','src/wire-curves.js','src/curves.js','src/wire-geometry.js','src/wire-world.js','src/wire-instances.js','src/wire-trails.js','src/wire-state.js','test/wire-scene.test.js','qa/wire-scene.ps1','node_modules/three/package.json','node_modules/three/build/three.module.js' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-scene-inputs.json'
cmd /c "bun test test/wire-scene.test.js > evidence\wire-scene.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/wire-scene.exit'
Write-Output "TAG=WIRE_SCENE EXIT=$code"
exit $code
