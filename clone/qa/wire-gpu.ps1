param(
  [Parameter(Mandatory=$true)][string]$ElectronPath,
  [Parameter(Mandatory=$true)][string]$OutputDirectory,
  [ValidateSet('shaders','context')][string]$Probe = 'shaders'
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
if (Test-Path $OutputDirectory) { throw 'GPU evidence directory must be new to prevent stale receipts.' }
New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
$output = (Resolve-Path $OutputDirectory).Path
$electron = (Resolve-Path $ElectronPath).Path
$inputs = @(
  'package.json','bun.lock','node_modules/electron/package.json',
  'qa/wire-gpu.ps1','qa/wire-gpu.cjs','qa/wire-gpu.html','qa/wire-gpu-tests.js','qa/wire-gpu-context.js',
  'src/wire-shaders.js','src/wire-material.js','src/wire-scene.js','src/wire-effect.js',
  'src/wire-emitter.js','src/wire-schedule.js','src/wire-spawn.js','src/wire-motion.js',
  'src/wire-shape.js','src/wire-color.js','src/wire-curves.js','src/curves.js',
  'src/wire-geometry.js','src/wire-world.js','src/wire-instances.js','src/wire-trails.js',
  'src/wire-state.js','node_modules/three/package.json','node_modules/three/build/three.module.js'
)
Get-FileHash -Algorithm SHA256 ($inputs + @($electron)) |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $output 'inputs.json')
$launch = Get-Content -Raw (Join-Path $output 'launch.json') | ConvertFrom-Json
$launch.inputs = Get-Content -Raw (Join-Path $output 'inputs.json') | ConvertFrom-Json
$launch | ConvertTo-Json -Depth 6 | Out-File -Encoding utf8 (Join-Path $output 'launch.json')
$env:ELECTRON_RUN_AS_NODE = $null
if ($Probe -eq 'context') {
  Get-FileHash -Algorithm SHA256 'qa/wire-gpu-context.js' | Select-Object Path,Hash |
    ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $output 'probe-input.json')
}
$process = Start-Process -FilePath $electron -ArgumentList @(
  ('"' + (Join-Path $PSScriptRoot 'wire-gpu.cjs') + '"'), ('"' + $output + '"'), ('"' + $root + '"'), $Probe
) -RedirectStandardOutput (Join-Path $output 'process.log') -RedirectStandardError (Join-Path $output 'process.stderr.log') -PassThru -Wait
$code = $process.ExitCode
$code | Out-File -Encoding ascii (Join-Path $output 'process.exit')
if ($code -ne 0) { Write-Output "TAG=WIRE_GPU_PROCESS EXIT=$code"; exit $code }
$result = Get-Content -Raw (Join-Path $output 'result.json') | ConvertFrom-Json
$receiptExit = (Get-Content -Raw (Join-Path $output 'exit.txt')).Trim()
if ($result.pass -ne $true -or $receiptExit -ne '0') { throw 'GPU process exited zero without matching passing receipts.' }
Write-Output 'TAG=WIRE_GPU_PROCESS EXIT=0'
