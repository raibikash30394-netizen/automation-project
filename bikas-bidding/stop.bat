@echo off
REM ---------------------------------------------------------------------------
REM stop.bat -- Kills all Bikas Bidding node processes on Windows.
REM
REM Uses `taskkill` to target node.exe windows whose title matches the ones
REM start.bat opened ("Bikas Captcha Solver" and "Bikas Bid Engine"). Falls
REM back to killing ALL node.exe if the title match finds nothing (e.g. user
REM launched manually).
REM ---------------------------------------------------------------------------
setlocal

echo Killing Bikas Bidding node processes...

REM Try to kill by window title first (safer -- won't kill unrelated node processes).
taskkill /FI "WINDOWTITLE eq Bikas Captcha Solver*" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq Bikas Bid Engine*"     /T /F >nul 2>nul

REM Also kill any node.exe listening on ports 3000 (captcha) -- for the case
REM where user ran `node bidding.js` from a plain terminal without start.bat.
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    if not "%%P"=="0" (
        echo   killing PID %%P ^(port 3000^)
        taskkill /PID %%P /F >nul 2>nul
    )
)

echo Done.
endlocal
exit /b 0
