$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$inputs = @('src/library.js', 'src/curves.js', 'src/emitter.js', 'test/library.test.js', 'test/definition-boundary.test.js', 'test/curves-rng.test.js', 'test/emission.test.js', 'qa/u01-u02-boundary.ps1')
Get-FileHash -Algorithm SHA256 -LiteralPath $inputs | Select-Object Path,Hash |
  ConvertTo-Json | Out-File -Encoding utf8 'evidence/inputs.json'
cmd /c "bun test test/library.test.js test/definition-boundary.test.js test/curves-rng.test.js test/emission.test.js > evidence\tests.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii 'evidence/tests.exit'
Write-Output "TAG=BOUNDARY_TESTS EXIT=$code"
exit $code
