@echo off
echo Starting HR Management Frontend...
cd /d "%~dp0frontend"
call npm install
call npm run dev
pause
