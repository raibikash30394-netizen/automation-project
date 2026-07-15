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

## Implemented (2026-02 — v3.13 SAP-late visibility / anti-panic-restart)
- **Root cause explained**: SAP tenant's captcha unlock time varies by ±60s per window. User's 17:15 IST log showed 61 seconds delay — bot was polling correctly, SAP was slow. User panicked and restarted at 17:15:51; SAP unlocked at 17:16:00; restart-bot caught it coincidentally. Restart didn't fix anything.
- **Fix**: Pure visibility/UX (no behavior change):
  - `🕒 :15/:45 window BOUNDARY reached` — fires once per window at boundary crossover, tells user bot is polling
  - `⏳ waiting for SAP to unlock captcha… ~Ns past :15/:45 boundary (bot is polling, SAP is late — do NOT restart)` — throttled to every 10s during hot-window sap-empty state
  - Per-window resets of `__firstCaptchaAt`, `__lastWaitLog`, `__postSaveVerified` so signals fire fresh each window instead of once per process
- New unit test `testSapLateVisibility` (6 cases proving 10s throttle correctness).
- **Total tests: 15/15 pass**. **testing_agent iteration_11: 100% pass, no issues**.

## Implemented (2026-02 — v3.14 SAP-late polling stall fix)
- **Root cause of missing wait-log & no bids saved**: In v3.13 the wait-log lived ONLY inside `fetchFreshCaptcha()` (called when `sap-empty` captcha response). But when SAP is late, the `BidOrderListSet` endpoint also returns 0 orders (or 0 matched) — `tick()` then early-returned BEFORE ever calling captcha fetch. Result: wait-log never fired, main loop dropped to 2000ms idle poll, user thought bot was frozen.
- **Fix in `tick()`** (bid-engine.js lines 1464-1509):
  - `orders.length === 0` inside `isHotWindow()` → set tight-loop + emit throttled wait-log ("waiting for SAP to populate order list… Ns past boundary — do NOT restart")
  - `stats.matched === 0` inside `isHotWindow()` → same tight-loop + throttled wait-log ("waiting for matched orders to appear (N live, 0 matched)…")
  - Cold-window behaviour unchanged (idle 2000ms sleep + 10s heartbeat log)
- New unit test `testEmptyOrdersInHotWindow` (6 cases).
- **Total tests: 16/16 pass**.

## Implemented (2026-02 — v3.19 GitHub setup templates + POLL_MS default)

### Problem discovered from user's 07:44 IST log
- User pulled fresh code from GitHub → boot log showed `Config: POLL_MS=20` (not the v3.18's `POLL_MS=5`) → user's local `.env` was stale (GitHub had old default too).
- User complained: "GitHub se download kiya toh data file aur creds file missing hain" — because our security audit v3.16 correctly untracked `creds.json`, `data.json`, `cookie.txt` from git → they don't exist after a fresh clone.
- Repeat cycle: user pulls → files missing → tries to run → fails → asks for fix.

### Fix — 4 template files + code default + README
- **`creds.json.example`** — placeholder JSON with `userid` + `apikey` fields.
- **`cookie.txt.example`** — one-line placeholder for browser cookie.
- **`data.json.example`** — empty array `[]` (cache seeds itself as bot runs).
- **`.env.example`** — regenerated to match current `.env`: `POLL_MS=5`, `LOCAL_OCR_ENABLED=true`, `L1_UNDERCUT=true`, etc.
- **Code default**: `parseInt(process.env.POLL_MS || '5', 10)` (was `'20'`) — even if user's local `.env` is stale, bot polls tight by default.
- **README** — new "First-time setup (after cloning from GitHub)" section with 5-step guide: `cp .env.example .env` etc. Explains WHY these files are gitignored (security).

### From log analysis (not a bug — informational)
- `Config: POLL_MS=20 ... [metrics] uptime=300s | submits=0 | 15 live: bl=4 no-rule=11 club-drop=0 cool=0 sub-this-window=0 → 0 matched`
- 15 live SAP orders, but ALL 15 were either blacklisted (4) or didn't match any of 224 CSV rules (11). Bot correctly did nothing.
- **Not a code bug** — this was a genuine "SAP had no matched orders for user's rules in this window" situation. Bot's `sub-this-window=0` breakdown makes this clear.

## Implemented (2026-02 — v3.18.4 revert cacheable-lookup)

### v3.18.1 — Verified cache completeness
- User uploaded `data.json` + `cacheUploads.zip` for merging. Diff analysis:
  - Existing app cache: 162 entries. Uploaded JSON: 162 entries. **NEW entries: 0** (files were identical).
  - 162/162 PNG files' base64-sha256 correctly match the JSON hashes → cache hashing is consistent.
  - **Cache is already 100% populated for the recurring SAP captcha set.**
- Live logs confirm: `HIT QTTDb`, `HIT fish`, `HIT TEXR4Q` — TrueCaptcha never called, credits safe.

### v3.18.2 — DNS caching via `cacheable-lookup` [REVERTED in v3.18.4]
- Attempted `cacheable-lookup@6.1.0` plugged into every undici Pool + global Agent via `connect.lookup`.
- **REVERTED**: On Windows Node.js, `cacheable-lookup` triggered `queryA EDESTRUCTION rise.eye2serve.com` errors immediately on every DNS query (known Node.js DNS resolver internal bug with cacheable-lookup + Windows).
- OS-level DNS caching + undici keep-alive pool already handles this well — first request pays ~10-50ms lookup, subsequent requests reuse the persistent connection with zero DNS overhead.
- Package uninstalled; only a code comment remains as a reminder.

### v3.18.3 — Aggressive polling + triple pre-warm
- `POLL_MS`: 20 → **5 ms** (4× tighter detection loop). At the moment SAP unlocks the captcha, bot detects within 5ms max.
- **Triple pre-warm**: NEW early-warm at 60s before boundary (DNS + TLS priming), existing 30s warm (CSRF + TLS), plus the 3s hot keep-warm during active window. Total 3 warm-up stages.
- Log: `⏱ Early pre-warm (~55s away) — priming DNS + TLS` at t-60s, `⏱ Pre-warming for next SAP bid-window (~26s away…)` at t-30s.
- Expected impact: another 100-300ms shaved off first-submit latency. On a hot window with SAP unlocking exactly at :15:00, bot should now hit at :15:00.150-0.300 ms vs :15:00.500 ms before.

**Total tests: 19/19 pass**. Boot smoke test OK (both services green, DNS cache active, OCR ready, cache=162).

## Implemented (2026-02 — v3.17 duplicate-submit race fix + Local OCR primary)

### v3.17.1 — Duplicate-submit race at delayed boundary tick
- **Bug**: 07:45 IST live log showed JURANPUR order 1153441825 submitted TWICE (07:45:04 SAVED @ ₹598, then 07:45:10 resubmitted). Root cause: main loop was blocked inside a submit tick at :45:04 → boundary block fired 4s LATE → `ctx.submitted.clear()` wiped the just-added entry → next tick re-matched → duplicate submit.
- **Fix**: `ctx.submitted` is now `Map<sapOrderId, submitTimestamp>` (was Set). Boundary clear uses `clearOlderThan(ctx.submitted, now - 30_000)` which removes only entries ≥30s old. Since windows are 30min apart, any entry <30s old provably belongs to the just-opened window and MUST be preserved.
- **Additional guard**: `__firstCaptchaAt` reset in boundary block now also uses 30s window preservation → prevents the duplicate "First non-empty captcha detected" log within the same window.
- New unit test `testAgeBasedBoundaryClear` (7 cases including edge at exactly 30s).

### v3.17.2 — Local OCR (tesseract.js) primary, TrueCaptcha fallback
- **Motivation**: user's TrueCaptcha credits kept running low. SAP captchas are 4-6 char alphanumeric — perfect for tesseract.js WASM OCR (~80-200ms, 100% offline, zero cost).
- **Integration in `bidding.js`**:
  - New `solveViaLocalOcr(base64)` — tesseract.js worker with `pageseg_mode=7` (single line) + `char_whitelist=A-Za-z0-9`. Rejects results below `LOCAL_OCR_MIN_CONFIDENCE` (default 60%) or that don't match `[A-Za-z0-9]{4,8}` format.
  - Dispatcher: **cache → local OCR → TrueCaptcha API**. Local OCR result cached same as API result. Falls through transparently on reject.
  - Worker warmed at boot (background), so first bid-window doesn't pay model-load cost.
  - `GET /health` reports OCR readiness + attempts/ok/lowConf/badFormat/errors/avgMs.
  - Log format: `HIT xyz` (cache) | `OCR xyz` (tesseract) | `API xyz` (TrueCaptcha).
- **Config**: `LOCAL_OCR_ENABLED=true` (default), `LOCAL_OCR_MIN_CONFIDENCE=60`, `LOCAL_OCR_MIN_LEN=4`, `LOCAL_OCR_MAX_LEN=8`.
- Model files (~15MB) auto-download into `./tessdata/` (gitignored).
- **Boot verified**: `Local OCR ready (tesseract.js) — whitelist=62 chars, min-conf=60%, TrueCaptcha=fallback` in ~1 second.
- **Total tests: 19/19 pass** + boot smoke test OK.

## Implemented (2026-02 — v3.16 CRITICAL per-window state clearing)
- **REAL root cause of "restart fixes it" myth**: `ctx.submitted` (Set of successfully-saved SapOrderIds) was initialised once at bot start and NEVER cleared. Every subsequent window filtered out those orders via `seenSubmitted.has(key)` inside `buildBatches`. When SAP re-listed a previously-saved order in a fresh bidding round, the bot showed `matched=0` even though the order was clearly present. User restarted → fresh in-memory Set → order became matchable → SAVED. This is exactly what happened in the 18:15 IST log the user shared:
  - Bot ran since ~18:01 → likely saved order `1153419533` (RAJMAHAL) in the 17:45 window → added to `ctx.submitted`
  - 18:15:01 window opened → SAP re-listed 1153419533 → `matched=0` for 58s (filtered by stale set)
  - User restart at 18:15:59 → fresh `submitted = new Set()` → 18:16:09 scan #1 → `matched=1` → SAVED
  - `ctx.cooldown` and `ctx.undercutAttempts` had the same lifetime bug (the setInterval-based undercut clear only fired if the interval callback landed inside a 60s window right after boundary — unreliable).
- **Fix in main-loop boundary block** (bid-engine.js ~lines 1721-1743):
  - On each boundary crossover (:15/:45 detection), clear `ctx.submitted`, `ctx.cooldown`, `ctx.undercutAttempts`, and null out `ctx._cachedOrders` to force a fresh fetch.
  - Boundary log now reports how many entries were cleared: `cleared per-window state (submitted=X, cooldown=Y, undercut=Z)`.
  - Removed the old `setInterval(clearUndercut, 60_000)` timer (unreliable, superseded by boundary block).
- **Enhanced wait-log breakdown**: the `⏳ waiting for matched orders to appear` log now includes `(N live: bl=X no-rule=Y club-drop=Z cool=W sub-this-window=V → 0 matched)` so the user sees WHY matched=0 (e.g. if `sub-this-window=1` matches the live count, they know the bot already bid on the only matched order in this window).
- New unit test `testPerWindowStateClearing` (proves OLD retained-set filters re-listed order, FIX cleared-set matches again).
- **Total tests: 18/18 pass**.

## Implemented (2026-02 — v3.15 session-shake + cache-bypass on stall)
- **Live 18:15 IST log analysis**: bot correctly detected boundary at 18:15:01, polled tight for 58s with `14 live, 0 matched`, user restarted at 18:15:59, and same session at 18:16:09 immediately found matched=1 & saved in 440ms.
- **WebSocket path DEAD**: SAP's `zapc_e_bid` WebSocket returns `NS_ERROR_WEBSOCKET_CONNECTION_REFUSED` even in the browser — externally blocked. Do NOT attempt WS again.
- **Fix 1 — Cache bypass during stall**: `ctx._matchedButNoCaptcha=true` (which enabled 100 ms order-cache reuse) is NO LONGER set on hot-empty / hot-matched=0. Replaced with new flag `ctx._hotStall`. This forces a FRESH `BidOrderListSet` fetch on every tick during stall (~20ms/scan) so matched orders appear the microsecond SAP releases them.
- **Fix 2 — Silent session-shake**: New `maybeShakeSession(ctx, reason)` fires a background `refreshToken()` on every session at most once every 15 s during a hot-window stall. Fire-and-forget, non-blocking.
- **Main-loop tight-loop condition** extended: `sleepMs=0` when either `_matchedButNoCaptcha` OR `_hotStall` is true.
- New unit test `testSessionShakeThrottle` (5 cases).

## Implemented (2026-02 — v3.19 Priority COF Order ID + Setup automation)
- **Priority COF Order ID (Vbeln) sorting**: Matched orders whose `Vbeln` is in the priority set are pushed to the FRONT of every bid plan, so they hit SAP within the first ~300 ms of the :15/:45 window opening. Discovery order preserved within each bucket.
- **Two-source loader (`loadPriorityVbelns`)**: Merges `files/priority.csv` (one Vbeln per line, or CSV with header column `Vbeln`/`COF Order ID`) with the `PRIORITY_VBELNS` env var (comma-separated). Blank lines and `#` comments are ignored. Deduplicated automatically.
- **Live reload**: Priority list re-read at every :15/:45 boundary — user can edit `priority.csv` mid-run without restarting the bot.
- **Club atomicity**: If ANY member of a club-order group is priority, the whole club is bid first (SAP submits club atomically).
- **SapOrderId fallback**: If `o.Vbeln` is absent (some SAP tenants collapse COF into `SapOrderId`), the loader also matches priority against `SapOrderId`.
- **Log line**: Scan log shows `matched=N priority=M★` and boot log lists sample of priority Vbelns.
- **`buildBatches` signature extended**: 8th arg `priorityVbelns` (Set<string>). Plan order: priority-singles → priority-clubs → non-priority-singles → non-priority-clubs.
- **Unit tests**: 2 new groups (`testPrioritySorting` 6 cases, `testPriorityLoader` 6 cases) — all 21 test groups pass.
- **Setup automation (`setup.sh` + `setup.bat`)**: Idempotent bootstrap script that copies every `foo.example` to `foo` only if the destination doesn't exist. Auto-runs `yarn install`/`npm install` if `node_modules` missing. Solves the "bar-bar mistake" of missing config after GitHub pull.
- **`files/priority.csv.example`** template added.
- **`.env.example`** now documents `PRIORITY_VBELNS=`.
- **`.gitignore`** updated to exclude `files/priority.csv` (user's private business data).

## Implemented (2026-02 — v3.20 Network-timeout resilience)
User's live log showed sporadic `HeadersTimeoutError` between windows (SAP LB silently kills idle keep-alive sockets after ~30s; next request bombs). User's exact concern: "beech beech me save nahi le raha" — sometimes bids don't save. Fix:
- **Auto-retry on idempotent reads**: `sapRequest` now accepts `retryOnNetworkError` flag. When set (currently `fetchLiveOrders` + `fetchCaptchaImage`), a network-level error (HeadersTimeoutError, socket hang up, ECONNRESET, UND_ERR_CONNECT_TIMEOUT, ETIMEDOUT) triggers ONE automatic retry after 150 ms on a fresh socket. Per-session retry counter (`auth._netRetries`) tracks silent recoveries.
- **Submits DO NOT retry** at this layer — a timeout may hit AFTER SAP has already accepted the bid, so double-submit would race. Post-save verification (already in place) catches the "SAP said save but nothing persisted" case.
- **Pool `keepAliveTimeout` reduced 60s → 20s** to stay below SAP LB's ~30s idle timeout. Our sockets close & reopen before SAP kills them → subsequent requests always land on a live connection.
- **Tick-level log improved**: throttled to once per 10s (was every 20th scan — could suppress error bursts entirely). Log line now shows `X tick-fails, Y silent auto-retries so far` so user can see the health at a glance.
- **New unit test `testNetworkRetryOnIdempotent`** (4 cases): retry recovers, retry disabled honours flag, both-fail propagates, non-network errors are NEVER retried. All 22 test groups pass.

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
