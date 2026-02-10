# Task Checklist: Booking Feature

> Breakdown từ [tdd-booking.md](./tdd-booking.md)
> Business rules: [business-rules-booking.md](../../business-rules-booking.md)
> API contract: [api-contract-booking.md](../../api-contract-booking.md)

---

## Phase 1: Database & Schema

- [x] Task 1.1: **[DB] Extend Prisma Schema**
  - Add fields to `Booking`: `cancelledAt`, `cancelReason`, `expiresAt`.
  - Add indexes to `Booking`: `userId`, `status`, `bookingDate`, `expiresAt`.
  - Add fields to `Payment`: `checkoutUrl`, `expiresAt`.
  - Add indexes to `Payment`: `bookingId`, `transactionId`.
  - Add field to `Refund`: `processedAt`.
  - Add indexes to `Refund`: `bookingId`, `status`.

- [x] Task 1.2: **[DB] Generate Migration**
  - Run `pnpm prisma migrate dev --name add_booking_feature_fields`.
  - Verify migration applied cleanly.

- [x] Task 1.3: **[DB] Seed Booking Test Data**
  - Add sample bookings (PENDING, PAID, CANCELLED, REFUNDED) trong seed.ts.
  - Add sample payments và refunds.
  - Add schedules với varied capacity cho testing.

---

## Phase 2: Backend — Inventory Module

- [x] Task 2.1: **[BE] Scaffold Inventory Module**
  - Create `modules/inventory/inventory.module.ts`.
  - Create `modules/inventory/inventory.service.ts`.
  - Create `modules/inventory/inventory.constants.ts` (`BOOKING_CUTOFF_HOURS = 24`).
  - Register `InventoryModule` in `AppModule` (export `InventoryService`).

- [x] Task 2.2: **[BE] Implement InventoryService.reserveStock()**
  - Load schedule, validate status = OPEN.
  - Check `currentCapacity + travelers <= maxCapacity` (Rule I1).
  - Optimistic lock update: `WHERE version = expected` (Rule I4).
  - Auto SOLD_OUT if full (Rule S2).
  - Throw `ConflictException` on version mismatch.

- [x] Task 2.3: **[BE] Implement InventoryService.releaseStock()**
  - Optimistic lock update: decrement currentCapacity (Rule I3, I4).
  - Auto revert `SOLD_OUT → OPEN` if freed (Rule S2).

- [x] Task 2.4: **[Test] Inventory Unit Tests**
  - `reserveStock`: happy path, overbooking reject, conflict exception.
  - `releaseStock`: happy path, auto OPEN on free.
  - **15 test cases** (7 reserveStock, 5 releaseStock, 3 checkAvailability).

---

## Phase 3: Backend — Sales Module (Bookings)

### Core Service

- [x] Task 3.1: **[BE] Scaffold Bookings Module**
  - Create `modules/bookings/bookings.module.ts` (import InventoryModule).
  - Create `modules/bookings/bookings.service.ts`.
  - Create `modules/bookings/bookings.controller.ts` (JWT guarded).
  - Create `modules/bookings/bookings-admin.controller.ts` (ADMIN guarded).
  - Register `BookingsModule` in `AppModule`.

- [x] Task 3.2: **[BE] Create DTOs**
  - `create-booking.dto.ts`: scheduleId, travelers[], note.
  - `booking-query.dto.ts`: status tab, search, sort, page, limit.
  - `cancel-booking.dto.ts`: reason, confirmNoRefund.
  - `admin-booking-query.dto.ts`: search, status, tourId, dateFrom/To, sort, page, limit.
  - `admin-update-status.dto.ts`: status, reason, forceFullRefund.
  - `admin-refund.dto.ts`: amount, reason, gatewayRefundId.
  - All DTOs with `@ApiProperty` / `@ApiPropertyOptional` Swagger decorators.

- [x] Task 3.3: **[BE] Implement PriceCalculatorService**
  - Create `modules/bookings/price-calculator.service.ts`.
  - `calculatePrice(tour, travelers)`: Rule P1 (age pricing), P3 (tax 10%).
  - Return per-traveler prices + breakdown.
  - Constants in `modules/bookings/constants/booking.constants.ts`:
    - `TAX_RATE = 0.10`
    - `RESERVATION_TTL_MINUTES = 15`
    - `REFUND_TIERS = [{ minDays: 15, percent: 70 }, { minDays: 2, percent: 50 }, { minDays: 0, percent: 0 }]`

- [x] Task 3.4: **[BE] Implement CancellationService**
  - Create `modules/bookings/cancellation.service.ts`.
  - `calculateRefund(booking, schedule)`: Rule C1 (tiers), C2 (pending free), C3 (calculation).
  - `getCancellationPreview(bookingId, userId)`: Return preview cho frontend.

- [x] Task 3.5: **[BE] Implement BookingsService.createBooking()**
  - Validate min 1 ADULT (Rule B1).
  - Validate schedule status OPEN (Rule S3), cutoff 24h (Rule S1).
  - Transaction: `reserveStock()` + create Booking/Travelers (Rule P2 snapshot).
  - Set `expiresAt = now + 15min` (Rule B2).
  - Return full booking with priceBreakdown.

- [x] Task 3.6: **[BE] Implement BookingsService.getUserBookings()**
  - Filter by status tab mapping (upcoming/completed/cancelled).
  - Include tour, schedule info.
  - Calculate `canCancel`, `canModify` per item.
  - Return `tabs` counts + pagination.

- [x] Task 3.7: **[BE] Implement BookingsService.getBookingDetail()**
  - Load full booking with all relations.
  - Ownership check (`userId`).
  - Include cancellation preview.

- [x] Task 3.8: **[BE] Implement BookingsService.getBookingStatus()**
  - Return status + steps cho processing page polling.

- [x] Task 3.9: **[BE] Implement BookingsService.cancelBooking()**
  - Status guard: only PENDING or PAID (Rule B3).
  - Late cancel requires `confirmNoRefund = true` (Rule C4).
  - Transaction: update status + create Refund + releaseStock (Rule I3).

### Controllers

- [x] Task 3.10: **[BE] Implement BookingsController (User)**
  - `POST /bookings` → createBooking.
  - `GET /bookings/me` → getUserBookings.
  - `GET /bookings/:id` → getBookingDetail.
  - `GET /bookings/:id/status` → getBookingStatus.
  - `GET /bookings/:id/cancellation-preview` → getCancellationPreview.
  - `PATCH /bookings/:id/cancel` → cancelBooking.
  - All endpoints: `@UseGuards(JwtAuthGuard)` + Swagger decorators.

- [x] Task 3.11: **[BE] Implement BookingsAdminController**
  - `GET /admin/bookings` → admin list with stats.
  - `GET /admin/bookings/:id` → admin detail (no ownership check).
  - `PATCH /admin/bookings/:id/status` → update status (Rule C5 override).
  - `POST /admin/bookings/:id/refund` → manual refund.
  - ~~`GET /admin/bookings/export` → CSV export.~~ (Deferred)
  - All endpoints: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('ADMIN')` + Swagger.

### Tests

- [x] Task 3.12: **[Test] PriceCalculator Unit Tests**
  - Adult 100%, Child 75%, Baby free.
  - Tax calculation + rounding.
  - **7 test cases.**

- [x] Task 3.13: **[Test] CancellationService Unit Tests**
  - PENDING free cancel.
  - Early (>=15d) → 70%, Standard (2-14d) → 50%, Late (<2d) → 0%.
  - requiresConfirmation when 0%.
  - **8 test cases.**

- [x] Task 3.14: **[Test] BookingsService Unit Tests**
  - createBooking: happy, min adult, cutoff, full capacity.
  - getUserBookings: tab filter, pagination.
  - cancelBooking: PENDING free, PAID with refund, late confirm.
  - **17 test cases.**

- [x] Task 3.15: **[Test] Bookings E2E Tests**
  - POST /bookings: 201, 400, 409.
  - GET /bookings/me: 200 with tabs.
  - GET /bookings/:id: 200 owner, 403 other.
  - PATCH /bookings/:id/cancel: 200, 400.
  - GET /admin/bookings: 200 admin, 403 user.
  - **14 test cases.**

---

## Phase 4: Backend — Payment Module

- [x] Task 4.1: **[BE] Install Dependencies**
  - `pnpm add stripe @nestjs/schedule` trong apps/server.
  - Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

- [x] Task 4.2: **[BE] Scaffold Payment Module**
  - Create `modules/payments/payments.module.ts`.
  - Create `modules/payments/payments.service.ts`.
  - Create `modules/payments/payments.controller.ts`.
  - Create `modules/payments/stripe.service.ts`.
  - Create `modules/payments/webhook.controller.ts`.
  - Register `PaymentsModule` in `AppModule`.

- [x] Task 4.3: **[BE] Implement StripeService**
  - `createCheckoutSession(booking, returnUrl)`.
  - `verifyWebhookSignature(payload, signature)`.
  - `createRefund(paymentIntentId, amount)`.
  - `retrieveSession(sessionId)`.

- [x] Task 4.4: **[BE] Implement PaymentsService**
  - `createPayment(bookingId, userId, provider, returnUrl)`:
    - Validate booking PENDING + not expired.
    - Create Payment record (PENDING).
    - Call Stripe to get checkoutUrl.
  - `verifyPayment(bookingId, userId)`:
    - Check Stripe session status.
    - Update Payment + Booking if paid.
  - `handleWebhook(event)`:
    - `checkout.session.completed` → Payment SUCCESS, Booking PAID.
    - `checkout.session.expired` → Payment FAILED.
    - Idempotent: skip if already SUCCESS.
  - `processRefund(refundId)`:
    - Call Stripe refund API.
    - Update Refund status (PROCESSING → COMPLETED/FAILED).

- [x] Task 4.5: **[BE] Implement Webhook Controller**
  - `POST /webhooks/stripe` (Public, no JWT).
  - Raw body parsing cho signature verification.
  - Route to `PaymentsService.handleWebhook()`.
  - Hidden from Swagger via `@ApiExcludeEndpoint()`.

- [x] Task 4.6: **[Test] Payment Unit Tests**
  - StripeService: mock Stripe SDK.
  - PaymentsService: createPayment, handleWebhook (idempotent), processRefund.
  - **11 test cases.**

---

## Phase 5: Backend — Background Jobs

- [x] Task 5.1: **[BE] Scaffold Scheduler Module**
  - Create `modules/scheduler/scheduler.module.ts`.
  - Create `modules/scheduler/booking-scheduler.service.ts`.
  - Import `ScheduleModule.forRoot()` in `SchedulerModule`.
  - Register `SchedulerModule` in `AppModule`.

- [x] Task 5.2: **[BE] Implement expirePendingBookings()**
  - `@Cron(EVERY_MINUTE)`.
  - Find bookings: status PENDING, expiresAt < now.
  - For each: cancel + releaseStock, continue on individual failure.
  - Log number of expired bookings.

- [x] Task 5.3: **[BE] Implement closePastSchedules()**
  - `@Cron(EVERY_DAY_AT_MIDNIGHT)`.
  - Update schedules: startDate < today AND status IN (OPEN, SOLD_OUT) → COMPLETED.

- [x] Task 5.4: **[Test] Scheduler Unit Tests**
  - expirePendingBookings: finds expired, cancels, releases, handles errors.
  - closePastSchedules: updates correctly, handles empty.
  - **5 test cases.**

---

## Phase 6: Frontend — Types & API Client

- [x] Task 6.1: **[FE] Define Booking Types**
  - Create `apps/web/lib/types/booking.ts` với tất cả interfaces.
  - BookingStatus, PaymentStatus, RefundStatus, BookingTraveler, BookingListItem, PriceBreakdown, BookingDetail, BookingStatusResponse, CancellationPreview, CreateBookingPayload, CreateBookingResponse, BookingsListResponse, CreatePaymentResponse, CancelBookingPayload, CancelBookingResponse.

- [x] Task 6.2: **[FE] Create Booking API Client**
  - Create `apps/web/lib/api/bookings.ts`.
  - Functions: createBooking, getUserBookings, getBookingDetail, getBookingStatus, getCancellationPreview, cancelBooking, createPayment, verifyPayment.

---

## Phase 7: Frontend — Booking Processing (SCR-006)

- [x] Task 7.1: **[FE] Processing Steps Component**
  - Create `components/bookings/processing-steps.tsx`.
  - Step states: completed (green check), in_progress (spinner), pending (gray), failed (red).
  - Vertical layout with connecting lines.

- [x] Task 7.2: **[FE] Processing Page**
  - Create `apps/web/app/(site)/bookings/processing/page.tsx`.
  - Read bookingId from URL search param (`booking_id`).
  - Poll `GET /bookings/:id/status` mỗi 2 giây.
  - Redirect to confirmation khi status = PAID.
  - Show error khi CANCELLED.
  - Warning banner: "Do not close this page".
  - Auto-stop poll sau 5 phút.

---

## Phase 8: Frontend — Booking Confirmation (SCR-005)

- [x] Task 8.1: **[FE] Confirmation Summary Component**
  - Create `components/bookings/confirmation-summary.tsx`.
  - Green checkmark + "Booking Confirmed!" header.
  - Booking ID, status badge.
  - Tour info: name, location, date, duration, participants.
  - Price breakdown: adults, children, taxes, total (via `priceBreakdown`).
  - Cancellation policy info.

- [x] Task 8.2: **[FE] Confirmation Next Steps Component**
  - Create `components/bookings/confirmation-next-steps.tsx`.
  - 3 steps: Check email, Review meeting point, Prepare for pickup.
  - Action buttons: Manage Booking, Print.

- [x] Task 8.3: **[FE] Confirmation Page**
  - Create `apps/web/app/(site)/bookings/[id]/confirmation/page.tsx`.
  - Fetch booking detail with auth token.
  - Compose ConfirmationSummary + NextSteps.
  - Support contact section.
  - Error state for booking not found.

---

## Phase 9: Frontend — My Bookings (SCR-008)

- [x] Task 9.1: **[FE] Booking Status Badge Component**
  - Create `components/bookings/booking-status-badge.tsx`.
  - Variants: PENDING (yellow), PAID/Confirmed (green), CANCELLED (red), REFUNDED (purple).

- [x] Task 9.2: **[FE] Booking Tabs Component**
  - Create `components/bookings/booking-tabs.tsx`.
  - Tabs: Upcoming (count), Completed (count), Cancelled (count).
  - Active tab styling with blue border + badge.

- [x] Task 9.3: **[FE] Booking Card Item Component**
  - Create `components/bookings/booking-card-item.tsx`.
  - Horizontal layout: image + content + price + actions.
  - Tour name (via `tour.name`), booking ID, date (via `schedule.startDate`), location (via `tour.location`), traveler count.
  - Status badge.
  - Actions: View Details, Cancel (conditional via `canCancel`).

- [x] Task 9.4: **[FE] Cancel Booking Dialog**
  - Create `components/bookings/cancel-booking-dialog.tsx`.
  - Fetch cancellation preview on open.
  - Show refund info: tier, percentage, refund amount.
  - Warning message khi late cancel (0% refund) + checkbox confirmation.
  - Reason input (optional).
  - Confirm + Cancel buttons.

- [x] Task 9.5: **[FE] Booking Detail Modal**
  - Create `components/bookings/booking-detail-modal.tsx`.
  - Slide-in panel: tour info, schedule, travelers table, price breakdown (via `priceBreakdown`).
  - Payment history (via `payments[]`).
  - Refund history (via `refunds[]`).

- [x] Task 9.6: **[FE] My Bookings Page**
  - Create `apps/web/app/(site)/bookings/page.tsx`.
  - Auth guard (redirect to login if not authenticated).
  - Compose: Tabs (with `tabs` counts) + Search bar + BookingCardItem list.
  - Pagination with prev/next.
  - Empty states per tab.
  - `loading.tsx` skeleton.

---

## Phase 10: Frontend — Admin Bookings (SCR-012)

- [x] Task 10.6: **[FE] Admin Bookings Page** *(Placeholder)*
  - Create `apps/web/app/admin/bookings/page.tsx`.
  - Admin layout + guard (role check).
  - Stats cards placeholder + table header with "Coming Soon" message.

- [ ] Task 10.1: **[FE] Admin Bookings Stats Component**
  - Create `components/bookings/admin/admin-bookings-stats.tsx`.
  - Cards: Total Revenue, Total Bookings, Active, Occupancy Rate.

- [ ] Task 10.2: **[FE] Admin Bookings Filters Component**
  - Create `components/bookings/admin/admin-bookings-filters.tsx`.
  - Search input, status dropdown, tour dropdown, date range picker.

- [ ] Task 10.3: **[FE] Admin Bookings Table Component**
  - Create `components/bookings/admin/admin-bookings-table.tsx`.
  - Columns: Booking ID, Customer, Tour, Date, Amount, Status, Actions.
  - Sortable columns, row actions dropdown, pagination.

- [ ] Task 10.4: **[FE] Admin Status Update Modal**
  - Create `components/bookings/admin/admin-status-update-modal.tsx`.

- [ ] Task 10.5: **[FE] Admin Refund Modal**
  - Create `components/bookings/admin/admin-refund-modal.tsx`.

---

## Phase 11: Integration & QA

- [ ] Task 11.1: **[QA] Backend Integration Test**
  - Full flow: createBooking → payment → webhook → booking PAID.
  - Full flow: createBooking → timeout → auto cancel → stock released.
  - Full flow: PAID booking → cancel → refund created → stock released.

- [ ] Task 11.2: **[QA] Frontend Manual QA — Processing**
- [ ] Task 11.3: **[QA] Frontend Manual QA — Confirmation**
- [ ] Task 11.4: **[QA] Frontend Manual QA — My Bookings**
- [ ] Task 11.5: **[QA] Frontend Manual QA — Admin Bookings**

- [ ] Task 11.6: **[QA] Lint + Format + Build**
  - `pnpm format` — no changes.
  - `pnpm lint` — 0 errors, 0 warnings.
  - `npx nest build` — clean.
  - `pnpm test` — all pass.

---

## Summary

| Phase | Tasks | Done | Mô tả |
|-------|-------|------|-------|
| 1 | 3 | 3 | Database schema + migration + seed |
| 2 | 4 | 4 | Inventory Module (reserve/release stock) |
| 3 | 15 | 15 | Sales Module (booking CRUD, pricing, cancellation) |
| 4 | 6 | 6 | Payment Module (Stripe, webhook, refund) |
| 5 | 4 | 4 | Background Jobs (expire pending, close schedules) |
| 6 | 2 | 2 | Frontend types + API client |
| 7 | 2 | 2 | Booking Processing page (SCR-006) |
| 8 | 3 | 3 | Booking Confirmation page (SCR-005) |
| 9 | 6 | 6 | My Bookings page (SCR-008) |
| 10 | 6 | 1 | Admin Bookings page (SCR-012) — placeholder only |
| 11 | 6 | 0 | Integration testing + QA |
| **Total** | **57** | **46** | **81% complete** |

### Test Summary

| Test Suite | Count | Status |
|------------|-------|--------|
| Inventory unit tests | 15 | All pass |
| PriceCalculator unit tests | 7 | All pass |
| CancellationService unit tests | 8 | All pass |
| BookingsService unit tests | 17 | All pass |
| PaymentsService unit tests | 11 | All pass |
| BookingScheduler unit tests | 5 | All pass |
| Bookings E2E tests | 14 | All pass |
| **Total new tests** | **77** | **All pass** |
| **Total server tests** | **131** | **All pass** |

### Files Created/Modified

<details>
<summary>Backend (26 files)</summary>

**Schema & Seed:**
- `prisma/schema.prisma` — Extended Booking, Payment, Refund models
- `prisma/migrations/20260210095252_add_booking_feature_fields/` — Migration
- `prisma/seed.ts` — 5 bookings, 4 payments, 1 refund, 8 travelers

**Inventory Module (4 files):**
- `modules/inventory/inventory.module.ts`
- `modules/inventory/inventory.service.ts`
- `modules/inventory/inventory.constants.ts`
- `modules/inventory/inventory.service.spec.ts`

**Bookings Module (14 files):**
- `modules/bookings/bookings.module.ts`
- `modules/bookings/bookings.service.ts`
- `modules/bookings/bookings.controller.ts`
- `modules/bookings/bookings-admin.controller.ts`
- `modules/bookings/price-calculator.service.ts`
- `modules/bookings/cancellation.service.ts`
- `modules/bookings/constants/booking.constants.ts`
- `modules/bookings/dto/` — 6 DTO files
- `modules/bookings/*.spec.ts` — 3 unit test files
- `test/bookings.e2e-spec.ts`

**Payments Module (6 files):**
- `modules/payments/payments.module.ts`
- `modules/payments/payments.service.ts`
- `modules/payments/payments.controller.ts`
- `modules/payments/stripe.service.ts`
- `modules/payments/webhook.controller.ts`
- `modules/payments/dto/create-payment.dto.ts`
- `modules/payments/payments.service.spec.ts`

**Scheduler Module (3 files):**
- `modules/scheduler/scheduler.module.ts`
- `modules/scheduler/booking-scheduler.service.ts`
- `modules/scheduler/booking-scheduler.service.spec.ts`

**Config:**
- `app.module.ts` — Added BookingsModule, PaymentsModule, SchedulerModule
- `main.ts` — Added Swagger tags for bookings, payments, webhooks

</details>

<details>
<summary>Frontend (15 files)</summary>

**Types & API:**
- `lib/types/booking.ts` — 15 interfaces/types
- `lib/api/bookings.ts` — 8 API functions

**Components (8 files):**
- `components/bookings/booking-status-badge.tsx`
- `components/bookings/processing-steps.tsx`
- `components/bookings/confirmation-summary.tsx`
- `components/bookings/confirmation-next-steps.tsx`
- `components/bookings/booking-tabs.tsx`
- `components/bookings/booking-card-item.tsx`
- `components/bookings/cancel-booking-dialog.tsx`
- `components/bookings/booking-detail-modal.tsx`

**Pages (5 files):**
- `app/(site)/bookings/page.tsx` — My Bookings
- `app/(site)/bookings/loading.tsx` — Loading skeleton
- `app/(site)/bookings/processing/page.tsx` — Processing
- `app/(site)/bookings/[id]/confirmation/page.tsx` — Confirmation
- `app/admin/bookings/page.tsx` — Admin Bookings (placeholder)

</details>

### Swagger API Documentation

All booking/payment endpoints documented at `http://localhost:4000/api`:
- **bookings** — 6 user endpoints (JWT protected)
- **admin/bookings** — 4 admin endpoints (JWT + ADMIN role)
- **payments** — 2 payment endpoints (JWT protected)
- **webhooks** — Stripe webhook (excluded from Swagger UI)

### Remaining Work

1. **Admin Bookings UI** (Phase 10, Tasks 10.1–10.5) — Full admin table, filters, modals
2. **Integration & QA** (Phase 11) — End-to-end flow tests, manual QA, lint/format
3. **CSV Export** (Task 3.11) — Admin bookings export deferred
