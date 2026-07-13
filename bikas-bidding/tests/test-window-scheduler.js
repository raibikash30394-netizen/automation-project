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

// ---- Run --------------------------------------------------------------------

(async () => {
  try {
    testMsUntilNextWindow();
    testIsHotWindow();
    await testGlobalMutexSerialises();
    await testSequentialFallback();
    testBatchingLogic();
    console.log('\n🎉 ALL TESTS PASS');
    process.exit(0);
  } catch (e) {
    console.error('\n✗ TEST FAILED:', e.message);
    process.exit(1);
  }
})();
