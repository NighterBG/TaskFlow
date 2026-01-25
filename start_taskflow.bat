@echo off
echo Starting TaskFlow Backend...
start "TaskFlow Backend" /D "TaskFlow.API" dotnet run

echo Starting TaskFlow Frontend...
start "TaskFlow Frontend" /D "TaskFlow.Web" npm run dev

echo ====================================================
echo TaskFlow is starting up!
echo ----------------------------------------------------
echo Backend (Swagger): http://localhost:5202/swagger
echo Frontend (App):    http://localhost:5173
echo.
echo TIP: If the frontend says "Failed to load tasks", make sure
echo this window (Backend) and the other (Frontend) stay open!
echo.
echo ====================================================
echo.
pause
