$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/cleanup-review'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath 'src/pixel.js', 'test/cleanup.test.js', 'test/pixel.test.js', 'spec/fixtures/p01-input.json', 'spec/fixtures/p01-expected.json' |
  Select-Object Path, Hash | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.json')
cmd /c "bun test test/cleanup.test.js test/pixel.test.js > evidence\cleanup-review\tests.log 2>&1"
$code = $LASTEXITCODE
$code | Out-File -Encoding ascii (Join-Path $receiptDir 'tests.exit')
Write-Output "TAG=CLEANUP EXIT=$code"
exit $code
