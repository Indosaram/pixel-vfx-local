$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receipt = 'evidence/fixture-alpha'
New-Item -ItemType Directory -Force $receipt | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath 'spec/verify-fixture-freeze.mjs' | Select-Object Path,Hash | ConvertTo-Json | Out-File -Encoding utf8 "$receipt/verifier.json"
cmd /c "node spec/verify-fixture-freeze.mjs > evidence\fixture-alpha\audit.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii "$receipt/audit.exit"
Write-Output "TAG=ALPHA_AUDIT EXIT=$code"
exit $code
