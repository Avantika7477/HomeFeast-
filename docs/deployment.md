# Deployment (Phase 5)

HomeFeast is two apps plus a database. A static host cannot run Express.

## 1. Database — MongoDB Atlas

1. Create a free cluster.
2. Add a database user and allow the host IP (or `0.0.0.0/0` for a demo, then tighten).
3. Copy the connection string into `MONGO_URI`.

## 2. API — Render or Railway

Suggested service: **Web service**, Node, root `server/`.

- Build: `npm install`
- Start: `npm start`
- Env: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel/Netlify URL), `PORT` (platform sets this)

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

Live URLs depend on the project owner’s accounts. After deploy, paste them at the top of `docs/final-report.md`.
