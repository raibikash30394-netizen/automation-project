#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# test.sh -- Runs the 28-unit-test suite (no SAP calls).
#
# Safe to run anytime. Verifies the v3.30/v3.31/v3.33 EARLY DROP scheduler,
# INDEPENDENT CAPTCHA POLLER hooks, window helpers, and all regressions
# still pass on Linux/macOS.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"

echo ""
echo "================================================================"
echo "  Bikas Bidding v3.33 -- unit test suite (no SAP calls)"
echo "================================================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] node not installed. Install Node.js 18+ or 20+:"
    echo "        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "        sudo apt install -y nodejs"
    exit 1
fi

node tests/test-window-scheduler.js
EXITCODE=$?

echo ""
if [[ $EXITCODE -eq 0 ]]; then
    echo "[PASS] All unit tests green. Safe to ./start.sh"
else
    echo "[FAIL] Unit tests broke. DO NOT run ./start.sh until fixed."
fi
echo ""
exit $EXITCODE
