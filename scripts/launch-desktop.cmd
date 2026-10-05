@echo off
rem Desktop shell entry for Pixel VFX: starts the token-gated local server,
rem then opens a chrome/edge app window pointed at it with the session token.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch-desktop.ps1" %*
