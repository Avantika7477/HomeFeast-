# HomeFeast — Challenges Log

Living log. Add an entry the same day a problem blocks work. This file is copied into the final report.

---

## Template

- **Date / Phase:**
- **What went wrong:**
- **Why it was hard:**
- **How we fixed it:**
- **Lesson:**

---

## 2026-08-22 / Phase 0 — Empty remote repository

- **What went wrong:** GitHub repo `HomeFeast-` was created empty. Cloning produced only `.git` metadata, no source files.
- **Why it was hard:** Easy to assume the project already existed on GitHub. First `git status` also failed because the folder was not a repo until clone finished.
- **How we fixed it:** Cloned into `D:\Homemade`, then scaffolded the MERN app locally. Remote stays `https://github.com/Avantika7477/HomeFeast-.git`.
- **Lesson:** An empty remote is valid. Always confirm clone output (`warning: empty repository`) before planning features.

---

## 2026-08-22 / Phase 0 — “Nearby” without maps

- **What went wrong:** Requirements ask customers to browse nearby tiffin providers, but Google Maps / geolocation APIs are out of budget and out of Phase 1 scope.
- **Why it was hard:** “Nearby” usually implies coordinates and distance. Building that correctly needs maps keys, lat/lng, and extra UI.
- **How we fixed it:** Model location as `city` + `serviceAreas[]` on the cook profile. Customer search filters by city and cuisine instead of GPS radius.
- **Lesson:** Match the product word “nearby” to a constraint we can ship. Document the workaround so the report does not look like a missing feature.

---

## 2026-08-22 / Phase 1 — Role-based access on one SPA

- **What went wrong:** One React app must serve customer, cook, and admin without leaking dashboards or APIs.
- **Why it was hard:** JWT in `localStorage` is easy to tamper with on the client. UI hiding is not security.
- **How we fixed it:** Server middleware checks JWT and `role`. Cook routes require `cook`, admin routes require `admin`. Unapproved cooks cannot appear in public search. Client only uses the token to pick the landing page.
- **Lesson:** Protect every mutating API on the server. Client route guards are UX, not security.

---

## 2026-08-22 / Phase 2 — Cook approval gate

- **What went wrong:** New cooks must register but must not show up in browse until an admin approves them.
- **Why it was hard:** Easy to forget a query and list `pending` cooks, or let them add a public-looking menu.
- **How we fixed it:** `CookProfile.status` is `pending | approved | rejected`. Public list and detail only return `approved`. Cooks can still edit their own profile and menu while pending.
- **Lesson:** Approval is a query filter on every public endpoint, not only an admin screen.

---

## 2026-08-22 / Phase 3 — Orders vs subscriptions

- **What went wrong:** One-time tiffin orders and daily/weekly/monthly plans share a customer–cook relationship but have different lifecycles.
- **Why it was hard:** Stuffing both into one `orders` collection makes renewal and history messy. Two collections need a shared accept/reject flow.
- **How we fixed it:** `Order` for one-time meals. `Subscription` for plans (`daily | weekly | monthly`) with `startDate` / `endDate`. Both start as `pending` until the cook accepts or rejects. Reviews attach to completed orders.
- **Lesson:** Separate collections, same status language (`pending` / `accepted` / `rejected`) so cook dashboards stay simple.

---

## 2026-08-22 / Phase 5 — Split deploy (frontend + API)

- **What went wrong:** Vite client and Express API cannot live on one free static host. CORS and env URLs break if forgotten.
- **Why it was hard:** Locally both use localhost. In production the client origin and API origin differ.
- **How we fixed it:** `CLIENT_URL` on the server for CORS. `VITE_API_URL` on the client. Documented Vercel/Netlify + Render/Railway + MongoDB Atlas. Actual live URLs need the owner’s accounts.
- **Lesson:** Treat CORS and env as a first-class deploy task, not an afterthought.

---

## 2026-08-22 / Phase 0 — Slow local shells on Windows

- **What went wrong:** PowerShell wrappers in this environment took several minutes to start. `node -v` eventually printed `v24.13.0`, but `npm install` sat with no output for a long time.
- **Why it was hard:** Easy to think Node was missing or the install had crashed. Ampersand command chaining also fails in PowerShell.
- **How we fixed it:** Use separate PowerShell statements (`;` not `&`). Wait for Node to respond. Document that `npm install` in `server/` and `client/` is required before first run.
- **Lesson:** On a slow Windows host, treat first-time npm as a long step and keep source files ready so install is the only blocker.

---

## 2026-08-22 / Phase 0 — Concurrent npm install lock

- **What went wrong:** Two `npm install` runs in `server/` at once. Extract failed with `TAR_ENTRY_ERROR` and `ENOTEMPTY` on `node_modules`.
- **Why it was hard:** A slow PowerShell wrapper looked hung, so a second install was started. Both wrote the same tree.
- **How we fixed it:** Delete `server/node_modules` and run one install. Never start a second npm in the same folder.
- **Lesson:** On a slow machine, wait for the first npm to finish or fail before retrying. A “successful” install that raced another copy can still miss packages (`Cannot find module '../bson'`). Delete `node_modules` and install once more.

---

## 2026-08-22 / Timeline — Cut polish, keep the core loop

- **What went wrong:** Requirements include payments, maps, image uploads, AI, and native apps. Deadline is 15 September 2026.
- **Why it was hard:** Easy to start those extras and miss subscribe → accept → history.
- **How we fixed it:** v1 uses cash / pay-to-cook, image URLs (not file upload), city-based discovery, no payments. Those stay in Future Enhancements.
- **Lesson:** A working request–accept loop beats a half-built payment integration for a college/internship report.
