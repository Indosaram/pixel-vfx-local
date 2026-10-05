@echo off
setlocal
cd /d "%~dp0"
echo Pixel VFX Local - starting local server on http://127.0.0.1:8123/
start "" "http://127.0.0.1:8123/"
python -m http.server 8123 --bind 127.0.0.1
