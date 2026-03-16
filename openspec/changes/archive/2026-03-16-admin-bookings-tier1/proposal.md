# Admin Bookings Management — Tier 1

## Summary

Build the admin bookings management frontend page, connecting to the existing backend API (`BookingsAdminController`). This replaces the current "Coming Soon" stub at `/admin/bookings` with a fully functional listing page matching the design mockup.

## Motivation

The backend admin bookings API is fully implemented (`GET /admin/bookings` with search, filter, sort, pagination, and stats), but the frontend is a placeholder. Admins currently have no way to view or manage bookings through the UI.

## Scope

### In Scope (Tier 1)

- **API client** — `lib/api/admin/bookings.ts` with types and fetch functions
- **Stats cards** — Total Revenue and Active Bookings (from `getAdminStats()`)
- **Filter bar** — Search (debounced), status dropdown, date range filter
- **Bookings table** — Columns: Booking ID, Customer (avatar + name + email), Tour name, Date & Time, Amount, Status (dual badges for booking + payment status)
- **Pagination** — Page navigation with "Showing X to Y of Z" text
- **Replace stub page** — Wire everything into `app/admin/bookings/page.tsx`

### Out of Scope (Future Tiers)

- Occupancy Rate stat card (requires new backend calculation)
- Tour type filter dropdown
- Row action menu (status update, refund)
- Export functionality
- Create Booking (admin on behalf of user)
- Bulk selection / bulk actions
- Booking detail view/panel

## Design Reference

`docs/design/admin_booking_management/screen.png` and `code.html`

## Backend API (Already Implemented)

### `GET /admin/bookings`

Query params (`AdminBookingQueryDto`):
- `search?: string` — matches customer name, email, tour name
- `status?: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'`
- `tourId?: number`
- `dateFrom?: string` (YYYY-MM-DD)
- `dateTo?: string` (YYYY-MM-DD)
- `sort?: 'newest' | 'oldest' | 'price_high' | 'price_low'`
- `page?: number` (default 1)
- `limit?: number` (default 10, max 50)

Response shape:
```json
{
  "bookings": [
    {
      "id": 1,
      "status": "PAID",
      "bookingDate": "2026-03-10T...",
      "totalPrice": 150.00,
      "user": { "id": 1, "fullName": "Jane Doe", "email": "jane@example.com", "avatarUrl": null },
      "travelers": [...],
      "schedule": {
        "id": 1,
        "startDate": "2026-04-01T...",
        "tour": { "id": 1, "name": "Sunset Kayak Tour", ... }
      },
      "payments": [{ "status": "SUCCESS", "amount": 150.00, ... }]
    }
  ],
  "stats": {
    "totalBookings": 45,
    "activeBookings": 30,
    "totalRevenue": 12450
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Implementation Pattern

Follow the existing admin tours pattern:

| Tours Pattern | Bookings Equivalent |
|---|---|
| `lib/api/admin/tours.ts` | `lib/api/admin/bookings.ts` |
| `components/admin/tours/tour-statistics.tsx` | `components/admin/bookings/booking-statistics.tsx` |
| `components/admin/tours/tour-filters.tsx` | `components/admin/bookings/booking-filters.tsx` |
| `components/admin/tours/tour-table.tsx` | `components/admin/bookings/booking-table.tsx` |
| `app/admin/tours/page.tsx` (state orchestration) | `app/admin/bookings/page.tsx` (replace stub) |

Key patterns to replicate:
- `useCallback` for filter handlers (prevents re-render loops)
- `useDebounce` for search input (300ms)
- Statistics component with self-contained data fetching
- Table as presentational component (data + callbacks via props)
- Inline pagination at table footer

## Files to Create/Modify

### New Files
1. `apps/web/lib/api/admin/bookings.ts` — API client + types
2. `apps/web/components/admin/bookings/booking-statistics.tsx` — Stats cards
3. `apps/web/components/admin/bookings/booking-filters.tsx` — Filter bar
4. `apps/web/components/admin/bookings/booking-table.tsx` — Data table

### Modified Files
5. `apps/web/app/admin/bookings/page.tsx` — Replace "Coming Soon" with real implementation
