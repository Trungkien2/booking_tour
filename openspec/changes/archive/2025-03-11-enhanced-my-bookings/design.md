## Context

The "My Bookings" screen (`/bookings`) will provide authenticated users (USER, ADMIN, GUIDE) a unified view of their tour bookings, segmented into upcoming, completed, and cancelled states. The proposal and screen spec (`docs/screens/my-bookings/README.md`) define a UI with tab navigation, search, filters, booking cards, and quick actions. The backend already models bookings, tours, schedules, and payments with status flows such as PENDING, PAID/CONFIRMED, CANCELLED, and COMPLETED, and uses NestJS + Prisma for the API.

This design focuses on wiring a dedicated bookings query and management experience onto the existing domain model, exposing it through stable APIs and a Next.js screen. It must respect optimistic locking on schedules, price snapshots on travelers, and existing booking/payment status transitions. Performance considerations include paginated queries, filtered by status and search, with appropriate indexes.

## Goals / Non-Goals

**Goals:**

- Provide a secure, paginated endpoint to fetch the current user's bookings with filters:
  - `status`: upcoming/completed/cancelled, mapped to domain statuses.
  - `search`: by tour name or location.
  - `sort`: date ascending/descending.
- Implement a stable API for booking details (`GET /bookings/{id}`) scoped to the current user.
- Implement a cancellation endpoint (`PATCH /bookings/{id}/cancel`) that:
  - Validates ownership and status (only cancellable states).
  - Updates booking status and related records using transactions and optimistic locking rules where necessary.
  - Exposes enough information for the UI to show refund info (high level, not full accounting).
- Build a Next.js screen at `/bookings` with:
  - Tab navigation (Upcoming, Completed, Cancelled) bound to query parameters.
  - Search and filter controls mapped to the API.
  - Booking cards that match the documented UI (status badges, metadata, price, actions).
  - Empty states per tab.
- Reuse/shared components from `@repo/ui` where possible for consistency.

**Non-Goals:**

- Implementing new payment providers or deep changes to the payment flow (we only link to existing payment/booking flows).
- Changing fundamental booking state machine semantics (we honor existing allowed transitions).
- Building an admin reporting console or export feature for bookings.
- Implementing advanced analytics or notification flows (emails, push) tied to bookings.

## Decisions

- **D1: Dedicated bookings controller and service.**  
  Implement a `BookingsController` and `BookingsService` (or extend existing booking module if present) under `apps/server/src/modules/bookings`. This isolates user-facing booking operations (`/bookings/me`, `/bookings/{id}`, cancellation) from tour search and admin flows while still using shared domain models.

- **D2: Query shape for `GET /bookings/me`.**  
  The endpoint will accept:
  - `status`: `"upcoming" | "completed" | "cancelled"` mapped internally to booking + schedule dates:
    - `upcoming`: bookings with status in [PENDING, CONFIRMED] and schedule date ≥ today.
    - `completed`: bookings with status COMPLETED (or equivalent) and schedule date < today.
    - `cancelled`: bookings with status CANCELLED.
  - `search`: applied via `ILIKE` on tour name and primary location fields.
  - `sort`: `"date_asc" | "date_desc"` mapping to schedule start date ordering.
  - `page` and `limit` for pagination (with sane defaults, e.g., `page=1`, `limit=10`, and max limit guard).
  Prisma queries will select only fields needed for the My Bookings UI: booking id, status, total price, schedule dates, tour name, location, and traveler count (via aggregate count on related travelers).

- **D3: Response model for listing and details.**  
  Define DTOs:
  - `BookingSummaryDto` for list rows, matching the booking card's needed fields.
  - `BookingDetailDto` for `GET /bookings/{id}`, including additional fields such as traveler details and more schedule/tour metadata.
  This ensures strict typing and decouples API contracts from underlying DB models.

- **D4: Authorization and scoping.**  
  All `/bookings/me` and `/bookings/{id}` routes are protected by JWT auth guards. The service always scopes queries by `userId` from the JWT; admins/guides still use their own `userId` context for this screen (we do not expose arbitrary user bookings here).

- **D5: Cancellation rules via service method.**  
  Implement a `cancelBooking(bookingId, userId)` method that:
  - Fetches the booking scoped to `userId`.
  - Validates that the status is cancellable (e.g., PENDING or CONFIRMED and schedule start date not in the past).
  - Uses a transaction to:
    - Update booking status to CANCELLED.
    - Optionally create a refund record if payments have been captured (delegating to existing payment/refund service if present).
  The API returns the updated booking summary for UI refresh.

- **D6: Frontend data fetching and state.**  
  The `/bookings` screen will:
  - Use URL query parameters (`status`, `search`, `sort`, `page`) as the single source of truth for filters and pagination, enabling deep linking and back/forward navigation.
  - Use a data-fetching hook (e.g., React Query or a lightweight custom hook) to call the backend with those params, handle loading/error states, and map responses to UI components.
  - Render booking cards using shared UI primitives (card, badge, buttons, tabs).

- **D7: Action handling.**  
  - **View Details**: navigates to `/bookings/{id}`, which uses `GET /bookings/{id}`.
  - **Complete Payment**: navigates to the existing payment/checkout route, carrying booking id; no new payment API is introduced here.
  - **Cancel Booking**: triggers a confirmation dialog; on confirm, calls `PATCH /bookings/{id}/cancel`, then refetches the list on success.
  - **Modify**: initially a simple navigation to a modification flow (if implemented) or a modal; backend changes for modification are out of scope for this design unless explicitly required later.

## Risks / Trade-offs

- **R1: Performance of search and filtering on large datasets.**  
  If bookings volume grows significantly, ILIKE-based search on tour name/location may become slow without proper indexes. Mitigation: add composite indexes on `(userId, status, startDate)` and consider full-text search or denormalized search fields if needed.

- **R2: Ambiguity in mapping UI statuses to domain statuses.**  
  The UI has CONFIRMED, PENDING, CANCELLED, COMPLETED, while backend may use slightly different enums or additional intermediate states. Mitigation: define a clear mapping layer in the service (e.g., map multiple internal statuses to a single UI status) and document it in the spec for `booking-query-api`.

- **R3: Cancellation edge cases with payments and refunds.**  
  Existing payment/refund logic may have constraints (non-refundable bookings, partial refunds, deadlines). Misalignment can cause inconsistent user expectations. Mitigation: delegate to the existing payment/refund module for refund decisions and return only high-level refund information (e.g., `refundableAmount`, `refundPolicySummary`) if available, without re-implementing business rules here.

- **R4: Consistency between My Bookings and other booking views.**  
  There is a risk of duplicated logic if admin or other booking views use different services. Mitigation: centralize core booking query and status mapping logic in the booking service and have admin views call into the same service methods where possible.

