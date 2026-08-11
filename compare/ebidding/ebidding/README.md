# E-Bidding 24x7 Automation

SAP e-bidding script ko **24×7 continuous** chalane ke liye clean wrapper +
**live CSV reload** support (script chalte hue CSV edit karo, wrapper worker
ko safely restart karke naya data pick karta hai).

## Kya naya hai

- `runner.js` — supervisor jo:
  - Worker (`ebidding-secure.js`) ko continuously chalata hai
  - Crash / clean exit dono par auto-restart (exponential backoff)
  - `files/*.csv` ko watch karta hai; edit hone par debounce ke baad worker ko
    SIGTERM → naya worker start (fresh CSV load)
  - Logs `logs/runner.log` + PM2 mein bhi
- `ecosystem.config.js` — PM2 config (VM par boot pe auto-start)
- `ebidding.service` — Systemd alternative (PM2 nahi chahiye toh)
- `.env` — updated with `LOOP_CONTINUOUS=true` and tuning knobs

## Folder structure

```
ebidding/
├── runner.js               ← 24x7 supervisor (isko chalao)
├── ebidding-secure.js      ← original worker (touch mat karo)
├── ecosystem.config.js     ← PM2 config
├── ebidding.service        ← systemd unit
├── .env                    ← config
├── files/                  ← CSV files (live-editable)
│   ├── input2.csv
│   └── delete.csv
├── logs/                   ← runner + PM2 logs
└── package.json
```

## Local test (Emergent pod / laptop)

```bash
cd /app/ebidding
yarn install                # already done
yarn start                  # runner start hoga
```

Ab dusre terminal se koi CSV edit karo:
```bash
echo "TESTCITY,1164,500" >> files/input2.csv
```
Runner debounce (1.5s) ke baad worker ko restart karega aur naye data se
bidding continue karega.

Rukna ho toh `Ctrl+C` — runner + worker dono cleanly band ho jayenge.

---

## VM par 24x7 deploy — 2 options

### Option A: PM2 (recommended, easy)

```bash
# 1. Node install (agar nahi hai)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Code copy karo VM par
scp -r ebidding/ user@your-vm:~/

# 3. VM par
cd ~/ebidding
npm install -g pm2
yarn install                        # ya: npm install
pm2 start ecosystem.config.js       # start
pm2 save                            # save process list
pm2 startup                         # print karega ek command — usko run karo
                                    # (systemd me register ho jayega)
```

Useful PM2 commands:
```bash
pm2 status                 # running status
pm2 logs ebidding          # live logs
pm2 logs ebidding --lines 200
pm2 restart ebidding       # manual restart
pm2 stop ebidding          # stop
pm2 delete ebidding        # PM2 se remove
pm2 monit                  # live dashboard
```

Reboot ke baad automatic start ho jayega.

### Option B: systemd (PM2 ke bina)

```bash
# VM par (assume code /home/ubuntu/ebidding me hai)
sudo cp ebidding.service /etc/systemd/system/ebidding.service
# service file mein User= aur WorkingDirectory= edit kar lo apne path ke hisaab se
sudo systemctl daemon-reload
sudo systemctl enable ebidding      # boot par start
sudo systemctl start ebidding
sudo systemctl status ebidding
journalctl -u ebidding -f           # live logs
```

---

## Live CSV editing — kaise kaam karta hai

1. Runner startup pe har CSV ka SHA1 hash yaad rakhta hai.
2. `fs.watch` `files/` folder ko monitor karta hai.
3. Editor jab CSV save karta hai, event trigger hota hai.
4. **1.5s debounce** (config: `CSV_DEBOUNCE_MS`) — multiple writes ek baar
   handle honge.
5. Debounce ke baad content-hash compare hota hai. Agar sach me change hai,
   worker ko `SIGTERM` bhejta hai.
6. Worker exit → 500ms me naya worker start hota hai → fresh CSV load.
7. Agar sirf `mtime` badla (content same), koi restart nahi.

> Note: Restart ke waqt SAP ka current bid iteration abort hoga. Beech-batch
> mein edit karoge to us batch ke baaki items skip hoke naya loop shuru hoga.
> Isliye best practice: **batch complete hone ke thoda gap me edit karo**.

---

## Config knobs (`.env`)

| Variable            | Default | Kaam                                          |
|---------------------|---------|-----------------------------------------------|
| `LOOP_CONTINUOUS`   | `true`  | Worker khud loop me chale                     |
| `MIN_RESTART_MS`    | 2000    | First restart delay after crash               |
| `MAX_RESTART_MS`    | 30000   | Max backoff cap                               |
| `CSV_DEBOUNCE_MS`   | 1500    | CSV edit ke baad kitna wait                   |
| `KILL_GRACE_MS`     | 5000    | SIGTERM ke baad SIGKILL kab                   |
| `CSV_BATCH_SIZE`    | 3       | Original worker ka batch size                 |
| `AUTO_UPDATE_CSV_BIDS` | true | SAP reject hone par CSV auto-fix              |
| `DRY_RUN`           | false   | Test mode (no actual bidding)                 |

---

## Troubleshoot

- **Runner start hi nahi hota** → `node -v` (>= 18 chahiye), `yarn install` phir se.
- **Worker crash loop** → `logs/runner.log` dekho. SAP credentials `.env` mein sahi hain?
- **CSV edit pe restart nahi ho raha** → check karo file `files/` folder ke andar hi hai (root pe nahi). `logs/runner.log` mein "CSV changed" line dekho.
- **PM2 auto-start after reboot** → `pm2 save` + `pm2 startup` (jo command print kare wahi run karo).
