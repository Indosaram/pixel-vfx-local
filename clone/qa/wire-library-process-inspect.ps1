$ErrorActionPreference = 'Stop'
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like '*wire-library*' -and $_.CommandLine -notlike '*process-inspect*' } |
  Select-Object ProcessId,ParentProcessId,CreationDate,Name,CommandLine |
  ConvertTo-Json -Depth 3
