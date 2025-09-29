@echo off
echo Starting HR Management System...
echo.
echo Starting Backend...
start "Backend" cmd /k "cd /d %~dp0 && dotnet restore && dotnet run"
timeout /t 5
echo Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"
echo.
echo Both services are starting...
echo Backend: https://localhost:7001
echo Frontend: http://localhost:3000
echo Login: admin@gmail.com / 123456
pause
