$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
if ((Test-Path -LiteralPath 'src') -or (Test-Path -LiteralPath 'test')) {
  throw 'Independent fixture audit must not have implementation source or tests in staging'
}
$fixtures = @(Get-ChildItem -LiteralPath 'spec/fixtures' -Filter '*.json' -File | Sort-Object Name)
if ($fixtures.Count -ne 16) { throw "Expected 16 fixture files, found $($fixtures.Count)" }
$receiptDir = Join-Path (Get-Location) 'evidence/fixture-freeze'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
$inputs = @('spec/verify-fixture-freeze.mjs', 'spec/verify-timing-fixture.mjs', 'spec/verify-sampling-fixture.mjs', 'spec/verify-median-fixture.mjs', 'spec/verify-rng-trace-fixture.mjs', 'spec/verify-fixture-scope.mjs', 'spec/verify-sheet-layout-fixture.mjs', 'spec/verify-fixture-freeze-negative.mjs', 'qa/fixture-freeze.ps1') + @($fixtures | ForEach-Object { $_.FullName })
$inputs += 'spec/timing-independent-oracle.json'
Get-FileHash -Algorithm SHA256 -LiteralPath $inputs |
  Select-Object Path, Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.json')
cmd /c "node spec/verify-fixture-freeze.mjs > evidence\fixture-freeze\audit.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii (Join-Path $receiptDir 'audit.exit')
Write-Output "TAG=FIXTURE_FREEZE EXIT=$code"
if ($code -ne 0) { exit $code }
cmd /c "node spec/verify-timing-fixture.mjs > evidence\fixture-freeze\timing.log 2>&1"
$timingCode = $LASTEXITCODE
$timingCode | Out-File -Encoding ascii (Join-Path $receiptDir 'timing.exit')
Write-Output "TAG=FIXTURE_TIMING EXIT=$timingCode"
if ($timingCode -ne 0) { exit $timingCode }
foreach ($unit in @('sampling', 'median', 'rng-trace')) {
  cmd /c "node spec/verify-$unit-fixture.mjs > evidence\fixture-freeze\$unit.log 2>&1"
  $unitCode = $LASTEXITCODE
  $unitCode | Out-File -Encoding ascii (Join-Path $receiptDir "$unit.exit")
  Write-Output "TAG=FIXTURE_ARITHMETIC UNIT=$unit EXIT=$unitCode"
  if ($unitCode -ne 0) { exit $unitCode }
}
cmd /c "node spec/verify-fixture-scope.mjs > evidence\fixture-freeze\scope.log 2>&1"
$scopeCode = $LASTEXITCODE
$scopeCode | Out-File -Encoding ascii (Join-Path $receiptDir 'scope.exit')
if ($scopeCode -ne 0) { exit $scopeCode }
cmd /c "node spec/verify-sheet-layout-fixture.mjs > evidence\fixture-freeze\sheet-layout.log 2>&1"
$layoutCode = $LASTEXITCODE
$layoutCode | Out-File -Encoding ascii (Join-Path $receiptDir 'sheet-layout.exit')
Write-Output "TAG=FIXTURE_SHEET_LAYOUT EXIT=$layoutCode"
if ($layoutCode -ne 0) { exit $layoutCode }
cmd /c "node spec/verify-fixture-freeze-negative.mjs > evidence\fixture-freeze\negative.log 2>&1"
$negativeCode = $LASTEXITCODE
$negativeCode | Out-File -Encoding ascii (Join-Path $receiptDir 'negative.exit')
Write-Output "TAG=FIXTURE_NEGATIVE EXIT=$negativeCode"
exit $negativeCode
