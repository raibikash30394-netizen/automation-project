#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# stop.sh -- Kills all Bikas Bidding node processes on Linux/macOS.
#
# Handles both run modes:
#   - Background (default of start.sh)  : reads .bikas-*.pid files, sends SIGTERM
#   - tmux (`./start.sh --tmux`)        : kills tmux session `bikas`
#
# Fallback: kills any node.exe/node process listening on port 3000 (solver)
# so the tool always leaves a clean slate.
# ---------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")"

echo "Stopping Bikas Bidding processes..."

# ---- 1. tmux session -----------------------------------------------------
if command -v tmux >/dev/null 2>&1 && tmux has-session -t bikas 2>/dev/null; then
    tmux kill-session -t bikas
    echo "  [OK] tmux session 'bikas' killed"
fi

# ---- 2. PID files from background mode ------------------------------------
for name in solver engine; do
    pidfile=".bikas-${name}.pid"
    if [[ -f "$pidfile" ]]; then
        pid=$(cat "$pidfile" 2>/dev/null || true)
        if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            sleep 0.5
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null || true
                echo "  [OK] killed $name (PID $pid, SIGKILL)"
            else
                echo "  [OK] killed $name (PID $pid, SIGTERM)"
            fi
        fi
        rm -f "$pidfile"
    fi
done

# ---- 3. Fallback: kill anything listening on port 3000 (captcha solver) ----
# SAFETY: only kill if the process cmdline looks like our bidding.js — never
# kill unrelated node servers (e.g. a dev frontend also running on :3000).
if command -v lsof >/dev/null 2>&1; then
    port_pids=$(lsof -tiTCP:3000 -sTCP:LISTEN 2>/dev/null || true)
elif command -v ss >/dev/null 2>&1; then
    port_pids=$(ss -ltnp 'sport = :3000' 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 || true)
else
    port_pids=""
fi
if [[ -n "${port_pids:-}" ]]; then
    for pid in $port_pids; do
        # Read cmdline safely; skip if not our bidding.js
        cmdline=""
        if [[ -r "/proc/$pid/cmdline" ]]; then
            cmdline=$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null || true)
        elif command -v ps >/dev/null 2>&1; then
            cmdline=$(ps -p "$pid" -o command= 2>/dev/null || true)
        fi
        if [[ "$cmdline" == *"bidding.js"* ]]; then
            kill "$pid" 2>/dev/null && echo "  [OK] killed leftover bidding.js on port 3000 (PID $pid)" || true
        fi
    done
fi

# ---- 4. Belt-and-suspenders: pkill any orphaned bid-engine.js -------------
pkill -f "node.*bid-engine\.js" 2>/dev/null || true
pkill -f "node.*bidding\.js"    2>/dev/null || true

echo "Done."
