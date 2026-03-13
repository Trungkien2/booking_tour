# Project Status Summary

> Last updated: 2026-03-13

## Tech Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Backend  | NestJS 10, Prisma 6, PostgreSQL, Passport.js (JWT) |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Zustand      |
| Build    | Turborepo, pnpm workspaces                         |
| Testing  | Jest (backend)                                     |

---

## Feature Status Overview

| #   | Screen               | Route                         | Status      | Progress                                       |
| --- | -------------------- | ----------------------------- | ----------- | ---------------------------------------------- |
| 1   | Login                | `/login`                      | Done        | 15/15 tasks                                    |
| 2   | Register             | `/register`                   | Done        | UI complete                                    |
| 3   | Tours Overview       | `/`, `/tours`                 | Done        | Hero, search, filters, grid, pagination        |
| 4   | Tour Detail          | `/tours/[slug]`               | Done        | Gallery, itinerary, reviews, booking card      |
| 5   | User Profile         | `/profile`                    | Done        | 5 tabs (personal, bookings, favorites, notifications, security) |
| 6   | Admin Tours          | `/admin/tours`                | Done        | Full CRUD, statistics, filters                 |
| 7   | Admin Dashboard      | `/admin`                      | Partial     | UI placeholder, stats chưa kết nối API         |
| 8   | Admin Users          | `/admin/users`                | Done        | CRUD, role/status management, search, filters  |
| 9   | Admin Reviews        | `/admin/reviews`              | Not Started | Backend + frontend chưa implement              |
| 10  | Admin Reports        | `/admin/reports`              | Not Started | Backend + frontend chưa implement              |
| 11  | Admin Bookings       | `/admin/bookings`             | Partial     | Backend done, frontend "Coming Soon" stub      |
| 12  | My Bookings          | `/bookings`                   | Done        | Tabs, search, sort, cancel with preview        |
| 13  | Booking Detail       | `/bookings/[id]`              | Done        | Tour info, travelers, payment history          |
| 14  | Booking Payment      | `/bookings/[id]/pay`          | Done        | Auto-redirect to Stripe checkout               |
| 15  | Booking Processing   | `/bookings/processing`        | Done        | Polling, auto-redirect on success              |
| 16  | Booking Confirmation | `/bookings/[id]/confirmation` | Done        | Summary, next steps, support info              |
| 17  | Admin Login          | `/admin/login`                | Done        | Branded admin login form                       |
| 18  | Contact              | `/contact`                    | Done        | Form, contact methods, social links            |
| 19  | About                | `/about`                      | Done        | Company story, team, stats                     |
| 20  | FAQ & Support        | `/faq`                        | Not Started | Chưa implement                                 |

**Summary: 14 Done | 2 Partial | 3 Not Started**

---

## Backend Modules

| Module         | Path                   | Endpoints                                                         | Status      |
| -------------- | ---------------------- | ----------------------------------------------------------------- | ----------- |
| Auth           | `modules/auth/`        | login, register, refresh, check-email (OAuth stubbed)             | Done        |
| Countries      | `modules/countries/`   | GET /countries (hardcoded 20 nước)                                | Done        |
| Tours (Admin)  | `modules/tours/`       | CRUD /api/admin/tours, statistics                                 | Done        |
| Tours (Public) | `modules/tours/`       | GET /tours, /featured, /suggestions, /tours/:slug, reviews        | Done        |
| Users          | `modules/users/`       | profile, avatar, password, preferences, login history, admin CRUD | Done        |
| Favorites      | `modules/favorites/`   | GET/POST/DELETE /favorites, status check                          | Done        |
| Bookings       | `modules/bookings/`    | create, list, detail, cancel, admin CRUD, pricing, cancellation   | Done        |
| Payments       | `modules/payments/`    | create payment, verify, Stripe webhook, refund                    | Done        |
| Inventory      | `modules/inventory/`   | reserve/release stock, check availability (optimistic locking)    | Done        |
| Scheduler      | `modules/scheduler/`   | Cron: expire pending bookings (1min), close past schedules (daily)| Done        |
| Reviews        | -                      | -                                                                 | Not Started |

---

## Database Schema (Prisma)

### Models implemented:

- `User` (with profile fields: avatar, bio, preferences, emailVerified, soft delete)
- `Tour` (with slug, images, difficulty, featured, soft delete)
- `TourSchedule` (with optimistic locking via version)
- `Booking`, `BookingTraveler` (price snapshots)
- `Payment`, `Refund`
- `Review`
- `LoginHistory` (IP, user agent tracking)
- `UserFavorite` (user-tour relation)

### Key patterns:

- **Optimistic locking**: `TourSchedule.version` for race condition prevention
- **Price snapshots**: `BookingTraveler.price` stores price at booking time
- **Soft delete**: `Tour.deletedAt`, `User.deletedAt` instead of physical deletion
- **Business rules**: Min 1 adult, 15-min booking TTL, 24h cutoff, auto SOLD_OUT

---

## Frontend Structure

```
apps/web/app/
├── (site)/
│   ├── layout.tsx                    (SiteHeader + SiteFooter)
│   ├── page.tsx                      (Homepage - hero, search, tour grid)
│   ├── tours/page.tsx                (Tours browsing with filters)
│   ├── tours/[slug]/page.tsx         (Tour detail - gallery, booking card)
│   ├── profile/page.tsx              (User profile - 5 tabs)
│   ├── bookings/page.tsx             (My Bookings - tabs, cancel)
│   ├── bookings/processing/page.tsx  (Payment polling)
│   ├── bookings/[id]/page.tsx        (Booking detail)
│   ├── bookings/[id]/pay/page.tsx    (Stripe redirect)
│   ├── bookings/[id]/confirmation/page.tsx (Success page)
│   ├── contact/page.tsx              (Contact form + info)
│   ├── about/page.tsx                (Company info + team)
│   └── (auth)/
│       ├── login/page.tsx            (Login form + hero)
│       └── register/page.tsx         (Registration form)
├── admin/
│   ├── layout.tsx                    (Admin layout + guard)
│   ├── page.tsx                      (Dashboard - placeholder stats)
│   ├── login/page.tsx                (Admin login)
│   ├── tours/page.tsx                (Tour management - full CRUD)
│   ├── tours/new/page.tsx            (Create tour)
│   ├── bookings/page.tsx             (Coming Soon stub)
│   ├── users/page.tsx                (User management - full CRUD)
│   └── users/[id]/page.tsx           (User detail)
```

### Shared patterns:

- Forms: `react-hook-form` + `zod` validation
- State: `zustand` (auth store with persist)
- API: fetch-based clients in `lib/api/`
- Tokens: localStorage (`access_token`, `refresh_token`)

---

## Implementation Priority

### Phase A - Core User Journey ~~(High Priority)~~ **DONE**

1. ~~**Tour Detail** (`/tours/[slug]`) - View tour info, schedules, reviews~~ **Done**
2. ~~**Booking Processing** - Select schedule, add travelers, payment~~ **Done**
3. ~~**Booking Confirmation** - Success page after payment~~ **Done**
4. ~~**My Bookings** (`/bookings`) - User booking history~~ **Done**

### Phase B - Completion & Polish **DONE**

5. ~~Register - UI complete~~ **Done**
6. ~~Tours Overview - Filters, pagination, search~~ **Done**
7. ~~Admin Tours - Full CRUD~~ **Done**

### Phase C - Admin Panel (In Progress)

8. ~~Admin Users - Full CRUD with role/status management~~ **Done**
9. Admin Dashboard - Kết nối API lấy stats thật
10. Admin Bookings - Frontend implementation (backend API ready)
11. Admin Reviews - Backend service + frontend (DB model exists)
12. Admin Reports - Backend + frontend

### Phase D - Nice-to-have

13. FAQ & Support page
14. OAuth login (Google, Facebook) - backend stubbed
15. Image upload (hiện dùng URL)
16. Countries module - chuyển sang DB-backed
17. Testing (unit tests, e2e coverage)
