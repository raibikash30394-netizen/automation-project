module.exports = {
  apps: [{
    name: 'ebidding',
    script: 'runner.js',
    cwd: __dirname,
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,                 // runner.js khud CSV watch karta hai
    max_memory_restart: '500M',
    kill_timeout: 8000,
    restart_delay: 3000,
    max_restarts: 100000,
    out_file: './logs/pm2-out.log',
    error_file: './logs/pm2-err.log',
    merge_logs: true,
    time: true,
    env: {
      NODE_ENV: 'production',
      LOOP_CONTINUOUS: 'true'
    }
  }]
};
