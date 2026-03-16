# Design: Admin Dashboard — Lite Scope

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  app/admin/page.tsx (Dashboard Page)                        │
│                                                             │
│  State: dashboardData, loading, lastUpdated                 │
│  Fetch: getAdminDashboard(token) on mount + refresh click   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  DashboardStats                                       │  │
│  │  Props: stats: DashboardStats | null, loading         │  │
│  │  4 cards: Revenue, Bookings, Active Tours, Users      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Quick Actions (inline)                               │  │
│  │  [+ Add New Tour] → /admin/tours (or open create)     │  │
│  │  [Create Booking] → /admin/bookings                   │  │
│  │  [Invite User]    → /admin/users                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  RecentBookings                                       │  │
│  │  Props: bookings: RecentBooking[], loading             │  │
│  │  Table: Customer, Tour, Date, Amount, Status           │  │
│  │  "View All" → /admin/bookings                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  lib/api/admin/dashboard.ts                                 │
│  getAdminDashboard(token) → GET /api/admin/dashboard        │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: DashboardModule (NEW)                             │
│                                                             │
│  DashboardController                                        │
│  └── GET /api/admin/dashboard                               │
│      Guards: JwtAuthGuard, RolesGuard (ADMIN)               │
│                                                             │
│  DashboardService                                           │
│  └── getDashboard()                                         │
│      Uses PrismaService directly (no cross-module deps)     │
│      Promise.all([                                          │
│        prisma.payment.aggregate(SUCCESS → sum amount),      │
│        prisma.booking.count(),                              │
│        prisma.tour.count(PUBLISHED, not deleted),           │
│        prisma.user.count(not deleted),                      │
│        prisma.booking.findMany(last 5 with relations),      │
│      ])                                                     │
└─────────────────────────────────────────────────────────────┘
```

## API Response Shape

```typescript
// GET /api/admin/dashboard
{
  stats: {
    totalRevenue: number;       // sum of successful payments
    totalBookings: number;      // all bookings count
    activeTours: number;        // PUBLISHED tours count
    totalUsers: number;         // non-deleted users count
  };
  recentBookings: Array<{
    id: number;
    status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
    bookingDate: string;
    totalPrice: number;
    user: {
      id: number;
      fullName: string;
      email: string;
      avatarUrl: string | null;
    };
    schedule: {
      startDate: string;
      tour: {
        id: number;
        name: string;
      };
    };
  }>;
}
```

## Component Design

### DashboardStats

- Props: `stats: DashboardStats | null`, `loading: boolean`
- 4 cards in a responsive grid (1 col mobile, 2 col md, 4 col lg)
- Each card: icon (in colored background) + label + value
- Cards:
  1. Total Revenue — green icon `payments`, formatted as USD currency
  2. Total Bookings — blue icon `confirmation_number`, plain number
  3. Active Tours — purple icon `tour`, plain number
  4. Total Users — orange icon `group`, plain number
- Loading: 4 skeleton cards with pulse animation
- No % change indicators (out of scope)

### RecentBookings

- Props: `bookings: RecentBooking[]`, `loading: boolean`
- Card with header "Recent Bookings" + "View All" link → `/admin/bookings`
- Table: Customer (avatar + name + email), Tour, Date, Amount, Status badge
- Status badge colors: same as booking table (green=PAID, yellow=PENDING, red=CANCELLED/REFUNDED)
- Loading: skeleton rows
- Empty: "No recent bookings" message
- Max 5 rows, no pagination

### Quick Actions (inline in page)

- Row of buttons matching design:
  - "Add New Tour" (primary/blue button) → navigates to `/admin/tours`
  - "Create Booking" (outline button) → navigates to `/admin/bookings`
  - "Invite User" (outline button) → navigates to `/admin/users`
- Simple `Link` components, no complex logic

## Design Decisions

1. **Separate DashboardModule** — Not injecting into existing modules. DashboardService uses PrismaService directly to avoid circular dependencies. This is a read-only aggregation layer.

2. **No cross-module service injection** — Dashboard queries Prisma directly rather than calling ToursService/BookingsService/UsersService. Avoids tight coupling and keeps the module self-contained.

3. **Page fetches everything** — Single `getAdminDashboard()` call, passes data down as props. No self-contained data fetching in child components (unlike tour statistics). Simpler and more efficient for a dashboard that needs all data at once.

4. **Server component possible but using client** — The current admin layout pattern uses `"use client"` with auth guards. We follow the same pattern for consistency, even though a server component would be cleaner for a read-only page.

5. **Refresh button** — Re-calls `getAdminDashboard()` and updates `lastUpdated` timestamp. No auto-refresh interval.
