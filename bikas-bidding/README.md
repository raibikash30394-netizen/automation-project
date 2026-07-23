# Bikas Bidding v2

Backend automation for SAP UTCL vendor eBidding — clean rewrite of the old obfuscated tooling.

Two Node.js processes:

| Process        | Role                                              | Default port |
|----------------|---------------------------------------------------|--------------|
| `bidding.js`   | Local captcha solver (cache-first + TrueCaptcha)  | `:3000`      |
| `bid-engine.js`| Main bot — polls SAP, matches CSV rules, submits  | —            |

---

## What changed vs v1

* **HTTP client**: `undici` `Pool` per host, keep-alive across the whole process → 20–30% faster than axios, no per-request TLS handshake.
* **SAP session mutex** (v2.1): SAP maintains ONE active captcha per session cookie, so parallel workers each fetching their own captcha invalidate each other. The engine now serialises the `fetch-captcha → solve → submit` critical section behind a single mutex — first live run went from ~76% "Wrong Captcha" failure rate down to expected <5%. `PARALLEL_BATCHES` still exists as a config knob but is defaulted to `1` (parallel doesn't help until we support multiple SAP sessions).
* **Smart batcher**: singles cleared first in chunks of `BATCH_SIZE` (default 3), then club groups (grouped by `ClubId`, max 3 per batch).
* **Exponential WAF back-off**: `30 s → 60 s → 120 s cap`, resets to 30 s after 5 min of clean requests.
* **Retry logic**:
  * Wrong captcha → immediate retry with a fresh captcha (max 3 attempts per batch).
  * "Greater than or equal to X" (SAP floor) → logs the exact minimum SAP wants, marks order done, no retry.
  * "Reduce by X" → optional `AUTO_ADJUST` re-price + resubmit.
* **Logs**: `pino` + daily rotating JSON files in `logs/` (7-day retention), colored `pino-pretty` stdout for dev. Now distinguishes `sap-empty` (bid window closed) from `solver-unreachable` / `solver-empty` / `waf-406`.
* **Metrics** dumped every 30 s (submits, wrong-captcha count, avg latency, captcha success rate, WAF hits, throughput/min).
* **Cache**: sha256(base64) → in-memory `Map` (<5 ms hit). Persisted to `data.json` every 60 s.
* **No image writes on hot path** — only on solver errors, dumped into `logs/error-YYYY-MM-DD.log`.
* **No machine-ID lock** (removed per requirement).

---

## First-time setup (after cloning from GitHub)

**Step 1 — Install dependencies:**
```bash
cd bikas-bidding
yarn install
```

**Step 2 — Copy `.example` templates → real files:**
```bash
cp .env.example       .env
cp creds.json.example creds.json
cp cookie.txt.example cookie.txt
cp data.json.example  data.json    # empty cache — fills up as bot runs
```

**Step 3 — Fill in your real values:**

| File                    | What to put inside                                             |
|-------------------------|----------------------------------------------------------------|
| `creds.json`            | `{"userid":"your@email.com","apikey":"YOUR_TRUECAPTCHA_KEY"}` (get from https://apitruecaptcha.org/) |
| `cookie.txt`            | Raw browser Cookie header from your logged-in SAP session (F12 → Network → any request → Request Headers → Cookie) |
| `files/input2.csv`      | Your bidding rules — columns: `City Code Descriptio`, `Special Process Indi`, `BIDING AMMOUNT` |
| `files/delete.csv`      | Customer blacklist — one column: `Customer` |
| `.env`                  | Usually no changes needed. `VENDOR_ID` + `PLANT_CODE` if different from defaults. |

**Step 4 — Optional: TrueCaptcha rotation.** If you're reusing an existing account, get a fresh API key from the TrueCaptcha dashboard and paste it into `creds.json` (the old key may have been leaked via prior git commits).

**Step 5 — Run** (see below).

### Files NOT tracked in git (security — you must supply/keep local)

```
.env             # your config
creds.json       # TrueCaptcha secret
cookie.txt       # SAP session token
data.json        # captcha cache (grows over time)
token.txt        # auto-managed CSRF token
logs/            # daily-rotating logs
tessdata/        # tesseract.js downloaded language model (~15MB)
files/input2.csv # bidding rules (private business data)
files/delete.csv # blacklist
```

`token.txt` is auto-created on first successful run — leave it out entirely.

---

## Install (legacy quick-start)

```bash
cd /app/bikas-bidding
yarn install
cp .env.example .env
```

Files you must create yourself before first run:

```
creds.json          {"userid":"...","apikey":"..."}      TrueCaptcha creds
cookie.txt          raw browser Cookie header (SAP session)
files/input2.csv    CSV with columns:  City Code Descriptio, Special Process Indi, BIDING AMMOUNT
files/delete.csv    CSV with a Customer column (blacklist)
```

`token.txt` is auto-managed — you can leave it empty.

---

## Run

### Ubuntu / Linux / macOS (one-shot launcher, v3.33)

**One-shot launch (same as Windows workflow):**
```bash
chmod +x setup.sh test.sh start.sh stop.sh   # first-time only
./setup.sh              # installs deps, seeds .env / cookie.txt.example
./test.sh               # 28-test unit suite (no SAP calls, safe anytime)
./start.sh              # launches solver + engine in background (nohup)
./stop.sh               # kills both processes cleanly
```

`start.sh` will:
1. Verify `node_modules`, `cookie.txt` (non-empty), `.env` exist
2. Warn if `cookie.txt` is >6h old (SAP will 403)
3. Print current `EARLY_DROP_MS`, `CAPTCHA_POLLER_MS`, `POLL_MS` from `.env`
4. Attempt NTP time sync via `chronyc makestep` → `ntpdate` → `timedatectl` (best-effort, never blocks)
5. Launch `bidding.js` and `bid-engine.js` in background with `nohup`; PIDs saved to `.bikas-solver.pid` / `.bikas-engine.pid`
6. Print `tail -f` command for the live log

**Alternative — `tmux` mode** (if you prefer split-pane live view):
```bash
sudo apt install tmux -y      # if not already installed
./start.sh --tmux
tmux attach -t bikas          # attach; Ctrl+B then D to detach
```

**Watch live logs (background mode):**
```bash
tail -f /tmp/bikas-engine.log     # main bot output — look for:
#   🔍 Independent captcha poller ACTIVE (interval=50ms, ...)
#   [cap-poller] ⚡ PRE-SOLVED captcha ready for s1 (sample: KiLL)
#   [worker-1]  ⚡ INSTANT-DISPATCH: using pre-solved captcha (age 42ms)
#   ✓ ACCEPTED (single, 2) in 245ms — Bidding Amount Saved Successfully.
tail -f /tmp/bikas-solver.log     # captcha solver output
```

**NTP prerequisite (one-time, run as sudo):**
```bash
# Ubuntu 20.04+ — chrony is the recommended NTP daemon:
sudo apt install chrony -y
sudo systemctl enable --now chronyd
# Verify:
chronyc tracking
# Ensure "System time" offset is <100ms.
```
Without accurate clock, :15/:45 boundary timing drifts and you miss the window.

**Post-run analysis:**
```bash
# Latest engine log (JSON pino format, one line per event)
ls -lt logs/engine.log.*.1 | head -1

# Bid history (CSV, one row per submit attempt)
tail -20 logs/bids-$(date +%F).csv

# Captcha unlock latency (v3.32 telemetry)
column -t -s, logs/captcha-timing-$(date +%F).csv | head -10
```

### Windows (LOCAL TEST FIRST — recommended before AWS/PM2 deploy)

**One-click launch:**
```cmd
setup.bat        REM first-time only (installs deps, seeds .env / cookie.txt)
test.bat         REM run 28-test unit suite (no SAP calls, safe anytime)
start.bat        REM opens 2 windows: captcha solver + bid engine
stop.bat         REM kills both processes
```

`start.bat` will:
1. Run `w32tm /resync /force` to sync Windows clock (⚠ **critical for v3.30 EARLY DROP** — clock drift >100ms will miss the boundary)
2. Print your current `EARLY_DROP_MS` value from `.env`
3. Open **two separate cmd windows** — one for `bidding.js`, one for `bid-engine.js`
4. Both windows use UTF-8 codepage (65001) so `pino-pretty` emojis (🚀 🎯) render correctly

**What to watch in the "Bikas Bid Engine" window near :15 / :45 IST:**
```
[…] ⏱  Pre-warming for next SAP bid-window (~30s away, IST-aligned)
[…] 🚀 EARLY-DROP CSRF refresh (~1500ms to boundary, target fire T-500ms) — minting post-pre-window token
[…] 🎯 EARLY-DROP FIRE @ T-499ms (target: boundary open) — dispatching tick() speculatively
[…] ✓ ACCEPTED (single, 3) in 245ms — Bidding Amount Saved Successfully.
```

**If clock sync fails** (non-admin), open cmd **once as Administrator** and run:
```cmd
net start w32time
w32tm /config /update /manualpeerlist:"time.google.com,time.windows.com" /syncfromflags:manual
w32tm /resync
```
Then normal-user `start.bat` will work.

**Tuning `EARLY_DROP_MS`** (in `.env`):
| Network location            | Recommended | Rationale                          |
|-----------------------------|-------------|------------------------------------|
| AWS Mumbai / fast VPS       | `300`       | Low 30-80ms RTT to SAP             |
| Home ISP (India, decent)    | `500`       | Default — safe 100-400ms RTT       |
| Home ISP (India, congested) | `700`       | Higher RTT during peak hours       |
| International               | `1000`      | Cross-region latency               |
| Disable early-drop          | `0`         | Revert to strict-at-boundary       |

### Linux / macOS / Docker — manual (no launcher)

If you don't want to use `start.sh`, two terminals (or `pm2` / `screen`):

```bash
# Terminal 1 — captcha solver
node bidding.js
# or with pretty logs during dev:
yarn dev:solver

# Terminal 2 — main bot
node bid-engine.js
yarn dev:engine
```

Health probe for the solver:

```bash
curl -s http://localhost:3000/health | jq
# → { ok:true, cache:812, hits:0, misses:0, apiErrors:0, ... }
```

### AWS Mumbai / PM2 (production)

See `deploy/DEPLOY-AWS-MUMBAI.md` for full walkthrough. Quick version:
```bash
cd deploy && bash install-server.sh
pm2 start ecosystem.config.cjs
pm2 logs
```

---

## Tuning knobs (`.env`)

| Var                    | Default | What it does                                             |
|------------------------|---------|----------------------------------------------------------|
| `POLL_MS`              | `60`    | SAP live-orders poll interval (ms)                       |
| `BATCH_SIZE`           | `3`     | Max orders per submit (SAP hard-limit is 3)              |
| `PARALLEL_BATCHES`     | `1`     | Worker count (SAP session captcha makes parallel useless — see notes) |
| `AUTO_ADJUST`          | `false` | Auto-reduce bid on "Reduce by Rs X" rejection            |
| `MAX_ADJUST_RETRIES`   | `3`     | Cap on auto-adjust attempts per batch                    |
| `SKIP_RANK_PREVIEW`    | `true`  | Skip the extra rank-preview call (~200–500 ms saved)     |
| `TIME_ENDED_COOLDOWN_MS` | `30000` | How long to wait before retrying a "time ended" order   |
| `WAF_BACKOFF_MIN_MS`   | `30000` | Initial WAF back-off                                     |
| `WAF_BACKOFF_MAX_MS`   | `120000`| Cap on WAF back-off                                      |
| `WAF_RESET_AFTER_MS`   | `300000`| Reset back-off ladder after this many ms of clean traffic|
| `CAPTCHA_TTL_HOURS`    | `24`    | Solver cache entry lifetime                              |
| `LOG_LEVEL`            | `info`  | pino level (`trace`, `debug`, `info`, `warn`, `error`)   |
| `LOG_RETENTION_DAYS`   | `7`     | Daily-rotated log retention                              |
| `METRICS_INTERVAL_MS`  | `30000` | 0 disables metrics dumps                                 |

---

## Endpoints exposed by `bidding.js`

| Method | Path                     | Body                              | Returns              |
|--------|--------------------------|-----------------------------------|----------------------|
| POST   | `/`                      | text/plain JSON `{ base64Image }` | `{ solved }`         |
| POST   | `/solve-captcha`         | *(alias of `/` — legacy)*         | `{ solved }`         |
| POST   | `/captcha`               | JSON `{ base64Image }`            | `{ solved }`         |
| POST   | `/upload-base64-image`   | *(alias)*                         | `{ solved }`         |
| GET    | `/health`                | —                                 | metrics JSON         |

The old bid-engine expected `POST /solve-captcha` with `Content-Type: text/plain`; both are still accepted.

---

## Expected performance

| Metric                                | v1        | v2            |
|---------------------------------------|-----------|---------------|
| Per-bid latency                       | 1.5–3 s   | 400–800 ms    |
| 10 orders full cycle (3+3+3+1)        | 15–25 s   | **3–5 s**     |
| Captcha cache hit                     | ~250 ms   | **<5 ms**     |
| Bot-detection risk                    | baseline  | same or lower |

---

## Future improvements (not in this build)

* Redis-backed cache for multi-instance scaling
* Live web dashboard for metrics
* Adaptive parallelism (auto-throttle if captcha error rate > 30%)
* Multiple captcha solver fallback (retry on different provider)
* Prometheus metrics endpoint
