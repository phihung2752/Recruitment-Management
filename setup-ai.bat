@echo off
echo ========================================
echo    HR Management System - AI Setup
echo ========================================
echo.

echo Checking if Gemini API key is configured...
findstr /C:"YOUR_GEMINI_API_KEY_HERE" backend\appsettings.json >nul
if %errorlevel%==0 (
    echo.
    echo ⚠️  WARNING: Gemini API key not configured!
    echo.
    echo Please follow these steps:
    echo 1. Go to https://makersuite.google.com/app/apikey
    echo 2. Create a new API key
    echo 3. Open backend\appsettings.json
    echo 4. Replace "YOUR_GEMINI_API_KEY_HERE" with your actual API key
    echo.
    echo AI features will not work without a valid API key.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Gemini API key is configured!
)

echo.
echo Testing AI connection...
cd backend
dotnet run --urls="https://localhost:7001" --test-ai
if %errorlevel%==0 (
    echo ✅ AI integration is working!
) else (
    echo ❌ AI integration failed. Please check your API key.
)

echo.
echo AI setup complete!
pause
