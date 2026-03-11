## Why

The current platform does not yet provide a unified, user-friendly view of a customer's booking history. Users need a dedicated "My Bookings" experience where they can quickly understand the status of their trips, manage upcoming bookings, and review completed or cancelled trips. Delivering this screen now improves post-purchase engagement and reduces support load around booking management.

## What Changes

- Add a new authenticated route `/bookings` accessible to USER, ADMIN, and GUIDE roles, using the main layout.
- Implement a "My Bookings" screen with tab navigation for **Upcoming**, **Completed**, and **Cancelled** bookings.
- Provide search by tour name or location, plus sort and filter options (e.g., sort by date, price range filter).
- Display booking cards with consistent visual status badges (CONFIRMED, PENDING, CANCELLED, COMPLETED), key tour metadata, and total price.
- Add empty-state experiences per tab (upcoming, completed, cancelled) with clear messaging and a call-to-action to browse tours where appropriate.
- Wire up quick actions for each booking card: **Cancel Booking**, **View Details**, **Complete Payment**, and **Modify**, respecting booking status and disabling actions when not allowed by business rules.
- Expose and/or refine backend endpoints for fetching the current user's bookings (`GET /bookings/me` with status, search, sort, paging), getting booking details (`GET /bookings/{id}`), and cancelling a booking (`PATCH /bookings/{id}/cancel`).

## Capabilities

### New Capabilities
- `my-bookings-screen`: End-to-end capability for showing and managing a user's bookings at `/bookings`, including tabbed state (upcoming, completed, cancelled), search, filters, pagination, booking cards, empty states, and navigation to booking details and payment flows.

### Modified Capabilities
- `booking-management`: Extend existing booking management behavior (if present) to support user-facing cancellation from the My Bookings screen via `PATCH /bookings/{id}/cancel`, ensuring status transitions and refund information are handled correctly.
- `booking-query-api`: Refine or introduce the `GET /bookings/me` and `GET /bookings/{id}` endpoints to support filtering by status, search, sorting, and pagination parameters required by the My Bookings UI.

## Impact

- **Backend (apps/server)**:
  - Implement or extend booking APIs:
    - `GET /bookings/me` with `status`, `search`, `sort`, `page`, and `limit` query parameters.
    - `GET /bookings/{id}` for booking details.
    - `PATCH /bookings/{id}/cancel` for cancellation with proper status transitions, refund handling, and validation.
  - Ensure booking statuses (PENDING, CONFIRMED, CANCELLED, COMPLETED) align with existing domain models and flows.
  - Potential updates to Prisma models or repositories if additional fields or indexes are needed for efficient filtering and sorting.
- **Frontend (apps/web)**:
  - New screen component for `/bookings` implementing the My Bookings UI (tabs, search, filters, booking cards, empty states, pagination).
  - Integration with shared UI components (`@repo/ui`) for tabs, cards, badges, buttons, and empty states.
  - Client-side routing to `/bookings/{id}` for details and to the payment/booking flow for "Complete Payment" and modification.
- **Cross-cutting**:
  - Authorization checks ensuring only authenticated users can access `/bookings` and only see their own bookings.
  - UX and content alignment with existing design references (`user_tour_management` design, HTML reference in docs).

