# Deploy HomeFeast — step by step

Use this guide after local dev works (`npm run dev` in `server/` and `client/`).

**Order:** Atlas (done) → API on Render → Client on Vercel → update CORS → seed → test.

---

## 1. MongoDB Atlas (you already have this)

- Cluster: `cluster0.nujg9kg.mongodb.net`
- Database: **`Homemade`**
- User: `Homemade_db_users`
- Network: IP `0.0.0.0/0` allowed (OK for demo)

**Production `MONGO_URI` (try SRV first on Render — it usually works in the cloud):**

```
mongodb+srv://Homemade_db_users:YOUR_PASSWORD@cluster0.nujg9kg.mongodb.net/Homemade?retryWrites=true&w=majority&appName=Cluster0
```

If SRV fails on Render, use direct connection to primary shard:

```
mongodb://Homemade_db_users:YOUR_PASSWORD@ac-pbexo93-shard-00-01.nujg9kg.mongodb.net:27017/Homemade?ssl=true&authSource=admin&directConnection=true&retryWrites=true&w=majority
```

Never commit passwords. Set only in Render’s environment dashboard.

---

## 2. API — Render (free tier)

1. Go to [render.com](https://render.com) → **Sign up** (GitHub login is easiest).
2. **New +** → **Blueprint** → connect repo `Avantika7477/HomeFeast-`.
3. Render reads `render.yaml` at repo root (`rootDir: server`).
4. Set environment variables when prompted:

| Key | Value |
|-----|--------|
| `MONGO_URI` | Atlas URI above (with your password) |
| `JWT_SECRET` | Long random string (e.g. run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `CLIENT_URL` | `https://YOUR-APP.vercel.app` (set after step 3, or use a placeholder and update later) |

5. **Deploy**. Wait until status is **Live**.
6. Copy your API URL, e.g. `https://homefeast-api.onrender.com`.
7. Test: open `https://YOUR-API.onrender.com/api/health` — should return `{"ok":true,...}`.

### Seed production database (once)

Render dashboard → your service → **Shell** tab:

```bash
npm run seed
```

You should see `Seed complete` and demo accounts.

---

## 3. Client — Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → **Sign up** with GitHub.
2. **Add New** → **Project** → import `HomeFeast-`.
3. **Root Directory:** `client` (important).
4. Framework: Vite (auto-detected). Build: `npm run build`, Output: `dist`.
5. **Environment variables:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-API.onrender.com` (no trailing slash) |

6. **Deploy**. Copy the live URL, e.g. `https://homefeast.vercel.app`.

---

## 4. Fix CORS (if you used a placeholder)

Back on Render → **Environment** → set:

```
CLIENT_URL=https://homefeast.vercel.app
```

(Use your real Vercel URL.) Save → **Manual Deploy** → redeploy.

For preview URLs too, comma-separate:

```
CLIENT_URL=https://homefeast.vercel.app,https://homefeast-git-main-username.vercel.app
```

---

## 5. Smoke test

| Check | How |
|-------|-----|
| Health | `GET https://YOUR-API.onrender.com/api/health` |
| Home page | Open Vercel URL |
| Login | `student@homefeast.com` / `Demo@123` |
| Browse cooks | Should list Sunita, Rafiq, Lakshmi |
| Admin | `admin@homefeast.com` / `Demo@123` |

---

## 6. Update final report

Paste live URLs into `docs/final-report.md` section 5:

- Frontend: `https://...`
- API: `https://...`
- Health: `https://.../api/health`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot reach the API` on site | Check `VITE_API_URL` on Vercel; redeploy client after changing it |
| CORS error in browser | `CLIENT_URL` on Render must exactly match Vercel origin (https, no trailing slash) |
| API 503 / slow first load | Render free tier sleeps; first request wakes it (~30s) |
| MongoDB connection failed | Try SRV URI first; fallback to `directConnection` shard-01 URI |
| Empty browse page | Run `npm run seed` in Render Shell |

---

## Alternative hosts

- **API:** Railway — same env vars, root `server/`, start `npm start`.
- **Client:** Netlify — root `client/`, `netlify.toml` included, set `VITE_API_URL` in Netlify env.
