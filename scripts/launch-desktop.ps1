param(
  [int]$Port = 8765,
  [switch]$NoWindow
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$TokenFile = Join-Path $Root ".token"
if (Test-Path $TokenFile) { Remove-Item $TokenFile -Force }

$server = Start-Process -FilePath "python" -ArgumentList @(
  (Join-Path $Root "scripts\serve.py"), "--port", "$Port"
) -PassThru -WindowStyle Minimized

$deadline = (Get-Date).AddSeconds(15)
while ((Get-Date) -lt $deadline -and -not (Test-Path $TokenFile)) {
  Start-Sleep -Milliseconds 200
}
if (-not (Test-Path $TokenFile)) {
  Write-Error "serve.py did not write .token within 15s (server pid $($server.Id))"
  exit 1
}
$Token = (Get-Content -Raw $TokenFile).Trim()
$Url = "http://127.0.0.1:$Port/?t=$Token"

$candidates = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$browser = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { $browser = (Get-Command chrome -ErrorAction SilentlyContinue).Source }
if (-not $browser) { $browser = (Get-Command msedge -ErrorAction SilentlyContinue).Source }
if (-not $browser) {
  Write-Error "no chrome/edge found; server running at $Url"
  exit 1
}

if ($NoWindow) {
  Write-Output $Url
} else {
  Start-Process -FilePath $browser -ArgumentList @("--app=$Url")
  Write-Output "desktop window launched: $Url"
}
Write-Output "server pid: $($server.Id) (stop it from Task Manager when done)"
