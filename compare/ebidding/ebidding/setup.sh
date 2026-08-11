#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════
# E-Bidding VM One-Shot Setup
# Ubuntu/Debian VM par: chmod +x setup.sh && ./setup.sh
# ══════════════════════════════════════════════════════════════
set -e

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  E-Bidding 24x7 — VM Setup"
echo "═══════════════════════════════════════════════════════"
echo ""

# 1. Node.js check
if ! command -v node >/dev/null 2>&1; then
  echo "▶ Node.js install kar raha hoon..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "✓ Node.js already installed: $(node -v)"
fi

# 2. yarn + pm2
if ! command -v yarn >/dev/null 2>&1; then
  echo "▶ Yarn install kar raha hoon..."
  sudo npm install -g yarn
fi
if ! command -v pm2 >/dev/null 2>&1; then
  echo "▶ PM2 install kar raha hoon..."
  sudo npm install -g pm2
fi
echo "✓ yarn: $(yarn -v)   pm2: $(pm2 -v)"

# 3. .env check
if [ ! -f .env ]; then
  if [ -f env.example ]; then
    cp env.example .env
    echo ""
    echo "⚠  .env file banayi env.example se."
    echo "⚠  Abhi nano se apne SAP credentials daalo:"
    echo "     nano .env"
    echo ""
    read -p "   Enter dabao jab .env ready ho jaye..."
  else
    echo "✗ env.example bhi missing. Manually .env banao."
    exit 1
  fi
else
  echo "✓ .env file present."
fi

# 4. Dependencies
echo "▶ Node modules install kar raha hoon..."
rm -rf node_modules
yarn install

# 5. logs folder
mkdir -p logs

# 6. Start with PM2
echo "▶ PM2 se start kar raha hoon..."
pm2 delete ebidding >/dev/null 2>&1 || true
pm2 start ecosystem.config.js
pm2 save

# 7. Reboot survival
echo ""
echo "▶ Reboot ke baad auto-start ke liye ye command copy karke chalao"
echo "  (sudo password poochega):"
echo ""
pm2 startup | tail -1
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✓ SETUP COMPLETE"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Live logs:      pm2 logs ebidding"
echo "  Status:         pm2 status"
echo "  Restart:        pm2 restart ebidding"
echo "  CSV edit:       nano files/input2.csv   (auto-reload!)"
echo ""
