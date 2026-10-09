$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
if ((Test-Path 'src') -or (Test-Path 'test')) { throw 'Source-free staging required' }
$receipt = 'evidence/fixture-scope'
New-Item -ItemType Directory -Force $receipt | Out-Null
Get-FileHash -Algorithm SHA256 'spec/verify-fixture-scope.mjs' | Select-Object Path,Hash |
  ConvertTo-Json | Out-File -Encoding utf8 "$receipt/verifier.json"
cmd /c "node spec/verify-fixture-scope.mjs > evidence\fixture-scope\audit.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii "$receipt/audit.exit"
Write-Output "TAG=FIXTURE_SCOPE EXIT=$code"
exit $code
