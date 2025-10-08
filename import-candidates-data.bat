@echo off
echo =============================================
echo Importing Sample Candidates Data
echo =============================================

REM Set SQL Server connection details
set SERVER=localhost
set DATABASE=HRManagementDB
set USERNAME=SA
set PASSWORD=Hung@2752025

echo.
echo Connecting to SQL Server...
echo Server: %SERVER%
echo Database: %DATABASE%
echo.

REM Import the sample data
sqlcmd -S %SERVER% -d %DATABASE% -U %USERNAME% -P %PASSWORD% -i "database\sample-candidates-data.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =============================================
    echo SUCCESS: Sample candidates data imported!
    echo =============================================
    echo.
    echo Data imported:
    echo - 5 Users (Admin, HR, Recruiters, Interviewers)
    echo - 5 Job Postings (IT, Marketing, Analytics, Design)
    echo - 15 Candidates (Various positions and statuses)
    echo - 7 Interviews (Completed and scheduled)
    echo - 2 Employees (Hired candidates)
    echo.
    echo You can now view the data in your HR Management System!
) else (
    echo.
    echo =============================================
    echo ERROR: Failed to import data!
    echo =============================================
    echo.
    echo Please check:
    echo 1. SQL Server is running
    echo 2. Database exists
    echo 3. Connection details are correct
    echo 4. User has proper permissions
)

echo.
pause

