@echo off
setlocal

cd /d "%~dp0"

set "PORT=48317"
for /f "usebackq delims=" %%P in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$port=48317; while(Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue){ $port++ }; $port"`) do set "PORT=%%P"
set "ATTENTIONOS_STORE_PATH=%~dp0data\attentionos-store.json"
set "ATTENTIONOS_MAX_BODY_BYTES=131072"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo ERROR: Node.js was not found on PATH.
  echo Install Node.js, then run this file again.
  echo.
  pause
  exit /b 1
)

echo.
echo Starting AttentionOS...
echo Project: %~dp0
echo URL: http://127.0.0.1:%PORT%
echo Store: %ATTENTIONOS_STORE_PATH%
echo.

start "" /min powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Milliseconds 900; Start-Process 'http://127.0.0.1:%PORT%'"
node server.mjs

echo.
echo AttentionOS stopped.
pause
