@echo off
REM ---------------------------------------------------------------------------
REM setup.bat -- Bikas Bidding one-shot bootstrap for Windows
REM
REM Idempotent: safe to run multiple times. For every foo.example file it
REM copies to "foo" ONLY if "foo" doesn't already exist -- so your real
REM creds / cookies / rules are never overwritten.
REM
REM Usage (double-click, or from cmd):
REM     setup.bat
REM ---------------------------------------------------------------------------
setlocal EnableDelayedExpansion

cd /d "%~dp0"
echo ^>^>^> Bikas Bidding -- bootstrap starting in: %cd%

REM Ensure files\ dir exists.
if not exist "files" mkdir "files"

set /a CREATED=0
set /a SKIPPED=0

call :seed ".env.example"                     ".env"
call :seed "creds.json.example"               "creds.json"
call :seed "cookie.txt.example"               "cookie.txt"
call :seed "data.json.example"                "data.json"
call :seed "files\priority.csv.example"       "files\priority.csv"

REM Install Node dependencies if node_modules missing.
if not exist "node_modules" (
    echo ^>^>^> node_modules missing -- running yarn install ^(fallback: npm install^)
    where yarn >nul 2>nul
    if !ERRORLEVEL! EQU 0 (
        call yarn install
    ) else (
        call npm install
    )
) else (
    echo     [OK] node_modules present
)

echo.
echo ^>^>^> Setup complete: !CREATED! file(s) created, !SKIPPED! kept.
echo ^>^>^> NEXT STEPS:
echo      1. Edit  .env             ^(SAP_BASE_URL, VENDOR_ID, PLANT_CODE^)
echo      2. Edit  cookie.txt       ^(paste your SAP browser cookie^)
echo      3. Edit  creds.json       ^(TrueCaptcha USER + APIKEY as fallback^)
echo      4. Edit  files\input2.csv ^(your bidding rules^)
echo      5. Edit  files\delete.csv ^(blacklisted customers^)
echo      6. Edit  files\priority.csv ^(COF Order IDs to bid FIRST^)
echo      7. Start captcha server:  node bidding.js
echo      8. Start bidding engine:  node bid-engine.js
endlocal
exit /b 0

:seed
set "SRC=%~1"
set "DST=%~2"
if not exist "%SRC%" (
    echo     [WARN] missing template: %SRC% ^(skipped^)
    exit /b 0
)
if exist "%DST%" (
    echo     [OK] exists ^(kept^):  %DST%
    set /a SKIPPED+=1
) else (
    copy /Y "%SRC%" "%DST%" >nul
    echo     [+ ] created:        %DST%   ^(copied from %SRC%^)
    set /a CREATED+=1
)
exit /b 0
