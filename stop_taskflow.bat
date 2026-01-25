@echo off
echo Stopping TaskFlow processes...

echo Killing dotnet processes (Backend)...
taskkill /IM dotnet.exe /F

echo Killing node processes (Frontend)...
taskkill /IM node.exe /F

echo ====================================================
echo TaskFlow has been stopped.
echo ====================================================
pause
