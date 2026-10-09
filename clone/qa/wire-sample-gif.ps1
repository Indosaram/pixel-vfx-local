param(
  [Parameter(Mandatory=$true)][string]$OutputDirectory
)
$ErrorActionPreference = 'Stop'
$result = Get-Content -Raw (Join-Path $OutputDirectory 'result.json') | ConvertFrom-Json
$frame = $result.frames[0]
$width = [int]$frame.w
$height = [int]$frame.h
$fps = [int]$result.options.fps
$ffmpeg = (Get-Command ffmpeg).Source
$ffprobe = (Get-Command ffprobe).Source
$gif = Join-Path $OutputDirectory 'sample.gif'
$pattern = Join-Path $OutputDirectory 'frame-%03d.png'
$background = "color=c=0x0d0d12:s=${width}x${height}:r=$fps"
$filter = "[1:v][0:v]overlay=shortest=1,split[a][b];[a]palettegen=stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a"
$args = @('-y', '-v', 'error', '-framerate', "$fps", '-start_number', '0', '-i', $pattern,
  '-f', 'lavfi', '-i', $background, '-filter_complex', $filter, '-loop', '0', $gif)
$process = Start-Process -FilePath $ffmpeg -ArgumentList $args -PassThru -Wait -NoNewWindow
$process.ExitCode | Out-File -Encoding ascii (Join-Path $OutputDirectory 'gif.exit')
if ($process.ExitCode -ne 0) { throw "ffmpeg gif encode failed with exit $($process.ExitCode)" }
$probe = & $ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames,width,height -of default=noprint_wrappers=1 $gif
$probe | Out-File -Encoding utf8 (Join-Path $OutputDirectory 'gif.probe.txt')
$item = Get-Item $gif
Write-Output "GIF=$gif BYTES=$($item.Length)"
Write-Output $probe
