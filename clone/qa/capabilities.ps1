$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/capabilities'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
cmd /c "bun install --frozen-lockfile > evidence\capabilities\install.log 2>&1"
$installExit = $LASTEXITCODE
$installExit | Out-File -Encoding ascii (Join-Path $receiptDir 'install.exit')
if ($installExit -ne 0) { exit $installExit }
cmd /c "bun node_modules/electron/install.js > evidence\capabilities\electron-install.log 2>&1"
$electronExit = $LASTEXITCODE
$electronExit | Out-File -Encoding ascii (Join-Path $receiptDir 'electron-install.exit')
if ($electronExit -ne 0) { exit $electronExit }
cmd /c "bun run qa -- --case capabilities --out evidence/capabilities > evidence\capabilities\run.log 2>&1"
$runExit = $LASTEXITCODE
$runExit | Out-File -Encoding ascii (Join-Path $receiptDir 'run.exit')
Write-Output "TAG=CAPABILITIES EXIT=$runExit"
exit $runExit
