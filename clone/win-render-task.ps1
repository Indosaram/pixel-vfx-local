param(
  [string]$EffectId = 'Original Burst',
  [int]$Size = 64,
  [string]$OutFile = ''
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not $OutFile) { $OutFile = Join-Path $PSScriptRoot 'out/sample.gif' }
# Run directly in the caller's interactive session. No global scheduled task,
# machine-specific user, or existence-only success check.
& node (Join-Path $PSScriptRoot 'render-standalone.mjs') $EffectId $Size $OutFile
exit $LASTEXITCODE
