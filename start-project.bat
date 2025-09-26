@echo off
echo Starting Hospital Equipment Tracker...

echo.
echo Step 1: Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Starting server...
cd ..\server
start "Server" cmd /k "npm start"

echo.
echo Step 4: Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 5: Starting client...
cd ..\client
start "Client" cmd /k "npm start"

echo.
echo ✅ Hospital Equipment Tracker is starting!
echo.
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
