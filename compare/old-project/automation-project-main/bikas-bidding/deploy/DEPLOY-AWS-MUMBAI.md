# 🚀 Bikas Bidding — AWS Mumbai (ap-south-1) Deployment Guide

**Goal:** SAP ke Mumbai datacenter ke paas apna bot run karo → **40-60 ms latency saved**, competitor se pehle bid.

---

## 📋 Quick Overview

| Component        | Value                                    |
|------------------|------------------------------------------|
| Cloud            | AWS EC2                                  |
| Region           | **`ap-south-1` (Mumbai)** — CRITICAL     |
| Availability Zone| `ap-south-1a` or `1b` (whichever cheaper) |
| Instance Type    | **`t3.small`** (2 vCPU, 2 GB RAM)         |
| OS               | Ubuntu 24.04 LTS                          |
| Storage          | 20 GB gp3 SSD                             |
| Est. cost        | ~₹1,200-1,500 / month (24×7 uptime)      |
| Process Manager  | PM2 (auto-restart, log rotate)            |

**Kyun `t3.small`?** Bot single-threaded hai, RAM ~150 MB use karta hai, CPU spikes only during captcha OCR. `t3.small` `burstable` hai — idle mein credits build up, hot windows mein burst CPU milta hai. `t3.micro` (1 GB RAM) OCR ke liye tight ho jayegi. `t3.medium` overkill.

---

## STEP 1 — AWS EC2 Instance banao (15 min)

### 1.1 Login karo aur region set karo
1. https://console.aws.amazon.com pe login
2. **Top-right corner mein region change karo → "Asia Pacific (Mumbai) — ap-south-1"** ⚠️ Ye critical hai!

### 1.2 EC2 → Launch Instance
- **Name**: `bikas-bidding-bot`
- **AMI**: **Ubuntu Server 24.04 LTS (HVM), SSD Volume Type** — 64-bit (x86)
- **Instance type**: **`t3.small`**
- **Key pair**: `Create new key pair`
  - Name: `bikas-bidding-key`
  - Type: `RSA`, Format: `.pem`
  - **Download karke safe rakhna** — is key ke bina SSH nahi kar sakoge
- **Network settings** → Edit:
  - VPC: default rakho
  - Auto-assign public IP: **Enable**
  - Security group: `Create new`
    - Name: `bikas-bidding-sg`
    - **Rule 1**: SSH (port 22), Source: **My IP** (aapke ghar/office IP se)
    - `bidding.js` port 3000 sirf `localhost` bind hoga, no inbound needed
- **Storage**: 20 GiB, `gp3`
- **Advanced details** → User data (paste this — auto-installs everything on first boot):
```bash
#!/bin/bash
curl -fsSL https://raw.githubusercontent.com/nodesource/distributions/master/deb/setup_20.x | bash -
apt-get install -y nodejs git build-essential
npm install -g yarn pm2
```
- **Launch instance**

### 1.3 Elastic IP allocate karo (recommended)
Warna stop-start pe IP change ho jayegi. AWS Console → EC2 → Elastic IPs → Allocate → Associate with `bikas-bidding-bot` instance.

**Note aapki public IP** — Console mein instance select karo → "Public IPv4 address" — example: `13.234.XX.XX`

---

## STEP 2 — SSH Connect karo (5 min)

### From Windows (PowerShell)
```powershell
# .pem file ke saath permissions set karo
cd $HOME\Downloads
icacls bikas-bidding-key.pem /inheritance:r
icacls bikas-bidding-key.pem /grant:r "$env:USERNAME:(R)"

# SSH connect
ssh -i bikas-bidding-key.pem ubuntu@13.234.XX.XX
```

### From Mac/Linux
```bash
chmod 400 ~/Downloads/bikas-bidding-key.pem
ssh -i ~/Downloads/bikas-bidding-key.pem ubuntu@13.234.XX.XX
```

Pehli baar `yes` type karke fingerprint accept karo.

---

## STEP 3 — Test SAP latency (2 min)

Server pe login karke check karo Mumbai server se SAP tak kitna ping:
```bash
ping -c 5 rise.eye2serve.com
```
- Windows ghar se: ~40-80 ms typical
- AWS Mumbai se: **~10-30 ms** expected → yahi hai speed advantage!

---

## STEP 4 — Bot install karo (10 min)

### 4.1 Auto-installer chalao
Ek command se poora setup:
```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/bikas-bidding/main/deploy/install-server.sh | bash
```

**YA** manually clone karo:
```bash
cd ~
git clone https://github.com/YOUR_GITHUB_USERNAME/bikas-bidding.git
cd bikas-bidding
bash deploy/install-server.sh
```

Ye script karega:
- Node.js 20 + Yarn + PM2 install verify
- `yarn install` sab dependencies
- `.env.example` → `.env` copy
- Tesseract OCR system package install (`sudo apt install tesseract-ocr`)
- Log directory `logs/` create
- PM2 startup on boot enable

### 4.2 Config files fill karo
```bash
cd ~/bikas-bidding

# 1. Edit .env (SAP_BASE_URL, VENDOR_ID, PLANT_CODE)
nano .env

# 2. Paste cookie from SAP browser session
nano cookie.txt

# 3. TrueCaptcha creds (optional fallback for OCR)
nano creds.json

# 4. Bidding rules
nano files/input2.csv

# 5. Blacklisted customers
nano files/delete.csv

# 6. Priority COF Order IDs (bid FIRST)
nano files/priority.csv
```

**Windows se copy karne ke liye**:
- PowerShell: `scp -i bikas-bidding-key.pem C:\path\to\file ubuntu@13.234.XX.XX:~/bikas-bidding/files/`
- Ya WinSCP GUI tool use karo (recommended for beginners): https://winscp.net/

---

## STEP 5 — PM2 se bot chalao (2 min)

### 5.1 Ecosystem file se dono services start
```bash
cd ~/bikas-bidding
pm2 start ecosystem.config.cjs

# Verify running
pm2 status
```

Output aisa dikhega:
```
┌─────┬──────────────────┬─────────┬──────┬────────┬──────────┬────────┐
│ id  │ name             │ status  │ cpu  │ mem    │ uptime   │ ↺      │
├─────┼──────────────────┼─────────┼──────┼────────┼──────────┼────────┤
│ 0   │ bikas-solver     │ online  │ 0%   │ 60 MB  │ 5s       │ 0      │
│ 1   │ bikas-bid-engine │ online  │ 3%   │ 140 MB │ 3s       │ 0      │
└─────┴──────────────────┴─────────┴──────┴────────┴──────────┴────────┘
```

### 5.2 Auto-restart on reboot
```bash
pm2 startup  # follow the printed command
pm2 save
```

### 5.3 Live logs dekho
```bash
pm2 logs bikas-bid-engine       # bot log stream
pm2 logs bikas-bid-engine --lines 200   # last 200 lines
pm2 logs bikas-solver           # captcha solver log

# Rotating log files bhi hain
tail -f ~/bikas-bidding/logs/engine.log.$(date +%F).1
```

---

## STEP 6 — Common commands cheat sheet

| Task                             | Command                                     |
|----------------------------------|---------------------------------------------|
| Bot status                       | `pm2 status`                                |
| Live logs                        | `pm2 logs bikas-bid-engine`                 |
| Restart bot                      | `pm2 restart bikas-bid-engine`              |
| Stop bot                         | `pm2 stop bikas-bid-engine`                 |
| Stop everything                  | `pm2 stop all`                              |
| CPU/memory monitor               | `pm2 monit`                                 |
| Bot code update from Git         | `cd ~/bikas-bidding && git pull && pm2 restart all` |
| Cookie refresh (from local)      | `scp -i key.pem cookie.txt ubuntu@IP:~/bikas-bidding/cookie.txt && ssh ... "pm2 restart bikas-bid-engine"` |
| Full server reboot               | `sudo reboot` (PM2 auto-restarts everything) |

---

## STEP 7 — Cookie refresh workflow (aap ye rozana karoge)

SAP cookie ~24 ghante mein expire ho jaati hai. Refresh flow:
1. Windows PC pe SAP browser mein login karo
2. DevTools → Network → koi SAP API call dekhke `Cookie` header copy karo
3. Local mein `cookie.txt` mein paste karo
4. Server pe upload + restart:
   ```powershell
   scp -i bikas-bidding-key.pem cookie.txt ubuntu@13.234.XX.XX:~/bikas-bidding/cookie.txt
   ssh -i bikas-bidding-key.pem ubuntu@13.234.XX.XX "cd ~/bikas-bidding && pm2 restart bikas-bid-engine"
   ```

**Automation tip**: 1 script bana lo `refresh-cookie.ps1` (Windows) jo dono steps ek saath karega.

---

## 🎯 Expected Speed Improvement

| Metric                          | Windows Home (Kolkata) | AWS Mumbai       |
|---------------------------------|-------------------------|-------------------|
| Ping to SAP                     | 40-80 ms                | **10-30 ms**      |
| BidOrderListSet fetch RTT       | 200-400 ms              | **60-120 ms**     |
| EBiddingSaveSet submit RTT      | 250-400 ms              | **80-150 ms**     |
| Total submit latency at :15/:45 | ~3000 ms (with captcha) | **~200 ms** (with v3.27 fast-path) |
| Rank-1 probability              | Baseline                | **2-3× better**   |

**Combined with v3.27 CAPTCHA-FREE fast-path** (jo mine implement kiya) → sabse fast possible setup. Aap ke opponent ke against real advantage.

---

## 🚨 Troubleshooting

**Problem**: Bot start hote hi crash
- Check: `pm2 logs bikas-bid-engine --lines 50`
- Common: missing `.env` fields → `nano .env` to fill

**Problem**: `Cannot find module 'tesseract.js'`
- Fix: `cd ~/bikas-bidding && yarn install --force`

**Problem**: Captcha solving fails
- Verify tesseract installed: `tesseract --version`
- Reinstall: `sudo apt install --reinstall tesseract-ocr tesseract-ocr-eng`

**Problem**: SAP returns 403 COOKIE EXPIRED
- Follow Step 7 above (cookie refresh)

**Problem**: PM2 doesn't auto-restart on reboot
- Re-run: `pm2 startup` then follow instructions, then `pm2 save`

---

## 💰 Cost Optimization

- **Reserved instance** (1-year commit): ~30% cheaper → ~₹850/month
- **Savings plan**: ~20% cheaper
- **Spot instance**: 70% cheaper BUT can be reclaimed by AWS anytime → **NOT recommended** for critical bidding

Recommended: On-demand `t3.small` for first month, then switch to 1-year reserved.

---

## 🔐 Security Best Practices

1. **Security Group**: SSH port 22 restricted to your home IP only (already done in Step 1)
2. **Fail2ban** for extra brute-force protection:
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable --now fail2ban
   ```
3. **Cookie backup**: Server pe `cookie.txt` ~24h mein delete kar do (via cron), so leak nahi ho
4. **Never commit** `.env`, `cookie.txt`, `creds.json` to Git (already in `.gitignore`)

---

## 📞 Final Sanity Check

Ye 3 commands chalake confirm karo sab kaam kar raha hai:
```bash
# 1. Node.js version
node --version                    # v20.x expected

# 2. Bot running
pm2 status | grep bikas-bid-engine    # "online"

# 3. Bot fetching orders
pm2 logs bikas-bid-engine --lines 5 --nostream | grep -E "Scan #|matched"
```

Sab OK ho gaya to next `:15` / `:45` window pe bidding automatic ho jayega.

**Aaj hi setup karo aur kal `:15`/`:45` window pe test karo — rank ka bahut bada difference dikhega!** 🚀
