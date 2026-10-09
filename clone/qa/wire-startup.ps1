$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
Get-FileHash -Algorithm SHA256 'src/wire-startup.js','test/wire-startup.test.js','test/wire-startup.differential.test.js','qa/wire-startup.ps1' |
  Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 'evidence/wire-startup-inputs.json'
cmd.exe /d /c 'bun test test/wire-startup.test.js test/wire-startup.differential.test.js > evidence\wire-startup-diff.log 2>&1'
$code = $LASTEXITCODE
 $code | Out-File -Encoding ascii 'evidence/wire-startup-diff.exit'
Write-Output "TAG=WIRE_STARTUP_DIFF EXIT=$code"
exit $code
