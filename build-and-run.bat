@echo off
echo ================================================
echo Building and Running TaskFlow (Single Port)
echo ================================================
echo.

echo [1/4] Building React Frontend...
cd TaskFlow.Web
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Copying built files to backend wwwroot...
if not exist "..\TaskFlow.API\wwwroot" mkdir "..\TaskFlow.API\wwwroot"
xcopy /E /I /Y dist\* ..\TaskFlow.API\wwwroot\
if errorlevel 1 (
    echo ERROR: Failed to copy files!
    pause
    exit /b 1
)

echo.
echo [3/4] Starting backend (which will serve both API and Frontend)...
cd ..\TaskFlow.API
echo.
echo ================================================
echo TaskFlow is running on: http://localhost:5202
echo ================================================
echo.
echo Ready for ngrok! Run: ngrok http 5202
echo.
dotnet run

pause
