$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
New-Item -ItemType Directory -Force 'spec/fixtures' | Out-Null
Write-Output 'TAG=WIRE_FIXTURE_STAGE_READY'
