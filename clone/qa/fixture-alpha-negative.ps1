$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
cmd /c "node spec/verify-fixture-freeze-negative.mjs alpha-rescale.json > evidence\fixture-alpha\negative.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/fixture-alpha/negative.exit'
Write-Output "TAG=ALPHA_NEGATIVE EXIT=$code"
exit $code
