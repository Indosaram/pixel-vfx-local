$ErrorActionPreference = 'Stop'
$root = 'C:/Users/sook/clone-boundary-01a1154f'
if (Test-Path -LiteralPath $root) { throw 'Dedicated boundary staging already exists; inspect before reuse' }
New-Item -ItemType Directory -Path "$root/src", "$root/test", "$root/qa", "$root/evidence" | Out-Null
Write-Output 'TAG=BOUNDARY_STAGE_READY'
