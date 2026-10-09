$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/timing-settings'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath 'src/timing.js', 'src/settings.js', 'test/timing.test.js', 'test/settings.test.js', 'spec/fixtures/timing-input.json', 'spec/fixtures/timing-expected.json' |
  Select-Object Path, Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.json')
cmd /c "bun test test/timing.test.js test/settings.test.js > evidence\timing-settings\tests.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii (Join-Path $receiptDir 'tests.exit')
Write-Output "TAG=TIMING_SETTINGS EXIT=$code"
exit $code
