/**
 * agent-boost.js — Speed + SAP-order-reverse preload for obfuscated worker.
 *
 * Inject via: NODE_OPTIONS="--require ./agent-boost.js"
 *
 * Kya karta hai:
 *  1. HTTPS/HTTP keep-alive + big socket pool (axios uses these by default)
 *  2. undici → global fetch dispatcher (kisi bhi fetch() call ke liye)
 *  3. DNS ipv4-first
 *  4. axios response interceptor → SAP OData BidOrderList ko REVERSE karta
 *     hai ARRAY level pe. Result: SAP par worker jab iterate karega orders,
 *     JALANGI (jo original response me bottom pe thi) pehle process hogi.
 *     Yeh worker's axios AUR har `axios.create()` instance dono par apply hota
 *     hai (axios.create ko monkey-patch karke).
 */

'use strict';

const https = require('https');
const http  = require('http');
const dns   = require('dns');

const REVERSE_SAP_ORDERS = (process.env.REVERSE_SAP_ORDERS || 'true').toLowerCase() === 'true';

// ── FAST MODE — cap long worker sleeps (7-sec cycle rest, retry waits) ──
// Obfuscated worker ke andar setTimeout(..., 7000+) waits hain jo bid window
// ke beech "rest" mein chali jaati hain. Yaha global.setTimeout ko wrap karke
// bade delays ko chhota kar dete hain — worker turant next fetch mein aa jayega.
const FAST_MODE       = (process.env.FAST_MODE || 'true').toLowerCase() === 'true';
// Delays iss threshold se BADE hain to unko clamp karo (ms).
// Chhote delays (HTTP retry gaps, TLS timing) untouched rahe.
const SLOW_THRESHOLD  = parseInt(process.env.FAST_SLOW_THRESHOLD_MS || '900', 10);
// Clamp target — kitne ms tak reduce karo bade delays ko.
const MAX_DELAY_MS    = parseInt(process.env.FAST_MAX_DELAY_MS || '250', 10);

if (FAST_MODE) {
  const origSet = global.setTimeout;
  let patchLog = 0;

  // Skip clamping when setTimeout is being used as HTTP request/socket
  // timeout by axios/undici/https — clamping those would break requests.
  const HTTP_STACK_RE = /(node:https|node:http|node:net|node:_http|node_modules[\/\\](axios|undici|follow-redirects|tough-cookie|form-data))/i;
  function isHttpTimeout() {
    const stack = new Error().stack || '';
    return HTTP_STACK_RE.test(stack);
  }

  const patched = function (fn, delay, ...args) {
    let d = Number(delay) || 0;
    if (d > SLOW_THRESHOLD && !isHttpTimeout()) {
      const orig = d;
      d = MAX_DELAY_MS;
      if (patchLog++ < 8) {
        try { process.stdout.write(`\x1b[33m[FAST] setTimeout ${orig}ms → ${d}ms\x1b[0m\n`); } catch {}
      }
    }
    return origSet(fn, d, ...args);
  };
  // Preserve node internals + promise-based helpers (skip read-only symbols)
  Object.setPrototypeOf(patched, origSet);
  for (const k of Reflect.ownKeys(origSet)) {
    try {
      const desc = Object.getOwnPropertyDescriptor(origSet, k);
      if (desc && (desc.writable || desc.configurable)) {
        Object.defineProperty(patched, k, desc);
      }
    } catch {}
  }
  global.setTimeout = patched;
  // Also patch setInterval for repeating slow polls
  const origInt = global.setInterval;
  global.setInterval = function (fn, delay, ...args) {
    let d = Number(delay) || 0;
    if (d > SLOW_THRESHOLD && !isHttpTimeout()) d = MAX_DELAY_MS;
    return origInt(fn, d, ...args);
  };
  Object.setPrototypeOf(global.setInterval, origInt);
}

// ── DNS: IPv4 first ─────────────────────────────────────────────────
try { dns.setDefaultResultOrder('ipv4first'); } catch {}

// ── Keep-alive HTTPS/HTTP agents ────────────────────────────────────
const MAX_SOCKETS = parseInt(process.env.HTTP_MAX_SOCKETS || '64', 10);
const MAX_FREE    = parseInt(process.env.HTTP_MAX_FREE || '32', 10);
const TIMEOUT_MS  = parseInt(process.env.HTTP_TIMEOUT_MS || '60000', 10);

https.globalAgent = new https.Agent({
  keepAlive: true, keepAliveMsecs: 30_000,
  maxSockets: MAX_SOCKETS, maxFreeSockets: MAX_FREE,
  scheduling: 'lifo', rejectUnauthorized: false, timeout: TIMEOUT_MS,
});
http.globalAgent = new http.Agent({
  keepAlive: true, keepAliveMsecs: 30_000,
  maxSockets: MAX_SOCKETS, maxFreeSockets: MAX_FREE,
  scheduling: 'lifo', timeout: TIMEOUT_MS,
});

// ── Undici global dispatcher ────────────────────────────────────────
let undiciOk = false;
try {
  const { Agent, setGlobalDispatcher } = require('undici');
  setGlobalDispatcher(new Agent({
    keepAliveTimeout: 30_000,
    keepAliveMaxTimeout: 600_000,
    connections: MAX_SOCKETS,
    pipelining: 1,
    connect: { rejectUnauthorized: false },
  }));
  undiciOk = true;
} catch (_) {}

// ── SAP order reverse via axios interceptor ─────────────────────────
// Heuristic: agar response me OData `d.results` array hai AND rows order-like
// dikhte hain (Destination / Taluka / CofOrderId / BidOrderId fields hain),
// toh array reverse kar do — worker "top se" iterate karega jo effectively
// original "bottom" ho gaya.
function looksLikeOrderList(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return false;
  const s = arr[0];
  if (!s || typeof s !== 'object') return false;
  return (
    'CofOrderId' in s || 'BidOrderId' in s || 'OrderId' in s ||
    'BidOrder' in s   || 'OrderList' in s || 'COFOrderId' in s ||
    ('Destination' in s && ('Taluka' in s || 'Depot' in s || 'Freight' in s))
  );
}

function makeReverseInterceptor(tag) {
  return (res) => {
    try {
      if (!REVERSE_SAP_ORDERS) return res;
      // Standard OData v2 shape: { d: { results: [...] } }
      const d = res && res.data && res.data.d;
      if (d && Array.isArray(d.results) && looksLikeOrderList(d.results)) {
        const before = d.results.length;
        d.results = d.results.slice().reverse();
        try { process.stdout.write(`\x1b[35m[BOOST-REV] SAP orders reversed via ${tag} (${before} rows, bottom-first)\x1b[0m\n`); } catch {}
      } else if (Array.isArray(res && res.data) && looksLikeOrderList(res.data)) {
        // Fallback: raw array response
        const before = res.data.length;
        res.data = res.data.slice().reverse();
        try { process.stdout.write(`\x1b[35m[BOOST-REV] SAP orders reversed via ${tag} (${before} rows, bottom-first)\x1b[0m\n`); } catch {}
      }
    } catch {}
    return res;
  };
}

let axiosPatched = false;
try {
  const axios = require('axios');
  // 1. Default instance
  axios.interceptors.response.use(makeReverseInterceptor('default'));

  // 2. Monkey-patch axios.create so EVERY new instance also gets the interceptor
  const origCreate = axios.create.bind(axios);
  axios.create = function patchedCreate(...args) {
    const inst = origCreate(...args);
    try {
      inst.interceptors.response.use(makeReverseInterceptor('create'));
    } catch {}
    return inst;
  };
  axiosPatched = true;
} catch (_) {}

// ── Banner ─────────────────────────────────────────────────────────
try {
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  process.stdout.write(
    `\x1b[36m[${ts}] [BOOST] ready — undici=${undiciOk?'ON':'off'} ` +
    `keep-alive=ON maxSockets=${MAX_SOCKETS} ipv4first=ON ` +
    `axios-patch=${axiosPatched?'ON':'off'} reverse-sap-orders=${REVERSE_SAP_ORDERS?'ON':'off'} ` +
    `fast-mode=${FAST_MODE?'ON':'off'}${FAST_MODE?` (>${SLOW_THRESHOLD}ms → ${MAX_DELAY_MS}ms)`:''}\x1b[0m\n`
  );
} catch {}
