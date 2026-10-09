$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$receiptDir = Join-Path (Get-Location) 'evidence/u01-u02'
New-Item -ItemType Directory -Force -Path $receiptDir | Out-Null
Write-Output "CWD=$((Get-Location).Path)"
$inputs = @('src/library.js', 'src/settings.js', 'src/curves.js', 'test/library.test.js', 'test/settings.test.js', 'test/curves-rng.test.js')
$hashes = foreach ($inputPath in $inputs) {
  $hash = Get-FileHash -Algorithm SHA256 -LiteralPath $inputPath
  "$($hash.Hash.ToLower())  $inputPath"
}
$hashes | Out-File -Encoding utf8 (Join-Path $receiptDir 'inputs.sha256')
cmd /c "bun test test/library.test.js test/settings.test.js test/curves-rng.test.js > evidence\u01-u02\tests.log 2>&1"
$testExit = $LASTEXITCODE
$testExit | Out-File -Encoding ascii (Join-Path $receiptDir 'tests.exit')
Write-Output "TAG=U01_U02 EXIT=$testExit"
exit $testExit
