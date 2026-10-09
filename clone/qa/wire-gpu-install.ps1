$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
& cmd.exe /d /c 'bun install --ignore-scripts > evidence\wire-gpu-install.log 2>&1'
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii evidence/wire-gpu-install.exit
if ($code -ne 0) { exit $code }
& cmd.exe /d /c 'bun node_modules/electron/install.js > evidence\wire-gpu-electron-install.log 2>&1'
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii evidence/wire-gpu-electron-install.exit
Write-Output "TAG=WIRE_GPU_INSTALL EXIT=$code"
exit $code
