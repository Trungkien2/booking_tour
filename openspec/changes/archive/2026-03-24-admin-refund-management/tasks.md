# Tasks: Admin Refund Management

## Part A: Stripe Refund Processing

- [x] **Task 1: Add processRefund method to PaymentsService** — In `apps/server/src/modules/payments/payments.service.ts`, add `async processRefund(refundId: number)`. Logic: find refund with `include: { payment: true }`, retrieve Stripe session via `stripeService.retrieveSession(payment.transactionId)`, extract `payment_intent` from session, call `stripeService.createRefund(paymentIntentId, amount)`. On success: update refund `status: 'COMPLETED'`, `gatewayRefundId: stripeRefund.id`, `processedAt: new Date()`. On Stripe error: update refund `status: 'FAILED'`, log the error, re-throw. Guard: skip if refund status is already `COMPLETED`.

- [x] **Task 2: Wire processRefund into cancelBooking** — In `apps/server/src/modules/bookings/bookings.service.ts`, method `cancelBooking`: after the `$transaction` block, if a refund was created (refund variable is not null), call `this.paymentsService.processRefund(refund.id)` wrapped in try/catch. If it fails, log a warning but don't throw — the cancellation already succeeded. Need to inject `PaymentsService` into `BookingsService`: add to constructor, update `bookings.module.ts` imports. Use `forwardRef` if circular dependency with PaymentsModule.

- [x] **Task 3: Wire processRefund into adminUpdateStatus** — In `apps/server/src/modules/bookings/bookings.service.ts`, method `adminUpdateStatus`: after the booking update, if `dto.status === 'CANCELLED'` and `dto.forceFullRefund` and a refund was created, call `this.paymentsService.processRefund(refund.id)` wrapped in try/catch. Capture the created refund ID from the `prisma.refund.create` call (currently it doesn't save the result). Same pattern: log warning on failure, don't throw.

## Part B: Admin Refund API

- [x] **Task 4: Add getAdminRefunds and processAdminRefund to BookingsService** — In `bookings.service.ts`, add: (a) `async getAdminRefunds(query: { status?: string, page?: number, limit?: number })` — query refunds with pagination, include `booking` (select id, status, totalPrice, user select id/fullName/email) and `payment` (select id, provider, transactionId). Also return stats: count by status + sum of completed refund amounts. (b) `async processAdminRefund(refundId: number)` — find refund, validate status is PENDING or FAILED, delegate to `paymentsService.processRefund(refundId)`, return updated refund.

- [x] **Task 5: Add admin refund endpoints to BookingsAdminController** — In `bookings-admin.controller.ts`, add: (a) `@Get('refunds')` endpoint `getRefunds(@Query() query)` calling `bookingsService.getAdminRefunds(query)`. (b) `@Post('refunds/:id/process')` endpoint `processRefund(@Param('id', ParseIntPipe) id)` calling `bookingsService.processAdminRefund(id)`. Add Swagger decorators. Both endpoints already have admin guards from the controller class.

## Part C: Admin Refunds Page

- [x] **Task 6: Add admin refunds API client** — In `apps/web/lib/api/admin/bookings.ts`, add: (a) `AdminRefund` interface matching the API response shape (id, amount, reason, status, gatewayRefundId, createdAt, processedAt, booking with user, payment). (b) `AdminRefundsResponse` interface (refunds array, pagination, stats). (c) `getAdminRefunds(params, token)` function calling `GET /api/admin/refunds`. (d) `processAdminRefund(refundId, token)` function calling `POST /api/admin/refunds/{id}/process`.

- [x] **Task 7: Create admin refunds page** — Create `apps/web/app/admin/refunds/page.tsx`. Auth guard (same pattern as admin bookings page). Fetch refunds with `getAdminRefunds`. Stats cards at top: Pending (yellow), Completed (green), Failed (red), Total Refunded (blue with currency format). Table columns: ID, Booking (link to `/admin/bookings/{id}`), Customer (name + email), Amount (currency), Status (badge with colors), Date, Action. Action column: "Process" button for PENDING, "Retry" button for FAILED, dash for COMPLETED. Clicking Process/Retry calls `processAdminRefund`, shows loading state on button, refreshes list on success, shows error toast on failure. Status filter dropdown (All, Pending, Completed, Failed). Pagination. Follow same component patterns as `admin/bookings/page.tsx`.

- [x] **Task 8: Add Refunds link to admin sidebar** — In `apps/web/components/admin/admin-sidebar.tsx`, add a "Refunds" entry to the navigation array after "Bookings": `{ name: "Refunds", href: "/admin/refunds", icon: "receipt_long" }`.
