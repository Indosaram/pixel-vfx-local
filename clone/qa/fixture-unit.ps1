param(
  [Parameter(Mandatory=$true)]
  [ValidateSet('timing', 'sheet-layout', 'rng-trace', 'sampling', 'median')]
  [string]$Unit
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
if ((Test-Path 'src') -or (Test-Path 'test')) {
  throw 'Independent audit staging must exclude implementation source and tests'
}
$script = switch ($Unit) {
  'timing' { 'verify-timing-fixture.mjs' }
  'sheet-layout' { 'verify-sheet-layout-fixture.mjs' }
  'rng-trace' { 'verify-rng-trace-fixture.mjs' }
  'sampling' { 'verify-sampling-fixture.mjs' }
  'median' { 'verify-median-fixture.mjs' }
}
$selectors = switch ($Unit) {
  'timing' { @('timing-input.json', 'timing-expected.json') }
  'sheet-layout' { @('sheet-layout.json') }
  'rng-trace' { @('shared-rng-trace.json') }
  'sampling' { @('pixel-sampling.json') }
  'median' { @('median-cut.json') }
}
$receipt = "evidence/fixture-$Unit"
New-Item -ItemType Directory -Force $receipt | Out-Null
$inputs = @("spec/$script", 'spec/verify-fixture-freeze-negative.mjs', 'qa/fixture-unit.ps1') + @(
  Get-ChildItem 'spec/fixtures' -Filter '*.json' -File | ForEach-Object { $_.FullName }
)
if ($Unit -eq 'timing') { $inputs += 'spec/timing-independent-oracle.json' }
Get-FileHash -Algorithm SHA256 -LiteralPath $inputs | Select-Object Path,Hash |
  ConvertTo-Json | Out-File -Encoding utf8 "$receipt/inputs.json"
cmd /c "node spec/$script > $receipt/audit.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii "$receipt/audit.exit"
if ($code -ne 0) { exit $code }
foreach ($selector in $selectors) {
  cmd /c "node spec/verify-fixture-freeze-negative.mjs $selector > $receipt/$selector.negative.log 2>&1"
  $code = $LASTEXITCODE
  $code | Out-File -Encoding ascii "$receipt/$selector.negative.exit"
  if ($code -ne 0) { exit $code }
}
Write-Output "TAG=FIXTURE_UNIT UNIT=$Unit EXIT=0"
