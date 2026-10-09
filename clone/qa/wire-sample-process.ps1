param(
  [Parameter(Mandatory=$true)][string]$OutputDirectory
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$sessionId = (Get-Process -Id $PID).SessionId
[pscustomobject]@{ sessionId=$sessionId; mode='sample'; output=$OutputDirectory } |
  ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $OutputDirectory 'session.json')
if ($sessionId -ne 1) { throw "Expected console session 1, got $sessionId" }
$env:ELECTRON_RUN_AS_NODE = $null
$process = Start-Process -FilePath (Join-Path $root 'node_modules\electron\dist\electron.exe') -ArgumentList @(
  ('"' + (Join-Path $PSScriptRoot 'wire-sample.cjs') + '"'),
  ('"' + $OutputDirectory + '"'), ('"' + $root + '"')
) -RedirectStandardOutput (Join-Path $OutputDirectory 'process.log') -RedirectStandardError (Join-Path $OutputDirectory 'process.stderr.log') -PassThru -Wait
$code = $process.ExitCode
$code | Out-File -Encoding ascii (Join-Path $OutputDirectory 'process.exit')
exit $code
