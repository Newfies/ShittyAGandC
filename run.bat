@echo off
:MENU
echo.
echo ===============================
echo     Choose an option:
echo ===============================
echo     1. Run Generator
echo     2. Run Checker
echo ===============================
set /p option="Enter your choice (1 or 2): "

if "%option%"=="1" (
    echo Running Generator...
    node Generator.js
) else if "%option%"=="2" (
    echo Running Checker...
    node Checker.js
) else (
    echo Invalid choice, please select 1 or 2.
    goto MENU
)

echo.
pause
