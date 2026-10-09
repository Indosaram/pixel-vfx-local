$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
cmd /c "node spec/verify-fixture-freeze-negative.mjs unknown-fixture.json > evidence\fixture-alpha\selector.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/fixture-alpha/selector.exit'
if ($code -ne 1) { throw "Invalid selector unexpectedly exited $code" }
Write-Output 'TAG=INVALID_SELECTOR_REJECTED EXIT=1'
