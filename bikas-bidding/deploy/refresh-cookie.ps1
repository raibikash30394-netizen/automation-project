# refresh-cookie.ps1 — Upload fresh cookie.txt to AWS server + restart bot
#
# One-shot script to run from Windows PC after refreshing SAP cookie.
#
# Usage:
#   1) Edit SAP browser session, copy Cookie header
#   2) Paste into local .\cookie.txt
#   3) Run: .\deploy\refresh-cookie.ps1
#
# Edit the CONFIG section below with YOUR key path + server IP.

# ============== CONFIG (edit these once) ==================================
$KeyPath   = "$HOME\Downloads\bikas-bidding-key.pem"
$ServerIP  = "13.234.XX.XX"                             # <-- your Elastic IP
$ServerUser= "ubuntu"
$RemoteDir = "/home/ubuntu/bikas-bidding"
# ==========================================================================

$LocalCookie = Join-Path (Get-Location) "cookie.txt"

if (-not (Test-Path $LocalCookie)) {
    Write-Host "ERROR: cookie.txt not found in current directory." -ForegroundColor Red
    Write-Host "       Paste your fresh SAP cookie into .\cookie.txt first." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $KeyPath)) {
    Write-Host "ERROR: SSH key not found at: $KeyPath" -ForegroundColor Red
    Write-Host "       Edit \$KeyPath at the top of this script." -ForegroundColor Yellow
    exit 1
}

Write-Host ">>> Uploading fresh cookie.txt to $ServerIP..." -ForegroundColor Cyan
scp -i $KeyPath $LocalCookie "${ServerUser}@${ServerIP}:${RemoteDir}/cookie.txt"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: SCP upload failed." -ForegroundColor Red
    exit 1
}

Write-Host ">>> Deleting stale CSRF token on server..." -ForegroundColor Cyan
ssh -i $KeyPath "${ServerUser}@${ServerIP}" "cd $RemoteDir && rm -f token.txt"

Write-Host ">>> Restarting bikas-bid-engine on server..." -ForegroundColor Cyan
ssh -i $KeyPath "${ServerUser}@${ServerIP}" "pm2 restart bikas-bid-engine"

Write-Host ""
Write-Host "✓ Cookie refreshed and bot restarted." -ForegroundColor Green
Write-Host ""
Write-Host "Tail live logs with:" -ForegroundColor Yellow
Write-Host "  ssh -i $KeyPath ${ServerUser}@${ServerIP} 'pm2 logs bikas-bid-engine --lines 30'"
