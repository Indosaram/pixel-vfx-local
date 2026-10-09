$ErrorActionPreference = 'Stop'
$root = 'C:/Users/sook/fixture-freeze-01a1154f'
if (Test-Path -LiteralPath (Join-Path $root 'src')) { throw 'Fixture audit staging unexpectedly contains implementation source' }
if (Test-Path -LiteralPath (Join-Path $root 'test')) { throw 'Fixture audit staging unexpectedly contains implementation tests' }
New-Item -ItemType Directory -Force -Path (Join-Path $root 'spec/fixtures'), (Join-Path $root 'qa') | Out-Null
Write-Output 'FIXTURE_STAGE_READY'
