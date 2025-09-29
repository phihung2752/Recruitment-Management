@echo off
echo ========================================
echo    HR Management System - Import Database
echo ========================================
echo.

echo This script will import the database schema and sample data
echo to SQL Server instance: localhost\SONTIEN
echo Database: HRManagementDB_New
echo.

set /p confirm="Do you want to continue? (y/n): "
if /i "%confirm%" neq "y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo [1/3] Creating database...
sqlcmd -S localhost\SONTIEN -E -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'HRManagementDB_New') CREATE DATABASE HRManagementDB_New;"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)
echo Database created successfully!

echo.
echo [2/3] Importing schema...
sqlcmd -S localhost\SONTIEN -E -d HRManagementDB_New -i "database\fixed-complete-schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to import schema
    echo Please check the SQL file for syntax errors
    pause
    exit /b 1
)
echo Schema imported successfully!

echo.
echo [3/3] Importing sample data...
sqlcmd -S localhost\SONTIEN -E -d HRManagementDB_New -i "database\fixed-vietnamese-sample-data.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to import sample data
    echo Please check the SQL file for syntax errors
    pause
    exit /b 1
)
echo Sample data imported successfully!

echo.
echo ========================================
echo    Database import completed!
echo ========================================
echo.
echo Database: HRManagementDB_New
echo Tables created: Users, Companies, Departments, Employees, etc.
echo Sample data: Vietnamese companies, employees, candidates
echo.
echo You can now run the application using: start-project.bat
echo.
pause
