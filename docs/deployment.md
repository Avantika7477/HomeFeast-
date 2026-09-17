# Deployment (Phase 5)

HomeFeast is two apps plus a database. A static host cannot run Express.

**Quick start:** see **[deploy-step-by-step.md](deploy-step-by-step.md)** for copy-paste instructions (Render + Vercel + Atlas).

## 1. Database — MongoDB Atlas

1. Create a free cluster.
2. Add a database user and allow the host IP (or `0.0.0.0/0` for a demo, then tighten).
3. Copy the connection string into `MONGO_URI`.

## 2. API — Render or Railway

Suggested service: **Web service**, Node, root `server/`.

- Build: `npm install`
- Start: `npm start`
- Env: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel/Netlify URL), `PORT` (platform sets this)

**Security:** set a long random `JWT_SECRET` in production (never reuse the local/dev value). Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

After first deploy, run seed from a one-off shell: `npm run seed`.

`render.yaml` in the repo is a starting blueprint.

## 3. Client — Vercel or Netlify

- Root directory: `client`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://your-api.onrender.com` (no trailing slash)

SPA fallback: all routes → `index.html` (Vite default on Vercel). Netlify `_redirects` is included.

## 4. CORS

`CLIENT_URL` must match the live frontend origin. Comma-separate if you have a preview URL too.

## 5. Checklist

- [ ] Atlas URI works
- [ ] Seed run once
- [ ] Login with `admin@homefeast.com` / `Demo@123`
- [ ] Browse shows only approved cooks
- [ ] Customer can request; cook can accept
- [ ] Health: `GET /api/health`
- [ ] Notifications bell shows order/subscription updates
- [ ] Cook can edit menu and toggle availability
- [ ] Admin KPI page shows conversion, MAU, retention

**Live (current):**

- Frontend: https://home-feast-sigma.vercel.app
- API: https://homefeast-hqmf.onrender.com
- Health: https://homefeast-hqmf.onrender.com/api/health
