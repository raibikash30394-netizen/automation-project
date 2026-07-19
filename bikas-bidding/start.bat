@echo off
REM ---------------------------------------------------------------------------
REM start.bat -- One-click Windows launcher for local testing
REM
REM Opens TWO cmd windows:
REM   1) Captcha solver (bidding.js) on port 3000
REM   2) Bid engine (bid-engine.js) with v3.30 EARLY DROP enabled
REM
REM Use this for LOCAL Windows testing BEFORE deploying to AWS Mumbai via PM2.
REM Kill both with stop.bat (or close the terminal windows).
REM ---------------------------------------------------------------------------
setlocal
REM Enable UTF-8 codepage so pino-pretty emojis (rocket, target) render.
chcp 65001 >nul
cd /d "%~dp0"

REM ---- Sanity checks -------------------------------------------------------
if not exist "node_modules" (
    echo [ERROR] node_modules missing. Run setup.bat first.
    pause
    exit /b 1
)
if not exist "cookie.txt" (
    echo [ERROR] cookie.txt missing. Copy from cookie.txt.example and paste your SAP browser cookie.
    pause
    exit /b 1
)
if not exist ".env" (
    echo [ERROR] .env missing. Run setup.bat first.
    pause
    exit /b 1
)

REM ---- Cookie freshness warning -------------------------------------------
for %%F in (cookie.txt) do set COOKIE_AGE=%%~aF
echo.
echo ================================================================
echo   Bikas Bidding v3.30 -- Windows local test launcher
echo ================================================================
echo.
echo   EARLY_DROP_MS: (check .env, default 500ms)
findstr /R "^EARLY_DROP_MS" .env
echo.
echo   REMINDER: If cookie.txt is ^>6 hours old, SAP will 403 you.
echo   Refresh from a fresh browser login BEFORE the next :15/:45 window.
echo.
echo ================================================================
echo.

REM ---- CRITICAL: Sync Windows clock so EARLY_DROP timing is accurate ------
REM v3.30 fires at boundary - EARLY_DROP_MS (default 500ms). If Windows clock
REM is drifted >100ms from real time, the fire will miss the boundary.
REM Requires admin OR the W32Time service running (default on Win10/11).
echo Syncing Windows clock ^(needed for accurate EARLY_DROP timing^)...
w32tm /resync /force >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Windows time resynced
) else (
    echo   [WARN] w32tm resync failed. Run cmd as Admin ONCE:
    echo          net start w32time ^&^& w32tm /config /update /manualpeerlist:"time.google.com,time.windows.com" /syncfromflags:manual
    echo          w32tm /resync
    echo   Without accurate clock, EARLY_DROP_MS timing may drift 1-2 seconds.
)
echo.
timeout /t 3 >nul

REM ---- Launch captcha solver in NEW window ---------------------------------
echo [1/2] Starting captcha solver (bidding.js) in a new window...
start "Bikas Captcha Solver" cmd /k "chcp 65001 >nul && cd /d %~dp0 && node bidding.js"

REM Give bidding.js ~2s to bind port 3000 before bid-engine tries to reach it
timeout /t 2 >nul

REM ---- Launch bid engine in NEW window -------------------------------------
echo [2/2] Starting bid engine (bid-engine.js v3.30 EARLY DROP) in a new window...
start "Bikas Bid Engine" cmd /k "chcp 65001 >nul && cd /d %~dp0 && node bid-engine.js"

echo.
echo ================================================================
echo   Both processes launched in separate windows.
echo   Watch the "Bikas Bid Engine" window for:
echo     * 'EARLY-DROP CSRF refresh' log ~1s before :15/:45
echo     * 'EARLY-DROP FIRE' log ~500ms before :15/:45
echo     * BiddingRank in the response JSON
echo.
echo   To stop:   run stop.bat  (or close both terminal windows)
echo   To retest: run test.bat  (unit tests only, no SAP calls)
echo ================================================================
echo.
endlocal
exit /b 0
