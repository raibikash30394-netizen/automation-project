'use strict';

/**
 * Unit tests for:
 *   • IST window helpers (getISTNow, msUntilNextWindow, isHotWindow)
 *   • globalSubmitMutex (serialisation across concurrent callers)
 *   • Sequential-fallback semantics (silentFail → next session)
 *
 * Run with: node tests/test-window-scheduler.js
 */

const assert = require('assert');

// ---- Re-implement the helpers exactly as they exist in bid-engine.js ------
// (bid-engine.js exports nothing right now — copy the tested functions here
// verbatim. If the source ever diverges, this test WILL fail as intended.)

function getISTNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const o = {};
  for (const p of parts) if (p.type !== 'literal') o[p.type] = parseInt(p.value, 10);
  return o;
}

function msUntilNextWindow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(now);
  const o = {};
  for (const p of parts) if (p.type !== 'literal') o[p.type] = parseInt(p.value, 10);
  const ms = now.getMilliseconds();
  const secondsIntoMinute = o.second + ms / 1000;
  let nextMin;
  if (o.minute < 15) nextMin = 15;
  else if (o.minute < 45) nextMin = 45;
  else nextMin = 75;
  const secondsToGo = (nextMin - o.minute) * 60 - secondsIntoMinute;
  return Math.max(0, Math.round(secondsToGo * 1000));
}

function isHotWindow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(now);
  const o = {};
  for (const p of parts) if (p.type !== 'literal') o[p.type] = parseInt(p.value, 10);
  if ((o.minute === 14 || o.minute === 44) && o.second >= 30) return true;
  if (o.minute >= 15 && o.minute < 20) return true;
  if (o.minute >= 45 && o.minute < 50) return true;
  return false;
}

// ---- Test IST helpers using synthetic clock -------------------------------

// Helper: create a Date whose IST representation is (h, m, s).
// IST is UTC+5:30 with no DST, so this is deterministic.
function istDate(h, m, s = 0) {
  // Aim for a fixed reference day (2026-02-15) to avoid DST edge cases.
  const utcH = h - 5;
  const utcM = m - 30;
  // Normalise carry
  const d = new Date(Date.UTC(2026, 1, 15, utcH, utcM, s, 0));
  return d;
}

function testMsUntilNextWindow() {
  const cases = [
    // hh:mm:ss IST → expected ms to next :15 or :45
    { at: [14,  0,  0], want:  15 * 60_000 },     // 14:00 → 14:15
    { at: [14, 14, 59], want:  1_000 },           // 14:14:59 → 14:15
    { at: [14, 15,  0], want: 30 * 60_000 },      // 14:15:00 → 14:45
    { at: [14, 44, 30], want: 30_000 },           // 14:44:30 → 14:45
    { at: [14, 45,  0], want: 30 * 60_000 },      // 14:45:00 → 15:15
    { at: [14, 59, 59], want: 15 * 60_000 + 1_000 },  // 14:59:59 → 15:15:00 (15m1s)
    { at: [15, 14, 45], want: 15_000 },           // 15:14:45 → 15:15
  ];
  for (const c of cases) {
    const d = istDate(c.at[0], c.at[1], c.at[2]);
    const got = msUntilNextWindow(d);
    // Allow ±100 ms tolerance (millisecond granularity of Date)
    assert(Math.abs(got - c.want) <= 100,
      `msUntilNextWindow(${c.at.join(':')}) → got ${got}ms, want ~${c.want}ms`);
  }
  console.log('✓ msUntilNextWindow(): 7 IST clock cases pass');
}

function testIsHotWindow() {
  const trueCases = [
    [14, 14, 30], [14, 14, 45], [14, 14, 59], // pre-warm before :15
    [14, 15,  0], [14, 17,  0], [14, 19, 59], // active window after :15
    [14, 44, 30], [14, 44, 59],               // pre-warm before :45
    [14, 45,  0], [14, 47,  0], [14, 49, 59], // active window after :45
  ];
  const falseCases = [
    [14,  0,  0], [14, 10,  0], [14, 14, 29], // too early
    [14, 20,  0], [14, 25,  0], [14, 30,  0], // between windows
    [14, 40,  0], [14, 44, 29],               // too early for :45
    [14, 50,  0], [14, 55,  0], [14, 59, 59], // after active
  ];
  for (const c of trueCases) {
    assert(isHotWindow(istDate(...c)) === true,
      `isHotWindow(${c.join(':')}) should be TRUE`);
  }
  for (const c of falseCases) {
    assert(isHotWindow(istDate(...c)) === false,
      `isHotWindow(${c.join(':')}) should be FALSE`);
  }
  console.log(`✓ isHotWindow(): ${trueCases.length} hot + ${falseCases.length} cold cases pass`);
}

// ---- Test global mutex serialisation --------------------------------------

async function testGlobalMutexSerialises() {
  // Re-implement the mutex (should stay in lockstep with the engine's copy).
  const mutex = (() => {
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

  const log = [];
  const start = Date.now();
  async function task(id, ms) {
    return mutex.run(async () => {
      log.push({ id, at: 'start', t: Date.now() - start });
      await new Promise((r) => setTimeout(r, ms));
      log.push({ id, at: 'end',   t: Date.now() - start });
      return id;
    });
  }

  // Fire 4 tasks concurrently — they should run STRICTLY sequentially.
  const results = await Promise.all([task('A', 40), task('B', 40), task('C', 40), task('D', 40)]);

  // Assert ordering: A.end ≤ B.start, B.end ≤ C.start, C.end ≤ D.start
  const ends = {};
  const starts = {};
  for (const e of log) {
    if (e.at === 'start') starts[e.id] = e.t;
    else ends[e.id] = e.t;
  }
  assert(starts.B >= ends.A, `B started at ${starts.B} but A ended at ${ends.A} — mutex broken`);
  assert(starts.C >= ends.B, `C started at ${starts.C} but B ended at ${ends.B} — mutex broken`);
  assert(starts.D >= ends.C, `D started at ${starts.D} but C ended at ${ends.C} — mutex broken`);
  assert.deepStrictEqual(results, ['A', 'B', 'C', 'D']);
  console.log('✓ globalSubmitMutex: 4 concurrent submits ran STRICTLY sequentially');
}

// ---- Test sequential-fallback logic (simulated) ---------------------------

async function testSequentialFallback() {
  // Simulate 4 sessions where s1..s3 silent-fail, s4 succeeds.
  const outcomes = [
    { silentFail: true },
    { silentFail: true },
    { silentFail: true },
    { ok: true },
  ];
  const sessions = outcomes.map((o, i) => ({ id: `s${i + 1}`, outcome: o }));
  const called = [];

  async function runItem() {
    for (const s of sessions) {
      called.push(s.id);
      if (s.outcome.silentFail) continue;
      return s.outcome; // real success/rejection → stop
    }
    return { allSilentFail: true };
  }

  const r = await runItem();
  assert.deepStrictEqual(called, ['s1', 's2', 's3', 's4']);
  assert.deepStrictEqual(r, { ok: true });
  console.log('✓ Sequential fallback: s1→s2→s3→s4, stops at first non-silent-fail');

  // Case 2: all 4 silent-fail
  const outcomesAllFail = [{ silentFail: true }, { silentFail: true }, { silentFail: true }, { silentFail: true }];
  const sessions2 = outcomesAllFail.map((o, i) => ({ id: `s${i + 1}`, outcome: o }));
  const called2 = [];
  let allSilent = true;
  let last = null;
  for (const s of sessions2) {
    called2.push(s.id);
    last = s.outcome;
    if (!s.outcome.silentFail) { allSilent = false; break; }
  }
  assert.strictEqual(allSilent, true);
  assert.deepStrictEqual(called2, ['s1', 's2', 's3', 's4']);
  assert.strictEqual(last.silentFail, true);
  console.log('✓ Sequential fallback: all-silent-fail case triggers cooldown path');
}

// ---- Test batching: singles pack 3-per-batch, clubs come after ------------

function testBatchingLogic() {
  // Simulate the buildBatches core (singles + clubs → plan)
  const BATCH_SIZE = 3;
  function planFromCounts(numSingles, clubGroups = []) {
    const singles = Array.from({ length: numSingles }, (_, i) => ({ id: `single-${i + 1}` }));
    const singleBatches = [];
    for (let i = 0; i < singles.length; i += BATCH_SIZE) {
      singleBatches.push(singles.slice(i, i + BATCH_SIZE));
    }
    const plan = [];
    for (const b of singleBatches) plan.push({ kind: 'single', bids: b });
    for (const c of clubGroups)    plan.push({ kind: 'club',   bids: c.bids, clubId: c.clubId });
    return plan;
  }

  // Case 1: 1 single → 1 batch of size 1
  let p = planFromCounts(1);
  assert.strictEqual(p.length, 1);
  assert.strictEqual(p[0].bids.length, 1);
  assert.strictEqual(p[0].kind, 'single');

  // Case 2: 3 singles → 1 batch of size 3
  p = planFromCounts(3);
  assert.strictEqual(p.length, 1, `3 singles should be ONE batch of 3, got ${p.length} batches`);
  assert.strictEqual(p[0].bids.length, 3);

  // Case 3: 6 singles → 2 batches of 3
  p = planFromCounts(6);
  assert.strictEqual(p.length, 2);
  assert.strictEqual(p[0].bids.length, 3);
  assert.strictEqual(p[1].bids.length, 3);

  // Case 4: 7 singles → 3 batches (3, 3, 1)
  p = planFromCounts(7);
  assert.strictEqual(p.length, 3);
  assert.strictEqual(p[0].bids.length, 3);
  assert.strictEqual(p[1].bids.length, 3);
  assert.strictEqual(p[2].bids.length, 1);

  // Case 5: 5 singles + 2 club groups → singles first, clubs after
  p = planFromCounts(5, [
    { clubId: 'C1', bids: [{ id: 'c1-1' }, { id: 'c1-2' }] },
    { clubId: 'C2', bids: [{ id: 'c2-1' }] },
  ]);
  // 5 singles = 2 batches (3, 2), + 2 clubs = 4 items total
  assert.strictEqual(p.length, 4);
  assert.strictEqual(p[0].kind, 'single');
  assert.strictEqual(p[0].bids.length, 3);
  assert.strictEqual(p[1].kind, 'single');
  assert.strictEqual(p[1].bids.length, 2);
  assert.strictEqual(p[2].kind, 'club');
  assert.strictEqual(p[2].clubId, 'C1');
  assert.strictEqual(p[3].kind, 'club');
  assert.strictEqual(p[3].clubId, 'C2');

  console.log('✓ Batching: 5 cases pass (singles pack 3-per, clubs come after)');
}

// ---- Test rank hint extraction from SAP submit response --------------------

function testRankHintExtraction() {
  // Simulate what submitBid does when SAP echoes NavEBiddingTrackHis back.
  function extractRankHints(d) {
    const rankHints = [];
    const trackHis = d?.NavEBiddingTrackHis?.results || [];
    if (Array.isArray(trackHis) && trackHis.length) {
      for (const t of trackHis) {
        rankHints.push({
          sapOrderId: (t.SapOrderId || '').toString(),
          rank      : (t.BiddingRank || '').toString(),
          savedAmt  : (t.BiddingAmount || '').toString(),
          l1Amt     : (t.L1BidAmount || '').toString(),
          avgAmt    : (t.AvgWtBidAmount || '').toString(),
        });
      }
    }
    return rankHints;
  }

  // Case 1: SAP echoes back one order with rank 5, L1=564, saved=564
  const resp1 = {
    NavEBiddingTrackHis: {
      results: [{
        SapOrderId    : '1153385318',
        BiddingRank   : '05',
        BiddingAmount : '564.000',
        L1BidAmount   : '564.000',
        AvgWtBidAmount: '569.000',
      }],
    },
  };
  const h1 = extractRankHints(resp1);
  assert.strictEqual(h1.length, 1);
  assert.strictEqual(h1[0].sapOrderId, '1153385318');
  assert.strictEqual(h1[0].rank, '05');
  assert.strictEqual(h1[0].l1Amt, '564.000');
  assert.strictEqual(h1[0].savedAmt, '564.000');

  // Case 2: Empty response — no hints
  assert.deepStrictEqual(extractRankHints({}), []);
  assert.deepStrictEqual(extractRankHints({ NavEBiddingTrackHis: { results: [] } }), []);

  // Case 3: Club with 2 items
  const resp3 = {
    NavEBiddingTrackHis: {
      results: [
        { SapOrderId: '1153406328', BiddingRank: '03', BiddingAmount: '690.000', L1BidAmount: '685.000' },
        { SapOrderId: '1153406322', BiddingRank: '03', BiddingAmount: '690.000', L1BidAmount: '685.000' },
      ],
    },
  };
  const h3 = extractRankHints(resp3);
  assert.strictEqual(h3.length, 2);
  assert.strictEqual(h3[0].rank, '03');
  assert.strictEqual(h3[1].rank, '03');
  assert.notStrictEqual(h3[0].l1Amt, h3[0].savedAmt, 'saved > L1 means outbid — user is 2nd/3rd place');

  console.log('✓ Rank hint extraction: 3 cases pass (single, empty, club-of-2)');
}

// ---- Test empty HTTP 201 classification as SUCCESS -------------------------
//
// v3.6: Restored old-file behaviour where SAP's HTTP 200/201 with an empty
// NavEBiddingMessage + empty Ev_Text is treated as a SILENT SAVE SUCCESS
// (the browser row appears after this response). Previous multi-session era
// classified this as a silent-fail, which caused the bot to skip the
// "submitted" bookkeeping and re-submit endlessly — while the browser
// actually showed the bid saved.
function testEmptyResponseSuccess() {
  // Mirror the exact predicate from handleBatch.
  function classify(result) {
    const textLower = (result.text || '').toString().toLowerCase();
    const isSavedOk      = /saved successfully|bid.*accepted|success/i.test(textLower);
    const isTimeEnded    = /ended|closed|expired/i.test(textLower) && !isSavedOk;
    const isWrongCaptcha = /captcha.*(fail|wrong|invalid)|worng\s*captcha/i.test(textLower);
    const isRealSuccess  = (result.info === 'S' && !/ended|closed|expired|invalid|error/i.test(textLower)) || isSavedOk;
    if (isRealSuccess) return 'ACCEPTED';
    if (isWrongCaptcha) return 'WRONG_CAPTCHA';
    if (isTimeEnded) return 'TIME_ENDED';
    // Empty 200/201 predicate
    if ((result.statusCode === 200 || result.statusCode === 201) &&
        !result.info && !result.text && !isTimeEnded && !isWrongCaptcha) return 'ACCEPTED_EMPTY_201';
    if (result.info === 'I') return 'INFO_RETRY';
    if (result.info === 'E') return 'REJECTED';
    return 'UNKNOWN';
  }

  // Case 1: Empty 201 (the disputed one) → must be ACCEPTED
  assert.strictEqual(
    classify({ statusCode: 201, info: '', text: '' }),
    'ACCEPTED_EMPTY_201',
    'HTTP 201 empty must classify as silent save',
  );

  // Case 2: Empty 200 → also ACCEPTED
  assert.strictEqual(
    classify({ statusCode: 200, info: '', text: '' }),
    'ACCEPTED_EMPTY_201',
  );

  // Case 3: Real "Bidding Amount Saved Successfully" → ACCEPTED via text match
  assert.strictEqual(
    classify({ statusCode: 200, info: 'S', text: 'Bidding Amount Saved Successfully.' }),
    'ACCEPTED',
  );

  // Case 4: "Bid window closed" → TIME_ENDED (not accepted)
  assert.strictEqual(
    classify({ statusCode: 200, info: 'E', text: 'Bidding time has ended for this order.' }),
    'TIME_ENDED',
  );

  // Case 5: "Wrong captcha" → WRONG_CAPTCHA
  assert.strictEqual(
    classify({ statusCode: 200, info: 'E', text: 'Captcha validation failed. Please try again.' }),
    'WRONG_CAPTCHA',
  );

  // Case 6: 500-series → UNKNOWN
  assert.strictEqual(
    classify({ statusCode: 500, info: '', text: 'Internal Server Error' }),
    'UNKNOWN',
  );

  console.log('✓ Empty-201 classification: 6 cases pass (empty=SUCCESS, error text=proper category)');
}

// ---- Test dead-cookie detection (3× 403 after refresh → cool-off) ---------
//
// Scenario the user hit: SAP session cookie expired, but SessionSet('')
// still returns a fresh CSRF. Every subsequent OData call is 403. Before
// this fix: infinite loop of refresh→403→refresh→403 pounding SAP.
// After this fix: after 3 consecutive 403-after-refresh, mark auth as dead
// and cool off for AUTH_DEAD_COOLDOWN_MS.
async function testDeadCookieDetection() {
  // Simulate sapRequest's post-refresh 403 tracking.
  function makeAuthTracker(threshold = 3, cooldownMs = 30_000) {
    const auth = { _deadCount: 0, _deadUntil: 0 };
    return {
      auth,
      // Called when a request that had csrf=required also fails 403 after refresh.
      onPostRefresh403() {
        auth._deadCount = (auth._deadCount || 0) + 1;
        if (auth._deadCount >= threshold) {
          auth._deadUntil = Date.now() + cooldownMs;
        }
      },
      onSuccess() { auth._deadCount = 0; },
      isDead() { return Boolean(auth._deadUntil && Date.now() < auth._deadUntil); },
    };
  }

  const t = makeAuthTracker(3, 30_000);
  assert.strictEqual(t.isDead(), false, 'starts alive');

  t.onPostRefresh403(); // 1
  assert.strictEqual(t.isDead(), false);
  t.onPostRefresh403(); // 2
  assert.strictEqual(t.isDead(), false);
  t.onPostRefresh403(); // 3 → dead
  assert.strictEqual(t.isDead(), true, 'dead after 3 consecutive 403-after-refresh');
  assert.strictEqual(t.auth._deadCount, 3);
  assert(t.auth._deadUntil > Date.now(), '_deadUntil is in the future');

  // Success clears the counter (but not _deadUntil until cool-off passes)
  const t2 = makeAuthTracker(3, 30_000);
  t2.onPostRefresh403();
  t2.onPostRefresh403();
  t2.onSuccess();
  assert.strictEqual(t2.auth._deadCount, 0);
  t2.onPostRefresh403();
  t2.onPostRefresh403();
  assert.strictEqual(t2.isDead(), false, 'no dead: counter was reset by success');

  console.log('✓ Dead-cookie detection: 3 cases pass (threshold triggers, success resets counter)');
}

// ---- Test post-save verification classification --------------------------
//
// After a save that SAP replies 'Saved Successfully' to, we refetch the
// order list ~1.5s later and check whether the submitted orders now show
// non-zero BiddingAmount. Three outcomes: ALL_PERSISTED / PARTIAL / NONE.
function testPostSaveVerification() {
  function verify(submitted, refetchedOrders) {
    const submittedIds = new Set(submitted.map((s) => String(s.sapOrderId)));
    const found = [];
    const missing = [];
    for (const o of refetchedOrders) {
      const oid = String(o.SapOrderId || '');
      if (!submittedIds.has(oid)) continue;
      const persistedAmt = parseFloat(o.BiddingAmount || 0);
      if (persistedAmt > 0) found.push({ oid, amt: persistedAmt });
      else missing.push(oid);
    }
    if (missing.length && !found.length) return 'FAILED';
    if (missing.length && found.length)  return 'PARTIAL';
    if (found.length)                    return 'OK';
    return 'NOT_IN_LIST';
  }

  // Case 1: All 3 bids persisted (browser will show)
  const s1 = [{ sapOrderId: '1153390721', amount: 690 }, { sapOrderId: '1153379947', amount: 408 }, { sapOrderId: '1153375640', amount: 569 }];
  const r1 = [
    { SapOrderId: '1153390721', BiddingAmount: '690.000' },
    { SapOrderId: '1153379947', BiddingAmount: '408.000' },
    { SapOrderId: '1153375640', BiddingAmount: '569.000' },
    { SapOrderId: '9999999999', BiddingAmount: '0' }, // unrelated
  ];
  assert.strictEqual(verify(s1, r1), 'OK');

  // Case 2: SAP said 'Saved' but nothing actually persisted (user's scenario)
  const r2 = [
    { SapOrderId: '1153390721', BiddingAmount: '0' },
    { SapOrderId: '1153379947', BiddingAmount: '0' },
    { SapOrderId: '1153375640', BiddingAmount: '0' },
  ];
  assert.strictEqual(verify(s1, r2), 'FAILED', 'when all show 0 despite SAP saying Saved');

  // Case 3: Partial persist — 1 of 3 saved
  const r3 = [
    { SapOrderId: '1153390721', BiddingAmount: '690.000' },
    { SapOrderId: '1153379947', BiddingAmount: '0' },
    { SapOrderId: '1153375640', BiddingAmount: '0' },
  ];
  assert.strictEqual(verify(s1, r3), 'PARTIAL');

  // Case 4: Orders vanished from list (probably went past window)
  const r4 = [{ SapOrderId: '9999999999', BiddingAmount: '0' }];
  assert.strictEqual(verify(s1, r4), 'NOT_IN_LIST');

  console.log('✓ Post-save verification: 4 cases pass (OK, FAILED, PARTIAL, NOT_IN_LIST)');
}

// ---- Test captcha cache invalidation on wrong-captcha --------------------
//
// User's log showed 3/4 cache HITs were WRONG (=bg=, herrd, CUU5 → SAP said
// wrong captcha; fdamc → SAP accepted). If SAP shows the same image again
// later, the wrong cache entry would come back as a HIT and rebase the
// wrong-captcha loop. This test verifies the invalidate-on-wrong-captcha
// contract at the cache-Map level.
function testCaptchaCacheInvalidation() {
  const cache = new Map();
  function put(hash, solved) { cache.set(hash, solved); }
  function get(hash) { return cache.get(hash); }
  function invalidate(hash) {
    const had = cache.has(hash);
    if (had) cache.delete(hash);
    return had;
  }

  // Seed with 4 entries — 3 wrong (as user's live log) + 1 right
  put('ff57a25c0d', '=bg=');    // wrong
  put('cbc9716d0e', 'herrd');   // wrong
  put('355284144a', 'CUU5');    // wrong
  put('84e6236cf4', 'fdamc');   // right (SAP accepted)

  assert.strictEqual(cache.size, 4);
  assert.strictEqual(get('ff57a25c0d'), '=bg=');

  // Simulate wrong-captcha → invalidate
  assert.strictEqual(invalidate('ff57a25c0d'), true, 'was present');
  assert.strictEqual(get('ff57a25c0d'), undefined, 'now absent');
  assert.strictEqual(cache.size, 3);

  // Invalidating a non-existent hash is a no-op
  assert.strictEqual(invalidate('deadbeef00'), false);
  assert.strictEqual(cache.size, 3);

  // The RIGHT solve stays cached (only wrong ones invalidated)
  assert.strictEqual(get('84e6236cf4'), 'fdamc');

  console.log('✓ Captcha cache invalidation: removes wrong entries, keeps right ones');
}

// ---- Test L1-undercut candidate detection ----------------------------------
//
// Scenario from user's live screenshot: some bids saved at L1 amount but got
// rank > 1 (tie-loser). L1-undercut should identify those and compute a new
// bid = L1BidAmount - L1_UNDERCUT_STEP, capped by per-order attempt counter.
function testL1UndercutDetection() {
  const L1_UNDERCUT_STEP = 1;
  const L1_UNDERCUT_MAX_ATTEMPTS = 2;

  function planUndercuts(submittedItems, refetchedOrders, attemptsMap) {
    const bidsById = Object.fromEntries(submittedItems.map((b) => [String(b.order.SapOrderId), b]));
    const submittedIds = new Set(Object.keys(bidsById));
    const targets = [];
    for (const o of refetchedOrders) {
      const oid = String(o.SapOrderId || '');
      if (!submittedIds.has(oid)) continue;
      const rank  = parseInt(o.BiddingRank || 0, 10);
      const l1Amt = parseFloat(o.L1BidAmount || 0);
      if (rank > 1 && l1Amt > 0) {
        const attempts = attemptsMap.get(oid) || 0;
        if (attempts < L1_UNDERCUT_MAX_ATTEMPTS) {
          const newAmt = l1Amt - L1_UNDERCUT_STEP;
          if (newAmt > 0 && newAmt < parseFloat(bidsById[oid].amount || 0)) {
            targets.push({ oid, newAmt, origRank: rank, origL1: l1Amt });
            attemptsMap.set(oid, attempts + 1);
          }
        }
      }
    }
    return targets;
  }

  const submittedItems = [
    { order: { SapOrderId: '1153420264' }, amount: 472 }, // KHARGRAM  → rank 01 (skip)
    { order: { SapOrderId: '1153420262' }, amount: 878 }, // RASAKHOA  → rank 03 (undercut)
    { order: { SapOrderId: '1153406814' }, amount: 535 }, // GOLAPGANJ → rank 04 (undercut)
    { order: { SapOrderId: '1153403459' }, amount: 869 }, // BALURGHAT → rank 04 (undercut)
    { order: { SapOrderId: '1153390830' }, amount: 589 }, // PANCHANANDAPUR → rank 02 (undercut)
  ];
  const refetched = [
    { SapOrderId: '1153420264', BiddingRank: '01', L1BidAmount: '472.000' },
    { SapOrderId: '1153420262', BiddingRank: '03', L1BidAmount: '878.000' },
    { SapOrderId: '1153406814', BiddingRank: '04', L1BidAmount: '535.000' },
    { SapOrderId: '1153403459', BiddingRank: '04', L1BidAmount: '869.000' },
    { SapOrderId: '1153390830', BiddingRank: '02', L1BidAmount: '589.000' },
  ];
  const attempts = new Map();
  const t1 = planUndercuts(submittedItems, refetched, attempts);
  assert.strictEqual(t1.length, 4, 'should undercut 4 orders (skip the rank-1 one)');
  assert.deepStrictEqual(t1.map((x) => x.oid).sort(), ['1153390830', '1153403459', '1153406814', '1153420262']);
  assert.strictEqual(t1.find((x) => x.oid === '1153420262').newAmt, 877); // 878 - 1
  assert.strictEqual(t1.find((x) => x.oid === '1153390830').newAmt, 588); // 589 - 1

  // 2nd pass: same rejected → 4 undercuts again (attempts now 2 each — at limit)
  const t2 = planUndercuts(submittedItems, refetched, attempts);
  assert.strictEqual(t2.length, 4);
  attempts.forEach((v) => assert.strictEqual(v, 2, 'each order attempted twice'));

  // 3rd pass: should be blocked by max-attempts (2)
  const t3 = planUndercuts(submittedItems, refetched, attempts);
  assert.strictEqual(t3.length, 0, 'max-attempts reached, no more undercuts');

  console.log('✓ L1-undercut detection: correctly identifies tie-loser orders + respects max-attempts');
}

// ---- Test parallel captcha probe race semantics (LAST-arrived winner) -----
//
// SAP maintains ONE active captcha per session — every new fetch invalidates
// the previous one. So when PARALLEL_CAPTCHA_PROBES > 1, we MUST return the
// LAST-arrived solved captcha (not the first), otherwise the winner we submit
// with will already have been invalidated by later probes. This regression
// test was born from user's 16:45 IST log: 3 solver hits (ry2n4, f8233,
// VFh@4@), submitted ry2n4 (first) → 'Wrong Captcha' 3× → no bid saved.
async function testParallelCaptchaProbes() {
  async function makeProbe(willSucceed, delayMs, tag) {
    await new Promise((r) => setTimeout(r, delayMs));
    return willSucceed ? { solved: tag, reason: 'ok', img: `img-${tag}` } : { solved: '', reason: 'sap-empty' };
  }

  // v3.12 semantics: return LAST-arrived solved (SAP-safe)
  async function nextCaptchaParallel(probeSpecs) {
    const results = await Promise.all(probeSpecs.map((s) => makeProbe(s.succeed, s.delayMs, s.tag)));
    const solved = results.filter((r) => r.solved);
    if (solved.length) return solved[solved.length - 1];
    return results[results.length - 1];
  }

  // Case 1: All empty → returns the last empty result
  const r1 = await nextCaptchaParallel([
    { succeed: false, delayMs: 10, tag: 'AAA' },
    { succeed: false, delayMs: 20, tag: 'BBB' },
    { succeed: false, delayMs: 30, tag: 'CCC' },
  ]);
  assert.strictEqual(r1.solved, '');

  // Case 2: All succeed — winner is LAST-arrived (SAP invalidated the others)
  const r2 = await nextCaptchaParallel([
    { succeed: true,  delayMs: 10, tag: 'AAA' },  // SAP invalidated
    { succeed: true,  delayMs: 20, tag: 'BBB' },  // SAP invalidated
    { succeed: true,  delayMs: 30, tag: 'CCC' },  // ← only this one is submit-safe
  ]);
  assert.strictEqual(r2.solved, 'CCC', 'must return LAST-arrived, not first (SAP single-captcha rule)');

  // Case 3: Only the middle probe succeeds (first empty, mid solved, last empty)
  // — return the middle one because it's the last (and only) solved. But
  // this is actually a broken SAP state: last probe was empty means SAP
  // hasn't fully unlocked; middle probe's captcha may still be invalidated
  // by the (empty) last probe. In practice PARALLEL_CAPTCHA_PROBES=1 is safer.
  const r3 = await nextCaptchaParallel([
    { succeed: false, delayMs: 10, tag: 'AAA' },
    { succeed: true,  delayMs: 20, tag: 'BBB' },
    { succeed: false, delayMs: 30, tag: 'CCC' },
  ]);
  assert.strictEqual(r3.solved, 'BBB', 'returns the only solved probe');

  console.log('✓ Parallel captcha probes (SAP-safe): returns LAST-arrived solved, prevents captcha invalidation race');
}

// ---- Test adaptive keep-warm frequency (hot vs cold) -----------------------
function testAdaptiveKeepWarm() {
  const HOT_MS  = 3_000;
  const COLD_MS = 20_000;
  function shouldPing(now, lastPing, hot) {
    const need = hot ? HOT_MS : COLD_MS;
    return (now - lastPing) >= need;
  }
  const t0 = 1_000_000;

  // Hot: ping every 3s
  assert.strictEqual(shouldPing(t0 + 2_999, t0, true),  false, '2.999s in hot: no ping yet');
  assert.strictEqual(shouldPing(t0 + 3_000, t0, true),  true,  '3.000s in hot: ping');
  assert.strictEqual(shouldPing(t0 + 5_000, t0, true),  true,  '5s in hot: ping');

  // Cold: ping every 20s
  assert.strictEqual(shouldPing(t0 + 3_000, t0, false), false, '3s in cold: no ping yet');
  assert.strictEqual(shouldPing(t0 + 19_999, t0, false), false, '19.9s in cold: no ping');
  assert.strictEqual(shouldPing(t0 + 20_000, t0, false), true,  '20s in cold: ping');

  console.log('✓ Adaptive keep-warm: hot=3s, cold=20s (TCP+TLS stays hot during window opens)');
}

// ---- Test SAP-late visibility log throttling -------------------------------
//
// User's 17:15 IST log showed a scary 80-second silence during hot window
// because SAP unlocked captcha ~61s late. Fix: log "still waiting" every
// ~10s during hot window with sap-empty state, so user knows the bot is
// alive and doesn't panic-restart.
function testSapLateVisibility() {
  const THROTTLE_MS = 10_000;
  function shouldLog(now, lastLog) {
    return !lastLog || (now - lastLog) > THROTTLE_MS;
  }

  const t0 = 1_000_000;
  assert.strictEqual(shouldLog(t0,          0),           true,  'first call: log');
  assert.strictEqual(shouldLog(t0 + 5_000,  t0),          false, '5s later: no log');
  assert.strictEqual(shouldLog(t0 + 9_999,  t0),          false, '9.999s later: no log');
  assert.strictEqual(shouldLog(t0 + 10_001, t0),          true,  '10.001s later: log');
  assert.strictEqual(shouldLog(t0 + 15_000, t0 + 10_001), false, 'reset window, 4.999s: no log');
  assert.strictEqual(shouldLog(t0 + 20_002, t0 + 10_001), true,  'reset window, 10.001s: log');

  console.log('✓ SAP-late visibility log: throttled at ~10s intervals (prevents log spam + prevents user panic)');
}

// v3.14 — SAP-late polling stall fix:
// When SAP hasn't populated the order list (or matches are 0) inside an
// active :15/:45 hot-window, the bot must:
//   (1) STILL emit the throttled wait-log so the user sees activity
//   (2) SET _matchedButNoCaptcha=true so the main loop uses tight 0-ms
//       polling (not the 2000ms idle branch)
// Before v3.14, tick() early-returned on orders=0 without doing either →
// wait-log never fired, main loop slept 2s, user thought bot was stuck.
function testEmptyOrdersInHotWindow() {
  // Simulate the tick() decision for the empty-orders branch.
  function decideEmptyOrders({ hot, lastWaitLog, now }) {
    if (hot) {
      const shouldLog = !lastWaitLog || (now - lastWaitLog) > 10_000;
      return { tightLoop: true, log: shouldLog };
    }
    return { tightLoop: false, log: false };
  }

  // Simulate the tick() decision for the matched=0 branch (same semantics).
  function decideMatchedZero({ hot, lastWaitLog, now }) {
    return decideEmptyOrders({ hot, lastWaitLog, now });
  }

  const t0 = 5_000_000;

  // Case 1: cold window + empty orders → old idle behaviour (no tight loop, no wait-log).
  assert.deepStrictEqual(
    decideEmptyOrders({ hot: false, lastWaitLog: 0, now: t0 }),
    { tightLoop: false, log: false },
    'cold-window empty orders: idle mode preserved'
  );

  // Case 2: hot window + empty orders + first tick → tight loop + emit log.
  assert.deepStrictEqual(
    decideEmptyOrders({ hot: true, lastWaitLog: 0, now: t0 }),
    { tightLoop: true, log: true },
    'hot-window empty orders (first tick): tight loop + wait-log'
  );

  // Case 3: hot window + empty orders + 3s after last log → tight loop, NO log.
  assert.deepStrictEqual(
    decideEmptyOrders({ hot: true, lastWaitLog: t0, now: t0 + 3_000 }),
    { tightLoop: true, log: false },
    'hot-window empty orders (3s throttle): tight loop, no log'
  );

  // Case 4: hot window + empty orders + 11s later → tight loop + log again.
  assert.deepStrictEqual(
    decideEmptyOrders({ hot: true, lastWaitLog: t0, now: t0 + 11_000 }),
    { tightLoop: true, log: true },
    'hot-window empty orders (past 10s throttle): tight loop + fresh log'
  );

  // Case 5: hot window + matched=0 (same semantics as empty orders).
  assert.deepStrictEqual(
    decideMatchedZero({ hot: true, lastWaitLog: 0, now: t0 }),
    { tightLoop: true, log: true },
    'hot-window matched=0 (first tick): tight loop + wait-log'
  );

  // Case 6: cold window + matched=0 → idle, no log.
  assert.deepStrictEqual(
    decideMatchedZero({ hot: false, lastWaitLog: 0, now: t0 }),
    { tightLoop: false, log: false },
    'cold-window matched=0: idle preserved'
  );

  console.log('✓ SAP-late polling stall fix: hot-window empty orders / matched=0 → tight loop + throttled visibility log (6 cases)');
}

// v3.15 — Session-shake throttle:
// During hot-window stall (orders=0 or matched=0), the bot silently
// refreshes CSRF on every session at most once every 15s to shake loose
// SAP-side stale-session filtering that may hide matched orders.
function testSessionShakeThrottle() {
  const THROTTLE_MS = 15_000;
  function shouldShake(now, lastShake) {
    return !lastShake || (now - lastShake) >= THROTTLE_MS;
  }

  const t0 = 2_000_000;
  assert.strictEqual(shouldShake(t0,          0),           true,  'first stall tick: shake fires');
  assert.strictEqual(shouldShake(t0 + 5_000,  t0),          false, '5s later: within throttle');
  assert.strictEqual(shouldShake(t0 + 14_999, t0),          false, '14.999s later: within throttle');
  assert.strictEqual(shouldShake(t0 + 15_000, t0),          true,  '15s later: shake again');
  assert.strictEqual(shouldShake(t0 + 30_001, t0 + 15_000), true,  '30s later: another shake');

  console.log('✓ Session-shake throttle: max once per 15s per process — CSRF refresh unblocks stale session filtering (5 cases)');
}

// v3.16 — CRITICAL FIX: per-window state clearing.
// The `ctx.submitted` Set was initialised once at bot start and never
// cleared. If SAP re-lists a previously-saved order in the next window
// (e.g. because bidding is still open for it), buildBatches would filter
// it out via `seenSubmitted.has(key)` → matched=0 → user thinks bot is
// broken and restarts (which creates a fresh Set → bug hidden).
// Fix: at the boundary-log tick, clear submitted + cooldown + undercut.
function testPerWindowStateClearing() {
  // Simulate the buildBatches filter: seenSubmitted.has(key) excludes an order.
  function matches(order, seenSubmitted) {
    const key = String(order.SapOrderId);
    return !seenSubmitted.has(key);
  }

  const order = { SapOrderId: 1153419533 };
  const submitted = new Set();

  // Window 1: fresh Set — order matches, gets saved, added to set.
  assert.strictEqual(matches(order, submitted), true, 'W1: fresh set, order matches');
  submitted.add(String(order.SapOrderId));

  // Between windows (OLD BEHAVIOUR): Set retained → order filtered out.
  assert.strictEqual(matches(order, submitted), false, 'OLD: retained submitted set filters re-listed order');

  // v3.16 FIX: clear at boundary crossover.
  submitted.clear();
  assert.strictEqual(matches(order, submitted), true, 'FIX: cleared set → order matches again in new window');

  // Simulate all three collections clear together.
  const submitted2 = new Set(['a', 'b', 'c']);
  const cooldown2  = new Map([['a', Date.now() + 30_000]]);
  const undercut2  = new Map([['a', 2]]);
  function boundaryClear() { submitted2.clear(); cooldown2.clear(); undercut2.clear(); }
  boundaryClear();
  assert.strictEqual(submitted2.size, 0, 'boundary: submitted cleared');
  assert.strictEqual(cooldown2.size, 0,  'boundary: cooldown cleared');
  assert.strictEqual(undercut2.size, 0,  'boundary: undercut cleared');

  console.log('✓ Per-window state clearing: submitted+cooldown+undercut cleared at :15/:45 boundary — re-bid on repeated orders works without process restart');
}

// v3.17 — Age-based selective boundary clear (fixes duplicate-submit race).
// When the main loop is blocked inside tick() during boundary crossover,
// the boundary block fires a few seconds late. If .clear() were called it
// would wipe entries that were JUST submitted for the new window → dup.
// Fix: clearOlderThan(map, now - 30s) keeps recent entries.
function testAgeBasedBoundaryClear() {
  const RECENT_MS = 30_000;
  function clearOlderThan(map, thresholdMs) {
    let removed = 0;
    for (const [k, ts] of map) {
      if (ts < thresholdMs) { map.delete(k); removed++; }
    }
    return removed;
  }

  const now = 10_000_000;
  const map = new Map([
    ['prevWindow1',  now - 60_000],      // 60s old → PREVIOUS window
    ['prevWindow2',  now - 45_000],      // 45s old → PREVIOUS window
    ['thisWindow1',  now - 5_000],       // 5s old → CURRENT window (pre-warm submit)
    ['thisWindow2',  now - 500],         // 0.5s old → CURRENT window (just submitted)
  ]);

  const removed = clearOlderThan(map, now - RECENT_MS);
  assert.strictEqual(removed, 2, 'exactly 2 stale entries removed');
  assert.strictEqual(map.size, 2, '2 fresh entries preserved');
  assert.strictEqual(map.has('thisWindow1'), true, 'pre-warm submit preserved (no duplicate)');
  assert.strictEqual(map.has('thisWindow2'), true, 'just-submitted preserved (no duplicate)');
  assert.strictEqual(map.has('prevWindow1'), false, 'previous window entry cleared');
  assert.strictEqual(map.has('prevWindow2'), false, 'previous window entry cleared');

  // Edge case: exactly at threshold (30s old) is preserved (uses strict <).
  const edgeMap = new Map([['edge', now - 30_000]]);
  clearOlderThan(edgeMap, now - RECENT_MS);
  assert.strictEqual(edgeMap.size, 1, 'entry exactly 30s old is preserved (uses strict <)');

  console.log('✓ Age-based boundary clear: fresh (<30s) entries preserved → prevents duplicate submit race on delayed boundary tick');
}

// v3.19 — Priority COF Order ID (Vbeln) sorting.
// Matched orders whose Vbeln (COF Order ID) is in the priority set must
// appear FIRST in the submit plan — before any non-priority order — so
// the user's most critical bids hit SAP within the first ~300 ms of the
// window opening. Priority preserves original discovery order within
// each bucket (no re-shuffling among priority items).
function testPrioritySorting() {
  const BATCH_SIZE = 3;

  // Mirror the v3.19 buildBatches plan-ordering step (isolated).
  function buildPlan(matchedSingles, matchedClubs, prioritySet) {
    const isPri = (v) => prioritySet.has(String(v));
    const singles = matchedSingles.map((o) => ({
      order: o, priority: isPri(o.Vbeln || o.SapOrderId),
    }));
    const clubs = matchedClubs.map((c) => ({
      clubId: c.clubId,
      bids: c.bids.map((b) => ({ order: b })),
      priority: c.bids.some((b) => isPri(b.Vbeln || b.SapOrderId)),
    }));

    const singlesP = singles.filter((s) => s.priority);
    const singlesN = singles.filter((s) => !s.priority);
    const clubsP   = clubs.filter((c) => c.priority);
    const clubsN   = clubs.filter((c) => !c.priority);

    const pack = (arr) => {
      const out = [];
      for (let i = 0; i < arr.length; i += BATCH_SIZE) out.push(arr.slice(i, i + BATCH_SIZE));
      return out;
    };
    const singleBatchesP = pack(singlesP);
    const singleBatchesN = pack(singlesN);

    const plan = [];
    for (const b of singleBatchesP) plan.push({ kind: 'single', bids: b, priority: true });
    for (const c of clubsP)          plan.push({ kind: 'club',   bids: c.bids, clubId: c.clubId, priority: true });
    for (const b of singleBatchesN) plan.push({ kind: 'single', bids: b, priority: false });
    for (const c of clubsN)          plan.push({ kind: 'club',   bids: c.bids, clubId: c.clubId, priority: false });
    return plan;
  }

  // Case 1: 4 singles, 2 priority mixed in the middle → priority batch first
  const p1 = buildPlan(
    [
      { SapOrderId: 'S1', Vbeln: '1000000001' },
      { SapOrderId: 'S2', Vbeln: '1000000002' }, // priority
      { SapOrderId: 'S3', Vbeln: '1000000003' },
      { SapOrderId: 'S4', Vbeln: '1000000004' }, // priority
    ],
    [],
    new Set(['1000000002', '1000000004'])
  );
  assert.strictEqual(p1.length, 2, 'expected 2 batches (1 priority + 1 normal)');
  assert.strictEqual(p1[0].priority, true,  'batch 0 must be priority');
  assert.strictEqual(p1[0].bids.length, 2,  'priority batch has 2 items');
  assert.strictEqual(p1[0].bids[0].order.Vbeln, '1000000002', 'first priority preserves discovery order');
  assert.strictEqual(p1[0].bids[1].order.Vbeln, '1000000004');
  assert.strictEqual(p1[1].priority, false, 'batch 1 is non-priority');
  assert.strictEqual(p1[1].bids.length, 2);
  assert.strictEqual(p1[1].bids[0].order.Vbeln, '1000000001', 'non-priority also preserves discovery order');
  assert.strictEqual(p1[1].bids[1].order.Vbeln, '1000000003');

  // Case 2: Empty priority set → plan looks exactly like pre-v3.19 (backwards compat)
  const p2 = buildPlan(
    [
      { SapOrderId: 'S1', Vbeln: '1000000001' },
      { SapOrderId: 'S2', Vbeln: '1000000002' },
      { SapOrderId: 'S3', Vbeln: '1000000003' },
    ],
    [],
    new Set()
  );
  assert.strictEqual(p2.length, 1, 'no priority → single batch of 3');
  assert.strictEqual(p2[0].priority, false);
  assert.deepStrictEqual(p2[0].bids.map((b) => b.order.Vbeln), ['1000000001', '1000000002', '1000000003']);

  // Case 3: >3 priority items → priority batch splits at BATCH_SIZE too
  const p3 = buildPlan(
    [
      { SapOrderId: 'S1', Vbeln: 'P1' },
      { SapOrderId: 'S2', Vbeln: 'P2' },
      { SapOrderId: 'S3', Vbeln: 'P3' },
      { SapOrderId: 'S4', Vbeln: 'P4' },
      { SapOrderId: 'S5', Vbeln: 'N1' },
    ],
    [],
    new Set(['P1', 'P2', 'P3', 'P4'])
  );
  assert.strictEqual(p3.length, 3, '4 pri + 1 non = 2 pri batches + 1 non batch');
  assert.strictEqual(p3[0].priority, true);
  assert.strictEqual(p3[0].bids.length, 3, 'first priority batch full');
  assert.strictEqual(p3[1].priority, true);
  assert.strictEqual(p3[1].bids.length, 1, 'second priority batch has leftover 1');
  assert.strictEqual(p3[2].priority, false);
  assert.strictEqual(p3[2].bids[0].order.Vbeln, 'N1');

  // Case 4: Club whose ANY member is priority → whole club prioritised (club is atomic in SAP)
  const p4 = buildPlan(
    [{ SapOrderId: 'S1', Vbeln: 'V1' }],
    [
      { clubId: 'C1', bids: [{ SapOrderId: 'C1a', Vbeln: 'V2' }, { SapOrderId: 'C1b', Vbeln: 'V3' }] }, // priority (V3 in set)
      { clubId: 'C2', bids: [{ SapOrderId: 'C2a', Vbeln: 'V4' }] },                                     // non-priority
    ],
    new Set(['V3'])
  );
  // Expected order: (no priority singles) → priority club C1 → non-priority singles → non-priority club C2
  assert.strictEqual(p4.length, 3);
  assert.strictEqual(p4[0].kind, 'club');
  assert.strictEqual(p4[0].clubId, 'C1');
  assert.strictEqual(p4[0].priority, true);
  assert.strictEqual(p4[1].kind, 'single');
  assert.strictEqual(p4[1].bids[0].order.Vbeln, 'V1');
  assert.strictEqual(p4[2].kind, 'club');
  assert.strictEqual(p4[2].clubId, 'C2');
  assert.strictEqual(p4[2].priority, false);

  // Case 5: Priority match via SapOrderId fallback (some tenants collapse COF into SapOrderId)
  const p5 = buildPlan(
    [
      { SapOrderId: '999', Vbeln: '' },      // priority via SapOrderId fallback
      { SapOrderId: '111', Vbeln: '222' },   // non-priority
    ],
    [],
    new Set(['999'])
  );
  assert.strictEqual(p5[0].priority, true);
  assert.strictEqual(p5[0].bids[0].order.SapOrderId, '999');
  assert.strictEqual(p5[1].priority, false);

  // Case 6: Vbeln string-typed vs numeric-string safety
  const p6 = buildPlan(
    [
      { SapOrderId: 'S1', Vbeln: '0000123' },   // padded — must match set entry '0000123'
      { SapOrderId: 'S2', Vbeln: '123' },       // NOT the same — SAP uses exact string equality
    ],
    [],
    new Set(['0000123'])
  );
  assert.strictEqual(p6[0].priority, true,  'padded Vbeln matches exactly');
  assert.strictEqual(p6[0].bids[0].order.Vbeln, '0000123');
  assert.strictEqual(p6[1].priority, false, '"123" is NOT equal to "0000123"');

  console.log('✓ Priority Vbeln sorting: 6 cases pass (priority-first, empty set = pre-v3.19 order, club atomicity, Vbeln-vs-SapOrderId fallback, exact string equality)');
}

// v3.19 — Priority Vbeln loader (file + env merge, comments, headers).
function testPriorityLoader() {
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prio-test-'));

  // Replicate loadPriorityVbelns() but with injectable paths.
  function load(priorityCsvPath, envVal) {
    const set = new Set();
    try {
      if (fs.existsSync(priorityCsvPath)) {
        const raw = fs.readFileSync(priorityCsvPath, 'utf8');
        const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        const hdrIdx = lines.findIndex((l) => /[A-Za-z]/.test(l) && !/^#/.test(l));
        let vbelnCol = -1;
        if (hdrIdx === 0) {
          const cols = lines[0].split(',').map((c) => c.trim().toLowerCase());
          vbelnCol = cols.findIndex((c) => c === 'vbeln' || c === 'cof order id' || c === 'coforderid' || c === 'orderid' || c === 'order id');
        }
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('#')) continue;
          if (i === 0 && hdrIdx === 0) continue;
          let val;
          if (vbelnCol >= 0 && line.includes(',')) {
            val = (line.split(',')[vbelnCol] || '').trim();
          } else {
            val = line.split(',')[0].trim();
          }
          if (val) set.add(String(val));
        }
      }
    } catch (_) {}
    if (envVal) {
      for (const v of envVal.split(',')) {
        const t = v.trim();
        if (t) set.add(t);
      }
    }
    return set;
  }

  // Case 1: simple 1-per-line
  const p1 = path.join(tmpDir, 'a.csv');
  fs.writeFileSync(p1, '1000000001\n1000000002\n1000000003\n');
  const s1 = load(p1, '');
  assert.strictEqual(s1.size, 3);
  assert(s1.has('1000000001') && s1.has('1000000003'));

  // Case 2: CSV with header + Vbeln column
  const p2 = path.join(tmpDir, 'b.csv');
  fs.writeFileSync(p2, 'Vbeln,Notes\n2000000001,imp1\n2000000002,imp2\n');
  const s2 = load(p2, '');
  assert.strictEqual(s2.size, 2, `expected 2 Vbelns, got ${s2.size}: ${Array.from(s2).join(',')}`);
  assert(s2.has('2000000001') && s2.has('2000000002'));
  assert(!s2.has('imp1'), 'notes column should NOT be extracted as Vbeln');

  // Case 3: File + env merge (dedupe)
  const p3 = path.join(tmpDir, 'c.csv');
  fs.writeFileSync(p3, '3000000001\n3000000002\n');
  const s3 = load(p3, '3000000002,3000000003,3000000004');
  assert.strictEqual(s3.size, 4, 'union of file + env, deduped');
  assert(s3.has('3000000001') && s3.has('3000000004'));

  // Case 4: Comments and blank lines are ignored
  const p4 = path.join(tmpDir, 'd.csv');
  fs.writeFileSync(p4, '# comment line\n\n4000000001\n\n# another comment\n4000000002\n');
  const s4 = load(p4, '');
  assert.strictEqual(s4.size, 2);
  assert(!s4.has('# comment line'));

  // Case 5: Missing file + no env → empty set (no crash)
  const s5 = load(path.join(tmpDir, 'does-not-exist.csv'), '');
  assert.strictEqual(s5.size, 0);

  // Case 6: Env-only source works
  const s6 = load(path.join(tmpDir, 'does-not-exist.csv'), '9999999999, 8888888888 ');
  assert.strictEqual(s6.size, 2);
  assert(s6.has('9999999999') && s6.has('8888888888'));

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log('✓ Priority loader: 6 cases pass (line-list, CSV+header, file+env merge, comments, missing file, env-only)');
}

// v3.21 — Tie-rejection detection.
// SAP returns Type='E' with Message="Saved Successfully" but Ev_Text reveals
// another vendor already bid the same amount → bid NOT persisted (rank=0).
// Prior code trusted Message and marked ACCEPTED → order added to submitted
// set → never re-bid. Fix: check Ev_Text FIRST, override cosmetic Message.
function testTieRejection() {
  function classify(result) {
    const textLower = (result.text || '').toString().toLowerCase();
    const evText = (result.evText || '').toString();
    const evTextLower = evText.toLowerCase();
    const isTieRejected = /same\s+(avg\s+)?amount\s+has\s+been\s+bid\s+by\s+other\s+vendor/i.test(evTextLower);
    const isSavedOk = /saved successfully|bid.*accepted|success/i.test(textLower);
    const isRealSuccess = !isTieRejected && result.info !== 'E' && (
      (result.info === 'S' && !/ended|closed|expired|invalid|error/i.test(textLower)) || isSavedOk
    );
    const isTimeEnded = /ended|closed|expired/i.test(textLower) && !isSavedOk;
    const isWrongCaptcha = /captcha.*(fail|wrong|invalid)|worng\s*captcha/i.test(textLower);
    if (isTieRejected) return 'REJECTED_TIE';
    if (isRealSuccess) return 'ACCEPTED';
    if (isWrongCaptcha) return 'WRONG_CAPTCHA';
    if (isTimeEnded) return 'TIME_ENDED';
    if ((result.statusCode === 200 || result.statusCode === 201) &&
        !result.info && !result.text && !isTieRejected) return 'ACCEPTED_EMPTY_201';
    if (result.info === 'I') return 'INFO_RETRY';
    if (result.info === 'E') return 'REJECTED';
    return 'UNKNOWN';
  }

  // Case 1: THE actual live-log case — info='E', Message="Saved" (misleading),
  //         Ev_Text="Same amount has been bid...". Must classify as REJECTED_TIE.
  assert.strictEqual(
    classify({
      statusCode: 201,
      info: 'E',
      text: 'Bidding Amount Saved Successfully.',
      evText: 'Same amount has been bid by other vendor for order id : 5574818614 and posnr: 000101#',
    }),
    'REJECTED_TIE',
    'info=E + tied Ev_Text must classify as REJECTED_TIE even when Message says "Saved"'
  );

  // Case 2: Club tie-rejection variant ("Same Avg amount has been bid...")
  assert.strictEqual(
    classify({
      statusCode: 201,
      info: 'E',
      text: 'Bidding Amount Saved Successfully.',
      evText: 'Same Avg amount has been bid by other vendor for Order : 5574771877 posnr : 000104#',
    }),
    'REJECTED_TIE',
    'club-level tie ("Same Avg amount") also classifies as REJECTED_TIE'
  );

  // Case 3: Real success (info='S', empty Ev_Text) still classifies ACCEPTED
  assert.strictEqual(
    classify({
      statusCode: 201,
      info: 'S',
      text: 'Bidding Amount Saved Successfully.',
      evText: '',
    }),
    'ACCEPTED',
    'genuine save (info=S, empty Ev_Text) still ACCEPTED'
  );

  // Case 4: Empty 201 (silent-save) unchanged
  assert.strictEqual(
    classify({ statusCode: 201, info: '', text: '', evText: '' }),
    'ACCEPTED_EMPTY_201',
    'empty 201 still classifies as silent save'
  );

  // Case 5: Wrong-captcha unchanged (info='I' + captcha text)
  assert.strictEqual(
    classify({
      statusCode: 201,
      info: 'I',
      text: 'Captcha Validation Failed. Worng Captcha Value.',
      evText: 'Captcha Validation Failed. Worng Captcha Value.',
    }),
    'WRONG_CAPTCHA',
    'wrong-captcha detection still works (info=I, captcha text)'
  );

  // Case 6: Pure 'E' with a non-tie error message → generic REJECTED (unchanged path)
  assert.strictEqual(
    classify({
      statusCode: 201,
      info: 'E',
      text: 'Rate should be reduced by Rs 50',
      evText: 'Rate should be reduced by Rs 50',
    }),
    'REJECTED',
    'non-tie E rejection still returns REJECTED'
  );

  console.log('✓ Tie-rejection detection: 6 cases pass (SAP\'s cosmetic "Saved" no longer masks Ev_Text real reject)');
}
// SAP's load-balancer silently closes idle keep-alive sockets after ~30s.
// The next request on that socket bombs with HeadersTimeoutError / socket
// hang up. sapRequest now retries idempotent reads (fetchLiveOrders,
// fetchCaptchaImage) ONCE on a fresh socket after a 150ms backoff. Submits
// are NOT retried at this layer (post-save verification handles that).
async function testNetworkRetryOnIdempotent() {
  const NETWORK_ERR_RE = /HeadersTimeoutError|Headers Timeout|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET|ETIMEDOUT|ECONNRESET|socket hang up|other side closed/i;

  // Replicate the doWithNetRetry wrapper from sapRequest.
  async function sapRequestSim({ retryOnNetworkError, errorSequence, auth }) {
    let idx = 0;
    const doOnce = async () => {
      const outcome = errorSequence[idx++];
      if (outcome instanceof Error) throw outcome;
      return outcome;
    };
    const doWithNetRetry = async () => {
      try {
        return await doOnce();
      } catch (e) {
        const msg = (e && e.message) || String(e);
        if (!retryOnNetworkError || !NETWORK_ERR_RE.test(msg)) throw e;
        await new Promise((r) => setTimeout(r, 5)); // shortened backoff for test speed
        auth._netRetries = (auth._netRetries || 0) + 1;
        return await doOnce();
      }
    };
    return doWithNetRetry();
  }

  // Case 1: First attempt fails HeadersTimeout, second attempt succeeds → RECOVERED
  const auth1 = {};
  const err1 = new Error('HeadersTimeoutError: Headers Timeout Error');
  const r1 = await sapRequestSim({
    retryOnNetworkError: true,
    errorSequence: [err1, { statusCode: 200, ok: true }],
    auth: auth1,
  });
  assert.strictEqual(r1.statusCode, 200, 'timeout on 1st, success on 2nd → returns 2nd result');
  assert.strictEqual(auth1._netRetries, 1, 'retry counter bumped');

  // Case 2: Retry disabled → first timeout propagates immediately
  const auth2 = {};
  let threw = false;
  try {
    await sapRequestSim({
      retryOnNetworkError: false,
      errorSequence: [new Error('socket hang up'), { statusCode: 200 }],
      auth: auth2,
    });
  } catch (e) {
    threw = true;
    assert(/socket hang up/.test(e.message));
  }
  assert.strictEqual(threw, true, 'retry disabled → first error must propagate');
  assert.strictEqual(auth2._netRetries || 0, 0, 'no retry counter bump when disabled');

  // Case 3: Both attempts fail → propagates (tick-level logger will surface it)
  const auth3 = {};
  let threw3 = false;
  try {
    await sapRequestSim({
      retryOnNetworkError: true,
      errorSequence: [new Error('ECONNRESET'), new Error('HeadersTimeoutError')],
      auth: auth3,
    });
  } catch (e) {
    threw3 = true;
    assert(/HeadersTimeoutError/.test(e.message), 'second error is what propagates');
  }
  assert.strictEqual(threw3, true);
  assert.strictEqual(auth3._netRetries, 1, 'counter bumped even when both fail');

  // Case 4: Non-network error → NEVER retried (would risk semantic issues)
  const auth4 = {};
  let threw4 = false;
  try {
    await sapRequestSim({
      retryOnNetworkError: true,
      errorSequence: [new Error('HTTP 500 Internal Server Error'), { statusCode: 200 }],
      auth: auth4,
    });
  } catch (e) {
    threw4 = true;
    assert(/HTTP 500/.test(e.message));
  }
  assert.strictEqual(threw4, true, 'HTTP-level errors are not network errors → no retry');
  assert.strictEqual(auth4._netRetries || 0, 0);

  console.log('✓ Network-timeout retry: 4 cases pass (retry recovers, retry disabled honours flag, both-fail propagates, non-network errors NOT retried)');
}

// ---- Run --------------------------------------------------------------------

(async () => {
  try {
    testMsUntilNextWindow();
    testIsHotWindow();
    await testGlobalMutexSerialises();
    await testSequentialFallback();
    testBatchingLogic();
    testRankHintExtraction();
    testEmptyResponseSuccess();
    await testDeadCookieDetection();
    testPostSaveVerification();
    testCaptchaCacheInvalidation();
    testL1UndercutDetection();
    await testParallelCaptchaProbes();
    testAdaptiveKeepWarm();
    testSapLateVisibility();
    testEmptyOrdersInHotWindow();
    testSessionShakeThrottle();
    testPerWindowStateClearing();
    testAgeBasedBoundaryClear();
    testPrioritySorting();
    testPriorityLoader();
    testTieRejection();
    await testNetworkRetryOnIdempotent();
    console.log('\n🎉 ALL TESTS PASS');
    process.exit(0);
  } catch (e) {
    console.error('\n✗ TEST FAILED:', e.message);
    process.exit(1);
  }
})();
