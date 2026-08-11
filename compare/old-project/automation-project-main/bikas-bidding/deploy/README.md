# deploy/ — AWS Mumbai Deployment Toolkit

Files:

| File                       | Purpose                                                    |
|----------------------------|------------------------------------------------------------|
| `DEPLOY-AWS-MUMBAI.md`     | 📖 **Complete step-by-step guide** — read this FIRST      |
| `install-server.sh`        | One-shot Ubuntu bootstrap (run on server via SSH)          |
| `refresh-cookie.ps1`       | Windows helper to upload fresh cookie + restart bot        |
| `../ecosystem.config.cjs`  | PM2 config for both `bidding.js` + `bid-engine.js`         |

## Quick Start

1. Read `DEPLOY-AWS-MUMBAI.md` fully (10 min).
2. Launch EC2 `t3.small` in `ap-south-1` (Mumbai).
3. SSH into server, clone repo, run `bash deploy/install-server.sh`.
4. Fill config files (`.env`, `cookie.txt`, `files/*.csv`).
5. Start: `pm2 start ecosystem.config.cjs`
6. Monitor: `pm2 logs bikas-bid-engine`

## Cookie Refresh (daily)

From Windows PC after refreshing SAP browser session:
```powershell
.\deploy\refresh-cookie.ps1
```

## Support

Issues? Check `pm2 logs bikas-bid-engine --lines 100` first.
