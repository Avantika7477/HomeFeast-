# HomeFeast

Web platform that connects students, working professionals, and others with verified home cooks for daily, weekly, or monthly homemade tiffin.

**Stack:** MongoDB · Express.js · React (Vite) · Node.js  
**Deadline target:** 15 September 2026  
**Repo:** https://github.com/Avantika7477/HomeFeast-

## Local setup

1. Install [Node.js 18+](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) (or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
2. **Start MongoDB** (required — or the API will show `ECONNREFUSED 127.0.0.1:27017`):
   - Open **Services** (`Win + R` → `services.msc`) → **MongoDB Server** → **Start**
   - Or **Administrator** PowerShell: `net start MongoDB`
3. From the repo root:

```bash
cd server
copy .env.example .env
npm install
npm run seed
npm run dev
```

In a second terminal:

```bash
cd client
npm install
npm run dev
```

3. Open http://localhost:5173

### Atlas connection error `querySrv ECONNREFUSED`

Use the **standard** `mongodb://` URI in `server/.env` (not `mongodb+srv://`).  
In Atlas: **Connect → Drivers →** copy the standard connection string for database `Homemade`.

Run server and seed as **two separate commands** (do not use `>>`):

```bash
npm run dev
# new terminal:
npm run seed
```

### Demo accounts (after seed)

Password for all: `Demo@123`

| Role | Email |
| --- | --- |
| Admin | admin@homefeast.com |
| Customer | student@homefeast.com |
| Cook (approved, Pune) | sunita@homefeast.com |
| Cook (pending) | pending@homefeast.com |

## What v1 includes

- Customer register/login, browse + filters, order or subscribe, history, reviews, complaints
- Cook profile, menu, meal plans, accept/reject, earnings
- Admin KPIs, user/cook management, categories, order/subscription monitor, dispute resolve
- Cash / pay-to-cook only (no online payments)

## Docs

- [docs/PRD.md](docs/PRD.md)
- [docs/technical-docs.md](docs/technical-docs.md)
- [docs/challenges-log.md](docs/challenges-log.md)
- [docs/final-report.md](docs/final-report.md)
- [docs/deployment.md](docs/deployment.md)
- [docs/deploy-step-by-step.md](docs/deploy-step-by-step.md) — **start here to go live**

## Deploy (production)

Code and builds are ready. Follow **[docs/deploy-step-by-step.md](docs/deploy-step-by-step.md)**:

1. **Render** — deploy `server/` (uses `render.yaml`)
2. **Vercel** — deploy `client/` with `VITE_API_URL`
3. Set `CLIENT_URL` on Render for CORS
4. Run `npm run seed` once in Render Shell

Verify: `npm run build` in `client/` succeeds locally before deploying.

## Scripts

| Where | Command | What it does |
| --- | --- | --- |
| `server` | `npm run dev` | API on port 5000 |
| `server` | `npm run seed` | Demo cities, cooks, menus |
| `client` | `npm run dev` | Vite on port 5173 |
| `client` | `npm run build` | Production client build |
