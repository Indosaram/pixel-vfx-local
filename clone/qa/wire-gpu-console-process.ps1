param(
  [Parameter(Mandatory=$true)][string]$OutputDirectory,
  [Parameter(Mandatory=$true)][ValidateSet('context','shader','capture')][string]$Mode
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$sessionId = (Get-Process -Id $PID).SessionId
[pscustomobject]@{ sessionId=$sessionId; mode=$Mode; output=$OutputDirectory } |
  ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $OutputDirectory 'session.json')
if ($sessionId -ne 1) { throw "Expected console session 1, got $sessionId" }
$env:ELECTRON_RUN_AS_NODE = $null
$probe = if ($Mode -eq 'shader') { 'shaders' } else { $Mode }
$process = Start-Process -FilePath (Join-Path $root 'node_modules\electron\dist\electron.exe') -ArgumentList @(
  ('"' + (Join-Path $PSScriptRoot 'wire-gpu.cjs') + '"'),
  ('"' + $OutputDirectory + '"'), ('"' + $root + '"'), $probe
) -RedirectStandardOutput (Join-Path $OutputDirectory 'process.log') -RedirectStandardError (Join-Path $OutputDirectory 'process.stderr.log') -PassThru -Wait
$code = $process.ExitCode
$code | Out-File -Encoding ascii (Join-Path $OutputDirectory 'process.exit')
exit $code
