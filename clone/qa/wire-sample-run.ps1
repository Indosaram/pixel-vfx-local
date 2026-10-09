param(
  [Parameter(Mandatory=$true)][string]$TaskName,
  [Parameter(Mandatory=$true)][string]$RunId
)
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\sook\clone-boundary-01a1154f'
Set-Location $root
$OutputDirectory = "evidence/wire-sample-$RunId"
$taskEvidence = Join-Path $root $OutputDirectory
if (Test-Path $taskEvidence) { throw 'Task output directory must be new.' }
$hashFiles = @(
  'qa/wire-sample-run.ps1','qa/wire-sample-process.ps1','qa/wire-sample.cjs','qa/wire-sample.html',
  'qa/wire-sample-gpu.js','package.json','bun.lock',
  'node_modules/electron/package.json','node_modules/electron/dist/electron.exe',
  'node_modules/three/package.json','node_modules/three/build/three.module.js',
  'spec/fixtures/f01-wire-input.json',
  'src/export/sheet-layout.js','src/wire-capture.js','src/wire-capture-driver.js','src/wire-capture-pixels.js',
  'src/wire-capture-bounds.js','src/wire-capture-camera.js','src/wire-scene.js','src/wire-effect.js',
  'src/wire-emitter.js','src/wire-schedule.js','src/wire-spawn.js','src/wire-motion.js','src/wire-shape.js',
  'src/wire-color.js','src/wire-curves.js','src/curves.js','src/wire-geometry.js','src/wire-world.js',
  'src/wire-instances.js','src/wire-trails.js','src/wire-state.js','src/wire-material.js','src/wire-shaders.js'
)
$hashes = Get-FileHash -Algorithm SHA256 $hashFiles | Select-Object Path,Hash
$launcherManifest = [pscustomobject]@{ mode='sample'; runId=$RunId; output=$OutputDirectory; mechanism='TaskScheduler-Interactive'; taskName=$TaskName; user='sook'; sessionId=1; crashVeto='GPU child-process-gone fails run'; inputs=$hashes }
$null = New-Item -ItemType Directory -Path $taskEvidence
$launcherManifest | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 (Join-Path $taskEvidence 'launch.json')
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ('-NoProfile -File "' + $root + '\qa\wire-sample-process.ps1" -OutputDirectory "' + $taskEvidence + '"') -WorkingDirectory $root
$principal = New-ScheduledTaskPrincipal -UserId 'sook' -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 3) -MultipleInstances IgnoreNew
$task = Register-ScheduledTask -TaskName $TaskName -Action $action -Principal $principal -Settings $settings
if ($task.Principal.LogonType -ne 'Interactive') { throw 'Task principal is not Interactive.' }
if ((Get-ScheduledTask -TaskName $TaskName).Principal.LogonType -ne 'Interactive') { throw 'Registered task is not Interactive.' }
Start-ScheduledTask -TaskName $TaskName
Write-Output "TASK_STARTED $TaskName MODE=sample RUN_ID=$RunId OUTPUT=$OutputDirectory SESSION=1 INTERACTIVE USER=sook MECHANISM=TaskScheduler-Interactive GPU_CRASH_VETO=ON"
