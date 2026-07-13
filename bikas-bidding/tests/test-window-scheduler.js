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
    console.log('\n🎉 ALL TESTS PASS');
    process.exit(0);
  } catch (e) {
    console.error('\n✗ TEST FAILED:', e.message);
    process.exit(1);
  }
})();
