@echo off
echo ========================================
echo    HR Management System - Start Project
echo ========================================
echo.

echo [1/4] Checking database connection...
echo Testing SQL Server connection to localhost\SONTIEN...
sqlcmd -S localhost\SONTIEN -E -Q "SELECT @@VERSION" -o "db_test.txt" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to SQL Server instance 'localhost\SONTIEN'
    echo Please ensure SQL Server is running and accessible
    echo.
    echo Alternative connection strings you can try:
    echo - Server=localhost;Database=HRManagementDB_New;Trusted_Connection=True;TrustServerCertificate=True;
    echo - Server=localhost\SQLEXPRESS;Database=HRManagementDB_New;Trusted_Connection=True;TrustServerCertificate=True;
    echo.
    pause
    exit /b 1
)
echo Database connection successful!
del db_test.txt 2>nul

echo.
echo [2/4] Importing database schema...
echo Please run the following SQL files in SQL Server Management Studio:
echo 1. database\fixed-complete-schema.sql
echo 2. database\fixed-vietnamese-sample-data.sql
echo.
echo Or run this command to import automatically:
echo sqlcmd -S localhost\SONTIEN -E -i "database\fixed-complete-schema.sql"
echo sqlcmd -S localhost\SONTIEN -E -i "database\fixed-vietnamese-sample-data.sql"
echo.
pause

echo.
echo [3/4] Starting Backend API...
echo Starting .NET API on https://localhost:7001
start "HR Management API" cmd /k "dotnet run --project . --urls=https://localhost:7001"

echo.
echo [4/4] Starting Frontend...
echo Starting React/Next.js frontend on http://localhost:3000
start "HR Management Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Project started successfully!
echo ========================================
echo.
echo Backend API: https://localhost:7001
echo Frontend: http://localhost:3000
echo Swagger UI: https://localhost:7001
echo.
echo Press any key to close this window...
pause >nul
