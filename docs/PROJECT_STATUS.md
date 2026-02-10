# Project Status Summary

> Last updated: 2026-02-10

## Tech Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Backend  | NestJS 10, Prisma 6, PostgreSQL, Passport.js (JWT) |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Zustand      |
| Build    | Turborepo, pnpm workspaces                         |
| Testing  | Jest (backend)                                     |

---

## Feature Status Overview

| #   | Screen               | Route              | Status      | Progress                                |
| --- | -------------------- | ------------------ | ----------- | --------------------------------------- |
| 1   | Login                | `/login`           | Done        | 15/15 tasks                             |
| 2   | Register             | `/register`        | Partial     | 30/36 tasks (thiếu tests)               |
| 3   | Tours Overview       | `/`, `/tours`      | Partial     | 48/61 tasks (thiếu QA)                  |
| 4   | Tour Detail          | `/tours/[slug]`    | Done        | All phases complete (manual QA pending) |
| 5   | User Profile         | `/profile`         | Done        | All phases complete                     |
| 6   | Admin Tours          | `/admin/tours`     | Partial     | Thiếu QA cuối                           |
| 7   | Admin Dashboard      | `/admin`           | Not Started | Chỉ có design docs                      |
| 8   | Admin Users          | `/admin/users`     | Not Started | Chỉ có README                           |
| 9   | Admin Reviews        | `/admin/reviews`   | Not Started | Chỉ có README                           |
| 10  | Admin Reports        | `/admin/reports`   | Not Started | Chỉ có README                           |
| 11  | Admin Bookings       | `/admin/bookings`  | Partial     | Backend done, frontend not started      |
| 12  | My Bookings          | `/bookings`        | Done        | Backend + Frontend complete             |
| 13  | Booking Processing   | `/bookings/processing` | Done    | Backend + Frontend complete             |
| 14  | Booking Confirmation | `/bookings/[id]/confirmation` | Done | Backend + Frontend complete          |
| 15  | FAQ & Support        | `/faq`             | Not Started | Chỉ có README                           |

**Summary: 6 Done | 4 Partial | 5 Not Started**

---

## Backend Modules

| Module         | Path                 | Endpoints                                                | Status      |
| -------------- | -------------------- | -------------------------------------------------------- | ----------- |
| Auth           | `modules/auth/`      | login, register, refresh, check-email, send-verification | Done        |
| Countries      | `modules/countries/` | GET /countries                                           | Done        |
| Tours (Admin)  | `modules/tours/`     | CRUD /api/admin/tours, statistics                        | Done        |
| Tours (Public) | `modules/tours/`     | GET /tours, /featured, /suggestions                      | Done        |
| Users          | `modules/users/`     | GET/PATCH /users/me, avatar, password                    | Done        |
| Favorites      | `modules/favorites/` | GET/POST/DELETE /favorites, status check                 | Done        |
| Bookings       | `modules/bookings/`  | POST /bookings, GET /me, GET /:id, status, cancel, admin CRUD | Done |
| Payments       | `modules/payments/`  | POST /:id/payment, verify, Stripe webhook                | Done        |
| Reviews        | -                    | -                                                        | Not Started |

---

## Database Schema (Prisma)

### Models implemented:

- `User` (with profile fields: avatar, bio, preferences, emailVerified)
- `Tour` (with slug, images, difficulty, featured, soft delete)
- `TourSchedule` (with optimistic locking via version)
- `Booking`, `BookingTraveler`
- `Payment`, `Refund`
- `Review`

### Key patterns:

- **Optimistic locking**: `TourSchedule.version` for race condition prevention
- **Price snapshots**: `BookingTraveler.price` stores price at booking time
- **Soft delete**: `Tour.deletedAt` instead of physical deletion

---

## Frontend Structure

```
apps/web/app/
├── (site)/
│   ├── layout.tsx          (SiteHeader + SiteFooter)
│   ├── page.tsx            (Homepage - featured tours)
│   ├── tours/page.tsx      (Tours browsing)
│   ├── tours/[slug]/page.tsx (Tour detail)
│   ├── profile/page.tsx    (User profile - Done)
│   ├── bookings/page.tsx   (My Bookings - Done)
│   ├── bookings/processing/page.tsx (Booking processing - Done)
│   ├── bookings/[id]/confirmation/page.tsx (Confirmation - Done)
│   └── (auth)/
│       ├── login/page.tsx  (Done)
│       └── register/page.tsx (Done)
├── admin/
│   ├── layout.tsx          (Admin layout + guard)
│   ├── tours/page.tsx      (Tour management - Done)
│   └── tours/new/page.tsx  (Create tour)
```

### Shared patterns:

- Forms: `react-hook-form` + `zod` validation
- State: `zustand` (auth store with persist)
- API: fetch-based clients in `lib/api/`
- Tokens: localStorage (`access_token`, `refresh_token`)

---

## Implementation Priority

### Phase A - Core User Journey (High Priority)

1. ~~**Tour Detail** (`/tours/[slug]`) - View tour info, schedules, reviews~~ **Done**
2. ~~**Booking Processing** - Select schedule, add travelers, payment~~ **Done**
3. ~~**Booking Confirmation** - Success page after payment~~ **Done**
4. ~~**My Bookings** (`/bookings`) - User booking history~~ **Done**

### Phase B - Completion & Polish

5. Register - Add missing tests
6. Tours Overview - Final QA
7. Admin Tours - Final QA

### Phase C - Admin Panel

8. Admin Dashboard - KPI overview
9. Admin Bookings - Manage bookings
10. Admin Users - User management
11. Admin Reviews - Review moderation
12. Admin Reports - Analytics

### Phase D - Nice-to-have

13. FAQ & Support
