$ErrorActionPreference = 'Stop'
$process = Get-CimInstance Win32_Process -Filter 'ProcessId=31076'
if (-not $process) { throw 'Recorded test process is absent; no termination performed' }
$started = [DateTimeOffset]$process.CreationDate
if ($process.ParentProcessId -ne 19520 -or $process.Name -ne 'bun.exe' -or
    $process.CommandLine.Trim() -ne 'bun  test test/wire-library.test.js' -or
    $started.ToUnixTimeMilliseconds() -ne 1791412507463) {
  throw 'Recorded process identity does not match; no termination performed'
}
Write-Output "STOP_OWNED_TEST PID=31076 PARENT=19520 START_MS=1791412507463"
Stop-Process -Id 31076 -ErrorAction Stop
Write-Output 'STOP_OWNED_TEST_SENT'
