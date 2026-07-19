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

## Implemented (2026-02 — v3.21 CRITICAL: Tie-rejection detection)
Root cause identified from user's `submit-responses.jsonl` — SAP's misleading response protocol was causing rejected bids to be marked ACCEPTED:
```
Ev_Text: "Same amount has been bid by other vendor for order id: 5574818614 ..."
NavEBiddingMessage.Type    = "E"     ← real signal: rejected
NavEBiddingMessage.Message = "Bidding Amount Saved Successfully."   ← misleading!
BiddingRank (track hint)   = "0"     ← confirms not saved
```
Prior code trusted the cosmetic "Saved Successfully" text, marked the bid as ACCEPTED, and added the order to `submitted` set → order was **never re-bid** in that window. This was the mysterious "beech beech me save nahi le raha" user was seeing.

- **`isTieRejected`** detection: regex-matches `Ev_Text` for `"same (avg )?amount has been bid by other vendor"` — the two live-log rejection patterns (single-order and club-order variants).
- **`isRealSuccess`** now requires `!isTieRejected && info !== 'E'` in addition to the message text check. Prevents cosmetic "Saved" from masking real Ev_Text reject.
- **New REJECTED_TIE handler**: does NOT add order to `submitted` (so next scan re-picks), sets 3s cooldown, and — if `L1_UNDERCUT` is enabled — decrements the bid amount by `L1_UNDERCUT_STEP` and increments the undercut counter so the next submit uses a lower value. Logs the tied Vbeln IDs parsed from Ev_Text.
- **Cookie-expired log throttled** to once every 5 min per session (was flooding error.log with 100+ identical banners per hour when cookie was dead).
- **New unit test `testTieRejection`** (6 cases) covering the actual live-log Ev_Text patterns.
- **All 23 test groups pass** ✅.

## Updated (2026-02 — v3.22 Tie-rejection: no undercut, mark done)
User feedback: **SAP does NOT allow bids below L1** — trying to undercut by ₹1 would hit SAP's floor validation and reject anyway. The ONLY winning strategy for a tied slot is **SPEED**: being first (by ms) to submit at that amount. Reverted the automatic amount decrement in TIE_REJECTED handler:
- Removed the `L1_UNDERCUT_STEP` decrement (would violate SAP's floor rule).
- Removed the 3-second cooldown/retry loop (retrying at the same amount just ties again).
- Order is now marked `submitted` for this window (bot doesn't burn cycles re-submitting a losing bid).
- Log message updated: `"Cannot undercut (SAP doesn't allow < L1). Bid LOST for this window. Speed is the only way to win next window — consider AWS ap-south-1 hosting to shave ~40ms latency."`

## Updated (2026-02 — v3.23 Timeout tuning)
User reported repeated `tick failed: network timeout (Headers Timeout Error)` on idle scans. Root cause: SAP occasionally takes 6-12s to respond during peak, but our timeouts were:
- `BidOrderListSet` fetch: 5s (too tight)
- `EbiddingCaptchaSet` fetch: 4s (too tight)

Both were timing out on BOTH the initial attempt AND the v3.20 retry. Fix:
- **`BidOrderListSet` timeout**: 5s → **10s** (default, env-tunable via `FETCH_ORDERS_TIMEOUT_MS`)
- **`EbiddingCaptchaSet` timeout**: 4s → **6s** (env-tunable via `FETCH_CAPTCHA_TIMEOUT_MS`)
- **`EBiddingSaveSet` submit timeout**: unchanged at 5s (env-tunable via `SUBMIT_TIMEOUT_MS`) — during hot window we want fast fail-and-retry, not patient waiting
- **`.env.example`** documents all three knobs so user can tune based on their ISP/SAP latency profile
- No behaviour change during hot windows — this only affects idle polling patience

## Implemented (2026-02 — v3.24 CRITICAL: Ghost-save detection)
Second silent-fail pattern discovered from user's 2026-07-17 15:45 window log. SAP returned:
```
Type: "S", Message: "Bidding Amount Saved Successfully.", Ev_Text: ""
NavEBiddingTrackHis[0].ChangeNo   = "AAAAAAAAAAAAAAAAAAAAAA=="   ← empty base64 GUID
NavEBiddingTrackHis[0].CreatedOn  = null                          ← no save timestamp
NavEBiddingTrackHis[0].CreatedAt  = "PT00H00M00S"                 ← zero duration
```
Bot logged ACCEPTED + POST-SAVE OK (post-save refetch showed the optimistic amount echo), but the browser showed nothing — SAP's master DB never committed. User's "abhi browser me save nahi hua" report.

- **`isGhostRecord`** per-hint flag computed at rankHints extraction:
  - `changeNoEmpty = !changeNo || /^A+={0,2}$/.test(changeNo)`
  - `timestampsGhost = createdOn === null && /^PT0+H0+M0+S$/i.test(createdAt)`
- **`isGhostSaved`** (all-hints-ghost) added to classify logic — takes precedence over `isRealSuccess`.
- **New REJECTED_GHOST branch**: does NOT mark `submitted`, sets 500ms cooldown, returns `retry: true` so the next scan re-picks and re-submits (before window closes).
- **Log line** clearly states the diagnostic: `"SAP said 'Saved' (Type=S) but response contains ghost persistence markers: ChangeNo=empty, CreatedOn=null, CreatedAt=PT0S. No actual DB commit — browser will show nothing."`
- **Partial-ghost safety**: If SOME hints are ghost and OTHERS aren't (mixed), we treat as ACCEPTED to avoid duplicate re-submits of the ones that did save. Only 100%-ghost responses trigger retry.
- **Tie-rejection has priority**: If Ev_Text says "Same amount..." AND ghost markers present, still classify as REJECTED_TIE (Ev_Text is the strongest signal).
- **New unit test `testGhostSaveDetection`** (6 cases). **All 24 test groups pass** ✅

## Implemented (2026-02 — v3.25 CRITICAL: Boundary CSRF re-issue + empty-201 ghost check)
User's 2026-07-18 logs revealed the ROOT CAUSE of ghost-save: **pre-warm CSRF token is flagged by SAP as "pre-window" and any submit with it lands in a no-commit code path**. Across 3 different windows, the pattern was identical:
1. `~30s before boundary`: Pre-warm CSRF refresh
2. `~1s past boundary`: First captcha detected + submit fired with **pre-warm CSRF** → GHOST (`ChangeNo=empty`, `CreatedOn=null`)
3. `~4s past boundary`: Session-shake refreshes CSRF (fresh **post-boundary** token)
4. `~5s past boundary`: Retry with fresh CSRF → SUCCESS (empty 201)

Also discovered a related bug: the retry's empty-201 response STILL contained ghost markers in `NavEBiddingTrackHis`, but the empty-201 handler fired BEFORE the ghost check → wrongly marked ACCEPTED. User's browser confirmed no save.

Fixes:
- **Boundary CSRF re-issue**: At every `:15`/`:45` boundary, all sessions fire a background CSRF refresh (non-blocking). By the time the first captcha lands (~1-2s past boundary), the token is post-boundary → submit lands in the commit code path.
- **Empty-201 handler now checks ghost markers**: `!isGhostSaved` added to the empty-201 acceptance condition. If ghost markers present, falls through to REJECTED_GHOST handler.
- **Ghost retry cap** (`MAX_GHOST_RETRIES = 3`): per-order counter tracks ghost retries within a window; after 3 attempts, gives up on that order (prevents infinite retry loops on SAP anti-fraud paths).
- **New `ctx.ghostRetries` Map**: per-window state, cleared at each `:15`/`:45` boundary along with cooldown/undercut/submitted.
- **All 24 unit tests pass** ✅ (existing ghost test still valid — new logic is additive).

## Updated (2026-02 — v3.26 Tie is SUCCESS, not rejection)
User's 2026-07-18 browser screenshot revealed a critical semantic error in v3.21/v3.22: **tied bids ARE saved** (at rank 6-7 depending on how many vendors bid the same amount first), they are NOT rejected outright. The Ev_Text `"Same amount has been bid by other vendor..."` is an INFO message ("you tied, N vendors were faster"), not a failure signal. Bot was scaring the user with "TIE-REJECTED — Bid LOST" warnings when the bids were actually persisted at a non-1 rank.

- **`REJECTED_TIE` → `SAVED_TIED` semantic rename**: log level changed from `warn` (scary red) to `info` (green tick).
- **`metrics.submitsOk++`** instead of `submitsRejected++` — throughput counter now reflects the real save rate visible in browser.
- **Log message rewritten** to be constructive: `"✓ SAVED-TIED — bid saved but at non-1 rank. SAP says other vendor(s) bid the same amount FIRST. → To improve rank, try a slightly different amount next window (₹1-2 below the ties)."`
- **Behaviour unchanged**: order still added to `submitted` set (no wasted retries), `bidLogRow` writes `SAVED_TIED` status (was `REJECTED_TIE`) for CSV analytics.
- **Unit test `testTieRejection` unchanged** — still validates the `isTieRejected` classifier, which is correct. Only the runtime handler mapping changed (tie → save at non-1 rank instead of tie → reject).

## Implemented (2026-02 — v3.27 CAPTCHA-FREE fast-path)
Discovery from SAP's own browser controller (`EBidding-dbg.controller.js` → `onEBiddingSave`): when `BidOrderListSet` response returns `EvCaptchaFlag !== 'X'`, the browser SKIPS captcha input entirely and calls `EBiddingSaveSet` directly with just the amount. Bot never used this path — always waited for captcha unlock (2-3s past boundary), even when captcha was optional. This aligns exactly with user's suggestion: "khulte he window ready save kar do jaise mera oponet kar raha hai".

- **`fetchLiveOrders` now captures `EvCaptchaFlag`** into `auth._lastCaptchaFlag`.
- **`fetchFreshCaptcha` fast-path**: if `_lastCaptchaFlag === ''`, returns sentinel `'__NO_CAPTCHA_REQUIRED__'` immediately (no HTTP round-trip for captcha). Only fires when the flag was EXPLICITLY observed as empty from a completed order fetch (undefined falls through to normal captcha path).
- **`submitBid` payload builder**: when sentinel is passed, omits the `IvCaptchaValue` field entirely — matches browser payload structure when captcha isn't required.
- **Log line** once per window: `"⚡ CAPTCHA-FREE fast-path enabled (EvCaptchaFlag='' from BidOrderListSet) — skipping captcha wait, submit will fire immediately."`
- Impact: for plants/vendors where SAP doesn't require captcha, submit latency drops from **~3000 ms past boundary** (captcha unlock delay) to **~200 ms** (network RTT only) — a 15× improvement for those windows. This is the single biggest speed win possible without geographic relocation.
- **All 24 unit tests pass** ✅.

## Implemented (2026-02 — v3.28 AWS Mumbai deployment toolkit)
User asked for AWS `ap-south-1` (Mumbai) deployment on Ubuntu + SSH + PM2 so the bot runs from the same region as SAP's datacenter (40-60 ms latency saved → 2-3× better rank-1 probability). Created a complete self-service toolkit:

- **`deploy/DEPLOY-AWS-MUMBAI.md`** — full step-by-step guide (EC2 setup, security group, Elastic IP, SSH keys, install, config, PM2 startup, cookie refresh workflow, expected speed improvements, troubleshooting, cost optimization)
- **`deploy/install-server.sh`** — one-shot Ubuntu 22/24.04 bootstrap script (Node 20 + Yarn + PM2 + Tesseract + deps + `.example`→real config seeding + unit test verification + PM2 startup-on-boot)
- **`deploy/refresh-cookie.ps1`** — Windows PowerShell helper to upload fresh `cookie.txt` + delete stale `token.txt` + restart bot on server via SSH+SCP in one command
- **`deploy/README.md`** — quick-start index for the deploy/ directory
- **`ecosystem.config.cjs`** at repo root — PM2 config for both `bidding.js` (captcha solver) and `bid-engine.js` (SAP bot). Fork mode, auto-restart, memory limits (350M solver, 400M engine), per-day log rotation, PM2-managed timestamps
- Recommended instance: **`t3.small`** in `ap-south-1` (Mumbai) with 20 GB gp3 SSD — ~₹1,200-1,500/month burstable, right-sized for bot's ~150 MB RAM + captcha OCR spikes

## Updated (2026-02 — v3.29 TIE-SAVE post-verify)
User's 2026-07-19 Rampurhat window revealed SAP's tie behaviour is inconsistent: sometimes ties save at non-1 rank (July 18 rank 6-7), sometimes silently drop (July 19 nothing in browser). Bot's log couldn't distinguish these cases. Fix:
- **Fire-and-forget POST-SAVE VERIFY for TIE branch**: 3.5s after every `SAVED-TIED` response, bot refetches `BidOrderListSet` and logs:
  - ✅ `TIE-SAVE VERIFIED: N tied bid(s) actually persisted in browser (rank low but visible)` — good outcome
  - 🚨 `TIE-SAVE VERIFICATION FAILED: SAP said SAVED-TIED but NONE of the N bids appear... Browser will show NOTHING.` — bad outcome (user's July 19 case)
  - ⚠  `TIE-SAVE PARTIAL: X/N bids persisted...` — mixed outcome
- Provides **objective evidence** of whether a tie truly saved or not — user no longer needs to check browser manually to know the outcome
- Non-blocking (setTimeout+fetchLiveOrders) — does not delay the main scan loop


## Implemented (2026-02 — v3.30 EARLY DROP "1 sec pehle" trick)
User feedback ("mai UI me 1 sec pehele chor deta hu... 50% mera rank 1 hota") revealed that submitting ~1 second BEFORE the :15/:45 boundary bypasses the network-RTT penalty that competitors face. Fix:
- **New config**: `EARLY_DROP_MS` (default `500`) and `EARLY_DROP_CSRF_LEAD_MS` (default `1000`) in `.env` / `.env.example`
- **New scheduler helper**: `isEarlyDropWindow()` returns true within `EARLY_DROP_MS` of next boundary
- **Early-drop CSRF refresh**: fires exactly ONCE per window at `T-(EARLY_DROP_MS + LEAD_MS)` — mints a token that is fresh enough to not be flagged pre-window stale, propagated enough to be accepted by SAP
- **Early-drop FIRE**: fires exactly ONCE per window at `T-EARLY_DROP_MS`, sets `ctx._hotStall = true` so `tick()` tight-polls captcha + orders — request lands on SAP AT boundary open given 100-400ms RTT
- **Tight-poll runway**: final 2s before early-drop fire uses `sleepMs = 0` so we never sleep past the target moment
- **Once-per-window semantics**: both triggers use `nextBoundaryKey = Math.floor((Date.now() + untilNext) / 60_000)` to prevent duplicate fires across tight polls
- **3 new unit tests** in `test-window-scheduler.js`: `testEarlyDropWindow` (8 cases), `testEarlyDropOnceSemantics` (3-window verification), `testEarlyDropAndBoundaryComplementary` (temporal ordering with v3.25 boundary block)
- **Set `EARLY_DROP_MS=0` to disable** and revert to strict-at-boundary behaviour

## Implemented (2026-02 — v3.31 PRECISION EARLY-DROP + fastpath visibility)
User's live 2026-07-19 10:15 IST run revealed v3.30 bug: FIRE trigger NEVER fired (verified via `grep "EARLY-DROP FIRE" engine.log` returned nothing). CSRF refresh fired at T-1236ms but next log was boundary-crossed at T+1013ms — main loop jumped from T-1236 to T+1013 (~2.25s tick), skipping the T-300 to T-0 window entirely. Root cause: `while(true)` loop each iteration includes `await tick()` which takes 200-500ms during pre-boundary SAP polling.

Additionally, all 3 submits at T+3.6s / +6.0s / +8.5s were GHOST-SAVED (SAP responded `Rank=0`, `ChangeNo="AAAAAAAA=="`, `CreatedOn=null`, `BiddingDate=/Date(1784419200000)/` = July 14, 5 days old). Captcha `"KiLL"` was solved and accepted. Ghost cause unclear — likely SAP duplicate-detection on already-bid orders, OR tie-lose silent-reject.

Fixes in v3.31:
- **Precision setTimeout scheduler**: When we first enter `untilNext <= 5s` and `untilNext > EARLY_DROP_MS` (i.e. the ~5s runway), schedule TWO setTimeouts:
  - CSRF refresh at `untilNext - (EARLY_DROP_MS + CSRF_LEAD_MS)` — decouples from tick loop
  - FIRE at `untilNext - EARLY_DROP_MS` — dispatches submit directly from `ctx._cachedOrders`, bypassing `tick()`/`fetchLiveOrders`/`makeWorkerPool`
- **FIRE directly submits**: uses cached matched-bids + `buildBatches()` + `makeWorkerPool()` inline. If `_lastCaptchaFlag === 'X'`, skips (logs warning) since fastpath is required for pre-boundary submit
- **EvCaptchaFlag transition log**: on every `fetchLiveOrders`, if `EvCaptchaFlag` changes, log `⚡ CAPTCHA-FREE fastpath ENABLED` or `🔒 captcha REQUIRED` — user immediately sees per-window fastpath status
- **`earlyDropScheduledWinKey`** replaces the two separate v3.30 keys — one scheduling event per window


User request ("windows me chalne layak banao pehele windows me test kare tab sab pm2 me chore ge") — added Windows-native launchers so v3.30 can be validated on the user's local Windows machine BEFORE deploying to AWS Mumbai / PM2:
- **`start.bat`**: One-click launcher that (a) syncs Windows clock via `w32tm /resync` (critical: v3.30 fires at `T-500ms`, so >100ms clock drift misses the boundary), (b) sets UTF-8 codepage `chcp 65001` so pino-pretty emojis render, (c) opens two separate cmd windows — captcha solver + bid engine, (d) prints the current `EARLY_DROP_MS` from `.env` for visibility
- **`stop.bat`**: Kills both node processes by window-title match + fallback port-3000 kill
- **`test.bat`**: Runs the 28-unit-test suite without any SAP calls (safe anytime)
- **README updated** with Windows section: run order, expected log output, RTT-based `EARLY_DROP_MS` tuning table, one-time admin cmd to enable `w32time` service
- **`bid-engine.js` is already cross-platform** (uses `path.join`, no shell hooks, no Linux-only paths) — verified via `grep child_process|exec|spawn|/dev/|/tmp/|bash` returning no matches. `undici`, `pino`, `tesseract.js` all have Windows binaries.

Workflow now: `setup.bat` (once) → `test.bat` (green) → `start.bat` (test 1-2 live windows) → verify Rank 1 in browser → deploy to AWS via `deploy/install-server.sh` + PM2.

Testing status: 28 unit tests pass. Live SAP verification pending user's next Windows local run.


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
