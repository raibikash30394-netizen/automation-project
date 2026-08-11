'use strict';

/**
 * Shared pino logger with a daily-rotating file transport (`pino-roll`)
 * and a pretty-printed stdout stream for developer visibility.
 *
 *  - Files:   logs/<name>-YYYY-MM-DD.log  (JSON, rotated daily)
 *  - Console: pino-pretty formatted, colored, timestamped
 *  - Errors:  logs/error-YYYY-MM-DD.log  (level=error and above)
 *
 * Env knobs:
 *   LOG_LEVEL           = pino level (default: info)
 *   LOG_RETENTION_DAYS  = how many rotated files to keep (default: 7)
 */

const path = require('path');
const fs = require('fs');
const pino = require('pino');

const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const LEVEL     = process.env.LOG_LEVEL || 'info';
const RETENTION = parseInt(process.env.LOG_RETENTION_DAYS || '7', 10);

function build(name) {
  const transport = pino.transport({
    targets: [
      // Colored console
      {
        target: 'pino-pretty',
        level: LEVEL,
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: `[${name}] {msg}`,
        },
      },
      // Daily-rotating JSON log (all levels)
      {
        target: 'pino-roll',
        level: LEVEL,
        options: {
          file: path.join(LOG_DIR, `${name}.log`),
          frequency: 'daily',
          dateFormat: 'yyyy-MM-dd',
          mkdir: true,
          limit: { count: RETENTION },
        },
      },
      // Daily-rotating errors-only log — for post-mortem captcha/SAP dumps
      {
        target: 'pino-roll',
        level: 'error',
        options: {
          file: path.join(LOG_DIR, 'error.log'),
          frequency: 'daily',
          dateFormat: 'yyyy-MM-dd',
          mkdir: true,
          limit: { count: RETENTION },
        },
      },
    ],
  });

  return pino({ level: LEVEL, base: { component: name } }, transport);
}

module.exports = { build, LOG_DIR };
