# Design: Admin Bookings Management — Tier 1

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  app/admin/bookings/page.tsx (State Orchestrator)       │
│                                                         │
│  State: bookings[], stats, pagination, queryParams,     │
│         loading                                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  BookingStatistics (self-contained fetch)         │  │
│  │  Cards: Total Revenue | Active Bookings           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  BookingFilters                                   │  │
│  │  Props: onSearchChange, onStatusChange,           │  │
│  │         onDateRangeChange                         │  │
│  │  Internal: useDebounce(search, 300)               │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  BookingTable                                     │  │
│  │  Props: bookings[], loading                       │  │
│  │  Columns: ID, Customer, Tour, Date, Amount,       │  │
│  │           Status (dual badge)                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Pagination (inline)                              │  │
│  │  "Showing 1 to 10 of 45" + Prev/Next + pages     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  lib/api/admin/bookings.ts                              │
│                                                         │
│  getAdminBookings(params, token)                        │
│    → GET /admin/bookings?search=&status=&page=&limit=   │
│    → Returns { bookings, stats, pagination }            │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (existing, no changes)                         │
│  BookingsAdminController → BookingsService              │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User types in search
  → BookingFilters updates local state
  → useDebounce(300ms)
  → onSearchChange callback fires
  → Page sets queryParams { ...prev, search, page: 1 }
  → useEffect triggers fetchBookings()
  → API call → response → setBookings, setPagination
  → BookingTable re-renders with new data

User changes status filter
  → onStatusChange callback fires (immediate, no debounce)
  → Same flow as above

User clicks pagination
  → Page sets queryParams { ...prev, page: N }
  → Same fetch flow
```

## Types

```typescript
// API response types (mirror backend response)
interface AdminBooking {
  id: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  bookingDate: string;
  totalPrice: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  travelers: Array<{
    id: number;
    fullName: string;
    type: string;
    price: number;
  }>;
  schedule: {
    id: number;
    startDate: string;
    tour: {
      id: number;
      name: string;
      slug: string;
      coverImage: string | null;
      location: string | null;
    };
  };
  payments: Array<{
    id: number;
    status: string;
    amount: number;
    method: string;
  }>;
}

interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
}

interface BookingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface AdminBookingsResponse {
  bookings: AdminBooking[];
  stats: BookingStats;
  pagination: BookingPagination;
}

interface BookingQueryParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
```

## Component Design

### BookingStatistics

- Self-contained: fetches stats from the `getAdminBookings` response (stats are included in listing response, no separate endpoint needed)
- Alternative: receive stats as props from page (simpler, avoids duplicate fetch)
- **Decision**: Receive stats as props from page since stats come bundled with the listing response (unlike tours which has a separate stats endpoint)
- 2 cards: Total Revenue (formatted as currency), Active Bookings (count)
- Loading skeleton state

### BookingFilters

- Search input with magnifying glass icon, placeholder "Search booking ID, customer name..."
- Status dropdown/buttons: All, Pending, Paid, Cancelled, Refunded
- Date range: dateFrom + dateTo inputs (type="date")
- Search uses `useDebounce` from `use-debounce` (already in project via tours)
- Status and date changes are immediate (no debounce)

### BookingTable

- Presentational component, no internal data fetching
- Columns from design:
  1. **Booking ID** — formatted as `#BK-{id}` or just `#{id}`
  2. **Customer** — avatar (or initials fallback) + fullName + email
  3. **Tour** — tour name from schedule.tour
  4. **Date & Time** — schedule.startDate formatted
  5. **Amount** — totalPrice formatted as currency
  6. **Status** — dual badges: booking status + payment status
- Status badge colors:
  - PAID/SUCCESS → green
  - PENDING → yellow
  - CANCELLED/FAILED → red
  - REFUNDED → red
- Loading state: skeleton rows
- Empty state: "No bookings found" message
- Payment status derived from `payments[0].status` (latest payment)

### Pagination (inline in page)

- "Showing X to Y of Z results" text
- Page number buttons (1, 2, 3, ...) with active state
- Previous/Next arrows
- Disabled states when at first/last page

## Design Decisions

1. **Stats as props, not self-fetching** — Unlike tours (separate `/statistics` endpoint), booking stats come bundled in the listing response. Pass them down as props to avoid a duplicate API call.

2. **No separate booking detail page in Tier 1** — Booking IDs are displayed but not clickable links yet. Detail view is Tier 2.

3. **Follow tours pattern strictly** — Same file structure, same state management approach, same callback patterns. Consistency over novelty.

4. **Currency formatting** — Use `Intl.NumberFormat` for consistent currency display.

5. **Customer avatar fallback** — If `avatarUrl` is null, show initials in a colored circle (matching the design's "RK" pattern).
