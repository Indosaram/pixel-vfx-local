$ErrorActionPreference = 'Stop'
$current = Get-Process -Id $PID
[pscustomobject]@{
  ComputerName = $env:COMPUTERNAME
  UserName = $env:USERNAME
  SessionName = $env:SESSIONNAME
  PowerShellSessionId = $current.SessionId
  OS = [Environment]::OSVersion.VersionString
} | ConvertTo-Json
Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion,Status | ConvertTo-Json
& query.exe session
exit $LASTEXITCODE
