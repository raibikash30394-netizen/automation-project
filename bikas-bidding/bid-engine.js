'use strict';

/**
 * bid-engine.js — Bikas Bidding v2 main bot
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
const VENDOR_ID      = process.env.VENDOR_ID || '2210181';
const PLANT_CODE     = process.env.PLANT_CODE || '6924';
const POLL_MS        = parseInt(process.env.POLL_MS || '60', 10);
const BATCH_SIZE     = parseInt(process.env.BATCH_SIZE || '3', 10);
const PARALLEL_BATCHES = parseInt(process.env.PARALLEL_BATCHES || '4', 10);

const TIME_ENDED_COOLDOWN_MS = parseInt(process.env.TIME_ENDED_COOLDOWN_MS || '30000', 10);

const AUTO_ADJUST         = String(process.env.AUTO_ADJUST || 'false').toLowerCase() === 'true';
const MAX_ADJUST_RETRIES  = parseInt(process.env.MAX_ADJUST_RETRIES || '3', 10);
const SKIP_RANK_PREVIEW   = String(process.env.SKIP_RANK_PREVIEW || 'true').toLowerCase() === 'true';

const WAF_MIN_MS   = parseInt(process.env.WAF_BACKOFF_MIN_MS || '30000', 10);
const WAF_MAX_MS   = parseInt(process.env.WAF_BACKOFF_MAX_MS || '120000', 10);
const WAF_RESET_MS = parseInt(process.env.WAF_RESET_AFTER_MS || '300000', 10);

const METRICS_MS   = parseInt(process.env.METRICS_INTERVAL_MS || '30000', 10);

const ROOT       = __dirname;
const COOKIE_FILE = path.join(ROOT, 'cookie.txt');
const TOKEN_FILE  = path.join(ROOT, 'token.txt');
const FILES_DIR   = path.join(ROOT, 'files');
const INPUT_CSV   = path.join(FILES_DIR, 'input2.csv');
const DELETE_CSV  = path.join(FILES_DIR, 'delete.csv');

// ---- Undici pools ----------------------------------------------------------

// Global dispatcher — everyone else in the process (default fetch etc.) will
// also use these keep-alive connections.
setGlobalDispatcher(new Agent({
  keepAliveTimeout: 30_000,
  keepAliveMaxTimeout: 60_000,
  connectTimeout: 5_000,
  connections: 32,
}));

const sapPool = new Pool(SAP_ORIGIN, {
  connections: 12,
  pipelining: 1,
  keepAliveTimeout: 30_000,
  headersTimeout: 8_000,
  bodyTimeout: 10_000,
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

// ---- Auth (cookie + CSRF token) --------------------------------------------

class AuthConfig {
  constructor() {
    this.cookie = this._read(COOKIE_FILE);
    this.token  = this._read(TOKEN_FILE);
    this._refreshInFlight = null;
    this._lastPlantConf = null;
    if (!this.cookie) {
      log.error(`cookie.txt is empty. Paste your logged-in browser Cookie header into ${COOKIE_FILE} and restart.`);
      process.exit(1);
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
      log.info('Refreshing CSRF token…');
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
        fs.writeFileSync(TOKEN_FILE, this.token, 'utf8');
        log.info('CSRF token saved to token.txt');
        return this.token;
      } finally {
        this._refreshInFlight = null;
      }
    })();
    return this._refreshInFlight;
  }
}

// ---- Small SAP request helper (with 403 CSRF-refresh once) ----------------

async function sapRequest(auth, { path: p, method = 'POST', body, timeoutMs = 5000 }) {
  const doOnce = () => sapPool.request({
    path: p,
    method,
    headers: auth.headers(),
    body: body ? JSON.stringify(body) : undefined,
    headersTimeout: timeoutMs,
    bodyTimeout: timeoutMs,
  });
  if (!auth.token) await auth.refreshToken();
  let r = await doOnce();
  const csrfHdr = (r.headers['x-csrf-token'] || '').toString().toLowerCase();
  if (r.statusCode === 403 && csrfHdr === 'required') {
    log.warn('CSRF rejected — refreshing token and retrying once.');
    await auth.refreshToken();
    r = await doOnce();
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

function matchOrder(order, rules) {
  const dest = (order.Destination || order.DestCityDesc || order.CityCodeDescription || '')
    .toString().trim().toUpperCase();
  if (!dest) return null;
  const orderSpi = (order.SPI || order.Spi || order.SpecialProcessInd || order.Zspi || '')
    .toString().trim();
  for (const [ruleCity, ruleList] of rules.entries()) {
    const cityHit = dest === ruleCity || dest.includes(ruleCity) || ruleCity.includes(dest);
    if (!cityHit) continue;
    for (const rule of ruleList) {
      if (!rule.spi) return { amount: rule.amount, matchedCity: ruleCity, matchedSpi: '(any)' };
      if (orderSpi.includes(rule.spi)) {
        return { amount: rule.amount, matchedCity: ruleCity, matchedSpi: rule.spi };
      }
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
  return blacklist.some((b) => names.some((n) => n === b || n.includes(b) || b.includes(n)));
}

// ---- SAP calls -------------------------------------------------------------

async function fetchLiveOrders(auth) {
  if (wafActive()) return { orders: [], plantConf: null };
  const today = new Date().toISOString().slice(0, 10) + 'T00:00:00';
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
    timeoutMs: 5000,
  });

  if (res.statusCode !== 200 && res.statusCode !== 201) {
    const preview = typeof res.data === 'string' ? res.data.slice(0, 300) : JSON.stringify(res.data).slice(0, 300);
    if (res.statusCode === 406 || /Not Acceptable|<!DOCTYPE html>/i.test(preview)) {
      markWaf(`BidOrderListSet HTTP ${res.statusCode}`);
      return { orders: [], plantConf: null };
    }
    log.warn(`BidOrderListSet → HTTP ${res.statusCode} | ${preview}`);
    return { orders: [], plantConf: null };
  }

  const d = res.data?.d || {};
  const orders    = d.NavBidSchVendors?.results || d.results || (Array.isArray(d) ? d : []);
  const plantConf = d.NavBidPlntConf?.results?.[0] || null;
  auth._lastPlantConf = plantConf;
  return { orders, plantConf };
}

async function fetchCaptchaImage(auth) {
  if (wafActive()) return { img: null, reason: 'waf' };
  const p = `${SAP_PATH_PFX}/EbiddingCaptchaSet(Vendor='${VENDOR_ID}',Plant='${PLANT_CODE}')`;
  const res = await sapRequest(auth, { path: p, method: 'GET', timeoutMs: 4000 });
  if (res.statusCode === 406 || (typeof res.data === 'string' && /Not Acceptable|<!DOCTYPE html>/i.test(res.data.slice(0, 200)))) {
    markWaf('EbiddingCaptchaSet HTTP 406');
    return { img: null, reason: 'waf-406' };
  }
  if (res.statusCode !== 200 && res.statusCode !== 201) {
    return { img: null, reason: `http-${res.statusCode}` };
  }
  const d = res.data?.d || {};
  const img = d.ImageString || d.Captcha || d.CaptchaImage || d.EvCaptcha || null;
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
  return await solveViaLocal(img);
}

// ---- Formatting helpers ---------------------------------------------------

function fmtAmtInt(v) { return `${Math.round(Number(v || 0))}`; }
function fmtAmtSap(v) { return `${Math.round(Number(v || 0))}.000`; }

// ---- Submit ---------------------------------------------------------------

async function submitBid(auth, bids, solvedCaptcha) {
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

  const payload = {
    Flag              : '1',
    Ev_Text           : '',
    IvCaptchaValue    : solvedCaptcha,
    NavEBiddingMessage: {},
    NavEBiddingTrackHis,
  };

  const res = await sapRequest(auth, {
    path: `${SAP_PATH_PFX}/EBiddingSaveSet`,
    method: 'POST',
    body: payload,
    timeoutMs: 5000,
  });

  const d = res.data?.d || {};
  const messages = extractSapMessages(d);
  const severity = { E: 3, I: 2, S: 1, '': 0 };
  let primary = { info: '', text: '' };
  for (const m of messages) {
    if ((severity[m.info] || 0) > (severity[primary.info] || 0)) primary = m;
  }
  if (!primary.text && d.Ev_Text) primary = { info: primary.info || '', text: d.Ev_Text };
  return { statusCode: res.statusCode, info: primary.info, text: primary.text, messages, raw: res.data };
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

/**
 * Serialised SAP session mutex.
 *
 * SAP maintains ONE active captcha per session (cookie). When multiple parallel
 * workers each call EbiddingCaptchaSet concurrently, the last fetch invalidates
 * every earlier one — the empirical failure mode on the first live run was
 * ~76% "Wrong Captcha" rejections.
 *
 * Fix: serialise the critical section (`fetch captcha → solve → submit`) so
 * only ONE worker holds the SAP session at a time. Workers still run in
 * parallel for everything else (CSV parsing, next-scan polling, in-flight
 * bookkeeping), but the SAP-session-critical part is one-at-a-time.
 */
const sapSession = (() => {
  let chain = Promise.resolve();
  return {
    /** Serialise `fn` — returns whatever fn resolves to. */
    run(fn) {
      const p = chain.then(() => fn(), () => fn());
      // Keep chain alive even on rejection; swallow so one failure
      // doesn't poison every future queued task.
      chain = p.catch(() => {});
      return p;
    },
  };
})();

// ---- Batcher --------------------------------------------------------------

function buildBatches(orders, rules, blacklist, seenSubmitted, inFlight, cooldown) {
  const now = Date.now();
  const byClub = new Map();
  const stats = { total: orders.length, matched: 0, blacklisted: 0, noRule: 0, clubDropped: 0, coolskip: 0 };

  const fresh = orders.filter((o) => {
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

  for (const [club, members] of byClub.entries()) {
    if (!club) {
      for (const o of members) {
        if (isCustomerBlacklisted(o, blacklist)) { stats.blacklisted++; continue; }
        const m = matchOrder(o, rules);
        if (!m) { stats.noRule++; continue; }
        stats.matched++;
        singles.push({ order: o, amount: m.amount, city: m.matchedCity, spi: m.matchedSpi });
      }
    } else {
      const items = [];
      let drop = false;
      for (const o of members) {
        if (isCustomerBlacklisted(o, blacklist)) { drop = true; break; }
        const m = matchOrder(o, rules);
        if (!m) { drop = true; break; }
        items.push({ order: o, amount: m.amount, city: m.matchedCity, spi: m.matchedSpi });
      }
      if (drop) stats.clubDropped++;
      else if (items.length) {
        stats.matched += items.length;
        // clubs also split at BATCH_SIZE (SAP hard-limit 3 per submit)
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
          clubGroups.push({ clubId: club, bids: items.slice(i, i + BATCH_SIZE) });
        }
      }
    }
  }

  // Singles: chunk by BATCH_SIZE
  const singleBatches = [];
  for (let i = 0; i < singles.length; i += BATCH_SIZE) {
    singleBatches.push(singles.slice(i, i + BATCH_SIZE));
  }

  // Order: singles first, then clubs
  const plan = [];
  for (const b of singleBatches) plan.push({ kind: 'single', bids: b });
  for (const c of clubGroups)    plan.push({ kind: 'club',   bids: c.bids, clubId: c.clubId });

  return { plan, stats };
}

// ---- Worker (JIT captcha inside SAP-session mutex) ------------------------

/**
 * Each worker pulls batches from a shared queue. Inside the SAP session mutex
 * it fetches a fresh captcha, solves it, and submits — all in one atomic step
 * so no concurrent worker can invalidate the captcha mid-flight.
 *
 * We removed the earlier "pipelining" prefetch: even though it looked like a
 * win on paper, SAP's captcha invalidation semantics mean prefetching the
 * next captcha WHILE the current one is in-flight silently invalidates the
 * current one on the server side → 76% "Wrong Captcha" on the first live run.
 */
function makeWorkerPool(ctx) {
  let cursor = 0;

  async function fetchFreshCaptcha(workerId) {
    // 3 quick attempts — SAP sometimes returns an empty `ImageString` when the
    // bid window is transitioning; solver may occasionally return 'Redo'.
    for (let i = 0; i < 3; i++) {
      const r = await nextCaptcha(ctx.auth);
      if (r.solved) return r.solved;
      if (wafActive()) return '';
      if (r.reason === 'sap-empty' && i === 0) {
        // First time we see empty from SAP this scan — log once so user
        // knows the bid window is currently closed.
        log.warn(`[w${workerId}] SAP returned empty captcha (bid window likely closed) — retrying`);
      } else if (r.reason && r.reason !== 'ok' && r.reason !== 'sap-empty') {
        log.warn(`[w${workerId}] captcha attempt ${i + 1}/3 failed: ${r.reason}`);
      }
    }
    return '';
  }

  async function runOne(workerId) {
    // Jittered stagger so 4 workers don't all queue on the mutex at the same
    // instant — helps interleave with the SAP TCP window.
    const jitter = 30 + Math.floor(Math.random() * 60);
    await new Promise((r) => setTimeout(r, jitter));

    while (cursor < ctx.plan.length) {
      const item = ctx.plan[cursor++];
      const t0 = Date.now();
      for (const b of item.bids) ctx.inFlight.add(String(b.order.SapOrderId));

      // Critical section: hold the SAP session for the fetch-solve-submit
      // atomic unit. Only ONE worker at a time.
      const outcome = await sapSession.run(async () => {
        const solved = await fetchFreshCaptcha(workerId);
        if (!solved) return { skipped: true };
        return await handleBatch(ctx, item, solved, workerId);
      });

      if (outcome && outcome.skipped) {
        log.warn(`[w${workerId}] no captcha for ${item.kind} batch (${item.bids.length}) — retry next scan`);
      }

      for (const b of item.bids) ctx.inFlight.delete(String(b.order.SapOrderId));
      pushLatency(Date.now() - t0);
    }
  }

  const n = Math.min(PARALLEL_BATCHES, ctx.plan.length);
  return Array.from({ length: n }, (_, i) => runOne(i + 1));
}

async function handleBatch(ctx, item, solved, workerId, retryDepth = 0) {
  metrics.submits++;
  const list = item.bids.map((b) => `${b.order.SapOrderId}[${b.city}/${b.spi}]@${b.amount}`).join(', ');
  log.info(`[w${workerId}] → ${item.kind.toUpperCase()}${item.clubId ? ' id=' + item.clubId : ''} (${item.bids.length}): ${list}`);

  const bids = item.bids.map((b) => ({
    sapOrderId: b.order.SapOrderId,
    amount    : b.amount,
    order     : b.order,
    clubId    : b.order.ClubId || '',
  }));

  const result = await submitBid(ctx.auth, bids, solved);

  const textLower = (result.text || '').toString().toLowerCase();
  const evText    = (result.raw?.d?.Ev_Text || '').toString();

  const isSavedOk      = /saved successfully|bid.*accepted|success/i.test(textLower);
  const isRealSuccess  = (result.info === 'S' && !/ended|closed|expired|invalid|error/i.test(textLower)) || isSavedOk;
  const isTimeEnded    = /ended|closed|expired/i.test(textLower) && !isSavedOk;
  const isWrongCaptcha = /captcha.*(fail|wrong|invalid)|worng\s*captcha/i.test(textLower);
  const reduceBy       = parseReduceAmount(evText || result.text);
  const minFloor       = parseMinFloor(evText || result.text);

  if (isRealSuccess) {
    metrics.submitsOk++;
    log.info(`[w${workerId}] ✓ ACCEPTED (${item.kind}, ${bids.length}): ${result.text || 'OK'}`);
    for (const b of item.bids) ctx.submitted.add(String(b.order.SapOrderId));
    return { ok: true };
  }

  if (isWrongCaptcha) {
    metrics.submitsWrongCaptcha++;
    if (retryDepth < 3) {
      log.warn(`[w${workerId}] ↻ Wrong captcha — refetching + retry ${retryDepth + 1}/3`);
      // Immediate retry with a FRESH captcha (still inside session mutex —
      // we're called from sapSession.run in makeWorkerPool).
      let fresh = '';
      for (let i = 0; i < 3; i++) {
        const r = await nextCaptcha(ctx.auth);
        if (r.solved) { fresh = r.solved; break; }
        if (wafActive()) return { retry: false };
      }
      if (!fresh) return { retry: false };
      return handleBatch(ctx, item, fresh, workerId, retryDepth + 1);
    }
    log.error(`[w${workerId}] ✗ Wrong captcha 3× — will retry next scan`);
    return { retry: true };
  }

  if (isTimeEnded) {
    metrics.submitsTimeEnded++;
    const retryAt = Date.now() + TIME_ENDED_COOLDOWN_MS;
    log.warn(`[w${workerId}] ⏰ Bid window CLOSED — cooldown ${Math.round(TIME_ENDED_COOLDOWN_MS / 1000)}s`);
    for (const b of item.bids) ctx.cooldown.set(String(b.order.SapOrderId), retryAt);
    return { retry: false };
  }

  // ---- SAP floor rejection: "Bidding amount should be Greater than or equal to X" ----
  if (minFloor !== null && minFloor > 0) {
    metrics.submitsRejected++;
    for (const b of item.bids) {
      log.error(
        `[w${workerId}] ✗ RATE TOO LOW → SapOrderId=${b.order.SapOrderId} ` +
        `city="${b.city}" spi="${b.spi}" csv=${b.amount} ` +
        `(SAP floor ≥ ${minFloor}). Update input2.csv and re-run.`
      );
      ctx.submitted.add(String(b.order.SapOrderId));
    }
    return { retry: false };
  }

  if (reduceBy !== null && reduceBy > 0) {
    metrics.submitsRejected++;
    if (!AUTO_ADJUST) {
      for (const b of item.bids) {
        const suggested = +(b.amount - reduceBy).toFixed(2);
        log.error(
          `[w${workerId}] ✗ RATE HIGH → SapOrderId=${b.order.SapOrderId} ` +
          `city="${b.city}" spi="${b.spi}" csv=${b.amount} ` +
          `(SAP wants ≤ ${suggested}). Update input2.csv and re-run.`
        );
        ctx.submitted.add(String(b.order.SapOrderId));
      }
      return { retry: false };
    }
    const key = item.bids.map((b) => b.order.SapOrderId).join('|');
    const attempt = (ctx.adjustAttempts.get(key) || 0) + 1;
    if (attempt > MAX_ADJUST_RETRIES) {
      log.error(`[w${workerId}] ✗ Gave up after ${MAX_ADJUST_RETRIES} auto-adjust retries`);
      for (const b of item.bids) ctx.submitted.add(String(b.order.SapOrderId));
      ctx.adjustAttempts.delete(key);
      return { retry: false };
    }
    ctx.adjustAttempts.set(key, attempt);
    const step = reduceBy + (attempt - 1);
    log.warn(`[w${workerId}] ↓ Auto-adjust ${attempt}/${MAX_ADJUST_RETRIES} — reducing by Rs ${step}`);
    for (const b of item.bids) b.amount = +(b.amount - step).toFixed(2);
    // Fresh captcha for re-submit (still inside session mutex)
    let fresh = '';
    for (let i = 0; i < 3; i++) {
      const r = await nextCaptcha(ctx.auth);
      if (r.solved) { fresh = r.solved; break; }
    }
    if (!fresh) return { retry: false };
    return handleBatch(ctx, item, fresh, workerId, retryDepth + 1);
  }

  if (result.info === 'I') {
    log.warn(`[w${workerId}] ↻ Info-level rejection: ${result.text} — retry next scan`);
    return { retry: true };
  }

  if (result.info === 'E') {
    metrics.submitsRejected++;
    log.error(`[w${workerId}] ✗ Rejected: ${result.text || '(no text)'}`);
    for (const b of item.bids) ctx.submitted.add(String(b.order.SapOrderId));
    return { retry: false };
  }

  // Unknown → mark done to avoid hot-loop
  log.warn(`[w${workerId}] Unknown response info='${result.info}' status=${result.statusCode} — marking done`);
  for (const b of item.bids) ctx.submitted.add(String(b.order.SapOrderId));
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
    const { orders } = await fetchLiveOrders(ctx.auth);
    if (!orders.length) return;

    if (!ctx.sampled) {
      ctx.sampled = true;
      log.info(`Sample order keys: ${Object.keys(orders[0]).join(', ')}`);
    }

    const { plan, stats } = buildBatches(orders, ctx.rules, ctx.blacklist, ctx.submitted, ctx.inFlight, ctx.cooldown);
    if (stats.matched === 0) return;

    log.info(
      `Scan #${ctx.scan} | orders=${stats.total} matched=${stats.matched} bl=${stats.blacklisted} ` +
      `no-rule=${stats.noRule} club-drop=${stats.clubDropped} cool=${stats.coolskip} | ` +
      `plan=[singles+clubs=${plan.length}, parallel=${PARALLEL_BATCHES}]`
    );

    const workerCtx = { ...ctx, plan };
    const workers = makeWorkerPool(workerCtx);
    await Promise.all(workers).catch(() => {});
  } catch (e) {
    log.error({ err: e.message, stack: e.stack }, 'tick failed');
  }
}

// ---- Warm-up ---------------------------------------------------------------

async function warmUpPools(auth) {
  // Two cheap HEAD-ish calls to prime the TCP+TLS handshake for SAP pool
  // and the local solver pool, so the first real bid doesn't pay ~200-300ms.
  const tasks = [];
  tasks.push(sapPool.request({
    path: `${SAP_PATH_PFX}/SessionSet('')`,
    method: 'GET',
    headers: auth.headers({ 'x-csrf-token': 'Fetch' }),
  }).then((r) => r.body.dump()).catch(() => {}));

  tasks.push(solverPool.request({
    path: '/health',
    method: 'GET',
  }).then((r) => r.body.dump()).catch(() => {}));

  await Promise.all(tasks);
  log.info('Pools warmed up (SAP + local solver keep-alive established).');
}

// ---- Main ------------------------------------------------------------------

async function main() {
  log.info('🚀 Bikas Bidding v2 engine starting…');
  log.info(
    `Config: POLL_MS=${POLL_MS} BATCH_SIZE=${BATCH_SIZE} PARALLEL=${PARALLEL_BATCHES} ` +
    `AUTO_ADJUST=${AUTO_ADJUST} WAF=${WAF_MIN_MS}→${WAF_MAX_MS}ms metrics=${METRICS_MS}ms`
  );

  const auth = new AuthConfig();
  if (!auth.token) await auth.refreshToken();
  await warmUpPools(auth);

  const [inputRows, deleteRows] = await Promise.all([parseCSV(INPUT_CSV), parseCSV(DELETE_CSV)]);
  const { rules, blacklist } = buildRuleMaps(inputRows, deleteRows);
  let totalRules = 0;
  for (const list of rules.values()) totalRules += list.length;
  log.info(`Loaded ${rules.size} cities (${totalRules} rule rows), ${blacklist.length} blacklisted customers`);

  const ctx = {
    auth, rules, blacklist,
    scan: 0,
    submitted: new Set(),
    inFlight:  new Set(),
    cooldown:  new Map(),
    adjustAttempts: new Map(),
  };

  process.on('SIGINT',  () => { log.info('SIGINT — bye'); process.exit(0); });
  process.on('SIGTERM', () => { log.info('SIGTERM — bye'); process.exit(0); });

  if (METRICS_MS > 0) setInterval(metricsDump, METRICS_MS).unref();

  // Main polling loop with small jitter (0-20 ms) to avoid perfectly aligned bursts
  while (true) {
    await tick(ctx);
    await new Promise((r) => setTimeout(r, POLL_MS + Math.floor(Math.random() * 20)));
  }
}

main().catch((e) => { log.error({ err: e.message, stack: e.stack }, 'fatal'); process.exit(1); });
