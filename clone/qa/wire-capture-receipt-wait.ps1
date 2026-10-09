param([Parameter(Mandatory=$true)][string]$RunId)
$ErrorActionPreference = 'Stop'
$receipt = "C:\Users\sook\clone-boundary-01a1154f\evidence\wire-gpu-console-capture-$RunId\process.exit"
$deadline = [DateTime]::UtcNow.AddMinutes(2)
while (-not (Test-Path $receipt)) {
  if ([DateTime]::UtcNow -gt $deadline) { throw 'Capture process receipt did not arrive within two minutes' }
  Start-Sleep -Milliseconds 500
}
Write-Output 'CAPTURE_RECEIPT_READY'
