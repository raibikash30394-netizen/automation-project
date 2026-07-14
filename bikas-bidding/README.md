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

Two terminals (or `pm2` / `screen`):

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
