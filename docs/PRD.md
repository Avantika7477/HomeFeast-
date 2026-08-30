# HomeFeast — Product Requirements Document

## 1. Problem

People living away from home struggle to find healthy, affordable, hygienic homemade food. Restaurant-first delivery apps are expensive, often unhealthy, and do not offer long-term tiffin subscriptions. Local home cooks stay invisible or coordinate only on WhatsApp.

## 2. Product

HomeFeast is a **web** platform that connects customers (students, professionals, elderly) with **verified home cooks** for daily, weekly, or monthly homemade meals.

## 3. Goals

### Primary

- Digitize tiffin discovery and subscription
- Make local home cooks easy to find
- Support flexible meal plans
- Improve food access for students and professionals

### Secondary

- Support small home-based kitchens
- Transparent menus and prices
- Multi-city expansion (city field + service areas)

## 4. Users

| Role | Job to be done |
| --- | --- |
| Customer | Find a cook, order or subscribe, track history, complain if needed |
| Home cook | Publish kitchen + menu, accept or reject work, see earnings |
| Admin | Approve cooks, watch orders, manage categories, close disputes |

## 5. In scope (v1)

- Responsive web app
- Listings, search, filters (meal type, price, plan, cuisine, city)
- Cook profile, menu, ratings
- One-time orders and subscriptions
- Cook accept/reject
- Admin dashboard
- Notifications for orders, subscriptions, cook approval, complaints

## 6. Out of scope (v1)

- Native mobile apps
- Online payments and wallet
- Google Maps / GPS radius
- AI meal recommendations
- Cloud kitchen integrations
- Nutrition / calorie tracking
- File uploads (image URLs only if used)

## 7. User flow

Visit → register/login → search/filter → view menu → choose plan or dishes → request → cook accepts → confirmation in history → optional review / complaint.

## 8. Success metrics (KPIs)

Admin overview shows: registered users, approved cooks, pending cooks, orders, active subscriptions, open complaints, order conversion rate, cook onboarding rate, monthly active users, and customer retention rate.

Future report metrics: conversion rate, cook onboarding rate, MAU, retention — need production traffic.

## 9. Assumptions and constraints

- Cooks provide hygienic food; admin approval is the quality gate.
- Users prefer subscriptions; v1 still supports one-time orders.
- Fixed timeline (15 Sep 2026), limited budget, web only.
- “Nearby” means same city / listed service area, not GPS.

## 10. Deliverables

- Functional MERN web app (`client` + `server`)
- Admin dashboard
- This PRD, technical docs, challenges log, final report
- Deployment-ready build (`client` `npm run build`, API `npm start`)
