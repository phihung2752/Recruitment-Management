@echo off
echo Starting HR Management Backend...
cd /d "%~dp0"
dotnet restore
dotnet run
pause
