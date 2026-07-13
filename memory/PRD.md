# Bikas Bidding v2 — PRD

## Original Problem Statement
Backend automation tool (Node.js) — SAP UTCL vendor eBidding bot + local captcha solver.
CLI service, no UI. Node 18/20 compatible. undici + pino + express.
Deliverable inside `/app/bikas-bidding/` folder.

## Users
Single vendor user, running locally on Windows/Linux against SAP UTCL vendor portal.

## Architecture
Two Node.js processes:
- `bidding.js`  — local captcha solver (:3000 by default), sha256 cache → TrueCaptcha fallback
- `bid-engine.js` — main bot: polls SAP live orders, matches CSV rules, submits bids

## Implemented (2026-01-11)
- undici Pool clients for SAP + local solver (persistent keep-alive)
- Cache-first captcha solver with sha256 in-memory Map + auto-persist data.json every 60s
- pino logger with daily-rotating JSON files (`logs/*.log`, 7-day retention) + pino-pretty stdout
- Machine-ID lock **removed** per user request
- Smart batcher: singles-first (chunks of BATCH_SIZE=3), then club-grouped, max 3 per batch
- 4 parallel workers with jittered 30–90 ms stagger + per-worker captcha pipelining (prefetch next while current submits)
- CSRF token cache + auto-refresh (serialised mutex) on 403
- Retry logic: wrong-captcha (immediate retry ×3 with fresh captcha), time-ended (30s cooldown), reduce-amount (optional AUTO_ADJUST)
- Exponential WAF back-off: 30s → 60s → 120s cap, resets after 5min clean
- Metrics logger every 30s (submits, wrong-captcha, avg latency, captcha success %, WAF hits, throughput/min)
- Endpoints on `bidding.js`: POST `/`, POST `/solve-captcha` (legacy alias), POST `/captcha`, POST `/upload-base64-image`, GET `/health`
- Config via `.env` (18+ knobs documented in README + .env.example)
- Existing `data.json` cache (162 entries) preserved for backward-compat

## Implemented (2026-02 — silent-fail + rank fix)
- **Global Submit Mutex** across ALL sessions. Only ONE SAP submit HTTP call in flight at any instant. Kills the vendor-lockout that was producing silent HTTP 201 empty responses when multiple cookies were used → bids now actually save server-side (visible in browser again).
- **Sequential session fallback**: cookie2/3/4 no longer submit in parallel. If s1 gets an empty 201, s2 retries the same batch with a fresh captcha, then s3, then s4. Only after ALL sessions silent-fail does a cooldown kick in.
- **IST bid-window scheduler**: `getISTNow()`, `msUntilNextWindow()`, `isHotWindow()`. Windows open at :15 and :45 IST every hour.
- **Pre-warm trigger**: ~30 s before every window, background CSRF refresh + TLS ping across every session (fires once per window).
- **Adaptive main-loop sleep**: 0 ms (tight) when matched-but-no-captcha, 30 ms in hot window, 100 ms 10 s pre-window, 500 ms 1 min pre-window, 2000 ms idle between windows.
- **`handleBatch` empty-201 path** now returns `{ silentFail: true }` (no cooldown side-effect) so the caller can walk the session chain.
- **Unit tests** in `tests/test-window-scheduler.js` — 5 groups, all pass (msUntilNextWindow 7 cases, isHotWindow 22 cases, mutex serialisation 4-way, sequential fallback success + all-fail paths).

## Verified
- `bidding.js` starts, loads cache, `/health` returns metrics JSON
- `POST /solve-captcha` and `POST /` both accept text/plain JSON, return `{solved}`
- `bid-engine.js` loads config, refuses to start with missing cookie.txt (clear error), attempts CSRF refresh when cookie present
- ESLint: 0 issues
- (2026-02) `node --check bid-engine.js` clean; all 5 unit-test groups pass; testing_agent iteration_1 report — no critical/minor backend issues; all 8 claimed changes present at exact line ranges.
- **PENDING**: live SAP bid-window test by user (windows every :15 and :45 IST). Expected outcome — bids save on server (browser confirms) + improved rank vs Rank-10 silent-fail.

## Files delivered
```
/app/bikas-bidding/
├── bid-engine.js                     # main bot (v3.4 with global mutex + IST scheduler)
├── bidding.js                        # captcha server
├── logger.js                         # shared pino logger with daily rotation
├── creds.json                        # {userid, apikey} for TrueCaptcha
├── data.json                         # cache (backward-compat, 162 entries preserved)
├── package.json
├── .env / .env.example
├── tests/
│   └── test-window-scheduler.js      # unit tests (mutex + IST helpers + fallback)
├── logs/                             # daily-rotating JSON logs (7-day retention)
├── files/                            # user drops input2.csv / delete.csv here
└── README.md
```

## User must supply before first run
- `cookie.txt` — raw browser Cookie header (SAP session)
- `files/input2.csv` — bidding rules
- `files/delete.csv` — blacklist
- Optionally update `creds.json` with fresh TrueCaptcha credentials

## Backlog / Future (per plan)
- Redis-backed cache for multi-instance scaling
- Web dashboard for live metrics
- Adaptive parallelism (auto-throttle if captcha error rate > 30%)
- Multiple captcha solver fallback
- Prometheus metrics endpoint
