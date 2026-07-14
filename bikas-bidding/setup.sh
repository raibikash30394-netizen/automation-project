#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# setup.sh — Bikas Bidding one-shot bootstrap for Linux / macOS
#
# Idempotent: safe to run multiple times. For every foo.example file it
# copies to `foo` ONLY if `foo` doesn't already exist — so your real
# creds / cookies / rules are never overwritten.
#
# Usage:
#     chmod +x setup.sh && ./setup.sh
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")"

echo ">>> Bikas Bidding — bootstrap starting in: $(pwd)"

# Ensure the files/ dir exists (it's git-tracked as an empty dir, but be safe).
mkdir -p files

# List of "source.example -> target" pairs to seed.
declare -a pairs=(
    ".env.example:.env"
    "creds.json.example:creds.json"
    "cookie.txt.example:cookie.txt"
    "data.json.example:data.json"
    "files/priority.csv.example:files/priority.csv"
)

created=0
skipped=0
for pair in "${pairs[@]}"; do
    src="${pair%%:*}"
    dst="${pair##*:}"
    if [[ ! -f "$src" ]]; then
        echo "    ⚠  missing template: $src (skipped)"
        continue
    fi
    if [[ -f "$dst" ]]; then
        echo "    ✓ exists (kept):  $dst"
        skipped=$((skipped + 1))
    else
        cp "$src" "$dst"
        echo "    + created:        $dst   (copied from $src)"
        created=$((created + 1))
    fi
done

# Install Node dependencies if node_modules missing.
if [[ ! -d "node_modules" ]]; then
    echo ">>> node_modules missing — running: yarn install (or npm install)"
    if command -v yarn >/dev/null 2>&1; then
        yarn install
    else
        npm install
    fi
else
    echo "    ✓ node_modules present"
fi

echo ""
echo ">>> Setup complete: $created file(s) created, $skipped kept."
echo ">>> NEXT STEPS:"
echo "     1. Edit  .env             (SAP_BASE_URL, VENDOR_ID, PLANT_CODE)"
echo "     2. Edit  cookie.txt       (paste your SAP browser cookie)"
echo "     3. Edit  creds.json       (TrueCaptcha USER + APIKEY as fallback)"
echo "     4. Edit  files/input2.csv (your bidding rules)"
echo "     5. Edit  files/delete.csv (blacklisted customers)"
echo "     6. Edit  files/priority.csv (COF Order IDs to bid FIRST)"
echo "     7. Start captcha server:  node bidding.js"
echo "     8. Start bidding engine:  node bid-engine.js"
