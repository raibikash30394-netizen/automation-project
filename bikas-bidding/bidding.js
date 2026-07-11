'use strict';

/**
 * bidding.js — Bikas Bidding v2 captcha solver server (clean rewrite).
 *
 * Endpoints
 *   POST /                 body: text/plain JSON  { base64Image }  → { solved }
 *   POST /solve-captcha    (alias of /, backward compatible with old bid-engine)
 *   POST /captcha          body: application/json { base64Image }  → { solved }
 *   POST /upload-base64-image (alias of /captcha)
 *   GET  /health           → { ok:true, cache:<size>, hits, misses, uptime, ... }
 *
 * Behaviour
 *   1. sha256(base64) → in-memory Map cache lookup (<5 ms hit).
 *   2. On miss → call external TrueCaptcha API (undici Pool, keep-alive).
 *   3. Persist new (hash → solved) into `data.json` (auto-saved every 60s).
 *   4. On errors → daily rotating log with base64 + response dump.
 *
 * Keep-alive HTTP server: `keepAliveTimeout=30000` for connection reuse
 * from the local bid-engine.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const crypto    = require('crypto');
const { Pool }  = require('undici');
const { build } = require('./logger');

const log = build('solver');

// ---- Config ----------------------------------------------------------------

const PORT              = parseInt(process.env.CAPTCHA_PORT || '3000', 10);
const CREDS_FILE        = path.join(__dirname, 'creds.json');
const CREDS_FILE_ALT    = path.join(__dirname, 'credentials.json'); // backward-compat
const CACHE_FILE        = path.join(__dirname, 'data.json');
const CACHE_TTL_HOURS   = parseInt(process.env.CAPTCHA_TTL_HOURS || '24', 10);
const CACHE_SAVE_MS     = 60_000;   // flush cache to disk every 60s

const TRUECAPTCHA_ORIGIN = 'https://api.apitruecaptcha.org';
const TRUECAPTCHA_PATH   = '/one/gettext';

// ---- Credentials -----------------------------------------------------------

function loadCreds() {
  const file = fs.existsSync(CREDS_FILE) ? CREDS_FILE
             : fs.existsSync(CREDS_FILE_ALT) ? CREDS_FILE_ALT
             : null;
  if (!file) {
    log.error(`No creds.json / credentials.json found in ${__dirname}. Create one with {"userid":"...","apikey":"..."}`);
    process.exit(1);
  }
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!parsed.userid || !parsed.apikey) {
    log.error({ file }, 'creds file must contain "userid" and "apikey"');
    process.exit(1);
  }
  return parsed;
}

const CREDS = loadCreds();

// ---- Undici pool for TrueCaptcha -------------------------------------------

const captchaPool = new Pool(TRUECAPTCHA_ORIGIN, {
  connections: 8,
  pipelining: 1,
  keepAliveTimeout: 30_000,
  headersTimeout: 15_000,
  bodyTimeout: 20_000,
});

// ---- In-memory cache + persistence -----------------------------------------

let entries = [];            // [{hash, file, result, savedAt}, ...]  (disk shape)
const hashMap = new Map();   // hash → result
let dirty = false;           // flush on next tick if true
const stats = { hits: 0, misses: 0, apiErrors: 0, saves: 0, startedAt: Date.now() };

function loadCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      entries = [];
      return;
    }
    const raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (!Array.isArray(raw)) throw new Error('data.json must be a JSON array');

    // TTL prune (savedAt in ms; missing = keep forever for backward-compat)
    const ttlMs = CACHE_TTL_HOURS * 3_600_000;
    const now = Date.now();
    entries = raw.filter((e) => {
      if (!e || !e.hash || !e.result) return false;
      if (!e.savedAt) return true; // legacy entries have no timestamp — keep
      return now - e.savedAt < ttlMs || ttlMs <= 0;
    });
    for (const e of entries) hashMap.set(e.hash, e.result);
    log.info(`Cache loaded: ${entries.length} entries (TTL=${CACHE_TTL_HOURS}h)`);
  } catch (e) {
    log.warn(`Cache load failed: ${e.message} — starting empty`);
    entries = [];
    hashMap.clear();
  }
}

function saveCache() {
  if (!dirty) return;
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(entries, null, 2), 'utf8');
    stats.saves++;
    dirty = false;
    log.debug(`Cache flushed to disk: ${entries.length} entries`);
  } catch (e) {
    log.error(`Cache save failed: ${e.message}`);
  }
}

function cacheHit(hash) {
  return hashMap.get(hash) || null;
}

function cachePut(hash, result) {
  if (hashMap.has(hash)) return;
  const entry = { hash, file: `image-${Date.now()}.png`, result, savedAt: Date.now() };
  entries.push(entry);
  hashMap.set(hash, result);
  dirty = true;
}

// ---- Utilities -------------------------------------------------------------

function stripDataUri(b64) {
  return typeof b64 === 'string' && b64.includes(',') ? b64.split(',')[1] : b64;
}

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function parseBody(req) {
  // Body arrives as raw string (bodyParser.text) OR as parsed JSON.
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body || {};
}

// ---- External captcha (TrueCaptcha) ---------------------------------------

async function solveViaApi(base64Raw) {
  const t0 = Date.now();
  const payload = { userid: CREDS.userid, apikey: CREDS.apikey, data: base64Raw };
  try {
    const { statusCode, body } = await captchaPool.request({
      path: TRUECAPTCHA_PATH,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await body.text();
    let json;
    try { json = JSON.parse(text); }
    catch {
      stats.apiErrors++;
      log.error({ statusCode, textPreview: text.slice(0, 200) }, 'TrueCaptcha non-JSON response');
      return '';
    }
    const solved = json.result || '';
    log.debug({ statusCode, ms: Date.now() - t0, solved }, 'TrueCaptcha response');
    return solved;
  } catch (e) {
    stats.apiErrors++;
    // Rotating error log: dump base64 preview so we can replay offline.
    log.error({
      err: e.message,
      base64Preview: base64Raw.slice(0, 80),
      base64Len: base64Raw.length,
    }, 'TrueCaptcha request failed');
    return '';
  }
}

// ---- Main solve dispatcher -------------------------------------------------

async function solve(base64Input) {
  if (!base64Input) return { solved: '', source: 'empty' };
  const raw = stripDataUri(base64Input);
  const hash = sha256(raw);

  // Cache-first
  const hit = cacheHit(hash);
  if (hit) {
    stats.hits++;
    return { solved: hit, source: 'cache', hash };
  }

  // Miss → external
  stats.misses++;
  const solved = await solveViaApi(raw);
  if (solved && solved !== 'Redo') cachePut(hash, solved);
  return { solved, source: 'api', hash };
}

// ---- Express app -----------------------------------------------------------

const app = express();
app.use(express.text({ type: '*/*', limit: '50mb' }));   // accept text/plain OR json

async function handleSolve(req, res) {
  const t0 = Date.now();
  try {
    const { base64Image } = parseBody(req);
    if (!base64Image) return res.status(400).json({ error: 'Base64 image data is required' });
    const { solved, source, hash } = await solve(base64Image);
    const ms = Date.now() - t0;
    if (source === 'cache') log.info({ ms, hash: hash.slice(0, 10) }, `HIT ${solved}`);
    else                    log.info({ ms, hash: hash?.slice(0, 10) }, `MISS ${solved || '(empty)'}`);
    res.json({ solved });
  } catch (e) {
    log.error({ err: e.message, stack: e.stack }, 'solve handler failed');
    res.status(500).json({ solved: 'Redo', error: e.message });
  }
}

app.post('/',               handleSolve);
app.post('/solve-captcha',  handleSolve);   // legacy alias used by old bid-engine
app.post('/captcha',        handleSolve);
app.post('/upload-base64-image', handleSolve);

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    uptimeSec: Math.round((Date.now() - stats.startedAt) / 1000),
    cache: hashMap.size,
    hits: stats.hits,
    misses: stats.misses,
    apiErrors: stats.apiErrors,
    saves: stats.saves,
    hitRatePct: stats.hits + stats.misses > 0
      ? +(100 * stats.hits / (stats.hits + stats.misses)).toFixed(1) : 0,
  });
});

// ---- Boot ------------------------------------------------------------------

loadCache();
setInterval(saveCache, CACHE_SAVE_MS).unref();
setInterval(() => {
  const total = stats.hits + stats.misses;
  if (!total) return;
  log.info(
    `[metrics] cache=${hashMap.size} hits=${stats.hits} misses=${stats.misses} ` +
    `errors=${stats.apiErrors} hit-rate=${(100 * stats.hits / total).toFixed(1)}%`
  );
}, parseInt(process.env.METRICS_INTERVAL_MS || '30000', 10)).unref();

const server = app.listen(PORT, () => {
  log.info(`Captcha solver ready → http://localhost:${PORT} (endpoints: POST /, /solve-captcha, /captcha ; GET /health)`);
});
server.keepAliveTimeout = 30_000;
server.headersTimeout   = 35_000;

// Graceful shutdown → flush cache
function shutdown(sig) {
  log.info(`${sig} — flushing cache…`);
  dirty = true;
  saveCache();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (e) => log.error({ err: e.message, stack: e.stack }, 'uncaughtException'));
process.on('unhandledRejection', (e) => log.error({ err: (e && e.message) || String(e) }, 'unhandledRejection'));
