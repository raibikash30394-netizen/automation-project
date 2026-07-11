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
* **Captcha pipelining**: each worker prefetches the *next* batch's captcha in parallel with the current submit. No pre-solved pool — SAP invalidates the previous session captcha on every new fetch.
* **Smart batcher**: singles cleared first in chunks of `BATCH_SIZE` (default 3), then club groups (grouped by `ClubId`, max 3 per batch).
* **4 parallel workers** with **jittered 30–90 ms** stagger to avoid burst alignment with SAP's WAF.
* **Exponential WAF back-off**: `30 s → 60 s → 120 s cap`, resets to 30 s after 5 min of clean requests.
* **Retry logic**:
  * Wrong captcha → immediate retry with a fresh captcha (max 3 attempts per batch).
  * Reduce-amount rejection → optional `AUTO_ADJUST` re-price + resubmit.
* **Logs**: `pino` + daily rotating JSON files in `logs/` (7-day retention), colored `pino-pretty` stdout for dev.
* **Metrics** dumped every 30 s (submits, wrong-captcha count, avg latency, captcha success rate, WAF hits, throughput/min).
* **Cache**: sha256(base64) → in-memory `Map` (<5 ms hit). Persisted to `data.json` every 60 s.
* **No image writes on hot path** — only on solver errors, dumped into `logs/error-YYYY-MM-DD.log`.
* **No machine-ID lock** (removed per requirement).

---

## Install

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
| `PARALLEL_BATCHES`     | `4`     | Concurrent worker count                                  |
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
