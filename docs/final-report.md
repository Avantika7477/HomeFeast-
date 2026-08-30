# HomeFeast — Final report

**Project:** HomeFeast – Homemade Tiffin & Food Service Platform  
**Stack:** MERN (MongoDB, Express.js, React, Node.js)  
**Period:** 22 August 2026 – 15 September 2026  
**Repository:** https://github.com/Avantika7477/HomeFeast-

## 1. Executive summary

HomeFeast is a responsive web app that lets customers discover verified home cooks, view menus and meal plans, and request one-time orders or daily/weekly/monthly subscriptions. Cooks manage kitchens and accept or reject work. Admins approve cooks, watch activity, and close complaints. Online payments, maps, and mobile apps were left for a later phase so the core request–accept loop could ship.

## 2. Problem and objectives

Restaurant-first delivery is costly and poor for long-term homemade meals. HomeFeast digitizes discovery, subscriptions, and coordination that today happens on calls or WhatsApp.

Primary objectives met in v1: discovery, flexible plans, role-based dashboards, admin quality gate.  
Secondary: transparent prices/menus, multi-city via city + service area (not GPS).

## 3. What was built

### Customer

- Register / login
- Browse approved cooks; filter by city, cuisine, veg/non-veg, plan, max price
- Cook profile, menu, plans, ratings
- One-time order or subscription request (cash)
- Order and subscription history; review completed orders; raise complaints

### Home cook

- Profile (city, service areas, timings, cuisines)
- Menu and meal-plan CRUD
- Accept / reject orders and subscriptions
- Earnings totals on the dashboard

### Admin

- KPI snapshot
- Users and cook approval
- Order and subscription monitor
- Categories / cuisines
- Complaint resolve

## 4. Technical approach

Two-package MERN app. JWT + bcrypt. Public cook APIs filter `status: approved`. Orders and subscriptions are separate collections with the same pending/accept language. Vite proxies `/api` in development.

See [technical-docs.md](technical-docs.md) for routes and schemas.

## 5. Deployment

Deployment-ready: `client` production build, `server` `npm start`, Atlas + Render/Railway + Vercel/Netlify documented in [deployment.md](deployment.md).

**Completed in code:** notifications API, menu edit/availability, advanced KPIs, responsive UI.

**Still requires your hosting accounts:**

- Frontend:
- API:
- Health check:

## 6. Impact (expected)

Affordable homemade access, visibility for home cooks, less restaurant dependency, healthier weekday eating.

## 7. Future enhancements

Online payments and wallet, native apps, meal customization, nutrition tracking, AI recommendations, map-based GPS nearby search, image uploads.

## 8. Challenges faced

Copied from the living log [challenges-log.md](challenges-log.md) so the report stays complete if that file grows.

### Concurrent npm install lock

Two installs ran in `server/` at once. The second hit `TAR_ENTRY_ERROR` / `ENOTEMPTY`. The first finished after ~53 minutes and added 106 packages. Lesson: one npm per folder.

### Slow local shells on Windows

PowerShell wrappers took minutes to start. Node is installed (`v24.13.0`) but first `npm install` can look hung. Use `;` not `&` in PowerShell. Lesson: keep the source tree complete so a slow install is the only first-run blocker.

### Empty remote repository

The GitHub repo was empty on clone. We treated `D:\Homemade` as the working tree and built the MERN app locally, keeping `origin` as `https://github.com/Avantika7477/HomeFeast-.git`. Lesson: confirm clone warnings before assuming source exists.

### “Nearby” without maps

Requirements asked for nearby cooks; maps were out of budget. We used city + `serviceAreas[]` and search filters. Lesson: document the product meaning of “nearby” so it is not scored as a missing GPS feature.

### Role-based access on one SPA

Three roles share one React app. JWT in the browser is not trust. Every cook/admin mutation is checked on Express with `auth` + `allow(roles)`. Lesson: client guards are navigation, not security.

### Cook approval gate

New cooks must exist but stay invisible. `CookProfile.status` defaults to `pending`. List and detail endpoints require `approved`. Cooks can still edit menu while waiting. Lesson: approval is a query on every public endpoint.

### Orders vs subscriptions

One-time tiffins and recurring plans have different dates and renewals. Two collections, same accept/reject flow. Reviews attach only to completed orders. Lesson: do not force both into one document type.

### Split frontend/API deploy

Vite is static; Express is a process. CORS and `VITE_API_URL` / `CLIENT_URL` must match live origins. Lesson: treat env as part of the deliverable, not a last-hour surprise.

### Scope vs 15 September deadline

Payments, AI, native apps, and uploads were cut so the subscribe → accept → history loop stayed complete. Lesson: a working core is stronger for evaluation than half-finished extras.

## 9. Conclusion

HomeFeast v1 is a complete MERN tiffin platform for the stated in-scope features: discovery, subscriptions, cook operations, and admin control, with a written record of the engineering trade-offs made under a fixed timeline.
