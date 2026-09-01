# HomeFeast — Technical documentation

## Architecture

```
React (Vite, port 5173)
    REST JSON + JWT
Express (port 5000)
    Mongoose
MongoDB
```

- Locally the Vite dev server proxies `/api` to `http://localhost:5000`.
- In production set `VITE_API_URL` (client) and `CLIENT_URL` (server CORS).

## Repository layout

| Path | Role |
| --- | --- |
| `client/` | React UI, Tailwind, React Router |
| `server/src/index.js` | Express app + health check |
| `server/src/models/` | Mongoose schemas |
| `server/src/routes/` | REST routers |
| `server/src/middleware/auth.js` | JWT + role guard |
| `server/src/seed.js` | Demo data |

## Auth

- Register: `customer` or `cook` only. Admin is created by seed (or direct DB).
- Passwords hashed with bcrypt.
- JWT (`Authorization: Bearer <token>`), 7-day expiry.
- Cooks get a `CookProfile` with `status: pending` on register.

## Collections

- **User** — name, email, password, role, city, address
- **CookProfile** — kitchen, city, serviceAreas, cuisines, timings, status, ratings
- **MenuItem** — dish, veg/non-veg, price, availability
- **MealPlan** — daily / weekly / monthly price per cook
- **Order** — one-time request, status pending → accepted/rejected/completed
- **Subscription** — plan request, pending → active/rejected
- **Review** — one per completed order; updates cook averages
- **Category** — cuisine or menu label
- **Complaint** — open / in-progress / resolved

## REST map

| Method | Path | Who |
| --- | --- | --- |
| GET | `/api/health` | public |
| POST | `/api/auth/register` `/login` | public |
| GET/PATCH | `/api/auth/me` | any logged-in |
| GET | `/api/cooks` `/api/cooks/:id` | public (approved only) |
| GET/PUT | `/api/cooks/me` | cook |
| CRUD | `/api/menus/items` `/plans` | cook |
| POST/GET | `/api/orders` | customer / cook |
| POST/GET | `/api/subscriptions` | customer / cook |
| POST | `/api/reviews` | customer |
| GET/POST | `/api/categories` | public get, admin write |
| POST/GET/PATCH | `/api/complaints` | user / admin |
| GET/PATCH | `/api/notifications` | logged-in user |
| GET/PATCH | `/api/admin/*` | admin |

Public cook list **always** filters `status: approved`.

## Environment

### Server (`server/.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/Homemade
JWT_SECRET=long-random-string
CLIENT_URL=http://localhost:5173
```

### Client

Leave `VITE_API_URL` empty in local dev (proxy). For production:

```
VITE_API_URL=https://your-api.example.com
```

## Security notes

- Role checks run on the server. Client route guards are UX only.
- Do not commit production `.env` or JWT secrets.
- HTTPS should be enabled on the host.

## Performance

- List pages are small document queries with indexes on email and cook+plan uniqueness.
- Target: under 3 seconds on typical pages. Avoid huge images; v1 uses text/menus.

## How to extend

1. Payments: add a `payments` collection and a provider webhook; keep cash as fallback.
2. Maps: store `lat`/`lng` on cooks and filter by distance.
3. Images: add object storage; keep `imageUrl` field as-is.
