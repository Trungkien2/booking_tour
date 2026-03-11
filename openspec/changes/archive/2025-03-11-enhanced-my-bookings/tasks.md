## 1. Backend – Bookings module and DTOs

- [x] 1.1 Create bookings module (controller, service) under apps/server/src/modules/bookings
- [x] 1.2 Add BookingSummaryDto and query DTOs for GET /bookings/me (status, search, sort, page, limit)
- [x] 1.3 Add BookingDetailDto for GET /bookings/:id response
- [x] 1.4 Register BookingsModule in AppModule and mount routes under /bookings

## 2. Backend – GET /bookings/me

- [x] 2.1 Implement findMyBookings in BookingsService with userId scope and status mapping (upcoming/completed/cancelled)
- [x] 2.2 Add search filter (ILIKE on tour name and location) and sort (date_asc/date_desc) in query
- [x] 2.3 Add pagination (page, limit with max) and return pagination metadata in response
- [x] 2.4 Expose GET /bookings/me in BookingsController with JWT guard and query validation

## 3. Backend – GET /bookings/:id

- [x] 3.1 Implement findOne in BookingsService scoped to userId; return 404 or 403 for non-owners
- [x] 3.2 Expose GET /bookings/:id in BookingsController with JWT guard

## 4. Backend – PATCH /bookings/:id/cancel

- [x] 4.1 Implement cancelBooking in BookingsService (ownership check, cancellable status, transaction, optional refund)
- [x] 4.2 Expose PATCH /bookings/:id/cancel in BookingsController with JWT guard
- [x] 4.3 Return updated booking summary and high-level refund info when applicable

## 5. Frontend – Page and routing

- [x] 5.1 Add authenticated route /bookings in apps/web with main layout
- [x] 5.2 Create My Bookings page component with URL query state (status, search, sort, page)

## 6. Frontend – Tabs and data fetching

- [x] 6.1 Add tab navigation (Upcoming, Completed, Cancelled) bound to status query param
- [x] 6.2 Add data-fetching hook that calls GET /bookings/me with current query params
- [x] 6.3 Handle loading and error states and map API response to UI state

## 7. Frontend – Search, sort, and pagination

- [x] 7.1 Add search input (tour name or location) synced to URL and API
- [x] 7.2 Add sort dropdown (Newest First / Oldest First) synced to URL and API
- [x] 7.3 Add pagination or Load more and pass page/limit to API

## 8. Frontend – Booking cards and actions

- [x] 8.1 Render booking cards with status badge, tour name, booking id, dates, location, traveler count, price
- [x] 8.2 Show contextual actions (Cancel, View Details, Complete Payment, Modify) by status per spec
- [x] 8.3 Implement View Details navigation to /bookings/[id]
- [x] 8.4 Implement Complete Payment navigation to existing payment/checkout flow with booking id

## 9. Frontend – Cancel booking flow

- [x] 9.1 Add cancel confirmation dialog with cancellation policy and refund info
- [x] 9.2 On confirm, call PATCH /bookings/:id/cancel and refetch list on success
- [x] 9.3 Show error message when cancellation is not allowed (ineligible status or past window)

## 10. Frontend – Empty states

- [x] 10.1 Add empty state for Upcoming tab with CTA to browse tours (/tours)
- [x] 10.2 Add empty states for Completed and Cancelled tabs with descriptive message

## 11. Frontend – Booking details page

- [x] 11.1 Create /bookings/[id] page that fetches GET /bookings/:id and displays full booking details
- [x] 11.2 Protect route for authenticated users and handle 404/403 from API
