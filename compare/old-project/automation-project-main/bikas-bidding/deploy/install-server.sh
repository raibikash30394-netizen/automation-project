#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# deploy/install-server.sh — One-shot Ubuntu 22.04/24.04 bootstrap for
# Bikas Bidding v2 on AWS EC2 (Mumbai / ap-south-1).
#
# Idempotent: safe to run multiple times. Skips already-installed steps.
#
# Usage:
#     cd ~/bikas-bidding && bash deploy/install-server.sh
# ---------------------------------------------------------------------------
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"
echo "=========================================================================="
echo " Bikas Bidding v2 — AWS Mumbai server bootstrap"
echo " App dir : $APP_DIR"
echo " User    : $(whoami)"
echo " Time    : $(date)"
echo "=========================================================================="

# ---- 1) System deps -------------------------------------------------------
echo ""
echo "[1/7] Installing system packages (Node.js 20, Tesseract, build tools)..."
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v)" != v20* ]]; then
    curl -fsSL https://raw.githubusercontent.com/nodesource/distributions/master/deb/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

sudo apt-get update -qq
sudo apt-get install -y \
    build-essential \
    tesseract-ocr \
    tesseract-ocr-eng \
    git \
    curl \
    ca-certificates \
    net-tools

# Yarn + PM2 as global npm packages
if ! command -v yarn >/dev/null 2>&1; then
    sudo npm install -g yarn
fi
if ! command -v pm2 >/dev/null 2>&1; then
    sudo npm install -g pm2
fi
echo "    Node : $(node -v)"
echo "    Yarn : $(yarn -v)"
echo "    PM2  : $(pm2 -v)"
echo "    tesseract: $(tesseract --version 2>&1 | head -1)"

# ---- 2) Node deps ----------------------------------------------------------
echo ""
echo "[2/7] Installing Node dependencies (yarn install)..."
yarn install --frozen-lockfile

# ---- 3) Seed config files from templates (idempotent) ---------------------
echo ""
echo "[3/7] Seeding config templates -> real files (only if missing)..."
declare -a pairs=(
    ".env.example:.env"
    "creds.json.example:creds.json"
    "cookie.txt.example:cookie.txt"
    "data.json.example:data.json"
    "files/priority.csv.example:files/priority.csv"
)
mkdir -p files
for pair in "${pairs[@]}"; do
    src="${pair%%:*}"
    dst="${pair##*:}"
    if [[ -f "$src" && ! -f "$dst" ]]; then
        cp "$src" "$dst"
        echo "    + created: $dst  (from $src)"
    elif [[ -f "$dst" ]]; then
        echo "    ✓ exists : $dst  (kept)"
    fi
done

# ---- 4) Log dirs ----------------------------------------------------------
echo ""
echo "[4/7] Creating log directories..."
mkdir -p logs/pm2
echo "    Log dir  : $APP_DIR/logs"
echo "    PM2 logs : $APP_DIR/logs/pm2"

# ---- 5) Run unit tests to verify the code compiles ------------------------
echo ""
echo "[5/7] Running internal unit test suite..."
if [[ -f "tests/test-window-scheduler.js" ]]; then
    node tests/test-window-scheduler.js
else
    echo "    (test suite missing — skipping)"
fi

# ---- 6) PM2 startup on boot -----------------------------------------------
echo ""
echo "[6/7] Configuring PM2 to auto-start on server reboot..."
STARTUP_CMD=$(pm2 startup systemd -u "$USER" --hp "$HOME" 2>&1 | grep -E "^sudo env" | head -1 || true)
if [[ -n "$STARTUP_CMD" ]]; then
    echo "    Running: $STARTUP_CMD"
    eval "$STARTUP_CMD"
fi
pm2 save --force >/dev/null 2>&1 || true

# ---- 7) Print next steps --------------------------------------------------
echo ""
echo "[7/7] Bootstrap complete."
echo ""
echo "=========================================================================="
echo " NEXT STEPS"
echo "=========================================================================="
echo ""
echo " 1) Edit these config files (nano/vi):"
echo "      nano .env               # SAP_BASE_URL, VENDOR_ID, PLANT_CODE"
echo "      nano cookie.txt         # paste your SAP browser cookie"
echo "      nano creds.json         # TrueCaptcha USER + APIKEY (fallback OCR)"
echo "      nano files/input2.csv   # bidding rules"
echo "      nano files/delete.csv   # blacklisted customers"
echo "      nano files/priority.csv # COF Order IDs to bid FIRST"
echo ""
echo " 2) Start the bot (both processes):"
echo "      pm2 start ecosystem.config.cjs"
echo "      pm2 status"
echo ""
echo " 3) Watch live logs:"
echo "      pm2 logs bikas-bid-engine"
echo ""
echo " 4) Cookie refresh workflow (from your Windows PC):"
echo "      scp -i key.pem cookie.txt ubuntu@<SERVER_IP>:$APP_DIR/cookie.txt"
echo "      ssh -i key.pem ubuntu@<SERVER_IP> 'pm2 restart bikas-bid-engine'"
echo ""
echo "=========================================================================="
