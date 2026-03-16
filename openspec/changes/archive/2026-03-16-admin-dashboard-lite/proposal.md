# Admin Dashboard — Lite Scope

## Summary

Replace the hardcoded admin dashboard stub with a live dashboard that displays real KPI stats, a recent bookings table, and functional quick action buttons. Requires a new backend endpoint to aggregate data in a single API call.

## Motivation

The current dashboard at `/admin` shows 4 KPI cards with hardcoded `0` values and non-functional quick action buttons. It provides no value to admins. The data to power it is scattered across existing services (tours, bookings, users), but there's no aggregated endpoint.

## Scope

### In Scope (Lite)

- **New backend endpoint**: `GET /api/admin/dashboard` returning aggregated stats
  - Total Revenue (from successful payments)
  - Total Bookings count
  - Active Tours count (PUBLISHED status)
  - Total Users count
  - Recent bookings (last 5, with user + tour info)
- **Frontend**: Replace stub with live data
  - 4 KPI cards with real values (no % change — that's a future enhancement)
  - Recent Bookings table (last 5 bookings, linking to detail page)
  - Quick action buttons that navigate to the relevant pages
  - "Last updated" timestamp with refresh button

### Out of Scope

- % change vs last month on KPI cards
- Revenue trends chart (requires time-series data + charting library)
- Top Performing Tours section (requires aggregation query)
- Dark mode (the current stub has dark mode classes but actual admin layout doesn't use it)

## Design Reference

`docs/design/admin_dashboard/screen.png` and `code.html`

## Backend Data Sources (Existing)

| Metric | Source | Current Access |
|---|---|---|
| Total Revenue | `Payment` aggregate (status=SUCCESS) | `BookingsService.getAdminStats()` (private) |
| Total Bookings | `Booking` count | `BookingsService.getAdminStats()` (private) |
| Active Tours | `Tour` count (status=PUBLISHED) | `ToursService.getStatistics()` (public endpoint) |
| Total Users | `User` count (deletedAt=null) | No existing endpoint |
| Recent Bookings | `Booking` findMany (limit 5, newest first) | `BookingsService.getAdminBookings()` (reusable pattern) |

## Architecture Decision

**Single dashboard endpoint** rather than multiple frontend calls. Reasons:
- Reduces round trips (1 call vs 3-4)
- Backend can optimize queries with `Promise.all`
- Response shape is tailored to dashboard needs
- Easier to extend later (add chart data, top tours, etc.)

## Files to Create/Modify

### New Files
1. `apps/server/src/modules/dashboard/dashboard.module.ts` — NestJS module
2. `apps/server/src/modules/dashboard/dashboard.controller.ts` — Single GET endpoint
3. `apps/server/src/modules/dashboard/dashboard.service.ts` — Aggregation logic
4. `apps/server/src/modules/dashboard/dto/dashboard-response.dto.ts` — Response type
5. `apps/web/lib/api/admin/dashboard.ts` — Frontend API client + types
6. `apps/web/components/admin/dashboard/dashboard-stats.tsx` — KPI cards component
7. `apps/web/components/admin/dashboard/recent-bookings.tsx` — Recent bookings table

### Modified Files
8. `apps/server/src/app.module.ts` — Import DashboardModule
9. `apps/web/app/admin/page.tsx` — Replace stub with live dashboard
