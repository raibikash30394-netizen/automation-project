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
- **Global Submit Mutex** across ALL sessions. Only ONE SAP submit HTTP call in flight at any instant. Kills the vendor-lockout that was producing silent HTTP 201 empty responses when multiple cookies were used → bids now actually save server-side (visible in browser again). ✅ USER-VERIFIED LIVE: "ACCEPTED (single, 1) in 250ms: Bidding Amount Saved Successfully."
- **Sequential session fallback**: cookie2/3/4 no longer submit in parallel. If s1 gets an empty 201 OR burns 3× wrong-captcha, s2 retries the same batch with a fresh captcha, then s3, then s4. Only after ALL sessions silent-fail does a cooldown kick in.
- **IST bid-window scheduler**: `getISTNow()`, `msUntilNextWindow()`, `isHotWindow()`. Windows open at :15 and :45 IST every hour. ✅ USER-VERIFIED LIVE: 10:45 IST window opened & captured within 1 s ("⚡ First non-empty captcha detected [s1] — window open!" @ 10:45:01).
- **Pre-warm trigger**: ~30 s before every window, background CSRF refresh + TLS ping across every session (fires once per window). ✅ USER-VERIFIED: "⏱ Pre-warming for next SAP bid-window (~29s away, IST-aligned)".
- **Adaptive main-loop sleep**: 0 ms (tight) when matched-but-no-captcha, 30 ms in hot window, 100 ms 10 s pre-window, 500 ms 1 min pre-window, 2000 ms idle between windows.
- **`handleBatch` empty-201 path** returns `{ silentFail: true }` (no cooldown side-effect) so the caller can walk the session chain.
- **Batching restored to 3-per-call**: Post-mutex-refactor, `effectiveBatchSize = BATCH_SIZE` (unconditional). 3 singles pack into 1 SAP submit call. Singles-first, then clubs. Removes the fragmenting session-spread logic that was slowing the window.
- **Wrong-captcha exhaustion → fallback**: After 3× wrong-captcha on one session, `handleBatch` returns `{ silentFail: true }` so runAll retries with next session (its captcha comes from independent SAP session state, so OCR often succeeds).
- **Unit tests** in `tests/test-window-scheduler.js` — 7 groups, all pass (msUntilNextWindow 7 cases, isHotWindow 22 cases, mutex serialisation 4-way, sequential fallback success + all-fail paths, batching 5 cases, rank hint extraction 3 cases).

## Implemented (2026-02 — v3.7 dead-cookie diagnostic)
- **Root cause detected**: SAP returns fresh CSRF token via `SessionSet('')` EVEN when the underlying browser cookie is dead (logged out elsewhere, admin killed, session timeout). Prior code went into an infinite 403-loop hammering SAP.
- **`sapRequest()` now tracks** consecutive 403-after-refresh on `auth._deadCount`. After 3 (default `AUTH_DEAD_THRESHOLD=3`), sets `auth._deadUntil = now + 30_000ms` (default `AUTH_DEAD_COOLDOWN_MS`).
- **ONE loud instructional error** logged with 🔒 emoji + explicit steps: paste fresh Cookie header from DevTools Network → cookie.txt, delete token.txt, `pm2 restart bid-engine`.
- **During cool-off**: sapRequest short-circuits with synthetic `{ statusCode: 401, data: { _cookieDead: true, remainingMs } }` — no SAP hit, no rate-limit burn.
- **`fetchLiveOrders()`** suppresses per-poll `HTTP 403` warn spam when it sees the `_cookieDead` marker.
- **Self-heal**: any 2xx/3xx response clears `_deadCount` — if user updates cookie mid-run and it takes effect, bot recovers automatically.
- New unit test `testDeadCookieDetection`: 3 cases (alive-at-start, 3× triggers dead flag, mid-stream success resets counter).
- **testing_agent iteration_5**: 100% pass, no issues. 9/9 test groups.

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
