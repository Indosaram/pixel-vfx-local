
param(
  [string]$EffectId = 'Hit_01_Fire',
  [int]$Size = 64,
  [string]$OutFile = 'C:\Users\sook\pixel-vfx-local\clone\out\Hit_01_Fire_WIN_64.gif'
)
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\sook\pixel-vfx-local\clone'
Set-Location $root

$taskName = "PixelRenderStandalone"
# 기존 태스크 삭제
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$exe = 'C:\Users\sook\clone-boundary-01a1154f\node_modules\electron\dist\electron.exe'
$runner = Join-Path $root 'electron-runner.cjs'
$argList = "`"$runner`" $EffectId $Size `"$OutFile`""

$action = New-ScheduledTaskAction -Execute $exe -Argument $argList -WorkingDirectory $root
$principal = New-ScheduledTaskPrincipal -UserId 'sook' -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 2)

$task = Register-ScheduledTask -TaskName $taskName -Action $action -Principal $principal -Settings $settings
Start-ScheduledTask -TaskName $taskName
Write-Output "Task started: $taskName"

# 최대 30초 대기하면서 파일 생성 확인
$sw = [System.Diagnostics.Stopwatch]::StartNew()
while ($sw.Elapsed.TotalSeconds -lt 30) {
  if (Test-Path $OutFile) {
    $item = Get-Item $OutFile
    Write-Output "SUCCESS: Created $OutFile ($($item.Length) bytes) in $($sw.Elapsed.TotalSeconds)s"
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    exit 0
  }
  Start-Sleep -Seconds 1
}

Write-Error "TIMEOUT: File $OutFile not created within 30s"
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
exit 1
