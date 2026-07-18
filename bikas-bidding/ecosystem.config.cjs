// ecosystem.config.cjs — PM2 process manager config for Bikas Bidding v2
//
// Usage on server:
//   pm2 start ecosystem.config.cjs      # start both services
//   pm2 restart ecosystem.config.cjs    # after code update
//   pm2 stop all
//   pm2 status
//   pm2 logs bikas-bid-engine           # live tail
//
// Both services run in "fork" mode (single instance each) — matches SAP's
// single-session constraint. Auto-restarts on crash, rotates logs by day.
//
// Files created at /home/ubuntu/bikas-bidding/logs/pm2/
//   bikas-solver-{out,err}.log
//   bikas-bid-engine-{out,err}.log

module.exports = {
  apps: [
    // ---- 1) Captcha solver server (must start BEFORE bid-engine) ----
    {
      name: 'bikas-solver',
      script: 'bidding.js',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',                 // single process — has in-memory cache
      autorestart: true,
      max_restarts: 20,
      min_uptime: '10s',
      restart_delay: 2000,
      max_memory_restart: '350M',        // Tesseract can leak; recycle if bloat
      watch: false,                       // don't restart on file changes
      env: {
        NODE_ENV: 'production',
      },
      out_file: 'logs/pm2/bikas-solver-out.log',
      error_file: 'logs/pm2/bikas-solver-err.log',
      merge_logs: true,
      time: true,                         // prepend timestamps to PM2 output
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    },

    // ---- 2) Bid engine (depends on solver being up) ----
    {
      name: 'bikas-bid-engine',
      script: 'bid-engine.js',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',                 // SINGLE-SESSION MODE — critical
      autorestart: true,
      max_restarts: 30,
      min_uptime: '15s',                  // engine warms up ~10s before first scan
      restart_delay: 3000,
      max_memory_restart: '400M',        // engine holds order cache + retries
      watch: false,
      env: {
        NODE_ENV: 'production',
        // NOTE: All app config lives in .env — do NOT duplicate here.
        // PM2 auto-loads .env from cwd via dotenvx (already imported in
        // bid-engine.js). If you want to override at PM2 level, add here.
      },
      out_file: 'logs/pm2/bikas-bid-engine-out.log',
      error_file: 'logs/pm2/bikas-bid-engine-err.log',
      merge_logs: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
      // Wait for solver to be listening on 127.0.0.1:3000 before starting.
      // PM2 doesn't have a native "wait for port" hook, but the small
      // restart_delay + solver's fast startup (~1s) makes this practically safe.
    },
  ],
};
