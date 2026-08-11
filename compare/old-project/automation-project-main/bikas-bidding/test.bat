@echo off
REM ---------------------------------------------------------------------------
REM test.bat -- Runs the internal unit-test suite (no SAP calls).
REM
REM Safe to run anytime. Verifies the v3.30 EARLY DROP scheduler,
REM window helpers, and 27 other regressions still pass.
REM ---------------------------------------------------------------------------
setlocal
cd /d "%~dp0"

echo.
echo ================================================================
echo   Bikas Bidding v3.30 -- unit test suite (no SAP calls)
echo ================================================================
echo.

node tests\test-window-scheduler.js
set EXITCODE=%ERRORLEVEL%

echo.
if %EXITCODE% EQU 0 (
    echo [PASS] All unit tests green. Safe to start.bat.
) else (
    echo [FAIL] Unit tests broke. DO NOT run start.bat until fixed.
)
echo.
pause
endlocal
exit /b %EXITCODE%
