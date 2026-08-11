#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# start.sh -- One-shot Linux/macOS launcher for Bikas Bidding v3.33
#
# Launches BOTH `bidding.js` (captcha solver on port 3000) and `bid-engine.js`
# (main bot with independent captcha poller). Two run modes:
#
#   MODE 1 (default): background nohup — logs to /tmp/bikas-*.log, PIDs in
#           .bikas-solver.pid / .bikas-engine.pid, terminal returns.
#           Use `./stop.sh` to kill and `tail -f /tmp/bikas-engine.log`
#           to watch logs.
#
#   MODE 2 (tmux): pass `--tmux` — opens a tmux session `bikas` with two
#           panes (solver + engine). Attach with `tmux attach -t bikas`.
#           Requires tmux installed (`sudo apt install tmux`).
#
# Prerequisites:
#   - `./setup.sh` run at least once
#   - `cookie.txt` populated with fresh SAP browser cookie
#   - `.env` present (already seeded by setup.sh)
#   - Node 18+ / 20+ installed (`node -v`)
#
# NTP sync: critical for accurate :15/:45 boundary. This script tries
# `sudo chronyc makestep` (chrony) then `sudo ntpdate -u pool.ntp.org` (older
# systems). If both fail (non-sudo or missing tools), continues with a warning.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"

MODE="bg"
if [[ "${1:-}" == "--tmux" ]]; then MODE="tmux"; fi
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    grep '^# ' "$0" | sed 's/^# //'
    exit 0
fi

# ---- Sanity checks --------------------------------------------------------
if [[ ! -d node_modules ]]; then
    echo "[ERROR] node_modules missing. Run: ./setup.sh"
    exit 1
fi
if [[ ! -s cookie.txt ]]; then
    echo "[ERROR] cookie.txt is empty. Paste your SAP browser cookie header (copy from DevTools → Network → any /sap/opu/odata/... request → Cookie)."
    exit 1
fi
if [[ ! -f .env ]]; then
    echo "[ERROR] .env missing. Run: ./setup.sh"
    exit 1
fi

# ---- Cookie freshness warning --------------------------------------------
COOKIE_AGE_SEC=$(( $(date +%s) - $(stat -c %Y cookie.txt 2>/dev/null || stat -f %m cookie.txt) ))
if (( COOKIE_AGE_SEC > 6 * 3600 )); then
    echo "[WARN] cookie.txt is $(( COOKIE_AGE_SEC / 3600 ))h old — SAP session usually expires in 6h. Refresh from a fresh browser login BEFORE the next :15/:45 window."
fi

echo ""
echo "================================================================"
echo "  Bikas Bidding v3.33 -- Linux/macOS launcher"
echo "================================================================"
echo "  EARLY_DROP_MS       : $(grep -E '^EARLY_DROP_MS=' .env | cut -d= -f2)"
echo "  CAPTCHA_POLLER_MS   : $(grep -E '^CAPTCHA_POLLER_MS=' .env | cut -d= -f2 || echo 50)"
echo "  POLL_MS             : $(grep -E '^POLL_MS=' .env | cut -d= -f2)"
echo "  Mode                : $MODE"
echo "================================================================"

# ---- CRITICAL: NTP clock sync --------------------------------------------
# v3.33 fires submit at exactly the :15/:45 boundary. Clock drift >100ms
# means we miss the moment. Attempt sync but never block on failure.
echo ""
echo "Attempting NTP time sync (critical for :15/:45 accuracy)..."
if command -v chronyc >/dev/null 2>&1 && sudo -n chronyc makestep >/dev/null 2>&1; then
    echo "  [OK] chronyc makestep succeeded"
elif command -v ntpdate >/dev/null 2>&1 && sudo -n ntpdate -u pool.ntp.org >/dev/null 2>&1; then
    echo "  [OK] ntpdate succeeded"
elif command -v timedatectl >/dev/null 2>&1; then
    NTP_STATUS=$(timedatectl show -p NTPSynchronized --value 2>/dev/null || echo "unknown")
    if [[ "$NTP_STATUS" == "yes" ]]; then
        echo "  [OK] timedatectl reports NTPSynchronized=yes"
    else
        echo "  [WARN] timedatectl reports NTPSynchronized=$NTP_STATUS. Run: sudo timedatectl set-ntp true"
    fi
else
    echo "  [WARN] No NTP tool available or sudo needed. Install: sudo apt install chrony -y && sudo systemctl enable --now chronyd"
    echo "         Without accurate clock, :15/:45 timing may drift 1-2 seconds."
fi
echo ""

# ---- Launch --------------------------------------------------------------
if [[ "$MODE" == "tmux" ]]; then
    if ! command -v tmux >/dev/null 2>&1; then
        echo "[ERROR] tmux not installed. Install: sudo apt install tmux -y"
        echo "        Or omit --tmux to run in background mode."
        exit 1
    fi
    # Kill existing session if any (idempotent)
    tmux kill-session -t bikas 2>/dev/null || true
    tmux new-session -d -s bikas -n solver "node bidding.js"
    sleep 2  # let solver bind port 3000
    tmux split-window -t bikas -h "node bid-engine.js"
    tmux set-window-option -t bikas remain-on-exit on
    echo "================================================================"
    echo "  tmux session 'bikas' launched with two panes:"
    echo "    - LEFT  : captcha solver (port 3000)"
    echo "    - RIGHT : bid engine (v3.33 with independent captcha poller)"
    echo ""
    echo "  Attach       : tmux attach -t bikas"
    echo "  Detach       : Ctrl+B then D"
    echo "  Stop all     : ./stop.sh"
    echo "================================================================"
else
    # Background mode with nohup + PID files.
    mkdir -p logs
    SOLVER_LOG=/tmp/bikas-solver.log
    ENGINE_LOG=/tmp/bikas-engine.log
    : > "$SOLVER_LOG"
    : > "$ENGINE_LOG"

    nohup node bidding.js > "$SOLVER_LOG" 2>&1 &
    SOLVER_PID=$!
    echo "$SOLVER_PID" > .bikas-solver.pid
    echo "[1/2] captcha solver (bidding.js) started -- PID $SOLVER_PID  log: $SOLVER_LOG"

    sleep 2  # let solver bind port 3000

    nohup node bid-engine.js > "$ENGINE_LOG" 2>&1 &
    ENGINE_PID=$!
    echo "$ENGINE_PID" > .bikas-engine.pid
    echo "[2/2] bid engine   (bid-engine.js v3.33) started -- PID $ENGINE_PID  log: $ENGINE_LOG"

    echo ""
    echo "================================================================"
    echo "  Both processes launched. Recommended follow-up:"
    echo "    Live engine log : tail -f $ENGINE_LOG"
    echo "    Live solver log : tail -f $SOLVER_LOG"
    echo "    Stop everything : ./stop.sh"
    echo ""
    echo "  Near :15 / :45 IST watch for:"
    echo "    [cap-poller] PRE-SOLVED captcha ready ..."
    echo "    INSTANT-DISPATCH: using pre-solved captcha (age Xms)"
    echo "    ACCEPTED (single, N) in Xms -- Bidding Amount Saved"
    echo "================================================================"
fi
