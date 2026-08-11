'use strict';

/**
 * bid-engine.js — Bikas Bidding v2 main bot
 *
 * v3.41 — SAP `Flag` FIELD SUCCESS TRUST (user 2026-08-11 3rd run):
 *   User's submit-responses.jsonl reveals SAP's OData response has a
 *   top-level `Flag` field. Every accepted save has `Flag="1"` — even
 *   the "async ChangeNo" responses where NavEBiddingMessage=null and
 *   Ev_Text="" (i.e., no text message at all). Prior versions ignored
 *   `Flag` entirely; the classifier fell through to "unknown"/"ghost"
 *   for these responses. bhai's 07:45 (post-restart) + 08:15 windows
 *   saw the same 3 orders repeatedly submitted → all returning Flag="1"
 *   with async persistence markers → all classified as GHOST-SAVED and
 *   REJECTED_GHOST_MAX. In reality they WERE saved.
 *
 *   Changes:
 *   • `submitBid` now returns `respFlag` from SAP's response body.
 *   • handleBatch treats `respFlag === '1'` (when TRUST_TYPE_S=true and
 *     not tie-rejected) as a definitive success signal — the strongest
 *     signal available in the response. Sits alongside the v3.36
 *     _trustTypeS ('S') and v3.40 _trustSavedText (text match) trust
 *     paths. All three feed isRealSuccess.
 *   • Applies to all response shapes: empty NavMsg, empty Ev_Text,
 *     Type=' ', Type='S', with or without persistence markers.
 *
 * v3.40 — GHOST DETECTION DISABLED + WARNING SUPPRESSION (user 2026-08-11
 *         second-run report: "ek bhi save nahi hua"):
 *   User's 07:45 window log:
 *     • 3 orders (NAZIRPUR, BHARATPUR, TALIBPUR) submitted, all rejected
 *       as GHOST-SAVED, retried 3 times each, then `REJECTED_GHOST_MAX`.
 *     • Warning `[worker] ⚠ batch exit without persisted outcome
 *       (outcome=skipped)` fired 251 times per window — flooding logs.
 *     • Only 1 order (BASICMORE) actually saved (TIED). User's browser
 *       showed zero rank-1s.
 *
 *   Analysis: v3.36's TRUST_TYPE_S only bypassed ghost detection when
 *   `result.info === 'S'`. But SAP was returning NavEBiddingMessage with
 *   EMPTY Type field + Message containing "Saved" — so _trustTypeS=false,
 *   ghost detection fired, 3 captcha-burning retries per order, all with
 *   the same ghost response.
 *
 *   Changes:
 *   • Ghost detection is now GATED on `TRUST_TYPE_S=true` (default). With
 *     the default TRUE, `isGhostSaved = false` UNCONDITIONALLY — SAP's
 *     text response is trusted at face value. Post-save verification
 *     (1.5s later, via fetchLiveOrders) is now the sole authoritative
 *     check. Matches ebidding-secure.js which never inspects Type or
 *     ChangeNo markers. Set TRUST_TYPE_S=false to opt back into the
 *     conservative v3.34-era ghost detection.
 *   • Added `_trustSavedText` — text-based success match (SAP "Saved"
 *     even with empty Type) so isRealSuccess correctly flags true saves.
 *   • Tightened v3.39's worker-exit warning: only fires on a GENUINE
 *     silent drop (finalOutcome=null AND no exception caught). The
 *     `outcome=skipped` case (SAP hasn't unlocked captcha yet) is now
 *     suppressed — it fired 251 times per window in the v3.39 build.
 *
 * v3.39 — EXACT-MATCH BLACKLIST + CSV RULES + SILENT-DROP DIAGNOSTICS
 *         (user 2026-08-11 live-run report):
 *   User's directive (Hindi/Hinglish): "RADHA KRISHNA CONSTRUCTION diya
 *   tha lekin delet me naam thora alag hai RADHA KRISHNA TRADERS hai tho
 *   skip kar diya jab ki wo hit karna tha… input2 me bhi same pura naam
 *   proper match kar he save karna hai matlab ek dam same save ho koi
 *   oder chutna nahi chaiye".
 *
 *   Live-log analysis (06:45 window):
 *     • Scan showed `bl=10 no-rule=14` — 10 orders blacklisted, 14 no-rule
 *     • bids.csv logged 4 SAVED-TIED rows for 3 batches
 *     • Batch 2 (AMRAPARA/TALIBPUR/BALURGHAT) was submitted but produced
 *       NO response entry in any log — a fully silent drop.
 *
 *   Changes:
 *   • Blacklist match: EXACT case-insensitive equality only. Previously
 *     `n === b || n.includes(b) || b.includes(n)` — bidirectional
 *     substring — caused false positives (e.g., "RADHA KRISHNA
 *     CONSTRUCTION" would match delete-list "RADHA KRISHNA TRADERS" iff
 *     a shorter common prefix was somewhere in the list, or a suffix like
 *     "TRADERS" collided with "TRADERSE" typo). Set
 *     BLACKLIST_MATCH_MODE=substring in .env to restore legacy behaviour.
 *   • CSV rule match: EXACT only by default. Pass-2 substring fallback
 *     is now gated on CSV_MATCH_MODE=substring (default 'exact'). User's
 *     CSV already lists all destination variants (RAIGANJ, RAIGANJ - STO,
 *     etc.) so exact-only is safe and eliminates the "KANDI matches
 *     KANDIGRAM" style false hits.
 *   • Worker-exit safety net: `runAll()` now wraps its per-batch loop in
 *     try/catch and logs a `[worker] ✗ WORKER ERROR` line plus writes a
 *     WORKER_ERROR row to bids.csv whenever an unhandled exception drops
 *     the batch. Also emits `[worker] ⚠ batch exit without persisted
 *     outcome` when a batch completes without any persisted result. This
 *     surfaces the AMRAPARA-style silent drop observed in the 06:45 log.
 *   • Per-order visibility: the "waiting for matched orders" telemetry
 *     now includes samples of the first 5 blacklisted vbelns (with
 *     customer name), first 5 no-rule vbelns (with destination + SPI),
 *     and first 3 club-dropped groups. User can spot mis-configuration
 *     immediately without SAP-side inspection.
 *
 * v3.38 — PRE-BOUNDARY ORDER-CAPTURE FIX (user 2026-08-10 log analysis):
 *   User's engine.log showed EVERY window logging:
 *     "🎯 EARLY-DROP FIRE @ T-500ms — attempting direct speculative submit"
 *     "🎯 EARLY-DROP FIRE: no cached orders yet — cannot speculatively submit."
 *   User explained SAP releases pre-boundary orders at ~T-1s and each
 *   fetchLiveOrders round-trip takes 1500-2000ms; the previous single-in-flight
 *   busy-guard let one slow fetch block ~14 poll ticks so the T-500ms
 *   probe consistently missed the release moment.
 *
 *   Changes:
 *   • Orders poller HOT-ZONE mode: within ±5s of boundary (or in a hot
 *     window), interval drops from 150ms→50ms AND max-inflight goes from
 *     1→3. A stalled 2s-long fetch no longer blocks the next probe; SAP's
 *     pre-boundary release moment gets multiple parallel probes.
 *   • Empty-response guard: a late-arriving empty fetch will no longer
 *     wipe a previously-populated `ctx._cachedOrders` (protects against
 *     racy overwrites now that we allow parallel fetches).
 *   • Early-drop FIRE now SPIN-WAITS for a matched cached-orders list
 *     (EARLY_DROP_WAIT_MS=1500 default, 10ms tick). Instead of bailing at
 *     T-500ms, it keeps checking every 10ms — the moment the parallel
 *     orders-poller populates the cache with a non-empty matched list,
 *     it fires. Hard-caps at boundary crossing so post-boundary path
 *     picks up cleanly.
 *   • Also picks up v3.36 TRUST_TYPE_S fix — Raiganj/Rajgram GHOST-SAVED
 *     false-positives observed in the user's 2026-08-10 log (Vbelns
 *     1154908154/1154906389/1154906477 were retried as ghost then verified
 *     as persisted 6s later) are eliminated.
 *
 * v3.37 — PRE-WINDOW PLANNER + 10 ms CAPTCHA POLL (user 2026-08-08 log analysis):
 *   User shared a screenshot of a reference bot's timeline:
 *     10:44:59  ✓ Bid order list fetched: 40 orders
 *     10:44:59  ✓ CSV matching: 1 rows matched across 1 groups
 *     10:44:59  ℹ Batch size: 3, Total batches: 1
 *     10:44:59  ℹ First batch applied: 1 groups
 *     10:45:00  ℹ ⏳ Submitting in 00:00:02.944
 *     10:45:00  ℹ Polling SAP for captcha availability (catching it as it opens)…
 *     10:45:01  ✓ Captcha became available after 3 polling attempts! (Captured in 1008ms)
 *     10:45:01  ✓ Captcha solved: "TK58P"
 *     10:45:01  ★ SAP sent the captcha! Submitting instantly to beat the crowd…
 *     10:45:01  ★ Starting auto-continuous batch submission…
 *   Reference flow: fetch+plan T-1000ms → aggressive captcha poll → submit-instant → Rank 1.
 *
 *   Changes:
 *   • CAPTCHA_POLLER_MS default 50→10 (matches reference `sleep(10)`
 *     inner-loop; captcha caught within FIRST poll after SAP unlocks).
 *   • Pre-window planner in orders poller: at T ≤ 2500 ms, run
 *     `buildBatches` ONCE per window and cache the plan on `ctx._cachedPlan`
 *     + log the exact same 4-line block ("Bid order list fetched" / "CSV
 *     matching" / "Batch size" / "First batch applied") the reference bot
 *     shows. Zero-latency at captcha unlock.
 *   • Captcha poller INSTANT-SUBMIT path prefers the pre-built plan
 *     (`havePreBuilt` fast-path); falls back to inline build if plan was
 *     invalidated (e.g., fresh orders arrived after plan was built).
 *
 * v3.36 — 24×7 ROBUST-SAVE PARITY (user 2026-07-24, ebidding-secure.js reference):
 *   User uploaded a reference bot ("ebidding-secure.js") that runs 24×7
 *   without missing saves ("save bhaut acche se ho raha, jo missing hai
 *   engine me lo — 24×7 run kare jaise ye karta hai"). Comparing the two:
 *
 *   Changes:
 *   • TRUST_TYPE_S=true (default) — any SAP Type='S' response is trusted
 *     as a real success unconditionally. Ghost-marker retry path only fires
 *     for empty/'E' types. ebidding-secure.js never inspects ChangeNo /
 *     CreatedOn / CreatedAt — those are transient markers that populate on
 *     subsequent SessionSet fetches. v3.34 already relaxed this partially;
 *     v3.36 makes it complete so no legitimate save is ever retried and
 *     no captcha is burnt on ghost false-positives. Post-save monitor
 *     (1.5s later) still verifies actual persistence via fetchLiveOrders
 *     and logs any mismatch clearly.
 *   • INFO_INSTANT_RETRY_MAX=5 (default) — on Type='I' (info-level)
 *     responses (almost always "wrong captcha"), fetch a fresh captcha and
 *     retry the same batch inside the current tick, up to 5 attempts.
 *     Previously returned { retry:true } which deferred to the next scan
 *     (1-2s delay during hot windows, wasting saves-per-second). Matches
 *     `ebidding-secure.js#submitBids` which loops up to 10× on 'I'.
 *
 * v3.35 — PARALLEL ORDERS POLLER (user 2026-07-23 live log analysis):
 *   Live 18:15 window showed captcha ready at T+661ms but instant-dispatch
 *   happened at T+2432ms (1771ms gap) because tick()'s fetchLiveOrders was
 *   blocking the captcha-ready → submit path. Fix: new independent orders
 *   poller (150ms interval) running in PARALLEL with the captcha poller
 *   (v3.33). Orders are always pre-cached on `ctx._cachedOrders` before
 *   captcha unlocks, so the instant-submit-from-poller fires immediately.
 *   Also: captcha-poller now fetches orders INLINE if cache is empty as a
 *   safety net. Target: full save at :45:01 IST from AWS Mumbai.
 *
 * v3.34 — GHOST FIX + REVERSE MATCH + INSTANT-SUBMIT-FROM-POLLER (user 2026-07-23):
 *   Live log analysis of 09:45 window revealed our v3.24 ghost detection
 *   was falsely marking GENUINELY successful saves as ghost. SAP returned
 *   `Type=S, Message="Bidding Amount Saved Successfully.", Ev_Text=""` but
 *   also `ChangeNo=""` + `CreatedOn=null` + `CreatedAt="PT0S"` — this is
 *   SAP's IMMEDIATE-response signature for a real success (persistence
 *   markers only appear on subsequent SessionSet fetches). Bot retried 3×
 *   causing hammering + likely triggering anti-fraud.
 *
 *   Changes:
 *   • Ghost detection: only mark ghost if ghost-markers present AND SAP
 *     did NOT explicitly acknowledge success. If Type='S' + Message="Saved
 *     Successfully" + Ev_Text=empty, treat as REAL success (no retry).
 *   • Reverse order match: `MATCH_ORDER_REVERSE=true` (default) iterates
 *     BidOrderListSet from BOTTOM. User claim: 60% higher Rank 1 chance —
 *     less contested by top-down scanning competitors.
 *   • Instant-submit-from-poller: when captcha poller (v3.33) unlocks and
 *     cached orders exist, dispatches `makeWorkerPool()` inline from the
 *     50ms poller tick — bypasses next tick() scheduling (200-500ms lag).
 *     Target: full save by :45:01 IST per user's directive.
 *
 * v3.33 — INDEPENDENT CAPTCHA POLLER + extended pre-scan (user directive 2026-07-19):
 *   "ek scanner laga do jo bid window k khulne se pehele he scan karne lage
 *    or jaise window khule submit kar de captcha dikhte he" —
 *   Add a scanner that starts before the window opens, and submits the
 *   instant captcha appears.
 *
 *   Changes:
 *   • Extended pre-scan: `isHotWindow()` returns true for the ENTIRE minute
 *     :14 or :44 (60s pre-warm, was 30s) so BidOrderListSet scanner and
 *     captcha poller both have more runway to warm up.
 *   • Independent captcha poller: new 50ms `setInterval` loop that runs
 *     out-of-band from tick(). Starts polling 90s before each boundary
 *     (or immediately when isHotWindow). The moment SAP unlocks captcha,
 *     solves via local server and caches on `ctx._preCaptcha[sessionId]`.
 *   • Instant-dispatch hook: `resolveCaptcha()` checks the pre-cache FIRST
 *     and uses the pre-solved captcha if fresh (<3s). Shaves 100-300ms
 *     off the boundary→submit latency (captcha fetch was previously
 *     sequential inside tick, blocking the 200-500ms fetchOrders call).
 *   • Config: `CAPTCHA_POLLER_MS=50` (interval), `CAPTCHA_POLLER_LEAD_MS=90000`
 *     (activation lead time). Set POLLER_MS=0 to disable.
 *   • Mirrors the SAP browser controller (`EBidding-dbg.controller.js`)
 *     which uses `getCaptcha(...poll=true, interval=50)` to auto-fire save.
 *
 * v3.32 — READY-TO-USE (user directive 2026-07-19):
 *   • EARLY_DROP disabled by default (`EARLY_DROP_MS=0` in .env). The
 *     July 19 log proved early-drop only works on fastpath windows and
 *     wasn't firing due to tick-loop timing. Reverts to the proven
 *     "detect captcha post-boundary → save immediately" flow that
 *     previously achieved Rank 2. Can be re-enabled via .env for testing.
 *   • Captcha-timing CSV telemetry — new `logs/captcha-timing-YYYY-MM-DD.csv`
 *     records per-window (boundary_ms, first_captcha_ms, latency_ms,
 *     session, captcha_flag, sample). Answers "SAP captcha kab dega, hum
 *     kab detect karte hai" quantitatively.
 *   • Ghost-save log clarified — Vbelns given up in THIS window will retry
 *     in NEXT window AND on ANY new Vbeln for same destination (never
 *     permanent blacklist — destinations get bid 1000×/day, per user).
 *
 * v3.31 — PRECISION EARLY-DROP (fixes v3.30 setTimeout skipping):
 *   v3.30 tried to fire from the main tick loop, but each tick() call takes
 *   200-500ms during pre-boundary (SAP is slow). Loop jumped from T-1200ms
 *   straight to T+1000ms, SKIPPING the T-300 to T-0 window entirely.
 *   Fix: schedule BOTH the CSRF refresh AND the FIRE via `setTimeout` at
 *   precise target timestamps when we first enter the ~5s runway. FIRE now
 *   ALSO directly dispatches a submit from `ctx._cachedOrders` bypassing
 *   tick() so timing is guaranteed. Also added EvCaptchaFlag transition
 *   logging so user can see fastpath availability per window.
 *
 * v3.30 — EARLY DROP ("1 sec pehle" trick):
 *   Bot now fires EBiddingSaveSet EARLY_DROP_MS ms (default 500) BEFORE the
 *   :15/:45 boundary so the request lands on SAP AT boundary open — beating
 *   competitors whose submits fire AT boundary + network-RTT. Replicates the
 *   user's manual UI behaviour ("mai UI me 1 sec pehle chor deta hu") which
 *   was achieving ~50% Rank 1. CSRF is freshly minted 1s before the fire so
 *   SAP doesn't flag it as pre-window stale.
 *
 * Improvements over v1:
 *   • undici Pool per host (SAP main, local captcha solver) → faster than axios,
 *     persistent HTTP/1.1 keep-alive across the whole process.
 *   • Captcha pipelining per worker (prefetch next while current bid submits).
 *   • Smart batcher: singles-first in chunks of BATCH_SIZE, then club groups.
 *   • 4 parallel workers with jittered stagger (30-90 ms) to avoid burst
 *     alignment with SAP's WAF.
 *   • CSRF token cached; auto-refreshed on 403 (serialised via mutex so
 *     multiple parallel workers don't stampede the token endpoint).
 *   • Retry logic:
 *       - Wrong captcha  → immediate retry with fresh captcha (max 3 attempts)
 *       - WAF (HTTP 406) → exponential back-off 30 s → 60 s → 120 s (reset
 *         to 30 s after 5 min of clean requests)
 *       - Reduce-amount rejection → optional AUTO_ADJUST re-price + resubmit
 *   • Metrics dumped every 30 s (latency, captcha rate, WAF events, throughput).
 *
 * File layout expected next to this file:
 *   ./creds.json                  (SAP session — see `AuthConfig` below)
 *   ./files/input2.csv            (bidding rules)
 *   ./files/delete.csv            (blacklist)
 *   ./cookie.txt                  (raw browser cookie header)
 *   ./token.txt                   (auto-managed CSRF cache)
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const fs       = require('fs');
const path     = require('path');
const crypto   = require('crypto');
const csv      = require('csv-parser');
const { Pool, Agent, setGlobalDispatcher } = require('undici');
const { build } = require('./logger');

const log = build('engine');

// ---- Config ----------------------------------------------------------------

const SAP_BASE_URL   = process.env.SAP_BASE_URL || 'https://rise.eye2serve.com:8443/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV';
const SAP_ORIGIN     = new URL(SAP_BASE_URL).origin;
const SAP_PATH_PFX   = new URL(SAP_BASE_URL).pathname.replace(/\/$/, '');
const CAPTCHA_URL    = process.env.CAPTCHA_URL || 'http://localhost:3000/solve-captcha';
const CAPTCHA_ORIGIN = new URL(CAPTCHA_URL).origin;
const CAPTCHA_PATH   = new URL(CAPTCHA_URL).pathname || '/';
const VENDOR_ID      = process.env.VENDOR_ID || '2207936';
const PLANT_CODE     = process.env.PLANT_CODE || '6924';
const POLL_MS        = parseInt(process.env.POLL_MS || '5', 10);
const BATCH_SIZE     = parseInt(process.env.BATCH_SIZE || '3', 10);
const PARALLEL_BATCHES = parseInt(process.env.PARALLEL_BATCHES || '4', 10);

const TIME_ENDED_COOLDOWN_MS = parseInt(process.env.TIME_ENDED_COOLDOWN_MS || '30000', 10);

// v3.23 — Configurable SAP request timeouts. Bumped from 4-5s → 6-10s so the
// bot is more patient with slow SAP responses (especially during peak or when
// user's ISP has latency spikes). Lower values = faster fail-and-retry;
// higher values = more patient (fewer "tick failed" logs).
const FETCH_ORDERS_TIMEOUT_MS  = parseInt(process.env.FETCH_ORDERS_TIMEOUT_MS  || '10000', 10);
const FETCH_CAPTCHA_TIMEOUT_MS = parseInt(process.env.FETCH_CAPTCHA_TIMEOUT_MS || '6000', 10);
const SUBMIT_TIMEOUT_MS        = parseInt(process.env.SUBMIT_TIMEOUT_MS        || '5000', 10);

// L1 auto-undercut settings — after each save, re-refetch the Order List and
// if we're not rank 1 (someone else tied our amount and came first), auto
// re-bid at (L1BidAmount - L1_UNDERCUT_STEP) to secure rank 1.
const L1_UNDERCUT              = String(process.env.L1_UNDERCUT || 'true').toLowerCase() === 'true';
const L1_UNDERCUT_STEP         = parseFloat(process.env.L1_UNDERCUT_STEP || '1');
const L1_UNDERCUT_MAX_ATTEMPTS = parseInt(process.env.L1_UNDERCUT_MAX_ATTEMPTS || '2', 10);
const L1_UNDERCUT_MIN_REMAINING_MS = parseInt(process.env.L1_UNDERCUT_MIN_REMAINING_MS || '15000', 10);

const AUTO_ADJUST         = String(process.env.AUTO_ADJUST || 'false').toLowerCase() === 'true';
const MAX_ADJUST_RETRIES  = parseInt(process.env.MAX_ADJUST_RETRIES || '3', 10);
const SKIP_RANK_PREVIEW   = String(process.env.SKIP_RANK_PREVIEW || 'true').toLowerCase() === 'true';

// v3.36 — 24x7 ROBUST-SAVE parity with ebidding-secure.js (user 2026-07-24):
// User uploaded a reference bot ("ebidding-secure.js") that runs 24×7 without
// missing saves. Two robustness patterns were missing here:
//
// TRUST_TYPE_S (default true) — When SAP replies Type='S', trust it as a real
//   success unconditionally (skip ghost-marker retry). ebidding-secure.js NEVER
//   inspects ChangeNo/CreatedOn — those are just "not-yet-persisted" markers
//   that populate on subsequent SessionSet fetches. Retrying on Type=S burns
//   captcha attempts and can trigger SAP anti-fraud. v3.34 already relaxed
//   this partially (via _sapExplicitSuccess), but v3.36 makes it complete:
//   any Type='S' is trusted immediately; ghost detection only fires for
//   type='E' or empty type responses. Post-save monitor (1.5s later) still
//   verifies actual persistence via fetchLiveOrders and logs any mismatch.
//   Set to 'false' to fall back to v3.34 conditional ghost detection.
//
// INFO_INSTANT_RETRY_MAX (default 5) — When SAP replies Type='I' (info-level,
//   almost always "wrong captcha" or "captcha expired"), immediately fetch a
//   fresh captcha and retry the SAME batch inside the current tick — up to
//   N attempts. Prior behaviour was `return { retry:true }` which delayed
//   the retry by 1-2s (next scan). During the 5-min window, saving 1-2s per
//   info-retry × 10-20 orders = major throughput win. Matches
//   ebidding-secure.js's `submitBids` while-loop (up to 10 retries).
const TRUST_TYPE_S           = String(process.env.TRUST_TYPE_S || 'true').toLowerCase() === 'true';
const INFO_INSTANT_RETRY_MAX = parseInt(process.env.INFO_INSTANT_RETRY_MAX || '5', 10);

const WAF_MIN_MS   = parseInt(process.env.WAF_BACKOFF_MIN_MS || '30000', 10);
const WAF_MAX_MS   = parseInt(process.env.WAF_BACKOFF_MAX_MS || '120000', 10);
const WAF_RESET_MS = parseInt(process.env.WAF_RESET_AFTER_MS || '300000', 10);

const METRICS_MS   = parseInt(process.env.METRICS_INTERVAL_MS || '30000', 10);

// v3.30 — EARLY DROP (a.k.a. "1-second-early trick"). Replicates the user's
// manual UI behaviour: click Save ~1s BEFORE the :15/:45 boundary. SAP appears
// to accept these pre-boundary saves and processes them AT boundary open,
// giving Rank 1 with ~50% success in manual tests.
//
// The bot fires the submit `EARLY_DROP_MS` ms BEFORE the clock boundary so the
// request lands on SAP servers at (or microseconds before) the boundary open —
// beating competitors whose requests fire AT boundary + network RTT (100-400ms).
//
// Set to 0 to disable and revert to strict-at-boundary behaviour.
// Recommended: 300-700ms (network-RTT-dependent). Default 500ms.
const EARLY_DROP_MS = parseInt(process.env.EARLY_DROP_MS || '500', 10);

// How long BEFORE the early-drop moment to freshly mint CSRF. SAP flags
// too-old ("pre-window") CSRF tokens as stale, so we mint the token ~1s before
// the actual pre-boundary submit fire.
const EARLY_DROP_CSRF_LEAD_MS = parseInt(process.env.EARLY_DROP_CSRF_LEAD_MS || '1000', 10);

const ROOT       = __dirname;
const COOKIE_FILE = path.join(ROOT, 'cookie.txt');
const TOKEN_FILE  = path.join(ROOT, 'token.txt');
const FILES_DIR   = path.join(ROOT, 'files');
const INPUT_CSV   = path.join(FILES_DIR, 'input2.csv');
const DELETE_CSV  = path.join(FILES_DIR, 'delete.csv');
const PRIORITY_CSV = path.join(FILES_DIR, 'priority.csv');

// Priority COF Order IDs (Vbeln) — matched orders whose Vbeln is in this
// set are pushed to the FRONT of the bid plan, so they get submitted before
// any non-priority order in the same window. Sources are merged:
//   1) files/priority.csv           — one Vbeln per line (or CSV column "Vbeln"/"COF Order ID")
//   2) PRIORITY_VBELNS env var      — comma-separated Vbelns
// Reloaded once per :15/:45 window boundary so user can edit priority.csv
// mid-run without restarting the bot.
const PRIORITY_VBELNS_ENV = process.env.PRIORITY_VBELNS || '';

// ---- Undici pools ----------------------------------------------------------

// Global dispatcher — everyone else in the process (default fetch etc.) will
// also use these keep-alive connections.
//
// Note on DNS caching: v3.18 tried `cacheable-lookup` for shaving 20-100ms
// off cold connections, but it triggers `EDESTRUCTION` errors on Windows
// (Node.js DNS resolver bug). Reverted — OS-level DNS caching (both
// Windows and Linux) handles this well enough, and the keep-alive pool
// (below) means we rarely hit fresh lookups anyway.
setGlobalDispatcher(new Agent({
  keepAliveTimeout: 30_000,
  keepAliveMaxTimeout: 60_000,
  connectTimeout: 5_000,
  connections: 32,
}));

const sapPool = new Pool(SAP_ORIGIN, {
  connections: 32,
  pipelining: 1,
  // keepAliveTimeout must be LOWER than SAP's LB idle timeout (~30s observed),
  // otherwise we send on a socket that SAP already killed and get
  // "HeadersTimeoutError" or "socket hang up" (v3.20 root cause). Setting to
  // 20s gives us a safety margin: our socket is closed & reopened before SAP's
  // LB timeout fires, so subsequent requests always land on a live connection.
  keepAliveTimeout: 20_000,
  headersTimeout: 15_000,
  bodyTimeout: 15_000,
  // Note: HTTP/2 (allowH2: true) was tried but SAP's Web Dispatcher does not
  // support ALPN "h2" cleanly on this tenant — every request timed out with
  // "HeadersTimeoutError". Sticking to HTTP/1.1 + keep-alive which is proven.
});

const solverPool = new Pool(CAPTCHA_ORIGIN, {
  connections: 8,
  pipelining: 1,
  keepAliveTimeout: 30_000,
  headersTimeout: 20_000,
  bodyTimeout: 25_000,
});

// ---- WAF back-off (exponential) --------------------------------------------

const waf = {
  until: 0,
  step: WAF_MIN_MS,
  lastHitAt: 0,
  hits: 0,
};

function markWaf(reason) {
  const now = Date.now();
  // If it's been > WAF_RESET_MS since last hit, restart at minimum step.
  if (now - waf.lastHitAt > WAF_RESET_MS) waf.step = WAF_MIN_MS;
  else                                    waf.step = Math.min(waf.step * 2, WAF_MAX_MS);
  waf.lastHitAt = now;
  waf.until = now + waf.step;
  waf.hits++;
  log.error(`⚠  WAF hit (${reason}) — pausing ALL requests for ${Math.round(waf.step / 1000)}s. Total hits: ${waf.hits}`);
}
function wafActive()      { return Date.now() < waf.until; }
function wafRemainingMs() { return Math.max(0, waf.until - Date.now()); }

// ---- GLOBAL SUBMIT MUTEX ---------------------------------------------------
//
// SAP's anti-fraud triggers when the SAME vendor submits from multiple sessions
// concurrently — result: HTTP 201 with EMPTY body, bid NOT saved server-side
// (browser shows nothing, user gets Rank 10). Fix: serialise the actual submit
// HTTP call across ALL sessions so only ONE bid hits SAP at any instant.
//
// Multiple cookies (cookie2/3/4.txt) are still useful — they become sequential
// FALLBACKS (session A silent-fails → session B retries with a fresh captcha,
// etc.) instead of concurrent bombardment.
const globalSubmitMutex = (() => {
  let chain = Promise.resolve();
  const obj = {
    _busy: false,
    run(fn) {
      const wrapped = async () => {
        obj._busy = true;
        try { return await fn(); }
        finally { obj._busy = false; }
      };
      const p = chain.then(wrapped, wrapped);
      chain = p.catch(() => {});
      return p;
    },
  };
  return obj;
})();

// ---- IST bid-window scheduler ----------------------------------------------
//
// User confirmed: SAP bid windows open on FIXED clock schedule in IST:
//   :15 and :45 of every hour  → e.g. 14:15, 14:45, 15:15, 15:45 …
// Each window stays open ~5 min then closes. This lets us:
//   1) Pre-warm TLS + refresh CSRF ~30 s BEFORE the window opens
//   2) Aggressively poll captcha ~10 s BEFORE + first 5 min AFTER the window
//   3) Idle-sleep between windows to avoid needless SAP hits (WAF-safe)
function getISTNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const o = {};
  for (const p of parts) if (p.type !== 'literal') o[p.type] = parseInt(p.value, 10);
  return o; // { hour, minute, second }
}

// ms until the next :15 or :45 IST boundary. Always > 0, < 30 min.
function msUntilNextWindow() {
  const { minute, second } = getISTNow();
  const ms = new Date().getMilliseconds();
  const secondsIntoMinute = second + ms / 1000;
  // Determine next boundary in minutes-into-hour
  let nextMin;
  if (minute < 15) nextMin = 15;
  else if (minute < 45) nextMin = 45;
  else nextMin = 75; // next hour :15 (i.e. 60 + 15)
  const secondsToGo = (nextMin - minute) * 60 - secondsIntoMinute;
  return Math.max(0, Math.round(secondsToGo * 1000));
}

// Are we in an active/soon bid-window window?
//   pre-warm : 60 s BEFORE :15 / :45  → true (aggressive polling starts,
//              extended from 30s in v3.33 so the independent captcha poller
//              and BidOrderListSet scanner have more runway to warm caches)
//   active   : first 5 min AFTER      → true (window is open, keep tight)
//   idle     : otherwise              → false
function isHotWindow() {
  const { minute, second } = getISTNow();
  // Pre-warm: entire minute :14 or :44 (60s before boundary — v3.33)
  if ((minute === 14 || minute === 44)) return true;
  // Active window: :15–:19 and :45–:49 (first 5 min after open)
  if (minute >= 15 && minute < 20) return true;
  if (minute >= 45 && minute < 50) return true;
  return false;
}

// v3.30 — Are we inside the EARLY-DROP fire window?
//   Returns true when we're within `EARLY_DROP_MS` ms BEFORE the next :15/:45
//   boundary AND EARLY_DROP is enabled. During this phase the bot fires
//   `EBiddingSaveSet` speculatively so the request lands on SAP AT boundary
//   open (mirrors the user's manual "1 sec pehle" UI click).
function isEarlyDropWindow() {
  if (EARLY_DROP_MS <= 0) return false;
  return msUntilNextWindow() <= EARLY_DROP_MS;
}

/**
 * Format a human-friendly "how long until / how long past the :15/:45 boundary"
 * message. Pre-warm phase (last 30 s before boundary) shows "Ns BEFORE next
 * :15/:45 opens" so the user doesn't see a huge "1774s past" number that
 * really refers to the PREVIOUS boundary.
 */
function boundaryStatusText() {
  const untilNextSec = Math.round(msUntilNextWindow() / 1000);
  const { minute, second } = getISTNow();
  const inPreWarm = (minute === 14 || minute === 44) && second >= 30;
  if (inPreWarm || untilNextSec < 60) {
    return `~${untilNextSec}s BEFORE next :15/:45 window opens (pre-warm phase)`;
  }
  const secsPast = 30 * 60 - untilNextSec;
  return `~${secsPast}s past :15/:45 boundary`;
}

/**
 * Remove entries from a Map<key, timestampMs> whose value (timestamp) is
 * older than `thresholdMs`. Returns the number of entries removed. Used at
 * :15/:45 boundary crossover to age-out per-window state without wiping
 * entries that were just added inside the boundary-crossing tick.
 */
function clearOlderThan(map, thresholdMs) {
  let removed = 0;
  for (const [k, ts] of map) {
    if (ts < thresholdMs) { map.delete(k); removed++; }
  }
  return removed;
}

// ---- Auth (cookie + CSRF token) --------------------------------------------

/**
 * One SAP session = one cookie + its own CSRF token + its own session-serialisation
 * mutex. SAP maintains exactly ONE active captcha per session, so parallelism
 * across bids is only possible via MULTIPLE independent sessions (different
 * cookies from different browser logins).
 */
class AuthConfig {
  constructor(id, cookieFile, tokenFile) {
    this.id = id;                          // e.g. "s1", "s2"
    this.cookieFile = cookieFile;
    this.tokenFile = tokenFile;
    this.cookie = this._read(cookieFile);
    this.token  = this._read(tokenFile);
    this._refreshInFlight = null;
    this._lastPlantConf = null;
    // Per-session serialisation mutex — fetch-captcha → submit is atomic.
    // Sessions are independent, so mutexes are per-instance.
    let chain = Promise.resolve();
    this.mutex = {
      _busy: false,
      run: (fn) => {
        const wrapped = async () => {
          this.mutex._busy = true;
          try { return await fn(); }
          finally { this.mutex._busy = false; }
        };
        const p = chain.then(wrapped, wrapped);
        chain = p.catch(() => {});
        return p;
      },
    };
    if (!this.cookie) {
      throw new Error(`Session ${id}: ${cookieFile} is empty. Paste browser Cookie header there.`);
    }
  }

  _read(p) {
    try { return fs.readFileSync(p, 'utf8').trim(); } catch { return ''; }
  }

  headers(extra = {}) {
    return {
      'content-type'         : 'application/json',
      'accept'               : 'application/json',
      'dataserviceversion'   : '2.0',
      'maxdataserviceversion': '2.0',
      'x-csrf-token'         : this.token || 'Fetch',
      'cookie'               : this.cookie,
      'x-requested-with'     : 'XMLHttpRequest',
      'user-agent'           : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      ...extra,
    };
  }

  async refreshToken() {
    if (this._refreshInFlight) return this._refreshInFlight;
    this._refreshInFlight = (async () => {
      log.info(`[${this.id}] Refreshing CSRF token…`);
      try {
        const { statusCode, headers } = await sapPool.request({
          path: `${SAP_PATH_PFX}/SessionSet('')`,
          method: 'GET',
          headers: this.headers({ 'x-csrf-token': 'Fetch' }),
        });
        const tok = headers['x-csrf-token'];
        if (!tok || String(tok).toLowerCase() === 'required') {
          throw new Error(`HTTP ${statusCode} — no CSRF token returned. Cookie may have expired.`);
        }
        this.token = String(tok);
        fs.writeFileSync(this.tokenFile, this.token, 'utf8');
        log.info(`[${this.id}] CSRF token saved to ${path.basename(this.tokenFile)}`);
        return this.token;
      } finally {
        this._refreshInFlight = null;
      }
    })();
    return this._refreshInFlight;
  }
}

/**
 * Discover session cookie files in the working directory.
 *
 * Convention:
 *   cookie.txt    → session s1  (backward-compat with single-session mode)
 *   cookie2.txt   → session s2
 *   cookie3.txt   → session s3
 *   cookie4.txt   → session s4
 *   ...           up to cookie10.txt
 *
 * Each file: one line = raw browser Cookie header from a separate SAP login.
 * All sessions must be for the SAME vendor+plant — they submit in parallel
 * to the same bid queue, so the vendor identity has to match.
 *
 * Returns an array of { id, cookieFile, tokenFile } (never empty; falls back
 * to single cookie.txt if it's the only one).
 */
/**
 * SINGLE-SESSION mode (v3.6 — reverted from multi-session).
 *
 * Old-file behaviour that was proven to save bids in the browser: use ONE
 * cookie (cookie.txt) with ONE SAP session. Multi-cookie parallel submits
 * were causing SAP anti-fraud vendor-lockouts (silent empty HTTP 201). Even
 * with a global submit mutex, having 4 sessions doing fetch-captcha in
 * background was polluting SAP's session-captcha state and lowering the
 * observed save rate.
 *
 * Any cookie2.txt/cookie3.txt/cookie4.txt files in the folder are IGNORED
 * (kept on disk for future manual failover if the user ever wants to
 * hot-swap primary session — just move cookie2.txt → cookie.txt and restart).
 */
function discoverSessions() {
  const sessions = [];
  if (fs.existsSync(COOKIE_FILE) && fs.readFileSync(COOKIE_FILE, 'utf8').trim()) {
    sessions.push({ id: 's1', cookieFile: COOKIE_FILE, tokenFile: TOKEN_FILE });
  }
  if (!sessions.length) {
    log.error(`No cookie file found. Paste your logged-in browser Cookie header into ${COOKIE_FILE}`);
    process.exit(1);
  }
  // Warn (once) if the user still has old multi-cookie files sitting around,
  // so it's clear they are being ignored now.
  const extraCookies = [];
  for (let n = 2; n <= 10; n++) {
    const cf = path.join(ROOT, `cookie${n}.txt`);
    if (fs.existsSync(cf) && fs.readFileSync(cf, 'utf8').trim()) extraCookies.push(path.basename(cf));
  }
  if (extraCookies.length) {
    log.warn(`ⓘ Ignoring ${extraCookies.length} extra cookie file(s): ${extraCookies.join(', ')} — single-session mode is more reliable. Move one to cookie.txt to switch primary.`);
  }
  return sessions;
}

/**
 * Bid log book — every submit attempt (success, wrong-captcha, rejected) is
 * appended as one CSV row to `logs/bids-YYYY-MM-DD.csv` for post-mortem.
 * Rotated daily so files stay small.
 */
const bidLog = (() => {
  const dir = path.join(ROOT, 'logs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  let currentDate = '';
  let stream = null;
  const HEADER = 'timestamp,session,sap_order_id,city,spi,csv_rate,submit_ms,status,message\n';
  function open() {
    const today = new Date().toISOString().slice(0, 10);
    if (today === currentDate && stream) return stream;
    if (stream) { try { stream.end(); } catch (_) { /* ignore */ } }
    currentDate = today;
    const file = path.join(dir, `bids-${today}.csv`);
    const exists = fs.existsSync(file);
    stream = fs.createWriteStream(file, { flags: 'a' });
    if (!exists) stream.write(HEADER);
    return stream;
  }
  function esc(v) {
    const s = String(v == null ? '' : v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }
  return {
    write(row) {
      try {
        const s = open();
        s.write([
          new Date().toISOString(),
          row.session || '',
          row.sap_order_id || '',
          row.city || '',
          row.spi || '',
          row.csv_rate ?? '',
          row.submit_ms ?? '',
          row.status || '',
          row.message || '',
        ].map(esc).join(',') + '\n');
      } catch (_) { /* never let logging break bidding */ }
    },
  };
})();

/**
 * v3.32 — Captcha-timing telemetry.
 *
 * User asked (2026-07-19): "ek log laga jisme captcha kab detect hota hai
 * sap kab deta wo bhi record jare" — log when we detect captcha and when
 * SAP unlocks it, so we can quantify per-window captcha unlock latency.
 *
 * Writes one CSV row per window at the moment `nextCaptcha()` first returns
 * a non-empty solved captcha. Columns:
 *   • ts                — ISO timestamp of first detect
 *   • window_boundary   — IST HH:MM of the :15/:45 boundary this row belongs to
 *   • boundary_ms       — Date.now() at that boundary (recorded when the
 *                         :15/:45 crossing block fires, else best-guess)
 *   • first_captcha_ms  — Date.now() at first non-empty captcha
 *   • latency_ms        — first_captcha_ms - boundary_ms (positive = post-
 *                         boundary unlock, which is normal SAP behaviour)
 *   • session           — session id (s1, s2, ...)
 *   • captcha_flag      — EvCaptchaFlag as reported by SAP ('X' or '')
 *   • sample            — first 5 chars of solved captcha (for debugging)
 *
 * Rotated daily (`logs/captcha-timing-YYYY-MM-DD.csv`).
 */
const captchaTimingLog = (() => {
  const dir = path.join(ROOT, 'logs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  let currentDate = '';
  let stream = null;
  const HEADER = 'ts,window_boundary,boundary_ms,first_captcha_ms,latency_ms,session,captcha_flag,sample\n';
  function open() {
    const today = new Date().toISOString().slice(0, 10);
    if (today === currentDate && stream) return stream;
    if (stream) { try { stream.end(); } catch (_) { /* ignore */ } }
    currentDate = today;
    const file = path.join(dir, `captcha-timing-${today}.csv`);
    const exists = fs.existsSync(file);
    stream = fs.createWriteStream(file, { flags: 'a' });
    if (!exists) stream.write(HEADER);
    return stream;
  }
  function esc(v) {
    const s = String(v == null ? '' : v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }
  return {
    write(row) {
      try {
        const s = open();
        s.write([
          row.ts || new Date().toISOString(),
          row.window_boundary || '',
          row.boundary_ms ?? '',
          row.first_captcha_ms ?? '',
          row.latency_ms ?? '',
          row.session || '',
          row.captcha_flag || '',
          row.sample || '',
        ].map(esc).join(',') + '\n');
      } catch (_) { /* never let logging break bidding */ }
    },
  };
})();

// ---- Small SAP request helper (with 403 CSRF-refresh once) ----------------
//
// If the SAP cookie itself has expired/been invalidated (different browser
// login, timeout, admin-kill), then `SessionSet('')` still returns a NEW
// CSRF token successfully — but any subsequent OData call is rejected with
// HTTP 403 "CSRF token validation failed". That looked to the user like a
// bug in our code — it isn't; it's SAP saying "your cookie is dead".
//
// We track consecutive 403-after-refresh failures on the auth object and,
// after 3 of them in a row, log a LOUD RE-LOGIN warning and set a global
// cool-off so we stop hammering SAP with useless requests.
const AUTH_DEAD_THRESHOLD = parseInt(process.env.AUTH_DEAD_THRESHOLD || '3', 10);
const AUTH_DEAD_COOLDOWN_MS = parseInt(process.env.AUTH_DEAD_COOLDOWN_MS || '30000', 10);

async function sapRequest(auth, { path: p, method = 'POST', body, timeoutMs = 5000, retryOnNetworkError = false }) {
  const doOnce = () => sapPool.request({
    path: p,
    method,
    headers: auth.headers(),
    body: body ? JSON.stringify(body) : undefined,
    headersTimeout: timeoutMs,
    bodyTimeout: timeoutMs,
  });
  // Network-level retry wrapper. Only enabled for idempotent reads
  // (BidOrderListSet, EbiddingCaptchaSet) — DO NOT retry submits at this
  // layer since a HeadersTimeout may hit AFTER SAP already accepted the bid
  // (post-save verification handles that case separately).
  const NETWORK_ERR_RE = /HeadersTimeoutError|Headers Timeout|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET|ETIMEDOUT|ECONNRESET|socket hang up|other side closed/i;
  const doWithNetRetry = async () => {
    try {
      return await doOnce();
    } catch (e) {
      const msg = (e && e.message) || String(e);
      if (!retryOnNetworkError || !NETWORK_ERR_RE.test(msg)) throw e;
      // Brief backoff so the flaky socket has time to drop from the pool.
      await new Promise((r) => setTimeout(r, 150));
      auth._netRetries = (auth._netRetries || 0) + 1;
      return await doOnce(); // second attempt on a fresh socket
    }
  };
  // If auth is currently marked dead, refuse to send until cool-off passes.
  if (auth._deadUntil && Date.now() < auth._deadUntil) {
    return { statusCode: 401, headers: {}, data: { _cookieDead: true, remainingMs: auth._deadUntil - Date.now() } };
  }
  if (!auth.token) await auth.refreshToken();
  let r = await doWithNetRetry();
  const csrfHdr = (r.headers['x-csrf-token'] || '').toString().toLowerCase();
  if (r.statusCode === 403 && csrfHdr === 'required') {
    log.warn('CSRF rejected — refreshing token and retrying once.');
    await auth.refreshToken();
    r = await doWithNetRetry();

    // If retry ALSO comes back 403, the cookie itself is dead (not the token).
    // Track consecutive dead-cookie failures per auth.
    if (r.statusCode === 403) {
      auth._deadCount = (auth._deadCount || 0) + 1;
      if (auth._deadCount >= AUTH_DEAD_THRESHOLD) {
        auth._deadUntil = Date.now() + AUTH_DEAD_COOLDOWN_MS;
        // v3.21 — Throttle the loud cookie-expired banner to once every 5 min.
        // Prior to this, every 30s cooldown loop re-emitted the whole 4-line
        // banner, flooding error.log with 100s of identical entries per hour.
        const now = Date.now();
        if (!auth._lastDeadWarnAt || (now - auth._lastDeadWarnAt) > 5 * 60_000) {
          auth._lastDeadWarnAt = now;
          log.error(
            `🔒 COOKIE EXPIRED / SESSION KILLED for [${auth.id}] — SAP returns fresh CSRF but rejects every request.\n` +
            `   → Log into SAP again in your browser, copy the FULL "Cookie" request header from DevTools → Network,\n` +
            `   → Paste it into ${path.basename(auth.cookieFile)} (overwrite the whole file), delete ${path.basename(auth.tokenFile)},\n` +
            `   → Then restart the bot (pm2 restart bid-engine).\n` +
            `   ⏸  Pausing SAP requests for ${Math.round(AUTH_DEAD_COOLDOWN_MS / 1000)}s to avoid rate-limits. (This warning throttled — next in ≥5 min if still dead.)`
          );
        }
      }
    } else {
      auth._deadCount = 0; // recovered
      auth._lastDeadWarnAt = 0; // reset so we banner again next time it dies
    }
  } else if (r.statusCode >= 200 && r.statusCode < 400) {
    auth._deadCount = 0; // any success clears the dead counter
  }
  const text = await r.body.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
  return { statusCode: r.statusCode, headers: r.headers, data };
}

// ---- Metrics ---------------------------------------------------------------

const metrics = {
  startedAt: Date.now(),
  captchaAttempts: 0,
  captchaSolved: 0,
  captchaFailed: 0,
  captchaCacheMs: [],    // latency samples (cache round-trip via solver)
  submits: 0,
  submitsOk: 0,
  submitsWrongCaptcha: 0,
  submitsTimeEnded: 0,
  submitsRejected: 0,
  latencyMs: [],
  wafHits: 0,
};

function pushLatency(ms) {
  metrics.latencyMs.push(ms);
  if (metrics.latencyMs.length > 200) metrics.latencyMs.shift();
}

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function metricsDump() {
  const uptime = Math.round((Date.now() - metrics.startedAt) / 1000);
  const captchaRate = metrics.captchaAttempts
    ? +(100 * metrics.captchaSolved / metrics.captchaAttempts).toFixed(1) : 0;
  const throughputPerMin = uptime > 0 ? +(60 * metrics.submits / uptime).toFixed(1) : 0;
  log.info(
    `[metrics] uptime=${uptime}s | submits=${metrics.submits} ok=${metrics.submitsOk} ` +
    `wrong-captcha=${metrics.submitsWrongCaptcha} time-ended=${metrics.submitsTimeEnded} ` +
    `rejected=${metrics.submitsRejected} | avg-latency=${avg(metrics.latencyMs)}ms ` +
    `avg-captcha=${avg(metrics.captchaCacheMs)}ms captcha-success=${captchaRate}% ` +
    `waf-hits=${waf.hits} throughput=${throughputPerMin}/min`
  );
}

// ---- CSV -------------------------------------------------------------------

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) return resolve([]);
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data',  (d) => rows.push(d))
      .on('end',   () => resolve(rows))
      .on('error', reject);
  });
}

function buildRuleMaps(inputRows, deleteRows) {
  const rules = new Map();     // cityUpper -> [{spi, amount}, ...]
  for (const r of inputRows) {
    const city = (r['City Code Descriptio'] || r['City Code Description'] || '').trim().toUpperCase();
    const spi  = (r['Special Process Indi'] || r['Special Process Indicator'] || '').trim();
    const amt  = parseFloat(r['BIDING AMMOUNT'] || r['Bidding Amount'] || '0');
    if (!city || !amt) continue;
    if (!rules.has(city)) rules.set(city, []);
    rules.get(city).push({ spi, amount: amt });
  }
  const blacklist = deleteRows
    .map((r) => (r.Customer || r.City || Object.values(r)[0] || '').toString().trim().toUpperCase())
    .filter(Boolean);
  return { rules, blacklist };
}

function matchOrder(order, rules, ruleCitiesByLen) {
  const dest = (order.Destination || order.DestCityDesc || order.CityCodeDescription || '')
    .toString().trim().toUpperCase();
  if (!dest) return null;
  const orderSpi = (order.SPI || order.Spi || order.SpecialProcessInd || order.Zspi || '')
    .toString().trim();

  // Iterate longest ruleCity first so "KRISHNANAGAR - STO" (specific) wins
  // over "KRISHNANAGAR" (generic) when both are in the CSV.  We also prefer
  // an EXACT equal match over any substring hit at the same length.
  const candidates = ruleCitiesByLen || Array.from(rules.keys()).sort((a, b) => b.length - a.length);

  // Pass 1: exact equal match — always highest priority
  for (const ruleCity of candidates) {
    if (dest !== ruleCity) continue;
    const list = rules.get(ruleCity);
    const hit = pickBySpi(list, orderSpi, ruleCity, 'exact');
    if (hit) return hit;
  }

  // v3.39 — CSV_MATCH_MODE (user 2026-08-11 directive: "input2 me bhi same
  // pura naam proper match kar he save karna hai"). Default 'exact' skips
  // the substring pass entirely. Was previously prone to false matches
  // when partial city names collided (e.g., "KANDI" vs "KANDIGRAM").
  // Set CSV_MATCH_MODE=substring to restore the previous behaviour.
  const mode = String(process.env.CSV_MATCH_MODE || 'exact').toLowerCase();
  if (mode !== 'substring') return null;

  // Pass 2 (substring, legacy): dest.includes(ruleCity) or ruleCity.includes(dest).
  for (const ruleCity of candidates) {
    if (dest === ruleCity) continue;
    if (!(dest.includes(ruleCity) || ruleCity.includes(dest))) continue;
    const list = rules.get(ruleCity);
    const hit = pickBySpi(list, orderSpi, ruleCity, 'substr');
    if (hit) return hit;
  }
  return null;
}

/**
 * From a list of {spi, amount} rules for one city, pick the best-matching
 * one for the given order SPI.  Preference:
 *   1. SPI substring hit (e.g. CSV "1164" matches "1164-BAG-AL/…")
 *   2. Rule with empty SPI (wildcard "any")
 *   3. First rule in list
 */
function pickBySpi(list, orderSpi, ruleCity, matchKind) {
  if (!Array.isArray(list) || !list.length) return null;
  // Prefer SPI-specific rules first
  for (const rule of list) {
    if (rule.spi && orderSpi.includes(rule.spi)) {
      return { amount: rule.amount, matchedCity: ruleCity, matchedSpi: rule.spi, matchKind };
    }
  }
  // Then wildcard rules (no SPI in CSV)
  for (const rule of list) {
    if (!rule.spi) {
      return { amount: rule.amount, matchedCity: ruleCity, matchedSpi: '(any)', matchKind };
    }
  }
  return null;
}

function isCustomerBlacklisted(order, blacklist) {
  const names = [
    order.KunagName1, order.KunweName1, order.CustomerOrg, order.Customer,
    order.CustomerName, order.Kunag, order.Kunnr, order.Kunwe,
  ].filter(Boolean).map((v) => v.toString().trim().toUpperCase());
  if (!names.length) return false;
  // v3.39 EXACT-MATCH policy (user 2026-08-11 directive: "proper match kar
  // he skip karna hai"). Previously we used bidirectional substring:
  //     n === b || n.includes(b) || b.includes(n)
  // which falsely blacklisted "RADHA KRISHNA CONSTRUCTION" when the
  // delete-list had "RADHA KRISHNA TRADERS" iff a shorter prefix was in
  // the list, and generally over-blocked orders with common company
  // suffixes ("ENTERPRISE", "HARDWARE", "DAS", etc.).
  // New rule: STRICT case-insensitive equality after trim only.
  // Set BLACKLIST_MATCH_MODE=substring in .env to restore the previous
  // bidirectional-substring behaviour.
  const mode = String(process.env.BLACKLIST_MATCH_MODE || 'exact').toLowerCase();
  if (mode === 'substring') {
    return blacklist.some((b) => names.some((n) => n === b || n.includes(b) || b.includes(n)));
  }
  // Default: exact-only (safer, matches user's directive).
  return blacklist.some((b) => names.some((n) => n === b));
}

// ---- Priority (COF Order ID / Vbeln) list ----------------------------------
//
// Returns a Set<string> of priority Vbelns (COF Order IDs) merged from:
//   • files/priority.csv       — one Vbeln per line, OR CSV with a column
//                                 named "Vbeln" / "COF Order ID" / "OrderId"
//   • PRIORITY_VBELNS env var  — comma-separated Vbelns
// Blank lines, whitespace, comment lines (starting with #) and headers are
// ignored. Vbelns are normalised via `String(v).trim()` — SAP's Vbeln field
// is a numeric string (10 chars), so string equality is safe and O(1).
function loadPriorityVbelns() {
  const set = new Set();
  // 1) File source
  try {
    if (fs.existsSync(PRIORITY_CSV)) {
      const raw = fs.readFileSync(PRIORITY_CSV, 'utf8');
      const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      // Detect header row (contains letters). If header present, extract Vbeln column.
      const hdrIdx = lines.findIndex((l) => /[A-Za-z]/.test(l) && !/^#/.test(l));
      let vbelnCol = -1;
      if (hdrIdx === 0) {
        const cols = lines[0].split(',').map((c) => c.trim().toLowerCase());
        vbelnCol = cols.findIndex((c) => c === 'vbeln' || c === 'cof order id' || c === 'coforderid' || c === 'orderid' || c === 'order id');
      }
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('#')) continue;
        if (i === 0 && hdrIdx === 0) continue; // skip header
        // If line has commas + header had a Vbeln column, extract that column;
        // otherwise treat the entire line as a Vbeln.
        let val;
        if (vbelnCol >= 0 && line.includes(',')) {
          val = (line.split(',')[vbelnCol] || '').trim();
        } else {
          val = line.split(',')[0].trim(); // first column if CSV without header
        }
        if (val) set.add(String(val));
      }
    }
  } catch (e) {
    log.warn(`priority.csv read failed: ${e.message}`);
  }
  // 2) Env source
  if (PRIORITY_VBELNS_ENV) {
    for (const v of PRIORITY_VBELNS_ENV.split(',')) {
      const t = v.trim();
      if (t) set.add(t);
    }
  }
  return set;
}

// ---- SAP calls -------------------------------------------------------------

async function fetchLiveOrders(auth) {
  if (wafActive()) return { orders: [], plantConf: null };
  const today = new Date().toISOString().slice(0, 10) + 'T00:00:00';
  // Full payload — SAP's OData validator requires ALL declared nav ranges to
  // be present (even when empty). Removing them causes HTTP 400.
  const payload = {
    EvFrieghtPercent      : '',
    EvTolerenceAmount     : '',
    IvBidBiddingPlantFlag : '',
    IvBiddingStatus       : '2',
    IvStatus              : '',
    NavBidApplAreaRange   : [],
    NavBidBgpRange        : [],
    NavBidBiddingPlant    : [],
    NavBidBrandRange      : [],
    NavBidClubId          : [],
    NavBidCurrDtDm        : { CurrDate: '/Date(1467981296000)/', CurrTime: null },
    NavBidErdatRange      : [{ Sign: 'I', Option: 'BT', Low: today, High: today }],
    NavBidGradeRange      : [],
    NavBidKunagRange      : [],
    NavBidKunweRange      : [],
    NavBidMessage         : [],
    NavBidOrderIdRange    : [],
    NavBidPackRange       : [],
    NavBidPlntConf        : [],
    NavBidSapOrderIdRange : [],
    NavBidSapStoIdRange   : [],
    NavBidSchVendors      : [],
    NavBidShipFromWerksRange: [{ Sign: 'I', Option: 'EQ', Low: PLANT_CODE, High: '' }],
    NavBidShipToVkburRange: [],
    NavBidStateRange      : [],
    NavBidStoIdRange      : [],
    NavBidToler           : [],
    NavBidTolerence       : [],
    NavBidVendorRange     : [{ Sign: 'I', Option: 'EQ', Low: VENDOR_ID, High: '' }],
    NavBidVendorStatus    : [{ Sign: 'I', Option: 'EQ', Low: '1', High: '' }],
  };

  const res = await sapRequest(auth, {
    path: `${SAP_PATH_PFX}/BidOrderListSet`,
    method: 'POST',
    body: payload,
    timeoutMs: FETCH_ORDERS_TIMEOUT_MS,   // v3.23: env-tunable, default 10s
    retryOnNetworkError: true,  // idempotent read — safe to retry on socket timeout
  });

  if (res.statusCode !== 200 && res.statusCode !== 201) {
    const preview = typeof res.data === 'string' ? res.data.slice(0, 300) : JSON.stringify(res.data).slice(0, 300);
    if (res.statusCode === 406 || /Not Acceptable|<!DOCTYPE html>/i.test(preview)) {
      markWaf(`BidOrderListSet HTTP ${res.statusCode}`);
      return { orders: [], plantConf: null };
    }
    // Suppress spam when the cookie is confirmed dead — sapRequest already
    // logged a loud one-time re-login instruction and set _deadUntil.
    if (res.data && typeof res.data === 'object' && res.data._cookieDead) {
      return { orders: [], plantConf: null };
    }
    log.warn(`BidOrderListSet → HTTP ${res.statusCode} | ${preview}`);
    return { orders: [], plantConf: null };
  }

  const d = res.data?.d || {};
  const orders    = d.NavBidSchVendors?.results || d.results || (Array.isArray(d) ? d : []);
  const plantConf = d.NavBidPlntConf?.results?.[0] || null;
  // v3.27 — Read EvCaptchaFlag from response. Per SAP's own browser controller
  // (EBidding-dbg.controller.js `onEBiddingSave`), when this flag is NOT 'X',
  // captcha input is NOT required and the browser fires save directly. In that
  // mode we can submit at :15/:45 boundary WITHOUT the 2-3s captcha unlock
  // wait, giving the fastest possible submission (Rank-1 friendly).
  const captchaFlag = (d.EvCaptchaFlag || '').toString();
  auth._lastPlantConf  = plantConf;
  // v3.31 — Log when EvCaptchaFlag transitions so user immediately sees if
  // fastpath is available for the coming window. Early-drop only works when
  // fastpath is enabled (else SAP requires captcha which unlocks post-boundary).
  const prevFlag = auth._lastCaptchaFlag;
  if (prevFlag !== captchaFlag) {
    if (captchaFlag === '') {
      log.info(`[${auth.id}] ⚡ EvCaptchaFlag='' — CAPTCHA-FREE fastpath ENABLED (early-drop can submit pre-boundary)`);
    } else {
      log.info(`[${auth.id}] 🔒 EvCaptchaFlag='${captchaFlag}' — captcha REQUIRED (early-drop will skip; must wait for post-boundary captcha unlock)`);
    }
  }
  auth._lastCaptchaFlag = captchaFlag; // 'X' = captcha required, '' = fast-path
  return { orders, plantConf, captchaFlag };
}

// Global counter for one-time debug dump of the first captcha response.
let _firstCaptchaDumped = false;

async function fetchCaptchaImage(auth) {
  if (wafActive()) return { img: null, reason: 'waf' };
  const p = `${SAP_PATH_PFX}/EbiddingCaptchaSet(Vendor='${VENDOR_ID}',Plant='${PLANT_CODE}')`;
  const res = await sapRequest(auth, { path: p, method: 'GET', timeoutMs: FETCH_CAPTCHA_TIMEOUT_MS, retryOnNetworkError: true });
  if (res.statusCode === 406 || (typeof res.data === 'string' && /Not Acceptable|<!DOCTYPE html>/i.test(res.data.slice(0, 200)))) {
    markWaf('EbiddingCaptchaSet HTTP 406');
    return { img: null, reason: 'waf-406' };
  }
  if (res.statusCode !== 200 && res.statusCode !== 201) {
    return { img: null, reason: `http-${res.statusCode}` };
  }
  const d = res.data?.d || {};
  const img = d.ImageString || d.Captcha || d.CaptchaImage || d.EvCaptcha || null;

  // Dump the FIRST captcha response for offline inspection — critical for
  // debugging what SAP actually sends when the bid window is transitioning.
  if (!_firstCaptchaDumped) {
    _firstCaptchaDumped = true;
    try {
      const dir = path.join(__dirname, 'logs');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const dump = {
        ts: new Date().toISOString(),
        statusCode: res.statusCode,
        keys: Object.keys(d),
        hasImage: !!img,
        imageLen: img ? img.length : 0,
        imagePreview: img ? img.slice(0, 200) : null,
        rawPreview: (typeof res.data === 'string' ? res.data : JSON.stringify(res.data)).slice(0, 800),
      };
      fs.writeFileSync(path.join(dir, 'captcha-response.json'), JSON.stringify(dump, null, 2));
      log.info(`[captcha-debug] first captcha keys=[${Object.keys(d).join(',')}] hasImage=${!!img}${img ? ' len=' + img.length : ''} — dump: logs/captcha-response.json`);
    } catch (_) { /* silent */ }
  }

  return { img, reason: img ? 'ok' : 'sap-empty' };
}

async function solveViaLocal(base64) {
  const t0 = Date.now();
  metrics.captchaAttempts++;
  try {
    const { statusCode, body } = await solverPool.request({
      path: CAPTCHA_PATH,
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: JSON.stringify({ base64Image: base64 }),
    });
    const text = await body.text();
    metrics.captchaCacheMs.push(Date.now() - t0);
    if (metrics.captchaCacheMs.length > 200) metrics.captchaCacheMs.shift();
    if (statusCode !== 200) {
      metrics.captchaFailed++;
      return { solved: '', reason: `solver-http-${statusCode}` };
    }
    let json;
    try { json = JSON.parse(text); }
    catch { metrics.captchaFailed++; return { solved: '', reason: 'solver-bad-json' }; }
    const solved = json.solved || '';
    if (!solved || solved === 'Redo') {
      metrics.captchaFailed++;
      return { solved: '', reason: 'solver-empty' };
    }
    metrics.captchaSolved++;
    return { solved, reason: 'ok' };
  } catch (e) {
    metrics.captchaFailed++;
    log.warn(`Captcha solver unreachable: ${e.message}`);
    return { solved: '', reason: 'solver-unreachable' };
  }
}

/**
 * Fetch a captcha image from SAP and solve it via the local server.
 * Returns { solved, reason } — reason is one of: ok | sap-empty | waf | waf-406 |
 * http-XXX | solver-empty | solver-bad-json | solver-http-XXX | solver-unreachable
 *
 * Callers should treat everything except `ok` as a miss and retry.
 */
async function nextCaptcha(auth) {
  const { img, reason: fetchReason } = await fetchCaptchaImage(auth);
  if (!img) return { solved: '', reason: fetchReason };
  const r = await solveViaLocal(img);
  // First time captcha becomes available after a pre-window period, log the
  // exact moment so we can measure detection latency (window-open → detect).
  if (r.solved && !globalThis.__firstCaptchaAt) {
    globalThis.__firstCaptchaAt = Date.now();
    log.info(`⚡ First non-empty captcha detected [${auth.id}] — window open! (${boundaryStatusText()})`);
    // v3.32 — Persist per-window captcha unlock latency to CSV for post-mortem.
    // Uses `globalThis.__lastBoundaryMs` set by the :15/:45 boundary block
    // (see main scheduler). Latency = first_captcha_ms - boundary_ms;
    // positive value = normal post-boundary unlock (typical 1-3s for SAP).
    try {
      const now = Date.now();
      const boundaryMs = globalThis.__lastBoundaryMs || (now - msUntilNextWindow(new Date(now)) - 30 * 60_000);
      const latency = boundaryMs > 0 ? now - boundaryMs : null;
      const ist = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false,
      }).format(new Date(boundaryMs > 0 ? boundaryMs : now));
      captchaTimingLog.write({
        ts: new Date(now).toISOString(),
        window_boundary: ist,
        boundary_ms: boundaryMs > 0 ? boundaryMs : '',
        first_captcha_ms: now,
        latency_ms: latency,
        session: auth.id,
        captcha_flag: auth._lastCaptchaFlag || '',
        sample: (r.solved || '').slice(0, 5),
      });
      if (latency != null) {
        log.info(`   ↳ CAPTCHA UNLOCK LATENCY = ${latency}ms (boundary→detect). Recorded to logs/captcha-timing-*.csv`);
      }
    } catch (_) { /* never let logging break bidding */ }
  }
  // Attach the base64 image to the result so callers can invalidate the cache
  // entry later if SAP rejects the solve with "Wrong Captcha".
  return { ...r, img };
}

// ---- Captcha probe strategy -----------------------------------------------
//
// EARLIER we tried parallel captcha probes (fire N simultaneous requests,
// first non-empty wins) to reduce window-open detection latency. But SAP
// maintains exactly ONE active captcha per session — every new fetch
// INVALIDATES the previous one. So if we fire 3 parallel probes:
//   - probe #1 image X (solved as "AAA")
//   - probe #2 image Y (solved as "BBB") — invalidates X on SAP
//   - probe #3 image Z (solved as "CCC") — invalidates Y on SAP
// If we submit with "AAA" (the winner by find-order), SAP has already
// invalidated it and returns "Wrong Captcha". This exact bug bit user's
// 16:45 IST window: 3 solver hits (ry2n4, f8233, VFh@4@) → submits=1 ok=0
// wrong-captcha=1 → no bid saved.
//
// Correct approach: KEEP parallel probes DISABLED by default. Rely on
// (a) adaptive keep-warm (TCP+TLS stays hot near window boundary),
// (b) POLL_MS=20 tight serial polling,
// (c) setImmediate tight-loop when matched-orders-but-no-captcha.
// Serial + hot TCP typically detects unlock within one RTT (~50-100 ms).
//
// If the user WANTS to experiment with parallel probes (understanding that
// only the LAST-fetched captcha is submit-safe), they can set
// PARALLEL_CAPTCHA_PROBES>1 in .env. `nextCaptchaParallel()` then races
// the probes but returns the LAST arrived solved captcha (not the first)
// to match SAP's active-captcha semantics.
const PARALLEL_CAPTCHA_PROBES = parseInt(process.env.PARALLEL_CAPTCHA_PROBES || '1', 10);

async function nextCaptchaParallel(auth) {
  if (PARALLEL_CAPTCHA_PROBES <= 1) return nextCaptcha(auth);
  const probes = Array.from({ length: PARALLEL_CAPTCHA_PROBES }, () => nextCaptcha(auth));
  const results = await Promise.all(probes);
  // Return the LAST-arrived solved captcha — SAP invalidates earlier ones.
  // Note this still risks a race if two probes complete after SAP starts
  // rotating: safer default is PARALLEL_CAPTCHA_PROBES=1.
  const solvedResults = results.filter((r) => r.solved);
  if (solvedResults.length) return solvedResults[solvedResults.length - 1];
  return results[results.length - 1];
}

// Fire-and-forget: ask the local solver to drop a stale/wrong cache entry.
// Called when SAP rejects a solve as "Wrong Captcha" — prevents the same
// wrong answer from being returned as a cache HIT on subsequent scans.
function invalidateCaptchaCache(base64Image, wrongSolved) {
  if (!base64Image) return;
  solverPool.request({
    path: '/invalidate',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ base64Image, solved: wrongSolved || '' }),
  }).then((r) => r.body.dump()).catch(() => { /* silent */ });
}

// ---- Formatting helpers ---------------------------------------------------

function fmtAmtInt(v) { return `${Math.round(Number(v || 0))}`; }
function fmtAmtSap(v) { return `${Math.round(Number(v || 0))}.000`; }

// ---- Submit ---------------------------------------------------------------

async function submitBid(auth, bids, solvedCaptcha) {
  const t0 = Date.now();
  const pc = auth._lastPlantConf || {};
  const biddingDate = pc.BiddingDate || `/Date(${Date.now()})/`;
  const slotNumber  = (pc.SlotNumber ?? '').toString();

  const NavEBiddingTrackHis = bids.map((b) => {
    const orig = b.order || {};
    return {
      Mandt         : '',
      SapOrderId    : String(b.sapOrderId),
      Vendor        : VENDOR_ID,
      ChangeNo      : '',
      ShipFromWerks : (orig.ShipFromWerks || PLANT_CODE).toString(),
      BiddingDate   : biddingDate,
      SlotNumber    : slotNumber,
      Freight       : fmtAmtSap(orig.Freight ?? 0),
      ClubId        : (b.clubId || orig.ClubId || '').toString(),
      ClubFreight   : fmtAmtSap(orig.ClubFreight ?? 0),
      BiddingAmount : fmtAmtSap(b.amount),
      BiddingRank   : fmtAmtInt(orig.BiddingRank ?? 0),
      AvgWtBidAmount: fmtAmtSap(b.amount),
      CreatedOn     : null,
      CreatedAt     : null,
    };
  });

  // v3.27 — captcha-free fast-path: when solveCaptcha() returned the sentinel
  // '__NO_CAPTCHA_REQUIRED__' (meaning EvCaptchaFlag !== 'X'), omit the
  // IvCaptchaValue field entirely — matches what the browser controller does
  // in `onEBiddingSave` when captcha isn't required.
  const payload = {
    Flag              : '1',
    Ev_Text           : '',
    NavEBiddingMessage: {},
    NavEBiddingTrackHis,
  };
  if (solvedCaptcha !== '__NO_CAPTCHA_REQUIRED__') {
    payload.IvCaptchaValue = solvedCaptcha;
  }

  const res = await sapRequest(auth, {
    path: `${SAP_PATH_PFX}/EBiddingSaveSet`,
    method: 'POST',
    body: payload,
    timeoutMs: SUBMIT_TIMEOUT_MS,
  });
  const submitMs = Date.now() - t0;

  const d = res.data?.d || {};
  const messages = extractSapMessages(d);
  const severity = { E: 3, I: 2, S: 1, '': 0 };
  let primary = { info: '', text: '' };
  for (const m of messages) {
    if ((severity[m.info] || 0) > (severity[primary.info] || 0)) primary = m;
  }
  if (!primary.text && d.Ev_Text) primary = { info: primary.info || '', text: d.Ev_Text };

  // Dump submit responses to logs/submit-responses.jsonl for post-mortem when
  // the user reports "SAP says saved but browser doesn't show the rate".
  // Cap at 50 samples per process so disk doesn't grow unboundedly.
  try {
    if (!globalThis.__submitDumps) globalThis.__submitDumps = 0;
    if (globalThis.__submitDumps < 50) {
      globalThis.__submitDumps++;
      const dir = path.join(__dirname, 'logs');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(path.join(dir, 'submit-responses.jsonl'),
        JSON.stringify({
          ts: new Date().toISOString(),
          session: auth.id,
          submitted: bids.map((b) => ({ sapOrderId: b.sapOrderId, amount: b.amount, clubId: b.clubId })),
          submitMs,
          statusCode: res.statusCode,
          primary,
          messages,
          topLevelKeys: Object.keys(d),
          rawPreview: JSON.stringify(res.data).slice(0, 4000),
        }) + '\n',
        'utf8',
      );
    }
  } catch (_) { /* never let dumping break bidding */ }

  // Extract rank + L1 hints from the response if SAP echoed them back.
  // Different SAP tenants echo different keys — check the common ones.
  // v3.24 — Also capture persistence signals (ChangeNo, CreatedOn, CreatedAt).
  // A saved bid has: ChangeNo = real base64 GUID, CreatedOn = timestamp,
  // CreatedAt = non-zero duration. A "silent-fail" bid has:
  //   ChangeNo  = "AAAAAAAAAAAAAAAAAAAAAA=="  (empty base64, 22 A's + "==")
  //   CreatedOn = null
  //   CreatedAt = "PT00H00M00S"                (zero-duration ISO 8601)
  // When SAP responds Type=S with these ghost markers, the write didn't
  // actually commit to the master DB — order won't appear in the browser
  // even though the API said "Saved Successfully".
  const rankHints = [];
  const trackHis = d?.NavEBiddingTrackHis?.results || [];
  if (Array.isArray(trackHis) && trackHis.length) {
    for (const t of trackHis) {
      const changeNo   = (t.ChangeNo || '').toString();
      const createdOn  = t.CreatedOn; // may be null, a "/Date(...)/" string, or a timestamp
      const createdAt  = (t.CreatedAt || '').toString();
      // ChangeNo = all-A's base64 (or empty) = no GUID assigned = no write.
      const changeNoEmpty = !changeNo || /^A+={0,2}$/.test(changeNo);
      // CreatedOn null AND CreatedAt = zero-duration = ghost record.
      const timestampsGhost = (createdOn === null || createdOn === undefined) && /^PT0+H0+M0+S$/i.test(createdAt);
      const isGhostRecord = changeNoEmpty && timestampsGhost;
      rankHints.push({
        sapOrderId: (t.SapOrderId || '').toString(),
        rank      : (t.BiddingRank || '').toString(),
        savedAmt  : (t.BiddingAmount || '').toString(),
        l1Amt     : (t.L1BidAmount || '').toString(),
        avgAmt    : (t.AvgWtBidAmount || '').toString(),
        changeNo, createdOn, createdAt,
        isGhostRecord,   // v3.24 silent-fail marker
      });
    }
  }

  // v3.41 — capture SAP's response `Flag` field. SAP's OData EBiddingSave
  // response has a top-level `Flag` string. Live evidence from bhai's
  // 2026-08-11 07:46 log shows SAP returns `Flag="1"` even on responses
  // where `NavEBiddingMessage=null` and `Ev_Text=""` (i.e., no text
  // message at all). Flag="1" means the save was accepted; async DB
  // replication just hasn't populated ChangeNo/CreatedOn yet. This
  // single field is the STRONGEST success signal in the response.
  const respFlag = (d.Flag || '').toString();

  return { statusCode: res.statusCode, info: primary.info, text: primary.text, messages, raw: res.data, submitMs, rankHints, respFlag };
}

function extractSapMessages(d) {
  const msgs = [];
  const nav = d?.NavEBiddingMessage;
  if (Array.isArray(nav?.results)) {
    for (const m of nav.results) {
      msgs.push({
        info: (m.Type || m.Info || m.MessageType || '').toString().trim(),
        text: (m.Message || m.MessageText || m.Text || '').toString().trim(),
        sapOrderId: (m.SapOrderId || '').toString().trim(),
      });
    }
  } else if (nav && (nav.Type || nav.Info || nav.Message || nav.MessageText)) {
    msgs.push({
      info: (nav.Type || nav.Info || '').toString().trim(),
      text: (nav.Message || nav.MessageText || '').toString().trim(),
      sapOrderId: (nav.SapOrderId || '').toString().trim(),
    });
  }
  if (d?.Ev_Text) msgs.push({ info: '', text: d.Ev_Text.toString().trim(), sapOrderId: '' });
  return msgs;
}

function parseReduceAmount(text) {
  if (!text) return null;
  if (!/reduce|less than|minimum/i.test(text)) return null;
  const m = /(?:by|minimum|less than)\s*(?:rs\.?|₹|inr)?\s*([\d]+(?:\.\d+)?)/i.exec(text);
  return m ? parseFloat(m[1]) : null;
}

/**
 * Parse SAP's minimum-floor messages of the form:
 *   "Bidding amount should be Greater than or equal to 685.08"
 *   "Order : X posnr : Y Bidding amount should be Greater than or equal to Z"
 * Returns the highest floor value found across all orders in the message,
 * or null if no such pattern is present.
 */
function parseMinFloor(text) {
  if (!text) return null;
  const re = /greater\s*than\s*or\s*equal\s*to\s*([\d]+(?:\.\d+)?)/gi;
  let max = null;
  let m;
  while ((m = re.exec(text)) !== null) {
    const v = parseFloat(m[1]);
    if (isFinite(v) && (max === null || v > max)) max = v;
  }
  return max;
}

// ---- Per-session mutex (defined on AuthConfig) ----------------------------
// The old global `sapSession` object was replaced by `authInstance.mutex`
// so different SAP sessions can truly run in parallel.

// ---- Batcher --------------------------------------------------------------

function buildBatches(orders, rules, blacklist, seenSubmitted, inFlight, cooldown, sessionCount = 1, priorityVbelns = null) {
  const now = Date.now();
  const byClub = new Map();
  const stats = { total: orders.length, matched: 0, blacklisted: 0, noRule: 0, clubDropped: 0, coolskip: 0, priority: 0 };
  const priSet = priorityVbelns instanceof Set ? priorityVbelns : new Set();

  // Pre-sort rule cities: longest first → "KRISHNANAGAR - STO" wins over "KRISHNANAGAR"
  const ruleCitiesByLen = Array.from(rules.keys()).sort((a, b) => b.length - a.length);

  // v3.34 — user directive 2026-07-23: "niche se match kar k save karo uper
  // se nahi ise bid win k chance 60% badh jayega". Iterate the order list
  // from the BOTTOM (last-published orders) rather than the top. Rationale:
  // newer orders at the bottom may be less contested by other vendors who
  // scan top-down. Default TRUE per user directive; disable via
  // MATCH_ORDER_REVERSE=false in .env.
  const MATCH_ORDER_REVERSE = (process.env.MATCH_ORDER_REVERSE ?? 'true').toString().toLowerCase() !== 'false';
  const iterOrders = MATCH_ORDER_REVERSE ? [...orders].reverse() : orders;

  const fresh = iterOrders.filter((o) => {
    const key = String(o.SapOrderId || '');
    if (!key || seenSubmitted.has(key) || inFlight.has(key)) return false;
    const retryAt = cooldown.get(key);
    if (retryAt && retryAt > now) { stats.coolskip++; return false; }
    if (retryAt) cooldown.delete(key);
    return true;
  });

  for (const o of fresh) {
    const club = (o.ClubId || '').toString().trim();
    if (!byClub.has(club)) byClub.set(club, []);
    byClub.get(club).push(o);
  }

  const singles = [];
  const clubGroups = [];

  // Helper: is this order a priority (COF Order ID / Vbeln in priorityVbelns)?
  const isPriorityOrder = (o) => {
    if (!priSet.size) return false;
    const v = (o.Vbeln || o.CofOrderId || o.CofOrder || '').toString().trim();
    if (v && priSet.has(v)) return true;
    // Fallback: some SAP tenants expose the COF id under SapOrderId itself.
    const sid = (o.SapOrderId || '').toString().trim();
    return Boolean(sid && priSet.has(sid));
  };

  for (const [club, members] of byClub.entries()) {
    if (!club) {
      for (const o of members) {
        if (isCustomerBlacklisted(o, blacklist)) {
          stats.blacklisted++;
          // v3.39 — per-order blacklist visibility. User's 2026-08-11 report
          // asked "delete me naam thora alag hai, tho skip kar diya" — now
          // the CSV audit shows exactly which vbeln + customer name got
          // skipped so mis-blacklists are trivially spot-checkable.
          if (stats._blSamples === undefined) stats._blSamples = [];
          if (stats._blSamples.length < 5) {
            const cust = (o.KunagName1 || o.KunweName1 || o.Customer || o.CustomerName || '').toString().trim();
            stats._blSamples.push(`${o.SapOrderId || o.Vbeln}[${cust}]`);
          }
          continue;
        }
        const m = matchOrder(o, rules, ruleCitiesByLen);
        if (!m) {
          stats.noRule++;
          // v3.39 — per-order no-rule visibility (sample first 5). Helps
          // the user notice CSV cities that need adding.
          if (stats._nrSamples === undefined) stats._nrSamples = [];
          if (stats._nrSamples.length < 5) {
            const dest = (o.Destination || o.DestCityDesc || o.CityCodeDescription || '').toString().trim();
            const spi = (o.SPI || o.Spi || o.SpecialProcessInd || o.Zspi || '').toString().trim();
            stats._nrSamples.push(`${o.SapOrderId || o.Vbeln}[${dest}/${spi}]`);
          }
          continue;
        }
        stats.matched++;
        const priority = isPriorityOrder(o);
        if (priority) stats.priority++;
        singles.push({ order: o, amount: m.amount, city: m.matchedCity, spi: m.matchedSpi, priority });
      }
    } else {
      const items = [];
      let drop = false;
      let dropReason = '';
      let clubPriority = false;
      for (const o of members) {
        if (isCustomerBlacklisted(o, blacklist)) {
          drop = true;
          dropReason = `blacklisted customer (${(o.KunagName1 || o.Customer || '').toString().trim()})`;
          break;
        }
        const m = matchOrder(o, rules, ruleCitiesByLen);
        if (!m) {
          drop = true;
          dropReason = `no CSV rule for dest="${(o.Destination || o.DestCityDesc || o.CityCodeDescription || '').toString().trim()}"`;
          break;
        }
        if (isPriorityOrder(o)) clubPriority = true;
        items.push({ order: o, amount: m.amount, city: m.matchedCity, spi: m.matchedSpi });
      }
      if (drop) {
        stats.clubDropped++;
        if (stats._cdSamples === undefined) stats._cdSamples = [];
        if (stats._cdSamples.length < 3) stats._cdSamples.push(`club=${club}(${members.length}): ${dropReason}`);
      }
      else if (items.length) {
        stats.matched += items.length;
        if (clubPriority) stats.priority += items.length;
        // clubs also split at BATCH_SIZE (SAP hard-limit 3 per submit)
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
          clubGroups.push({ clubId: club, bids: items.slice(i, i + BATCH_SIZE), priority: clubPriority });
        }
      }
    }
  }

  // ---- BATCHING: singles-first (max BATCH_SIZE per submit), then clubs ----
  //
  // Since v3.4 sessions are SEQUENTIAL FALLBACKS (only one submit at a time),
  // the old "spread across sessions" logic just fragmented singles into 1-per
  // submit — which slowed the whole window because SAP costs ~200 ms per call.
  // Restore the original pack-3-into-one behaviour so 3 singles = 1 SAP call.
  //
  // Order in the plan:
  //   1) PRIORITY singles chunked by BATCH_SIZE (default 3)   ← v3.19
  //   2) Non-priority singles chunked by BATCH_SIZE
  //   3) PRIORITY club-id groups (already chunked upstream)   ← v3.19
  //   4) Non-priority club-id groups
  const effectiveBatchSize = BATCH_SIZE;

  // Stable partition: preserve original discovery order within each bucket.
  // (Priority Vbelns must go FIRST so they're hitting SAP within the first
  //  ~300 ms of the window; but we don't reshuffle among priority items.)
  const singlesPriority    = singles.filter((s) => s.priority);
  const singlesNonPriority = singles.filter((s) => !s.priority);
  const clubsPriority      = clubGroups.filter((c) => c.priority);
  const clubsNonPriority   = clubGroups.filter((c) => !c.priority);

  const packSingles = (arr) => {
    const out = [];
    for (let i = 0; i < arr.length; i += effectiveBatchSize) {
      out.push(arr.slice(i, i + effectiveBatchSize));
    }
    return out;
  };
  const singleBatchesP = packSingles(singlesPriority);
  const singleBatchesN = packSingles(singlesNonPriority);

  // Order: priority-singles → priority-clubs → non-priority-singles → non-priority-clubs
  // Rationale: within priority tier, singles still pack-3 per SAP call (fewest
  // calls = fastest); then priority clubs; then everything else.
  const plan = [];
  for (const b of singleBatchesP) plan.push({ kind: 'single', bids: b, priority: true });
  for (const c of clubsPriority)  plan.push({ kind: 'club',   bids: c.bids, clubId: c.clubId, priority: true });
  for (const b of singleBatchesN) plan.push({ kind: 'single', bids: b, priority: false });
  for (const c of clubsNonPriority) plan.push({ kind: 'club', bids: c.bids, clubId: c.clubId, priority: false });

  return { plan, stats, effectiveBatchSize };
}

// ---- Worker pool: one worker per SAP session, parallel across sessions ----

/**
 * With N SAP session cookies, we launch N workers — one per session. Each
 * worker holds its OWN mutex (fetch-captcha → submit is atomic PER session
 * but truly parallel ACROSS sessions).  A batch queue is round-robin dispatched.
 *
 * With 4 cookies: 4 bids can hit SAP simultaneously, cutting effective
 * end-to-end latency by ~4× when there are multiple batches to submit.
 */
function makeWorkerPool(ctx) {
  let cursor = 0;

  async function fetchFreshCaptcha(auth, workerId) {
    // v3.27 — Fast-path: if the last BidOrderListSet response reported
    // EvCaptchaFlag !== 'X', SAP does NOT require a captcha for this session
    // (mirrors the browser's onEBiddingSave logic in EBidding-dbg.controller.js).
    // Return the sentinel '' from the captcha path and let the submit code
    // skip IvCaptchaValue entirely — this saves the 2-3 s captcha unlock wait
    // and enables submitting at :15/:45 boundary within the first 100 ms.
    if (auth._lastCaptchaFlag === '' || auth._lastCaptchaFlag === undefined) {
      // Log the fast-path activation once per window (use boundary time as key).
      const winKey = Math.floor(Date.now() / 60_000);
      if (auth._lastCaptchaFlag === '' && auth._captchaFastPathLogged !== winKey) {
        auth._captchaFastPathLogged = winKey;
        log.info(`[${workerId}] ⚡ CAPTCHA-FREE fast-path enabled (EvCaptchaFlag='' from BidOrderListSet) — skipping captcha wait, submit will fire immediately at boundary.`);
      }
      if (auth._lastCaptchaFlag === '') return '__NO_CAPTCHA_REQUIRED__';
    }

    // v3.33 — INSTANT DISPATCH: If the independent captcha poller (started
    // at pre-warm, polls every 50 ms independent of tick loop) has already
    // solved a fresh captcha for this session, use it directly. This skips
    // the fetchCaptcha + solve round-trip entirely and can shave 100-300 ms
    // off the boundary→submit latency, mirroring the browser's model of
    // "captcha polling in background, save fires the instant it appears".
    if (ctx._preCaptcha && ctx._preCaptcha[auth.id]) {
      const pc = ctx._preCaptcha[auth.id];
      const ageMs = Date.now() - pc.ts;
      if (pc.solved && ageMs < 3_000 && !pc.consumed) {
        pc.consumed = true; // one-shot use; poller will keep refreshing
        auth._lastCaptchaImg = pc.img;
        log.info(`[${workerId}] ⚡ INSTANT-DISPATCH: using pre-solved captcha from independent poller (age ${ageMs}ms) — skipping in-tick captcha fetch`);
        return pc.solved;
      }
    }

    // Use parallel probing when we know the window is about to open (matched
    // orders exist + no captcha yet). Otherwise single probe is enough.
    const useParallel = ctx._matchedButNoCaptcha || isHotWindow();
    const r1 = useParallel ? await nextCaptchaParallel(auth) : await nextCaptcha(auth);
    if (r1.solved) { auth._lastCaptchaImg = r1.img; return r1.solved; }
    if (wafActive()) return '';

    // sap-empty = SAP has not unlocked the captcha for this session yet.
    // This is a SAP-SIDE STATE, not a client bug. During the 30-second
    // pre-warm phase we expect empty responses; even inside an active
    // :15/:45 window SAP sometimes takes 1-60 seconds after the clock
    // boundary to actually generate the captcha. Retrying costs ~50-100 ms
    // per attempt; we just poll again next scan.
    //
    // VISIBILITY: to reassure the user during long SAP-side delays (they
    // may otherwise think the bot is stuck), emit a status log every
    // ~10 seconds while inside a hot window. Includes seconds past the
    // :15/:45 boundary so it's obvious this is SAP being slow, not us.
    if (r1.reason === 'sap-empty') {
      const now = Date.now();
      if (isHotWindow() && (!globalThis.__lastWaitLog || now - globalThis.__lastWaitLog > 10_000)) {
        globalThis.__lastWaitLog = now;
        log.info(`[${workerId}] ⏳ waiting for SAP to unlock captcha… ${boundaryStatusText()} (bot is polling, SAP is late — do NOT restart, will catch as soon as SAP responds)`);
      } else if (!isHotWindow() && ctx.scan % Math.max(1, Math.round(10_000 / Math.max(POLL_MS, 1))) === 0) {
        log.warn(`[${workerId}] SAP returned empty captcha (bid window likely closed) — polling next scan`);
      }
      return '';
    }

    // Real transient error — retry 2 more times.
    log.warn(`[${workerId}] captcha attempt 1/3 failed: ${r1.reason}`);
    for (let i = 1; i < 3; i++) {
      const r = useParallel ? await nextCaptchaParallel(auth) : await nextCaptcha(auth);
      if (r.solved) { auth._lastCaptchaImg = r.img; return r.solved; }
      if (wafActive()) return '';
      if (r.reason === 'sap-empty') return '';
      log.warn(`[${workerId}] captcha attempt ${i + 1}/3 failed: ${r.reason}`);
    }
    return '';
  }

  async function runAll() {
    while (cursor < ctx.plan.length) {
      const item = ctx.plan[cursor++];
      const t0 = Date.now();
      for (const b of item.bids) ctx.inFlight.add(String(b.order.SapOrderId));

      // ---- Sequential FALLBACK across sessions -----------------------------
      // We iterate cookies (s1 → s2 → s3 → …). For each session:
      //   1. Fetch a fresh captcha (JIT — inside session's own mutex).
      //   2. Acquire the GLOBAL submit mutex (only ONE session hits SAP at a time).
      //   3. Submit. If SAP returns empty 201 (silent anti-fraud fail),
      //      try the next session immediately with a fresh captcha.
      //   4. Stop on real success or definitive rejection.
      // If ALL sessions silent-fail → mark cooldown so we retry next scan.
      let finalOutcome = null;
      let allSilentFail = true;
      // v3.39 — track submitted vbelns for the worker-exit log so any silent
      // exception (bug / SAP timeout / mutex crash / etc.) that swallows the
      // per-batch response is at least visible in the log. Prior to v3.39
      // a batch that hit an unlogged error (e.g., session mutex threw, or
      // a race where the outcome was undefined) simply vanished — the user's
      // 2026-08-11 log had one such batch (AMRAPARA/1154850608).
      const vbelns = item.bids.map((b) => String(b.order.SapOrderId));
      let workerErrorAlreadyLogged = false;
      try {
        for (const session of ctx.sessions) {
          const outcome = await session.mutex.run(async () => {
            const solved = await fetchFreshCaptcha(session, session.id);
            if (!solved) return { skipped: true };
            // Global mutex: serialise the actual submit HTTP call across ALL sessions.
            return await globalSubmitMutex.run(async () => {
              return await handleBatch(ctx, session, item, solved, session.id);
            });
          });

          finalOutcome = outcome;
          if (!outcome || outcome.skipped) continue;
          if (outcome.silentFail) {
            log.warn(`[${session.id}] Silent 201 → falling back to next session`);
            continue;
          }
          // Real result (success OR definitive rejection) → stop fallback loop
          allSilentFail = false;
          break;
        }
      } catch (workerErr) {
        // v3.39 — catch-all safety net: log any thrown error that would
        // otherwise silently drop the batch. Also write a WORKER_ERROR row
        // to bids.csv so the user's daily audit shows the drop.
        workerErrorAlreadyLogged = true;
        log.error(`[worker] ✗ WORKER ERROR while processing batch (vbelns=${vbelns.join(',')}): ${workerErr && workerErr.message} — stack: ${workerErr && workerErr.stack}`);
        for (const b of item.bids) bidLog.write({
          session: (ctx.sessions[0] && ctx.sessions[0].id) || 'unknown',
          sap_order_id: b.order.SapOrderId,
          city: b.city,
          spi: b.spi,
          csv_rate: b.amount,
          submit_ms: '',
          status: 'WORKER_ERROR',
          message: (workerErr && workerErr.message) || 'unknown worker error',
        });
      }

      // v3.40 — worker-exit diagnostic (tightened from v3.39).
      // Only warn when we produced NO outcome at all AND the batch was NOT
      // a normal pre-warm skip. v3.39's version fired on `outcome=skipped`
      // which is the NORMAL "SAP hasn't unlocked captcha yet" state during
      // pre-warm — flooded the log 251 times per window. v3.40 rule:
      // suppress `outcome=skipped` (that just means captcha wasn't ready
      // yet; the retry will fire next scan), only warn on genuinely
      // unlogged drops (finalOutcome=null AND no exception was caught).
      const outcomeSummary = finalOutcome
        ? (finalOutcome.ok ? 'ok'
          : finalOutcome.silentFail ? 'silent-fail'
          : finalOutcome.skipped ? 'skipped'
          : finalOutcome.retry ? 'retry' : 'other')
        : 'no-outcome';
      const isGenuineDrop = !finalOutcome && !workerErrorAlreadyLogged;
      if (isGenuineDrop) {
        log.warn(`[worker] ⚠ batch exit without persisted outcome (vbelns=${vbelns.join(',')}, outcome=${outcomeSummary}) — investigate: was captcha fetched, was mutex acquired?`);
      }

      // If every session silent-failed on this item, cooldown so we retry later
      if (allSilentFail && ctx.sessions.length > 0 && finalOutcome && finalOutcome.silentFail) {
        const retryAt = Date.now() + TIME_ENDED_COOLDOWN_MS;
        for (const b of item.bids) {
          ctx.cooldown.set(String(b.order.SapOrderId), retryAt);
          bidLog.write({
            session: 'all', sap_order_id: b.order.SapOrderId, city: b.city, spi: b.spi,
            csv_rate: b.amount, submit_ms: '', status: 'SILENT_TIME_ENDED_ALL',
            message: `all ${ctx.sessions.length} sessions returned empty 201`,
          });
        }
        metrics.submitsTimeEnded++;
      }

      for (const b of item.bids) ctx.inFlight.delete(String(b.order.SapOrderId));
      pushLatency(Date.now() - t0);
    }
  }

  // Single serialised worker — sessions are FALLBACKS, not concurrent hitters.
  // This prevents the SAP vendor-lockout that causes silent HTTP 201 empties.
  return [runAll()];
}

async function handleBatch(ctx, session, item, solved, workerId, retryDepth = 0) {
  const auth = session;   // session IS the AuthConfig (with .mutex, .headers, etc.)
  metrics.submits++;
  const list = item.bids.map((b) => `${b.order.SapOrderId}[${b.city}/${b.spi}]@${b.amount}`).join(', ');
  log.info(`[${workerId}] → ${item.kind.toUpperCase()}${item.clubId ? ' id=' + item.clubId : ''} (${item.bids.length}): ${list}`);

  const bids = item.bids.map((b) => ({
    sapOrderId: b.order.SapOrderId,
    amount    : b.amount,
    order     : b.order,
    clubId    : b.order.ClubId || '',
  }));

  const result = await submitBid(auth, bids, solved);

  const textLower = (result.text || '').toString().toLowerCase();
  const evText    = (result.raw?.d?.Ev_Text || '').toString();
  const evTextLower = evText.toLowerCase();

  // v3.21 CRITICAL FIX — Tie-rejection detection.
  //
  // SAP has a nasty pattern: when your bid ties with (or is beaten by) another
  // vendor's already-submitted amount, it returns:
  //     NavEBiddingMessage.Type    = "E"
  //     NavEBiddingMessage.Message = "Bidding Amount Saved Successfully."   ← misleading!
  //     Ev_Text                    = "Same amount has been bid by other vendor
  //                                    for order id : X and posnr : Y"
  //     BiddingRank in track hint  = "0"                                     ← not saved
  //
  // Previously we saw "Saved Successfully" in Message → marked ACCEPTED →
  // added to submitted set → order was NEVER re-bid → "beech beech me save
  // nahi le raha" (user's report). Now: check Ev_Text FIRST for the real
  // rejection signal, override any misleading Message.
  const isTieRejected = /same\s+(avg\s+)?amount\s+has\s+been\s+bid\s+by\s+other\s+vendor/i.test(evTextLower);

  // v3.34 CRITICAL FIX — Ghost-record detection recalibrated (user 2026-07-23).
  //
  // Live log analysis showed our v3.24 ghost detection was TOO AGGRESSIVE:
  // SAP's immediate response for a GENUINELY successful save also contains:
  //   Message   = "Bidding Amount Saved Successfully."
  //   Type      = "S"
  //   Ev_Text   = ""     (empty — no tie, no error)
  //   ChangeNo  = "AAAA==" + CreatedOn = null + CreatedAt = "PT0S"
  // …because SAP doesn't populate the persistence GUID in the immediate
  // response. Only on a SUBSEQUENT SessionSet('') fetch does the real
  // ChangeNo appear.
  //
  // Our v3.24 code marked these as "ghost" and retried 3× (verified from
  // 09:45 window bids.csv on 2026-07-23: 3 attempts on Vbeln 1153958547
  // all had Message="Saved Successfully" Ev_Text="" but got REJECTED_GHOST).
  // This wasted 3× the requests AND may have triggered SAP anti-fraud.
  //
  // v3.34 rule: only mark as ghost when BOTH (a) all rankHints have ghost
  // markers AND (b) SAP did NOT explicitly acknowledge success (Ev_Text has
  // content OR primary info is 'E' OR Message is not the standard success text).
  //
  // v3.36 UPGRADE — TRUST_TYPE_S (default true, user 2026-07-24 directive
  // "ebidding-secure jaisa bana do — kabhi save nahi chorta"): when SAP
  // returns Type='S' at ALL, trust it unconditionally as a real success.
  // ebidding-secure.js NEVER inspects ChangeNo/CreatedOn/CreatedAt — those
  // are transient markers. Reproducing that behaviour eliminates the last
  // false-positive ghost paths. Ghost retries now only fire on non-S types
  // (empty info or 'E' with ghost markers), which is a rare corner case.
  const _ghostMarkerHints = (result.rankHints || []).filter((h) => h.isGhostRecord);
  const _allHintsAreGhost = _ghostMarkerHints.length > 0 && _ghostMarkerHints.length === (result.rankHints || []).length;
  const _sapExplicitSuccess = (
    result.info === 'S' &&
    /saved\s*successfully/i.test(result.text || '') &&
    !evText.trim() && // Ev_Text is empty — no tie, no error text
    !isTieRejected
  );
  // v3.36 — when TRUST_TYPE_S is on, ANY Type='S' is treated as success
  // (except when Ev_Text says tie-rejection, still respected).
  const _trustTypeS = TRUST_TYPE_S && result.info === 'S' && !isTieRejected;
  // v3.40 CRITICAL FIX (user 2026-08-11 log: "ek bhi save nahi hua"):
  //   In the 07:45 window bhai's bot rejected 3 orders as GHOST-SAVED even
  //   though SAP's text said "Saved". Root cause: SAP returned the
  //   NavEBiddingMessage array with an EMPTY Type field (or no message at
  //   all), so `result.info` was '' — not 'S' — hence _trustTypeS=false
  //   and ghost detection fired. The retry burned 3 captchas per order
  //   and left the user with ZERO saved orders that window.
  //
  // New rule: TRUST_SAVED_TEXT (default true, tied to TRUST_TYPE_S). When
  // SAP's Message/text contains "Saved" at any severity, treat as SUCCESS
  // regardless of Type. The reference bot (ebidding-secure.js) never
  // inspects Type/ChangeNo — it trusts SAP's text response unconditionally.
  // Ghost detection is now GATED on TRUST_TYPE_S=false (opt-out only) so
  // the default behaviour matches the reference bot.
  const _trustSavedText = TRUST_TYPE_S && !isTieRejected && (
    /saved\s*successfully|bid.*accepted|save.*success/i.test(result.text || '') ||
    /saved\s*successfully|bid.*accepted|save.*success/i.test(evText)
  );
  // v3.41 — Flag="1" trust (user 2026-08-11 3rd-run response.jsonl analysis).
  // SAP's OData response top-level `Flag` is "1" on every accepted save,
  // including the "async ChangeNo" case where NavEBiddingMessage=null and
  // Ev_Text="". This means the DB row was written; the immediate response
  // just doesn't include the persistence GUID yet. Treat Flag="1" as
  // definitive success (highest-priority signal after tie-rejection).
  const _trustRespFlag = TRUST_TYPE_S && !isTieRejected && (result.respFlag || '').toString() === '1';
  const isGhostSaved = TRUST_TYPE_S
    ? false  // v3.40: with TRUST_TYPE_S=true (default), ghost detection is DISABLED entirely.
             //         Post-save verification (1.5s later via fetchLiveOrders) is the
             //         authoritative check. Prevents the "3-retry hammer" seen in bhai's
             //         07:45 log which produced zero saves for NAZIRPUR/BHARATPUR/TALIBPUR.
    : (_allHintsAreGhost && !_sapExplicitSuccess);

  const isSavedOk      = /saved successfully|bid.*accepted|success/i.test(textLower);
  // isRealSuccess must NOT trigger when SAP flags Type='E' with a tie-reject
  // Ev_Text — even if Message cosmetically says "Saved Successfully" — OR when
  // the response only contains ghost persistence markers AND SAP did not
  // explicitly acknowledge (v3.34 recalibrated).
  // v3.36 — TRUST_TYPE_S: any non-tie Type='S' is a real success.
  // v3.40 — also accept when SAP's text says "Saved" even with empty Type.
  // v3.41 — also accept when SAP's response `Flag`='1' (async DB commit).
  const isRealSuccess  = !isTieRejected && !isGhostSaved && result.info !== 'E' && (
    _trustTypeS || _trustSavedText || _trustRespFlag ||
    (result.info === 'S' && !/ended|closed|expired|invalid|error/i.test(textLower)) || isSavedOk
  );
  const isTimeEnded    = /ended|closed|expired/i.test(textLower) && !isSavedOk;
  const isWrongCaptcha = /captcha.*(fail|wrong|invalid)|worng\s*captcha/i.test(textLower);
  const reduceBy       = parseReduceAmount(evText || result.text);
  const minFloor       = parseMinFloor(evText || result.text);

  const bidLogRow = (b, status, message) => bidLog.write({
    session: workerId, sap_order_id: b.order.SapOrderId, city: b.city, spi: b.spi,
    csv_rate: b.amount, submit_ms: result.submitMs, status, message,
  });

  if (isRealSuccess) {
    metrics.submitsOk++;
    // Rename `saved=` (which is what WE sent, echoed back) to `submitted=` so
    // it's clear this is our input, not confirmed persisted value.
    const rankStr = (result.rankHints && result.rankHints.length)
      ? ' | ' + result.rankHints.map((r) => `${r.sapOrderId} rank=${r.rank || '?'} L1=${r.l1Amt || '?'} submitted=${r.savedAmt || '?'}`).join('; ')
      : '';
    log.info(`[${workerId}] ✓ ACCEPTED (${item.kind}, ${bids.length}) in ${result.submitMs}ms: ${result.text || 'OK'}${rankStr}`);
    for (const b of item.bids) {
      ctx.submitted.set(String(b.order.SapOrderId), Date.now());
      const hint = (result.rankHints || []).find((h) => h.sapOrderId === String(b.order.SapOrderId));
      const rankMsg = hint
        ? `rank=${hint.rank || '?'} L1=${hint.l1Amt || '?'} submitted=${hint.savedAmt || '?'} | ${result.text || 'OK'}`
        : (result.text || 'OK');
      bidLogRow(b, 'ACCEPTED', rankMsg);
    }
    // POST-SAVE MONITOR (fire-and-forget, non-blocking) — runs AFTER EVERY
    // successful save (not just first) because L1_UNDERCUT needs live rank
    // data per submit. Two responsibilities:
    //   1. VERIFY that the bid actually persisted (once per process).
    //   2. L1-UNDERCUT: if we're not rank 1 and the L1BidAmount equals our
    //      submitted amount (someone else tied and came first), auto-
    //      resubmit at (L1 - L1_UNDERCUT_STEP) to secure rank 1. Guarded by
    //      per-order attempt counter so we don't race forever.
    const submittedIds = new Set(item.bids.map((b) => String(b.order.SapOrderId)));
    const expectedAmounts = Object.fromEntries(item.bids.map((b) => [String(b.order.SapOrderId), b.amount]));
    const bidsById       = Object.fromEntries(item.bids.map((b) => [String(b.order.SapOrderId), b]));
    setTimeout(async () => {
      try {
        const check = await fetchLiveOrders(auth);
        const found = [];
        const missing = [];
        const undercutTargets = [];
        for (const o of check.orders || []) {
          const oid = String(o.SapOrderId || '');
          if (!submittedIds.has(oid)) continue;
          const persistedAmt = parseFloat(o.BiddingAmount || 0);
          const rank         = parseInt(o.BiddingRank || 0, 10);
          const l1Amt        = parseFloat(o.L1BidAmount || 0);
          if (persistedAmt > 0) found.push(`${oid}=${persistedAmt}(rank=${rank || '?'}, L1=${l1Amt || '?'})`);
          else missing.push(`${oid} (expected ${expectedAmounts[oid]})`);
          // Candidate for undercut: rank > 1 AND we have valid L1 amount
          if (L1_UNDERCUT && rank > 1 && l1Amt > 0 && bidsById[oid]) {
            const attempts = ctx.undercutAttempts.get(oid) || 0;
            if (attempts < L1_UNDERCUT_MAX_ATTEMPTS) {
              const newAmt = l1Amt - L1_UNDERCUT_STEP;
              if (newAmt > 0 && newAmt < parseFloat(bidsById[oid].amount || 0)) {
                undercutTargets.push({ ...bidsById[oid], amount: newAmt, _origRank: rank, _origL1: l1Amt, _attempt: attempts + 1 });
                ctx.undercutAttempts.set(oid, attempts + 1);
              }
            }
          }
        }
        // Verification log (first time only)
        if (!globalThis.__postSaveVerified) {
          globalThis.__postSaveVerified = true;
          if (missing.length && !found.length) {
            log.error(
              `🚨 POST-SAVE VERIFICATION FAILED: SAP replied 'Saved Successfully' but NONE of the ${submittedIds.size} bids appear persisted. ` +
              `Missing: ${missing.join(', ')}. ` +
              `→ Share logs/submit-responses.jsonl with support.`
            );
          } else if (missing.length && found.length) {
            log.warn(`⚠  POST-SAVE PARTIAL: ${found.length}/${submittedIds.size} bids persisted. Persisted: ${found.join(', ')} | Missing: ${missing.join(', ')}.`);
          } else if (found.length) {
            log.info(`✅ POST-SAVE OK: verified ${found.length} bid(s) persisted (${found.join(', ')}).`);
          }
        }
        // L1-Undercut re-bid — only during active window. isHotWindow() covers
        // both the 30 s pre-warm AND the 5-min active window (:15–:19 / :45–:49),
        // which is exactly when this feature should fire.
        if (undercutTargets.length && isHotWindow()) {
          log.warn(`🎯 L1-UNDERCUT: ${undercutTargets.length} order(s) not rank 1 — re-bidding at (L1 - ${L1_UNDERCUT_STEP})`);
          for (let i = 0; i < undercutTargets.length; i += BATCH_SIZE) {
            const chunk = undercutTargets.slice(i, i + BATCH_SIZE);
            const undercutItem = { kind: 'single', bids: chunk };
            session.mutex.run(async () => {
              const solved = await fetchFreshCaptcha(session, session.id);
              if (!solved) {
                // Captcha fetch failed — the attempt didn't actually reach SAP,
                // so give the user back this attempt.
                for (const b of chunk) {
                  const oid = String(b.order.SapOrderId);
                  const cur = ctx.undercutAttempts.get(oid) || 0;
                  if (cur > 0) ctx.undercutAttempts.set(oid, cur - 1);
                }
                log.warn(`L1-undercut: captcha unavailable, skipping (attempt refunded)`);
                return;
              }
              log.info(`[${session.id}] → UNDERCUT (${chunk.length}): ${chunk.map((b) => `${b.order.SapOrderId}@${b.amount}(was rank ${b._origRank}, L1=${b._origL1})`).join(', ')}`);
              await globalSubmitMutex.run(() => handleBatch(ctx, session, undercutItem, solved, session.id));
            }).catch((e) => log.warn(`L1-undercut submit failed: ${e.message}`));
          }
        }
      } catch (e) {
        log.warn(`Post-save monitor failed: ${e.message}`);
      }
    }, 1500).unref();
    return { ok: true };
  }

  if (isWrongCaptcha) {
    metrics.submitsWrongCaptcha++;
    // The captcha we just used was rejected — flush it from the local cache
    // so this same wrong OCR result never comes back as a HIT again.
    invalidateCaptchaCache(auth._lastCaptchaImg, solvedCaptcha);
    if (retryDepth < 3) {
      log.warn(`[${workerId}] ↻ Wrong captcha — refetching + retry ${retryDepth + 1}/3`);
      // Immediate retry with a FRESH captcha (still inside session mutex).
      let fresh = '';
      for (let i = 0; i < 3; i++) {
        const r = await nextCaptcha(auth);
        if (r.solved) { fresh = r.solved; auth._lastCaptchaImg = r.img; break; }
        if (wafActive()) return { retry: false };
      }
      if (!fresh) return { retry: false };
      return handleBatch(ctx, session, item, fresh, workerId, retryDepth + 1);
    }
    log.error(`[${workerId}] ✗ Wrong captcha 3× — will retry next scan`);
    for (const b of item.bids) bidLogRow(b, 'WRONG_CAPTCHA_3X', result.text || '');
    return { retry: true };
  }

  if (isTimeEnded) {
    metrics.submitsTimeEnded++;
    const retryAt = Date.now() + TIME_ENDED_COOLDOWN_MS;
    log.warn(`[${workerId}] ⏰ Bid window CLOSED — cooldown ${Math.round(TIME_ENDED_COOLDOWN_MS / 1000)}s`);
    for (const b of item.bids) {
      ctx.cooldown.set(String(b.order.SapOrderId), retryAt);
      bidLogRow(b, 'TIME_ENDED', result.text || '');
    }
    return { retry: false };
  }

  // ---- SAP floor rejection: "Bidding amount should be Greater than or equal to X" ----
  if (minFloor !== null && minFloor > 0) {
    metrics.submitsRejected++;
    for (const b of item.bids) {
      log.error(
        `[${workerId}] ✗ RATE TOO LOW → SapOrderId=${b.order.SapOrderId} ` +
        `city="${b.city}" spi="${b.spi}" csv=${b.amount} ` +
        `(SAP floor ≥ ${minFloor}). Update input2.csv and re-run.`
      );
      ctx.submitted.set(String(b.order.SapOrderId), Date.now());
      bidLogRow(b, 'RATE_TOO_LOW', `floor=${minFloor}`);
    }
    return { retry: false };
  }

  if (reduceBy !== null && reduceBy > 0) {
    metrics.submitsRejected++;
    if (!AUTO_ADJUST) {
      for (const b of item.bids) {
        const suggested = +(b.amount - reduceBy).toFixed(2);
        log.error(
          `[${workerId}] ✗ RATE HIGH → SapOrderId=${b.order.SapOrderId} ` +
          `city="${b.city}" spi="${b.spi}" csv=${b.amount} ` +
          `(SAP wants ≤ ${suggested}). Update input2.csv and re-run.`
        );
        ctx.submitted.set(String(b.order.SapOrderId), Date.now());
        bidLogRow(b, 'RATE_HIGH', `reduce_by=${reduceBy}`);
      }
      return { retry: false };
    }
    const key = item.bids.map((b) => b.order.SapOrderId).join('|');
    const attempt = (ctx.adjustAttempts.get(key) || 0) + 1;
    if (attempt > MAX_ADJUST_RETRIES) {
      log.error(`[${workerId}] ✗ Gave up after ${MAX_ADJUST_RETRIES} auto-adjust retries`);
      for (const b of item.bids) ctx.submitted.set(String(b.order.SapOrderId), Date.now());
      ctx.adjustAttempts.delete(key);
      return { retry: false };
    }
    ctx.adjustAttempts.set(key, attempt);
    const step = reduceBy + (attempt - 1);
    log.warn(`[${workerId}] ↓ Auto-adjust ${attempt}/${MAX_ADJUST_RETRIES} — reducing by Rs ${step}`);
    for (const b of item.bids) b.amount = +(b.amount - step).toFixed(2);
    let fresh = '';
    for (let i = 0; i < 3; i++) {
      const r = await nextCaptcha(auth);
      if (r.solved) { fresh = r.solved; break; }
    }
    if (!fresh) return { retry: false };
    return handleBatch(ctx, session, item, fresh, workerId, retryDepth + 1);
  }

  // ---- HTTP 201 with empty response body = SILENT SAVE SUCCESS ---------------
  // Restored behaviour from the pre-multi-session working build: SAP returns
  // HTTP 200/201 + empty NavEBiddingMessage + empty Ev_Text as its silent
  // confirmation that the bid was saved (the browser shows the row after
  // this). User confirmed this file version was reliably persisting bids.
  //
  // The earlier "silent-fail / anti-fraud" theory was actually caused by
  // multi-cookie parallel submits, NOT by SAP itself. In single-session mode
  // an empty 201 IS a real save. Treat it as ACCEPTED so we don't skip the
  // "add to submitted" bookkeeping (which caused endless re-submits).
  //
  // v3.25 EXCEPTION — Ghost markers override silent-save. If NavEBiddingTrackHis
  // still contains ghost markers (empty ChangeNo + null CreatedOn + zero
  // CreatedAt) even when NavEBiddingMessage is null, the retry ALSO failed to
  // commit — user's 2026-07-18 logs show the retry response has identical
  // ghost markers as the first attempt. Fall through to the ghost-save handler
  // (below) which will re-queue for another retry in the same window.
  if ((result.statusCode === 200 || result.statusCode === 201) &&
      !result.info && !result.text && !isTimeEnded && !isWrongCaptcha && reduceBy === null && minFloor === null &&
      !isGhostSaved) {
    metrics.submitsOk++;
    log.info(`[${workerId}] ✓ ACCEPTED (${item.kind}, ${bids.length}) in ${result.submitMs}ms: HTTP ${result.statusCode} (empty confirmation = silent save)`);
    for (const b of item.bids) {
      ctx.submitted.set(String(b.order.SapOrderId), Date.now());
      bidLog.write({
        session: workerId, sap_order_id: b.order.SapOrderId, city: b.city, spi: b.spi,
        csv_rate: b.amount, submit_ms: result.submitMs, status: 'ACCEPTED_EMPTY_201',
        message: `HTTP ${result.statusCode} silent save`,
      });
    }
    return { ok: true };
  }

  // v3.36 — INFO-LEVEL INSTANT RETRY (parity with ebidding-secure.js).
  //
  // Prior behaviour: `return { retry:true }` → main tick loop schedules a
  // fresh scan (1-2s later during hot window, wasting captcha lead time).
  //
  // New behaviour: fetch a fresh captcha and recurse INSIDE the same call —
  // up to INFO_INSTANT_RETRY_MAX attempts (default 5). Matches
  // `ebidding-secure.js#submitBids` which loops up to 10× on 'I' responses.
  // The retryDepth counter is shared with wrong-captcha (max 3) plus info
  // retries (max INFO_INSTANT_RETRY_MAX), guarded by an overall cap of
  // (3 + INFO_INSTANT_RETRY_MAX + 3 auto-adjust) = ~11 attempts worst-case.
  if (result.info === 'I') {
    if (retryDepth < INFO_INSTANT_RETRY_MAX) {
      log.warn(`[${workerId}] ↻ Info-level rejection (${result.text || 'captcha issue'}) — instant refetch + retry ${retryDepth + 1}/${INFO_INSTANT_RETRY_MAX}`);
      // Invalidate the captcha we just used (SAP told us it was bad).
      invalidateCaptchaCache(auth._lastCaptchaImg, solved);
      let fresh = '';
      for (let i = 0; i < 3; i++) {
        const r = await nextCaptcha(auth);
        if (r.solved) { fresh = r.solved; auth._lastCaptchaImg = r.img; break; }
        if (wafActive()) return { retry: false };
      }
      if (!fresh) {
        log.warn(`[${workerId}] Info-retry: could not solve fresh captcha — fall back to next-scan retry`);
        return { retry: true };
      }
      return handleBatch(ctx, session, item, fresh, workerId, retryDepth + 1);
    }
    log.warn(`[${workerId}] ↻ Info-level rejection ${INFO_INSTANT_RETRY_MAX}× — deferring to next scan: ${result.text}`);
    for (const b of item.bids) bidLogRow(b, 'INFO_RETRY', result.text || '');
    return { retry: true };
  }

  // v3.21 — Tie: SAP responded Type=E with Message="Saved" + Ev_Text = "Same
  //         amount has been bid by other vendor..." — this signals that we
  //         tied with an earlier submission.
  //
  // v3.22 — Do NOT undercut (SAP floor rule).
  //
  // v3.26 UPDATE (per user browser observation): tied bids ARE saved at the
  // "tied" rank (rank 6-7 in current data), they are NOT rejected outright.
  // The Ev_Text is an INFO message ("you tied, N vendors were faster"),
  // not a failure. Rename REJECTED_TIE → SAVED_TIED so:
  //   • Log reads as INFO not scary WARN
  //   • Metrics count as OK (bid IS on the order in browser view)
  //   • User can review ranks and decide to bid unique amounts next window
  if (isTieRejected) {
    metrics.submitsOk++;   // v3.26: tied bids ARE saved (per user's browser)
    const tiedIds = (evText.match(/order\s*(?:id)?\s*:\s*(\d+)/gi) || [])
      .map((m) => m.replace(/[^\d]/g, ''))
      .join(', ') || item.bids.map((b) => b.order.SapOrderId).join(', ');
    log.info(
      `[${workerId}] ✓ SAVED-TIED (${item.kind}, ${bids.length}) in ${result.submitMs}ms — bid saved but at non-1 rank. ` +
      `SAP says other vendor(s) bid the same amount FIRST. Tied orders: [${tiedIds}]. ` +
      `→ To improve rank, try a slightly different amount next window (₹1-2 below the ties).`
    );
    for (const b of item.bids) {
      ctx.submitted.set(String(b.order.SapOrderId), Date.now());
      bidLog.write({
        session: workerId, sap_order_id: b.order.SapOrderId, city: b.city, spi: b.spi,
        csv_rate: b.amount, submit_ms: result.submitMs, status: 'SAVED_TIED',
        message: evText.trim() || 'Tied with other vendor(s) — saved at non-1 rank',
      });
    }
    // v3.29 — Fire-and-forget POST-SAVE VERIFY for TIE case.
    // SAP's tie behaviour is inconsistent: sometimes ties DO persist at non-1
    // rank (browser shows the bid with rank 6-7), sometimes they don't save
    // at all. User cannot distinguish from bot's log alone. So we schedule an
    // explicit refetch 3.5 s later and log whether the bids actually appear
    // in SAP's order list. This gives objective proof of the browser state.
    const submittedIds = new Set(item.bids.map((b) => String(b.order.SapOrderId)));
    const expectedAmounts = Object.fromEntries(item.bids.map((b) => [String(b.order.SapOrderId), b.amount]));
    setTimeout(async () => {
      try {
        const check = await fetchLiveOrders(auth);
        const foundTied = [];
        const missingTied = [];
        for (const o of check.orders || []) {
          const oid = String(o.SapOrderId || '');
          if (!submittedIds.has(oid)) continue;
          const amt  = parseFloat(o.BiddingAmount || 0);
          const rank = parseInt(o.BiddingRank || 0, 10);
          const l1   = parseFloat(o.L1BidAmount || 0);
          if (amt > 0) foundTied.push(`${oid}@${amt}(rank=${rank || '?'}, L1=${l1 || '?'})`);
          else missingTied.push(`${oid}(expected ${expectedAmounts[oid]})`);
        }
        if (missingTied.length && !foundTied.length) {
          log.error(
            `🚨 TIE-SAVE VERIFICATION FAILED: SAP said SAVED-TIED but NONE of the ${submittedIds.size} bids appear in the order list 3.5s later. ` +
            `Missing: ${missingTied.join(', ')}. → Browser will show NOTHING. SAP's tie logic silently dropped these bids.`
          );
        } else if (missingTied.length && foundTied.length) {
          log.warn(`⚠  TIE-SAVE PARTIAL: ${foundTied.length}/${submittedIds.size} bids persisted. Persisted: ${foundTied.join(', ')} | Dropped: ${missingTied.join(', ')}.`);
        } else if (foundTied.length) {
          log.info(`✅ TIE-SAVE VERIFIED: ${foundTied.length} tied bid(s) actually persisted in browser (${foundTied.join(', ')}). Rank low but visible.`);
        }
      } catch (e) {
        log.warn(`TIE-SAVE verify failed: ${e.message}`);
      }
    }, 3500);
    return { ok: true };
  }

  // v3.24 — Ghost-save: SAP said "Saved Successfully" with Type=S OR returned
  // empty 201, but every NavEBiddingTrackHis entry has empty ChangeNo + null
  // CreatedOn + zero CreatedAt → no actual DB commit. Browser won't show the
  // bid. Retry now (before window closes) so a real save may catch on the
  // next scan.
  //
  // v3.25 — Retry cap: max 3 ghost-retries per order per window. After that,
  // give up on this order (further attempts will hit the same SAP anti-fraud
  // branch — burning cycles just delays other orders in the plan).
  if (isGhostSaved) {
    metrics.submitsRejected++;
    const ghostIds = _ghostMarkerHints.map((h) => h.sapOrderId).join(', ');
    const MAX_GHOST_RETRIES = 3;
    let anyGaveUp = false;
    for (const b of item.bids) {
      const key = String(b.order.SapOrderId);
      const prevCount = ctx.ghostRetries.get(key) || 0;
      ctx.ghostRetries.set(key, prevCount + 1);
      if (prevCount + 1 >= MAX_GHOST_RETRIES) {
        // Give up on this order for THIS window.
        ctx.submitted.set(key, Date.now());
        anyGaveUp = true;
        bidLogRow(b, 'REJECTED_GHOST_MAX', `SAP kept ghost-saving after ${MAX_GHOST_RETRIES} attempts — giving up for this window`);
      } else {
        // Short 300 ms cooldown to avoid burst re-submit on same broken path.
        ctx.cooldown.set(key, Date.now() + 300);
        bidLogRow(b, 'REJECTED_GHOST', `Ghost save (attempt ${prevCount + 1}/${MAX_GHOST_RETRIES})`);
      }
    }
    const attemptTag = anyGaveUp ? `GAVE UP after ${MAX_GHOST_RETRIES} ghost attempts (this window only — retries automatically in NEXT window if Vbeln reappears, or on ANY new Vbeln for same destination)` : `will retry on next scan`;
    log.warn(
      `[${workerId}] ✗ GHOST-SAVED (${item.kind}, ${bids.length}) — SAP said "Saved" but response contains ghost persistence markers ` +
      `(ChangeNo=empty, CreatedOn=null, CreatedAt=PT0S). No actual DB commit — browser will show nothing. ` +
      `Orders: [${ghostIds}]. ${attemptTag}.`
    );
    return { retry: !anyGaveUp };
  }

  if (result.info === 'E') {
    metrics.submitsRejected++;
    log.error(`[${workerId}] ✗ Rejected: ${result.text || '(no text)'}`);
    for (const b of item.bids) {
      ctx.submitted.set(String(b.order.SapOrderId), Date.now());
      bidLogRow(b, 'REJECTED', result.text || '');
    }
    return { retry: false };
  }

  // Unknown → mark done to avoid hot-loop
  log.warn(`[${workerId}] Unknown response info='${result.info}' status=${result.statusCode} — marking done`);
  for (const b of item.bids) {
    ctx.submitted.set(String(b.order.SapOrderId), Date.now());
    bidLogRow(b, 'UNKNOWN', `info=${result.info} status=${result.statusCode}`);
  }
  return { retry: false };
}

// ---- Tick ------------------------------------------------------------------

async function tick(ctx) {
  ctx.scan++;
  if (wafActive()) {
    if (ctx.scan % 20 === 0) log.warn(`⏸  WAF back-off — ${Math.ceil(wafRemainingMs() / 1000)}s left`);
    return;
  }
  try {
    // Use session s1 (primary) for orders + captcha probes. All sessions see
    // the SAME order list on SAP's side (same vendor+plant), so we only need
    // one probe. When work exists, we distribute batches across ALL sessions
    // for parallel submission.
    const primary = ctx.sessions[0];

    let orders;
    const canReuseOrders =
      ctx._cachedOrders &&
      ctx._cachedOrdersScan &&
      ctx.scan - ctx._cachedOrdersScan < 5 &&
      ctx._matchedButNoCaptcha;

    if (canReuseOrders) {
      orders = ctx._cachedOrders;
    } else {
      const res = await fetchLiveOrders(primary);
      orders = res.orders;
      ctx._cachedOrders = orders;
      ctx._cachedOrdersScan = ctx.scan;
    }

    if (!orders.length) {
      // Inside an active :15/:45 hot-window, SAP sometimes lags 1-60s AFTER
      // the boundary before ANY orders show up (not just the captcha). We
      // must keep tight-polling so we catch the moment SAP populates, and
      // emit a visibility log so the user doesn't panic-restart.
      if (isHotWindow()) {
        ctx._hotStall = true;             // main loop tight-polls
        ctx._matchedButNoCaptcha = false; // do NOT enable order-cache reuse in stall state
        maybeShakeSession(ctx, 'no-orders');
        const now = Date.now();
        if (!globalThis.__lastWaitLog || now - globalThis.__lastWaitLog > 10_000) {
          globalThis.__lastWaitLog = now;
          log.info(`⏳ waiting for SAP to populate order list… ${boundaryStatusText()} (bot is polling tight, SAP is late — do NOT restart)`);
        }
        return;
      }
      ctx._hotStall = false;
      ctx._matchedButNoCaptcha = false;
      // Reset the "first captcha detected" marker between windows so the
      // next window-open log fires afresh.
      if (globalThis.__firstCaptchaAt) globalThis.__firstCaptchaAt = null;
      // Idle heartbeat — every ~10s so user knows the bot is alive.
      const beat = Math.max(1, Math.round(10_000 / Math.max(POLL_MS, 1)));
      if (ctx.scan % beat === 0) {
        log.info(`Scan #${ctx.scan} | SAP returned 0 live orders (bid window likely closed) — waiting…`);
      }
      return;
    }

    if (!ctx.sampled) {
      ctx.sampled = true;
      log.info(`Sample order keys: ${Object.keys(orders[0]).join(', ')}`);
    }

    const { plan, stats, effectiveBatchSize } = buildBatches(
      orders, ctx.rules, ctx.blacklist, ctx.submitted, ctx.inFlight, ctx.cooldown,
      ctx.sessions.length, ctx.priorityVbelns
    );
    if (stats.matched === 0) {
      // Hot-window but nothing matched yet — could mean SAP populated a few
      // orders but the ones matching our CSV rules aren't visible yet, or
      // they're all in cooldown/inFlight/already-submitted-this-window.
      // ALSO: trigger a silent CSRF refresh every 15s ("session shake") in
      // case SAP is filtering orders on stale session state.
      if (isHotWindow()) {
        ctx._hotStall = true;
        ctx._matchedButNoCaptcha = false; // no cache reuse — force fresh order fetch each scan
        maybeShakeSession(ctx, 'no-match');
        const now = Date.now();
        if (!globalThis.__lastWaitLog || now - globalThis.__lastWaitLog > 10_000) {
          globalThis.__lastWaitLog = now;
          const alreadySubmitted = ctx.submitted.size;
          // v3.39 — surface WHICH orders were skipped (first 5 blacklist +
          // first 5 no-rule samples) so user can tell "wrongly blacklisted"
          // from "genuinely blacklisted" without grepping raw SAP orders.
          const blSample = (stats._blSamples && stats._blSamples.length)
            ? ` | bl-samples: ${stats._blSamples.join('; ')}${stats.blacklisted > stats._blSamples.length ? `+${stats.blacklisted - stats._blSamples.length} more` : ''}` : '';
          const nrSample = (stats._nrSamples && stats._nrSamples.length)
            ? ` | no-rule samples: ${stats._nrSamples.join('; ')}${stats.noRule > stats._nrSamples.length ? `+${stats.noRule - stats._nrSamples.length} more` : ''}` : '';
          const cdSample = (stats._cdSamples && stats._cdSamples.length)
            ? ` | club-drop samples: ${stats._cdSamples.join('; ')}` : '';
          log.info(`⏳ waiting for matched orders to appear (${stats.total} live: bl=${stats.blacklisted} no-rule=${stats.noRule} club-drop=${stats.clubDropped} cool=${stats.coolskip} sub-this-window=${alreadySubmitted} → 0 matched)… ${boundaryStatusText()} (bot polling tight, session-shake active — do NOT restart)${blSample}${nrSample}${cdSample}`);
        }
        return;
      }
      ctx._hotStall = false;
      ctx._matchedButNoCaptcha = false;
      return;
    }

    // Matched orders exist — clear the stall flag.
    ctx._hotStall = false;

    // Throttle the scan log: it repeats identically for every scan while
    // waiting for the captcha to appear. Log only when the plan changes or
    // every ~5s so log stays readable.
    const planSig = `${stats.matched}/${plan.length}/${stats.priority}`;
    if (ctx._lastPlanSig !== planSig || (ctx.scan - (ctx._lastPlanLoggedScan || 0)) * POLL_MS > 5000) {
      const priTag = stats.priority ? ` priority=${stats.priority}★` : '';
      log.info(
        `Scan #${ctx.scan} | orders=${stats.total} matched=${stats.matched}${priTag} bl=${stats.blacklisted} ` +
        `no-rule=${stats.noRule} club-drop=${stats.clubDropped} cool=${stats.coolskip} | ` +
        `plan=[batches=${plan.length}×${effectiveBatchSize || BATCH_SIZE}, sessions=${ctx.sessions.length}]` +
        (canReuseOrders ? ' [cached-orders]' : '')
      );
      ctx._lastPlanSig = planSig;
      ctx._lastPlanLoggedScan = ctx.scan;
    }

    const submitsBefore = metrics.submits;
    const workerCtx = { ...ctx, plan };
    const workers = makeWorkerPool(workerCtx);
    await Promise.all(workers).catch(() => {});
    // Mark whether this scan actually submitted or was blocked on captcha.
    // If ANY submit happened, invalidate the cached orders on next tick.
    if (metrics.submits > submitsBefore) {
      ctx._cachedOrders = null;         // force refresh next scan
      ctx._matchedButNoCaptcha = false;
    } else {
      ctx._matchedButNoCaptcha = true;  // still waiting on captcha
    }
  } catch (e) {
    // Transient network timeouts (HeadersTimeoutError / UND_ERR_CONNECT_TIMEOUT)
    // are common during long idle periods when SAP's LB kills our idle keep-alive
    // socket. Since v3.20 sapRequest already retries these ONCE automatically for
    // idempotent reads (fetchLiveOrders / fetchCaptchaImage) — so if the exception
    // STILL bubbles up here, both attempts failed. Throttle logs to once per 10s
    // and include how many auto-retries happened so user can see the health.
    const msg = e && e.message ? e.message : String(e);
    const NETWORK_ERR_RE = /HeadersTimeoutError|Headers Timeout|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET|ETIMEDOUT|ECONNRESET|socket hang up|other side closed/i;
    if (NETWORK_ERR_RE.test(msg)) {
      const now = Date.now();
      ctx._netErrCount = (ctx._netErrCount || 0) + 1;
      if (!ctx._netErrLastLog || (now - ctx._netErrLastLog) > 10_000) {
        const totalRetries = ctx.sessions.reduce((a, s) => a + (s._netRetries || 0), 0);
        log.warn(`tick #${ctx.scan}: network timeout (${msg}) — auto-retried but failed both times. Total: ${ctx._netErrCount} tick-fails, ${totalRetries} silent auto-retries so far.`);
        ctx._netErrLastLog = now;
      }
    } else {
      log.error({ err: msg, stack: e.stack }, 'tick failed');
    }
  }
}

// ---- Warm-up ---------------------------------------------------------------

async function warmUpPools(sessions) {
  const tasks = [];
  // Prime one connection per session (parallel TLS handshakes).
  for (const s of sessions) {
    tasks.push(sapPool.request({
      path: `${SAP_PATH_PFX}/SessionSet('')`,
      method: 'GET',
      headers: s.headers({ 'x-csrf-token': 'Fetch' }),
    }).then((r) => r.body.dump()).catch(() => {}));
  }
  tasks.push(solverPool.request({
    path: '/health',
    method: 'GET',
  }).then((r) => r.body.dump()).catch(() => {}));
  await Promise.all(tasks);
  log.info(`Pools warmed up (${sessions.length} SAP session${sessions.length > 1 ? 's' : ''} + local solver, keep-alive established).`);
}

/**
 * Background keep-warm ping — PER SESSION. Prevents TCP+TLS from dying so
 * the FIRST captcha probe after window-open doesn't pay a TLS-renegotiation
 * penalty (~200-500ms). Two frequencies:
 *   • Hot window (30s pre-warm + 5-min active): every 3 seconds
 *   • Cold time (between windows):               every 20 seconds
 * Errors are silent (non-fatal).
 */
function startKeepWarm(sessions) {
  const HOT_MS  = 3_000;
  const COLD_MS = 20_000;
  let lastPing = 0;
  setInterval(() => {
    if (wafActive()) return;
    const need = isHotWindow() ? HOT_MS : COLD_MS;
    if (Date.now() - lastPing < need) return;
    lastPing = Date.now();
    for (const s of sessions) {
      if (s.mutex._busy) continue;
      sapPool.request({
        path: `${SAP_PATH_PFX}/SessionSet('')`,
        method: 'GET',
        headers: s.headers({ 'x-csrf-token': 'Fetch' }),
        headersTimeout: 15_000,
        bodyTimeout: 15_000,
      }).then((r) => r.body.dump()).catch(() => {});
    }
  }, 1_000).unref();
  log.info(`Keep-warm ping enabled (${HOT_MS/1000}s hot / ${COLD_MS/1000}s cold, ${sessions.length} session${sessions.length > 1 ? 's' : ''}) — TCP+TLS stays hot during window opens.`);
}

// ---- Main ------------------------------------------------------------------

/**
 * "Session shake" — during a hot-window stall (SAP returning 0 orders or
 * 0 matched) we silently refresh CSRF tokens on every session in the
 * background. This shakes loose any SAP-side stale-session filtering that
 * may be hiding matched orders from this cookie. Throttled to at most
 * once every 15 seconds per process to avoid CSRF spam.
 *
 * Fire-and-forget (non-blocking, errors swallowed) so it never delays the
 * tick that would otherwise catch a real match.
 */
function maybeShakeSession(ctx, reason) {
  const now = Date.now();
  if (globalThis.__lastSessionShake && now - globalThis.__lastSessionShake < 15_000) return;
  globalThis.__lastSessionShake = now;
  log.info(`🔄 session-shake (${reason}) — refreshing CSRF on ${ctx.sessions.length} session(s) at ${boundaryStatusText()}`);
  Promise.all(ctx.sessions.map((s) => s.refreshToken().catch(() => {}))).catch(() => {});
}

async function main() {
  log.info('🚀 Bikas Bidding v2 engine starting…');

  // Discover session cookie files (cookie.txt, cookie2.txt, cookie3.txt, …)
  const sessionSpecs = discoverSessions();
  const sessions = sessionSpecs.map((sp) => new AuthConfig(sp.id, sp.cookieFile, sp.tokenFile));

  log.info(
    `Config: POLL_MS=${POLL_MS} BATCH_SIZE=${BATCH_SIZE} SESSIONS=${sessions.length} ` +
    `AUTO_ADJUST=${AUTO_ADJUST} WAF=${WAF_MIN_MS}→${WAF_MAX_MS}ms metrics=${METRICS_MS}ms`
  );
  log.info(`Cookies loaded: ${sessions.map((s) => s.id).join(', ')} — SINGLE-SESSION mode (empty HTTP 201 = silent save success, matches pre-multi-session working build).`);

  // Refresh CSRF for every session in parallel.
  await Promise.all(sessions.map((s) => (s.token ? Promise.resolve() : s.refreshToken())));

  await warmUpPools(sessions);
  startKeepWarm(sessions);

  const [inputRows, deleteRows] = await Promise.all([parseCSV(INPUT_CSV), parseCSV(DELETE_CSV)]);
  const { rules, blacklist } = buildRuleMaps(inputRows, deleteRows);
  let totalRules = 0;
  for (const list of rules.values()) totalRules += list.length;
  log.info(`Loaded ${rules.size} cities (${totalRules} rule rows), ${blacklist.length} blacklisted customers`);

  const priorityVbelns = loadPriorityVbelns();
  if (priorityVbelns.size) {
    const sample = Array.from(priorityVbelns).slice(0, 5).join(', ');
    log.info(`⭐ PRIORITY loaded: ${priorityVbelns.size} Vbelns will be bid FIRST (sample: ${sample}${priorityVbelns.size > 5 ? ', …' : ''})`);
  } else {
    log.info(`⭐ PRIORITY list empty — add COF Order IDs to files/priority.csv (one per line) or PRIORITY_VBELNS env to bid them first.`);
  }

  const ctx = {
    sessions, rules, blacklist, priorityVbelns,
    scan: 0,
    submitted: new Map(),  // Map<sapOrderId, submitTimestamp> — timestamp lets us
                            // preserve pre-warm-window submissions when the delayed
                            // boundary-clear tick runs a few seconds after boundary.
    inFlight:  new Set(),
    cooldown:  new Map(),
    adjustAttempts: new Map(),
    undercutAttempts: new Map(), // sapOrderId → attempt count (max L1_UNDERCUT_MAX_ATTEMPTS per window)
    ghostRetries: new Map(),     // v3.25: sapOrderId → ghost-save retry count (max 3 per window)
    windowStartAt: Date.now(),   // reset at each new bid window (below)
  };

  // Per-window state (submitted, cooldown, undercut counters) is cleared
  // inline at the boundary-log moment in the main loop below.

  process.on('SIGINT',  () => { log.info('SIGINT — bye'); process.exit(0); });
  process.on('SIGTERM', () => { log.info('SIGTERM — bye'); process.exit(0); });

  if (METRICS_MS > 0) setInterval(metricsDump, METRICS_MS).unref();

  // v3.33 — INDEPENDENT CAPTCHA POLLER.
  //
  // User asked (2026-07-19): "ek scanner laga do jo bid window ke khulne se
  // pehele he scan karne lage or jaise window khule submit kar de captcha
  // dikhte he" — a scanner that starts BEFORE the window opens, and submits
  // the moment captcha appears.
  //
  // Mirrors the SAP browser controller (EBidding-dbg.controller.js), which
  // starts a 50 ms setInterval captcha poll at boundary-500ms and auto-fires
  // save the moment SAP unlocks captcha. The main tick() loop is SEQUENTIAL
  // (fetchOrders 200ms → captcha 100ms → build → submit); if SAP unlocks
  // captcha while fetchOrders is in-flight, we miss the moment.
  //
  // This poller runs OUT-OF-BAND at 50 ms interval when we are within 90 s
  // of the next :15/:45 boundary (or already inside a hot window). When SAP
  // returns a non-empty captcha, it solves via the local server and caches
  // the result on `ctx._preCaptcha[sessionId]`. The `resolveCaptcha()` path
  // (called from tick) checks this cache FIRST and returns the pre-solved
  // captcha instantly, skipping the round-trip.
  ctx._preCaptcha = {};
  const CAPTCHA_POLLER_INTERVAL = parseInt(process.env.CAPTCHA_POLLER_MS || '50', 10);
  const CAPTCHA_POLLER_LEAD_MS  = parseInt(process.env.CAPTCHA_POLLER_LEAD_MS || '90000', 10);
  if (CAPTCHA_POLLER_INTERVAL <= 0) {
    log.info(`🔍 Independent captcha poller DISABLED (CAPTCHA_POLLER_MS=0) — tick loop only`);
  } else {
    let capPollerBusy = false;
  const capPollerHandle = setInterval(async () => {
    if (capPollerBusy) return;
    // Only run when close to (or inside) a hot window — otherwise idle to save CPU.
    const untilN = msUntilNextWindow();
    if (untilN > CAPTCHA_POLLER_LEAD_MS && !isHotWindow()) return;
    if (wafActive()) return;
    capPollerBusy = true;
    try {
      const primary = ctx.sessions[0];
      if (!primary || !primary.cookie) return;
      // If SAP told us fastpath is active for this window, skip captcha work.
      if (primary._lastCaptchaFlag === '') return;
      const winKey = Math.floor((Date.now() + untilN) / 60_000);
      // One fresh solve per window is enough — after that, tick() uses the
      // cached value; the poller stops re-solving until next boundary.
      if (ctx._preCaptcha[primary.id]?.winKey === winKey && ctx._preCaptcha[primary.id]?.solved) return;
      const { img, reason } = await fetchCaptchaImage(primary);
      if (!img) return; // sap-empty (pre-unlock) — normal
      const r = await solveViaLocal(img);
      if (r.solved) {
        ctx._preCaptcha[primary.id] = {
          solved: r.solved,
          img,
          ts: Date.now(),
          winKey,
          consumed: false,
        };
        log.info(`[cap-poller] ⚡ PRE-SOLVED captcha ready for ${primary.id} (session, sample: ${r.solved.slice(0, 5)}) — next tick will submit INSTANTLY`);
        // Reuse the timing telemetry that nextCaptcha uses.
        if (!globalThis.__firstCaptchaAt) {
          globalThis.__firstCaptchaAt = Date.now();
          try {
            const now = Date.now();
            const boundaryMs = globalThis.__lastBoundaryMs || 0;
            const latency = boundaryMs > 0 ? now - boundaryMs : null;
            const ist = new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false,
            }).format(new Date(boundaryMs > 0 ? boundaryMs : now));
            captchaTimingLog.write({
              ts: new Date(now).toISOString(),
              window_boundary: ist,
              boundary_ms: boundaryMs > 0 ? boundaryMs : '',
              first_captcha_ms: now,
              latency_ms: latency,
              session: primary.id,
              captcha_flag: primary._lastCaptchaFlag || '',
              sample: r.solved.slice(0, 5),
            });
            if (latency != null) log.info(`   ↳ CAPTCHA UNLOCK LATENCY (poller) = ${latency}ms`);
          } catch (_) { /* never let logging break bidding */ }
        }
        // v3.34 — INSTANT-SUBMIT-FROM-POLLER (user directive 2026-07-23:
        // "tum sab tik karo ki bid 45:01 sec me full process ho jaye jitna
        // jaldi ho sake"). v3.35 improvement (2026-07-23 live log analysis):
        // if orders are not cached yet, fetch them INLINE right here to
        // eliminate the 1771ms tick-loop delay observed in the 18:15 window
        // between captcha-ready (T+661ms) and instant-dispatch (T+2432ms).
        if (!ctx._pollerSubmittedForWinKey?.[winKey]) {
          ctx._pollerSubmittedForWinKey = ctx._pollerSubmittedForWinKey || {};
          ctx._pollerSubmittedForWinKey[winKey] = true;
          try {
            let ordersToUse = ctx._cachedOrders;
            if (!ordersToUse || !ordersToUse.length) {
              log.info(`[cap-poller] captcha ready but no cached orders — fetching orders INLINE (parallel to captcha unlock)…`);
              const fetchT0 = Date.now();
              try {
                const res = await fetchLiveOrders(primary);
                ordersToUse = res.orders;
                ctx._cachedOrders = ordersToUse;
                ctx._cachedOrdersScan = ctx.scan;
                log.info(`[cap-poller] inline order-fetch completed in ${Date.now() - fetchT0}ms — got ${ordersToUse.length} orders`);
              } catch (e) {
                log.warn(`[cap-poller] inline order-fetch failed: ${e.message}`);
                ordersToUse = [];
              }
            }
            if (ordersToUse && ordersToUse.length) {
              // v3.37 — reuse the pre-window plan built by the orders poller
              // at T-1500ms (parity with ebidding-secure.js). If we have a
              // cached plan for this same window, skip the buildBatches
              // step (~5-20ms saved). Otherwise build inline as fallback.
              let plan, stats;
              const havePreBuilt = (
                ctx._cachedPlan && ctx._cachedPlan.length &&
                ctx._planBuiltForWinKey === winKey
              );
              if (havePreBuilt) {
                plan = ctx._cachedPlan;
                stats = ctx._cachedPlanStats || { matched: plan.reduce((s, b) => s + (b.bids?.length || 0), 0), total: ordersToUse.length };
              } else {
                const built = buildBatches(
                  ordersToUse, ctx.rules, ctx.blacklist, ctx.submitted, ctx.inFlight, ctx.cooldown,
                  ctx.sessions.length, ctx.priorityVbelns
                );
                plan = built.plan; stats = built.stats;
              }
              if (plan.length) {
                log.info(`[cap-poller] 🚀 INSTANT-SUBMIT dispatching ${plan.length} batch(es) with ${stats.matched} matched orders (${havePreBuilt ? 'PRE-BUILT plan reused' : 'built inline'}) — bypassing tick loop entirely!`);
                ctx._hotStall = true;
                const workerCtx = { ...ctx, plan };
                const workers = makeWorkerPool(workerCtx);
                // Fire-and-forget — don't await, the poller must return quickly
                // for the next tick.
                Promise.all(workers).catch(() => {});
                // Consume the pre-built plan so we don't re-fire it.
                ctx._cachedPlan = null;
              } else {
                log.info(`[cap-poller] no matched orders (matched=${stats.matched}, total=${stats.total}) — tick() may pick up next scan`);
              }
            }
          } catch (e) {
            log.warn(`[cap-poller] instant-submit dispatch failed: ${e.message}`);
          }
        }
      }
    } catch (e) {
      // silent — poller must never crash the process
    } finally {
      capPollerBusy = false;
    }
  }, CAPTCHA_POLLER_INTERVAL);
  capPollerHandle.unref?.();
  log.info(`🔍 Independent captcha poller ACTIVE (interval=${CAPTCHA_POLLER_INTERVAL}ms, activates ${CAPTCHA_POLLER_LEAD_MS/1000}s before each :15/:45 window)`);
  }

  // v3.35 — INDEPENDENT ORDERS POLLER (parallel to captcha poller).
  //
  // User's 2026-07-23 18:15 log showed a 1771 ms gap between "captcha
  // ready" (T+661 ms) and "instant-dispatch" (T+2432 ms) because tick()
  // was blocked on the sequential fetchLiveOrders round-trip when captcha
  // unlocked. By running an INDEPENDENT orders poller (100 ms interval)
  // during the pre-warm + boundary phase, orders are already cached on
  // `ctx._cachedOrders` when captcha unlocks → the instant-submit path
  // can fire immediately, targeting :45:01 total completion.
  //
  // Two concurrent SAP GET streams (captcha + orders) are safe: (a) SAP
  // sees these as the same session, (b) captcha and orders are separate
  // endpoints with independent rate-limits, (c) tick() still runs but
  // reuses `_cachedOrders` when fresh (<5 scans old).
  const ORDERS_POLLER_INTERVAL = parseInt(process.env.ORDERS_POLLER_MS || '150', 10);
  const ORDERS_POLLER_LEAD_MS  = parseInt(process.env.ORDERS_POLLER_LEAD_MS || '90000', 10);
  // v3.38 — HOT-ZONE aggressive polling parameters (user 2026-08-10 log
  // analysis). SAP fetches take 1500-2000ms; the busy-guard let ONE slow
  // fetch block ~14 poll ticks so orders released at T-1s weren't visible
  // by the T-500ms early-drop moment ("no cached orders yet" warnings
  // every window). Fix: within ±ORDERS_POLLER_HOT_ZONE_MS of the boundary,
  // allow up to N parallel fetches at a faster interval so a slow fetch
  // no longer stalls the poller.
  const ORDERS_POLLER_HOT_INTERVAL   = parseInt(process.env.ORDERS_POLLER_HOT_MS      || '50',   10);
  const ORDERS_POLLER_HOT_ZONE_MS    = parseInt(process.env.ORDERS_POLLER_HOT_ZONE_MS || '5000', 10);
  const ORDERS_POLLER_MAX_INFLIGHT   = parseInt(process.env.ORDERS_POLLER_MAX_INFLIGHT || '3',    10);
  if (ORDERS_POLLER_INTERVAL <= 0) {
    log.info(`🔎 Independent orders poller DISABLED (ORDERS_POLLER_MS=0)`);
  } else {
    let ordersInflight = 0;                // v3.38 — replaces boolean busy-flag
    let lastOrdersFetchAt = 0;             // v3.38 — throttle when cold
    const ordersPollerHandle = setInterval(async () => {
      const untilN = msUntilNextWindow();
      const inHotZone = untilN <= ORDERS_POLLER_HOT_ZONE_MS || isHotWindow();
      // Cold zone: keep the original busy-guard (1 inflight at a time,
      // stagger to `ORDERS_POLLER_INTERVAL`). Hot zone: up to N parallel
      // fetches at `ORDERS_POLLER_HOT_INTERVAL` — the point is that SAP
      // releases orders in a very narrow T-1s→T+500ms window and each
      // fetch takes 1500-2000ms, so a single blocking fetch would miss it.
      if (untilN > ORDERS_POLLER_LEAD_MS && !inHotZone) return;
      if (wafActive()) return;
      const now = Date.now();
      const minGap = inHotZone ? ORDERS_POLLER_HOT_INTERVAL : ORDERS_POLLER_INTERVAL;
      if (now - lastOrdersFetchAt < minGap) return;
      const maxInflight = inHotZone ? ORDERS_POLLER_MAX_INFLIGHT : 1;
      if (ordersInflight >= maxInflight) return;
      lastOrdersFetchAt = now;
      ordersInflight++;
      try {
        const primary = ctx.sessions[0];
        if (!primary || !primary.cookie) return;
        // Fetch orders in the background and cache them so the captcha
        // poller's instant-dispatch path doesn't have to wait for a fetch.
        const t0 = Date.now();
        const res = await fetchLiveOrders(primary);
        const orders = res.orders || [];
        // Only overwrite the cache if this fetch actually returned data OR
        // if it's the first fetch for this window (prevents a late-arriving
        // empty response from wiping a previously-populated cache).
        if (orders.length > 0 || !ctx._cachedOrders || !ctx._cachedOrders.length) {
          ctx._cachedOrders = orders;
          ctx._cachedOrdersScan = ctx.scan;
          ctx._cachedOrdersAt = Date.now();
        }
        const winKey = Math.floor((Date.now() + untilN) / 60_000);
        // Log the first non-empty scan per window so we can see order-list
        // publication latency in the log (mirrors captcha-timing telemetry).
        if (orders.length && ctx._ordersPollerFirstSeenWin !== winKey) {
          ctx._ordersPollerFirstSeenWin = winKey;
          log.info(`[orders-poller] 📦 First non-empty orders scan for this window: ${orders.length} orders (fetch took ${Date.now() - t0}ms)`);
        }

        // v3.37 — PRE-WINDOW PLANNER (parity with ebidding-secure.js log timeline).
        //
        // Reference bot's log at T-1000ms shows:
        //   ✓ Bid order list fetched: 40 orders
        //   ✓ CSV matching: 1 rows matched across 1 groups
        //   ℹ Batch size: 3, Total batches: 1
        //   ℹ First batch applied: 1 groups
        //
        // So it: (a) fetches orders BEFORE the boundary, (b) runs CSV
        // matching, (c) pre-builds the batch plan, (d) waits for captcha.
        // Then at T+captcha-unlock, it submits the pre-built plan INSTANTLY.
        //
        // Our orders poller already caches orders every 150ms. Here we
        // ALSO run buildBatches() ONCE per window when we're within 2s of
        // the boundary and orders are cached, then stash the plan on
        // ctx._cachedPlan for the captcha poller to pick up with zero
        // computation cost at the T+captcha-unlock moment.
        if (
          orders.length &&
          untilN > 0 && untilN <= 2500 &&
          ctx._planBuiltForWinKey !== winKey
        ) {
          ctx._planBuiltForWinKey = winKey;
          try {
            const { plan, stats } = buildBatches(
              orders, ctx.rules, ctx.blacklist, ctx.submitted, ctx.inFlight, ctx.cooldown,
              ctx.sessions.length, ctx.priorityVbelns
            );
            ctx._cachedPlan = plan;
            ctx._cachedPlanStats = stats;
            log.info(`[pre-window] ✓ Bid order list fetched: ${orders.length} orders (T-${untilN}ms)`);
            log.info(`[pre-window] ✓ CSV matching: ${stats.matched} rows matched across ${plan.length} groups`);
            if (plan.length) {
              const batchSize = plan[0]?.bids?.length || 0;
              log.info(`[pre-window] ℹ Batch size: ${batchSize}, Total batches: ${plan.length}`);
              log.info(`[pre-window] ℹ First batch applied: ${plan.length} groups — waiting for captcha unlock…`);
            } else {
              log.info(`[pre-window] ℹ No matches in this pre-window scan — orders-poller will re-check every ${ORDERS_POLLER_INTERVAL}ms until boundary`);
              // Allow re-planning on the next tick if no match this time —
              // by clearing the guard so a fresh order-set gets re-planned.
              ctx._planBuiltForWinKey = 0;
            }
          } catch (e) {
            log.warn(`[pre-window] plan build failed: ${e.message}`);
            ctx._planBuiltForWinKey = 0;
          }
        }
      } catch (e) {
        // silent — poller must never crash the process
      } finally {
        ordersInflight--;
      }
    }, Math.min(ORDERS_POLLER_INTERVAL, ORDERS_POLLER_HOT_INTERVAL));
    ordersPollerHandle.unref?.();
    log.info(`🔎 Independent orders poller ACTIVE (cold=${ORDERS_POLLER_INTERVAL}ms, hot=${ORDERS_POLLER_HOT_INTERVAL}ms within ±${ORDERS_POLLER_HOT_ZONE_MS}ms of boundary, max ${ORDERS_POLLER_MAX_INFLIGHT} parallel fetches; activates ${ORDERS_POLLER_LEAD_MS/1000}s before each :15/:45 window)`);
  }

  // Main polling loop.
  //
  // SPEED strategy — IST-window-aware:
  //   • Pre-window (30 s BEFORE :15 or :45 IST) → aggressive polling
  //     (100 ms sleep) to be first to catch the "window opens" moment.
  //   • Active window (:15–:19 / :45–:49 IST, i.e. first 5 min) → tight
  //     loop (0-ms setImmediate) when we have matched orders but no captcha.
  //   • Between windows (idle) → slow poll (2000 ms) — WAF-safe & CPU-safe.
  //   • Whenever orders match but captcha is empty → tight loop regardless
  //     of clock (window may already be open).
  let lastPreWarmAt = 0;
  let lastEarlyWarmAt = 0;
  let lastBoundaryLogAt = 0;
  let earlyDropScheduledWinKey = 0;  // v3.31 — both CSRF & FIRE scheduled via setTimeout once per window
  while (true) {
    const untilNext = msUntilNextWindow();
    const hot = isHotWindow();

    // v3.18: TRIPLE pre-warm — 60s (early DNS+TLS), 30s (CSRF), and passive
    // keep-warm every 3s during hot. Multiple warm-ups ensure that if any
    // connection dies between warms, the next one revives it before the
    // window opens.
    if (untilNext < 60_000 && untilNext > 30_000 && Date.now() - lastEarlyWarmAt > 120_000) {
      lastEarlyWarmAt = Date.now();
      log.info(`⏱  Early pre-warm (~${Math.round(untilNext / 1000)}s away) — priming DNS + TLS`);
      // Fire-and-forget: touch SessionSet on every session to hydrate DNS+TLS.
      for (const s of ctx.sessions) {
        sapPool.request({
          path: `${SAP_PATH_PFX}/SessionSet('')`,
          method: 'GET',
          headers: s.headers({ 'x-csrf-token': 'Fetch' }),
        }).then((r) => r.body.dump()).catch(() => {});
      }
    }

    // Pre-warm CSRF + TLS ~30s before each window. Runs once per window.
    if (untilNext < 30_000 && Date.now() - lastPreWarmAt > 60_000) {
      lastPreWarmAt = Date.now();
      log.info(`⏱  Pre-warming for next SAP bid-window (~${Math.round(untilNext / 1000)}s away, IST-aligned)`);
      // Fire-and-forget: refresh CSRF + touch SessionSet in parallel for all sessions.
      Promise.all(ctx.sessions.map((s) => s.refreshToken().catch(() => {})));
    }

    // v3.31 — PRECISION EARLY-DROP scheduler.
    //
    // v3.30 tried to fire from the main tick loop, but each tick() call takes
    // 200-500ms during pre-boundary (SAP is slow). That made the loop jump
    // from T-1200ms straight to T+1000ms, SKIPPING the T-300 to T-0 window
    // entirely (verified from live log 2026-07-19: CSRF fired at T-1236ms
    // but no FIRE log ever appeared).
    //
    // FIX: schedule BOTH the CSRF refresh AND the FIRE with `setTimeout` at
    // the moment we first enter the pre-boundary window (~5s before). This
    // guarantees they fire at the exact target timestamps regardless of
    // how slow the tick loop is.
    const nextBoundaryKey = Math.floor((Date.now() + untilNext) / 60_000);
    if (
      EARLY_DROP_MS > 0 &&
      untilNext <= 5_000 &&
      untilNext > EARLY_DROP_MS &&
      earlyDropScheduledWinKey !== nextBoundaryKey
    ) {
      earlyDropScheduledWinKey = nextBoundaryKey;
      const csrfDelay = Math.max(0, untilNext - (EARLY_DROP_MS + EARLY_DROP_CSRF_LEAD_MS));
      const fireDelay = Math.max(0, untilNext - EARLY_DROP_MS);
      log.info(`⏰ EARLY-DROP scheduled: CSRF@T-${EARLY_DROP_MS + EARLY_DROP_CSRF_LEAD_MS}ms (in ${csrfDelay}ms), FIRE@T-${EARLY_DROP_MS}ms (in ${fireDelay}ms)`);

      // CSRF refresh — precise setTimeout so it never gets skipped by slow ticks.
      setTimeout(() => {
        log.info(`🚀 EARLY-DROP CSRF refresh @ T-${msUntilNextWindow()}ms — minting post-pre-window token`);
        Promise.all(ctx.sessions.map((s) => s.refreshToken().catch((e) => {
          log.warn(`[${s.id}] early-drop CSRF refresh failed: ${e.message}`);
        })));
      }, csrfDelay);

      // FIRE — precise setTimeout that IMMEDIATELY dispatches a submit if we
      // have cached matched bids. Bypasses the tick loop entirely so timing
      // is guaranteed regardless of how slow SAP is responding.
      setTimeout(async () => {
        const now = msUntilNextWindow();
        log.info(`🎯 EARLY-DROP FIRE @ T-${now}ms — attempting direct speculative submit`);

        // Set stall flag so main tick loop keeps tight-polling captcha too.
        ctx._hotStall = true;

        // Try direct submit from cached orders (if any). This bypasses
        // fetchLiveOrders (which returns 0 during pre-boundary) and dispatches
        // straight to submitBid using the cached matched-bids from the last
        // successful scan. Only viable when EvCaptchaFlag='' (fastpath).
        try {
          // v3.38 — SPIN-WAIT for orders to arrive (user 2026-08-10 log analysis).
          //
          // Previous behaviour: if `_cachedOrders` was empty at the exact
          // T-500ms tick, we bailed out and fell back to post-boundary tick().
          // But SAP releases orders ~1s pre-boundary and each fetch takes
          // 1500-2000ms — so at T-500ms the orders-poller's most recent
          // completed fetch was almost always the T-2500ms probe (empty).
          // Result: EVERY window logged "no cached orders yet" and missed
          // the pre-boundary submit opportunity.
          //
          // Fix: instead of bailing, spin-wait up to EARLY_DROP_WAIT_MS
          // (default 1500ms) checking every 10ms — the moment the parallel
          // hot-zone orders-poller populates the cache with a non-empty list
          // and buildBatches finds a match, we fire IMMEDIATELY. Includes a
          // hard timeout so we never fire past the boundary here.
          const EARLY_DROP_WAIT_MS = parseInt(process.env.EARLY_DROP_WAIT_MS || '1500', 10);
          const spinStartAt = Date.now();
          const spinDeadline = spinStartAt + EARLY_DROP_WAIT_MS;
          const primary = ctx.sessions[0];
          const captchaRequired = primary && primary._lastCaptchaFlag === 'X';
          if (captchaRequired) {
            log.warn(`🎯 EARLY-DROP FIRE: SAP requires captcha (EvCaptchaFlag='X') — cannot fire pre-boundary without captcha unlock. Skipping speculative submit; falling back to normal post-boundary path.`);
            return;
          }
          let plan = null, stats = null;
          let spinAttempts = 0;
          while (Date.now() < spinDeadline) {
            spinAttempts++;
            if (ctx._cachedOrders && ctx._cachedOrders.length) {
              const built = buildBatches(
                ctx._cachedOrders, ctx.rules, ctx.blacklist, ctx.submitted, ctx.inFlight, ctx.cooldown,
                ctx.sessions.length, ctx.priorityVbelns
              );
              if (built.plan.length) {
                plan = built.plan;
                stats = built.stats;
                break;
              }
            }
            // Guard: if the boundary has passed while spinning, exit — the
            // regular boundary/instant-submit-from-poller path will pick up.
            if (msUntilNextWindow() < 0) break;
            await new Promise((r) => setTimeout(r, 10));
          }
          if (!plan) {
            log.warn(`🎯 EARLY-DROP FIRE: spin-wait ${Date.now() - spinStartAt}ms (${spinAttempts} attempts), no matched cached orders — falling back to boundary path. cachedOrders=${ctx._cachedOrders?.length || 0}, T=${msUntilNextWindow()}ms.`);
            return;
          }
          log.info(`🎯 EARLY-DROP FIRE: dispatching ${plan.length} batch(es), ${stats.matched} matched from cache (fastpath EvCaptchaFlag='', spin=${Date.now() - spinStartAt}ms, ${spinAttempts} attempts, T-${msUntilNextWindow()}ms)`);
          const workerCtx = { ...ctx, plan };
          const workers = makeWorkerPool(workerCtx);
          await Promise.all(workers).catch(() => {});
        } catch (e) {
          log.warn(`🎯 EARLY-DROP FIRE crashed: ${e.message} — falling back to post-boundary path`);
        }
      }, fireDelay);
    }


    // Precise "window boundary reached" log — fires once per window when the
    // clock hits :15:00 or :45:00. Distinct from the "first captcha detected"
    // log (which fires whenever SAP finally unlocks, often later). This helps
    // the user see immediately that the boundary is CROSSED but captcha
    // hasn't unlocked yet — so they don't panic-restart.
    if (hot && untilNext > (29 * 60_000) && Date.now() - lastBoundaryLogAt > 60_000) {
      lastBoundaryLogAt = Date.now();
      // Only reset __firstCaptchaAt if it happened LONG ago (previous window).
      // If we already detected the first captcha within the last 30 s (i.e.
      // during pre-warm of the just-opened window), keep it so we don't
      // log "First non-empty captcha detected" twice for the same window.
      if (!globalThis.__firstCaptchaAt || Date.now() - globalThis.__firstCaptchaAt > 30_000) {
        globalThis.__firstCaptchaAt = 0;
      }
      globalThis.__lastWaitLog = 0;    // reset waiting log timer
      globalThis.__lastSessionShake = 0; // allow immediate session-shake on new window
      globalThis.__postSaveVerified = false; // allow post-save verify per window
      // *** v3.17 FIX for delayed-boundary race ***
      // When the main loop is blocked inside a tick() (submitting a bid) as
      // the clock crosses :15:00 / :45:00, the boundary block below fires a
      // few seconds LATE. If we then `.clear()` submitted entries, we wipe
      // the *just-submitted* order → next tick sees it as fresh → duplicate
      // submit at same amount. Fix: only remove entries older than 30 s.
      // Windows are 30 min apart, so any entry ≤30 s old must belong to the
      // current (just-opened) window; anything older is from a previous one.
      const RECENT_MS = 30_000;
      const now = Date.now();
      const clearedSub = clearOlderThan(ctx.submitted, now - RECENT_MS);
      const clearedCd  = clearOlderThan(ctx.cooldown,  now - RECENT_MS);
      const clearedUc  = ctx.undercutAttempts.size;
      ctx.undercutAttempts.clear();
      ctx.ghostRetries.clear();  // v3.25: reset per-window ghost-retry counters
      ctx._cachedOrders = null; // force fresh order fetch for new window
      // v3.32 — Record boundary timestamp for captcha-timing telemetry (used
      // by nextCaptcha() to compute per-window unlock latency).
      globalThis.__lastBoundaryMs = Date.now();
      // Reload priority Vbelns so user can edit files/priority.csv mid-run
      // without restarting the bot. Only diff-log if it changed.
      const beforeSize = ctx.priorityVbelns ? ctx.priorityVbelns.size : 0;
      const beforeKey  = ctx.priorityVbelns ? Array.from(ctx.priorityVbelns).sort().join(',') : '';
      ctx.priorityVbelns = loadPriorityVbelns();
      const afterKey = Array.from(ctx.priorityVbelns).sort().join(',');
      if (afterKey !== beforeKey) {
        const sample = Array.from(ctx.priorityVbelns).slice(0, 5).join(', ');
        log.info(`⭐ PRIORITY reloaded: ${beforeSize}→${ctx.priorityVbelns.size} Vbelns (sample: ${sample || 'none'})`);
      }
      log.info(`🕒 :15/:45 window BOUNDARY reached — cleared stale per-window state (submitted=${clearedSub}, cooldown=${clearedCd}, undercut=${clearedUc}, kept fresh=${ctx.submitted.size}). Bot polling for SAP captcha unlock.`);

      // v3.25 CRITICAL FIX — Boundary CSRF re-issue for FIRST submit.
      //
      // From live-log analysis (2026-07-18 logs across 3 windows), EVERY first
      // submit of a window was ghost-saved (Type=S "Saved" but ChangeNo empty +
      // CreatedOn null → no actual DB commit). The retry ~3-4 s later —
      // triggered by session-shake CSRF refresh — always succeeded. Pattern:
      //   1. Pre-warm CSRF fetched ~30 s BEFORE boundary → SAP flags this token
      //      as "pre-window" and any submit with it lands in a no-commit branch.
      //   2. Session-shake refreshes CSRF ~4 s AFTER boundary → new token is
      //      "post-boundary" → next submit actually writes to DB.
      //
      // Fix: at every :15/:45 boundary, immediately fire a background CSRF
      // refresh on all sessions so the token used by the first submit was
      // minted AFTER the boundary. This is non-blocking — we don't hold up
      // the tick loop (SAP takes 150-400 ms for CSRF); by the time the first
      // captcha is detected (~1-2 s after boundary), the fresh token is ready.
      for (const s of ctx.sessions) {
        Promise.resolve().then(() => s.refreshToken()).catch((e) => {
          log.warn(`[${s.id}] boundary CSRF refresh failed: ${e.message} — will retry on next tick`);
        });
      }
      log.info(`🔑 Boundary CSRF re-issue triggered on ${ctx.sessions.length} session(s) — first submit will use post-boundary token to avoid SAP "pre-window" ghost-save.`);
    }

    await tick(ctx);

    let sleepMs;
    if (ctx._matchedButNoCaptcha || ctx._hotStall) {
      sleepMs = 0; // tight loop — window is opening/open OR waiting for orders/matches to appear
    } else if (EARLY_DROP_MS > 0 && untilNext <= EARLY_DROP_MS + 2000) {
      // v3.30 — In the final ~2s runway before early-drop fire, poll tightly
      // so we do not sleep past our target `boundary - EARLY_DROP_MS` moment.
      sleepMs = 0;
    } else if (hot) {
      sleepMs = POLL_MS; // inside 5-min active window (or 30s pre-warm) — user-tunable
    } else if (untilNext < 10_000) {
      sleepMs = 100; // 10 s before window opens
    } else if (untilNext < 60_000) {
      sleepMs = 500; // 1 min before window opens
    } else {
      sleepMs = 2000; // idle between windows — WAF-safe
    }

    if (sleepMs === 0) {
      await new Promise((r) => setImmediate(r));
    } else {
      await new Promise((r) => setTimeout(r, sleepMs + Math.floor(Math.random() * 20)));
    }
  }
}

main().catch((e) => { log.error({ err: e.message, stack: e.stack }, 'fatal'); process.exit(1); });
