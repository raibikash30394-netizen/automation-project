#!/usr/bin/env node
/**
 * runner.js — 24x7 supervisor wrapper for ebidding-secure.js
 *
 * Features
 *  • Auto-restart on crash / clean exit (with cooldown backoff)
 *  • Live CSV reload: agar user files/*.csv edit kare, worker ko safely
 *    restart karta hai
 *  • REVERSE_CSV mode: worker ko reversed CSV feed karta hai (so
 *    SAP par bids bottom-first submit ho — 10,9,8 → 7,6,5 → ...).
 *    User-facing input2.csv original order mein rehta hai. Jab worker
 *    updates likhta hai (AUTO_UPDATE_CSV_BIDS), runner un-reverse karke
 *    user file par save karta hai.
 *  • Debounced file watching (editors ke multiple writes handle karta hai)
 *  • Clean log streaming + graceful shutdown
 */

'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

// ─── .env sanity check — catch #/$ truncation gotcha ────────────────
(function validateEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
      if (!m) continue;
      const key = m[1], val = m[2];
      // If value is UNQUOTED and contains '#', dotenv treats '#' as comment
      const looksQuoted = /^["'].*["']\s*$/.test(val);
      if (!looksQuoted && val.includes('#')) {
        const actual = process.env[key] || '';
        const rawBefore = val.split('#')[0].trim();
        if (actual === rawBefore && actual.length < val.length) {
          console.log(
            `\x1b[31m[ENV-WARN] "${key}" me '#' character hai but quotes nahi hain — ` +
            `dotenv ne value truncate kar di: "${actual}" (expected likely "${val.replace(/^["']|["']$/g,'')}")\n` +
            `           Fix: .env me line ko iss tarah likho:  ${key}="${val}"\x1b[0m`
          );
        }
      }
    }
  } catch (_) {}
})();

// ─── Config ─────────────────────────────────────────────────────────
const SCRIPT       = path.join(__dirname, 'ebidding-secure.js');
const FILES_DIR    = path.join(__dirname, 'files');
const LOG_DIR      = path.join(__dirname, 'logs');
const MIN_RESTART_MS  = parseInt(process.env.MIN_RESTART_MS || '2000', 10);
const MAX_RESTART_MS  = parseInt(process.env.MAX_RESTART_MS || '30000', 10);
const CSV_DEBOUNCE_MS = parseInt(process.env.CSV_DEBOUNCE_MS || '1500', 10);
const KILL_GRACE_MS   = parseInt(process.env.KILL_GRACE_MS || '5000', 10);
const REVERSE_CSV = (process.env.REVERSE_CSV || 'false').toLowerCase() === 'true';
const HTTP_BOOST  = (process.env.HTTP_BOOST || 'true').toLowerCase() === 'true';
// Watchdog: agar worker itne ms tak stdout nahi deta, stuck maano
const MAX_IDLE_MS      = parseInt(process.env.MAX_IDLE_MS || '180000', 10);   // 3 min default
// Force refresh: agar >0, worker ko itne ms baad restart karo (fresh orders fetch)
const FORCE_RESTART_MS = parseInt(process.env.FORCE_RESTART_MS || '0', 10);

// User-facing CSVs (yeh user edit karta hai)
const USER_CSV   = path.resolve(FILES_DIR, path.basename(process.env.CSV_FILE || './files/input2.csv'));
// Internal reversed CSV (worker isko read karega jab REVERSE_CSV=true)
const REV_CSV    = path.join(FILES_DIR, '_input2.reversed.csv');

// Force continuous loop mode
process.env.LOOP_CONTINUOUS = process.env.LOOP_CONTINUOUS || 'true';

// ─── Log helpers ────────────────────────────────────────────────────
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
const logFile = path.join(LOG_DIR, 'runner.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const C = {
  reset:'\x1b[0m', dim:'\x1b[2m', red:'\x1b[31m',
  green:'\x1b[32m', yellow:'\x1b[33m', cyan:'\x1b[36m'
};
function stamp() { return new Date().toISOString().replace('T',' ').slice(0,19); }
function say(color, tag, msg) {
  const line = `[${stamp()}] [${tag}] ${msg}`;
  console.log(`${color}${line}${C.reset}`);
  logStream.write(line + '\n');
}
const info = m => say(C.cyan,   'RUN', m);
const ok   = m => say(C.green,  'OK ', m);
const warn = m => say(C.yellow, 'WRN', m);
const err  = m => say(C.red,    'ERR', m);

// ─── CSV reverse / un-reverse helpers ───────────────────────────────
// Keeps first line (header) on top, reverses only data rows
function reverseCsvText(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return text;
  const header = lines[0];
  // Filter out empty data lines completely
  const data = lines.slice(1).filter(l => l.trim() !== '');
  if (data.length === 0) return text;
  return [header, ...data.reverse()].join('\n') + '\n';
}

function syncUserToReversed() {
  if (!fs.existsSync(USER_CSV)) {
    warn(`User CSV not found: ${USER_CSV}`);
    return;
  }
  const txt = fs.readFileSync(USER_CSV, 'utf8');
  const rev = reverseCsvText(txt);
  fs.writeFileSync(REV_CSV, rev);
  csvHashes.set(path.basename(REV_CSV), sha1(rev));
  csvHashes.set(path.basename(USER_CSV), sha1(txt));
  info(`Reversed CSV regenerated → ${path.basename(REV_CSV)} (rows will submit bottom-first)`);
}

function syncReversedToUser() {
  if (!fs.existsSync(REV_CSV)) return;
  const txt = fs.readFileSync(REV_CSV, 'utf8');
  const orig = reverseCsvText(txt); // reversing again gives back original order
  fs.writeFileSync(USER_CSV, orig);
  csvHashes.set(path.basename(USER_CSV), sha1(orig));
  csvHashes.set(path.basename(REV_CSV), sha1(txt));
  ok(`Worker updates un-reversed → saved to ${path.basename(USER_CSV)} (original order preserved)`);
}

// ─── State ──────────────────────────────────────────────────────────
let child = null;
let restartTimer = null;
let restartDelay = MIN_RESTART_MS;
let killedForReload = false;
let shuttingDown = false;
let csvDebounceTimer = null;
let idleTimer = null;
let forceRestartTimer = null;
let lastOutputAt = Date.now();
const csvHashes = new Map();

function resetIdleTimer() {
  lastOutputAt = Date.now();
  clearTimeout(idleTimer);
  if (MAX_IDLE_MS > 0) {
    idleTimer = setTimeout(() => {
      warn(`Worker idle for ${Math.round(MAX_IDLE_MS/1000)}s (no output). Forcing restart to pick up new orders...`);
      killedForReload = true;
      stopChild('idle-watchdog');
    }, MAX_IDLE_MS);
  }
}

// ─── Hashing ────────────────────────────────────────────────────────
function sha1(buf) { return crypto.createHash('sha1').update(buf).digest('hex'); }
function hashFile(file) {
  try { return sha1(fs.readFileSync(file)); } catch { return null; }
}
function snapshotCsvs() {
  if (!fs.existsSync(FILES_DIR)) return;
  for (const f of fs.readdirSync(FILES_DIR)) {
    if (f.toLowerCase().endsWith('.csv')) {
      csvHashes.set(f, hashFile(path.join(FILES_DIR, f)));
    }
  }
}

// ─── Child management ───────────────────────────────────────────────
function startChild() {
  if (shuttingDown) return;
  clearTimeout(restartTimer);
  killedForReload = false;

  // Prepare CSV for worker
  const childEnv = { ...process.env };
  if (REVERSE_CSV) {
    syncUserToReversed();
    childEnv.CSV_FILE = './files/' + path.basename(REV_CSV);
    info(`REVERSE_CSV mode ON → worker CSV_FILE=${childEnv.CSV_FILE}`);
  } else {
    snapshotCsvs();
  }

  // Preload speed boost (undici + keep-alive + ipv4-first)
  if (HTTP_BOOST) {
    const boost = path.join(__dirname, 'agent-boost.js');
    const existing = childEnv.NODE_OPTIONS || '';
    if (!existing.includes('agent-boost.js')) {
      childEnv.NODE_OPTIONS = (existing + ' --require ' + JSON.stringify(boost)).trim();
    }
    info(`HTTP_BOOST ON → NODE_OPTIONS injected (undici + keep-alive)`);
  }

  info(`Starting worker: node ${path.basename(SCRIPT)}`);
  child = spawn(process.execPath, [SCRIPT], {
    cwd: __dirname,
    env: childEnv,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', d => { process.stdout.write(d); logStream.write(d); resetIdleTimer(); });
  child.stderr.on('data', d => { process.stderr.write(d); logStream.write(d); resetIdleTimer(); });

  resetIdleTimer();
  clearTimeout(forceRestartTimer);
  if (FORCE_RESTART_MS > 0) {
    forceRestartTimer = setTimeout(() => {
      warn(`Force refresh (${Math.round(FORCE_RESTART_MS/1000)}s elapsed). Restarting for fresh SAP orders...`);
      killedForReload = true;
      stopChild('force-refresh');
    }, FORCE_RESTART_MS);
  }

  child.on('exit', (code, signal) => {
    child = null;
    clearTimeout(idleTimer);
    clearTimeout(forceRestartTimer);
    if (shuttingDown) return;
    if (killedForReload) {
      ok(`Worker stopped for CSV reload (code=${code}, signal=${signal||'-'}). Restarting...`);
      restartDelay = MIN_RESTART_MS;
      restartTimer = setTimeout(startChild, 500);
      return;
    }
    if (code === 0) {
      ok(`Worker exited cleanly. Restarting in ${MIN_RESTART_MS}ms...`);
      restartDelay = MIN_RESTART_MS;
    } else {
      err(`Worker died (code=${code}, signal=${signal||'-'}). Restarting in ${restartDelay}ms...`);
    }
    restartTimer = setTimeout(startChild, restartDelay);
    restartDelay = Math.min(restartDelay * 2, MAX_RESTART_MS);
  });
}

function stopChild(reason) {
  if (!child) return;
  warn(`Stopping worker (${reason})...`);
  const c = child;
  try { c.kill('SIGTERM'); } catch {}
  setTimeout(() => {
    if (c && !c.killed) { try { c.kill('SIGKILL'); } catch {} }
  }, KILL_GRACE_MS);
}

// ─── CSV watcher ────────────────────────────────────────────────────
function handleCsvChange(name) {
  const full = path.join(FILES_DIR, name);
  const newHash = hashFile(full);
  const oldHash = csvHashes.get(name);
  if (newHash === oldHash) return; // no real content change

  // Case A: Worker wrote to reversed file → un-reverse to user file. NO restart.
  if (REVERSE_CSV && name === path.basename(REV_CSV)) {
    csvHashes.set(name, newHash);
    try {
      syncReversedToUser();
    } catch (e) { err(`Un-reverse failed: ${e.message}`); }
    return;
  }

  // Case B: User edited user-CSV → regenerate reversed → restart worker
  csvHashes.set(name, newHash);
  if (REVERSE_CSV && name === path.basename(USER_CSV)) {
    warn(`User CSV changed: ${name} — regenerating reversed + reloading worker...`);
    try { syncUserToReversed(); } catch (e) { err(`Reverse failed: ${e.message}`); }
    killedForReload = true;
    stopChild('csv-reload');
    return;
  }

  // Case C: Other CSVs (delete.csv etc.) — just reload worker
  warn(`CSV changed: ${name} — reloading worker with fresh data...`);
  killedForReload = true;
  stopChild('csv-reload');
}

function watchCsvs() {
  if (!fs.existsSync(FILES_DIR)) {
    warn(`files/ folder not found at ${FILES_DIR}. CSV watching disabled.`);
    return;
  }
  info(`Watching CSVs in ${FILES_DIR} for live edits...`);
  fs.watch(FILES_DIR, { persistent: true }, (evt, name) => {
    if (!name || !name.toLowerCase().endsWith('.csv')) return;
    clearTimeout(csvDebounceTimer);
    csvDebounceTimer = setTimeout(() => handleCsvChange(name), CSV_DEBOUNCE_MS);
  });
}

// ─── Graceful shutdown ──────────────────────────────────────────────
function shutdown(sig) {
  if (shuttingDown) return;
  shuttingDown = true;
  warn(`Received ${sig}. Shutting down runner + worker...`);
  clearTimeout(restartTimer);
  if (child) {
    try { child.kill('SIGTERM'); } catch {}
    setTimeout(() => {
      if (child && !child.killed) { try { child.kill('SIGKILL'); } catch {} }
      process.exit(0);
    }, KILL_GRACE_MS);
  } else {
    process.exit(0);
  }
}
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', e => { err(`Runner uncaught: ${e.stack||e}`); });
process.on('unhandledRejection', e => { err(`Runner unhandled rejection: ${e}`); });

// ─── Boot ───────────────────────────────────────────────────────────
info('══════════════════════════════════════════════════════════');
info(' E-Bidding 24x7 Runner  |  live CSV reload' + (REVERSE_CSV ? ' + REVERSE mode' : ''));
info('══════════════════════════════════════════════════════════');
info(`Script:      ${SCRIPT}`);
info(`Files dir:   ${FILES_DIR}`);
info(`User CSV:    ${USER_CSV}`);
if (REVERSE_CSV) info(`Reversed CSV: ${REV_CSV}`);
info(`Log file:    ${logFile}`);
info(`LOOP_CONTINUOUS=${process.env.LOOP_CONTINUOUS}   REVERSE_CSV=${REVERSE_CSV}`);
info(`MAX_IDLE_MS=${MAX_IDLE_MS}   FORCE_RESTART_MS=${FORCE_RESTART_MS || 'off'}   HTTP_BOOST=${HTTP_BOOST}`);
watchCsvs();
startChild();
