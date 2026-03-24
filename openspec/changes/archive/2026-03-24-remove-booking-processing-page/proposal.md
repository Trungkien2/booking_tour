# Remove Booking Processing Page — Direct Stripe-to-Confirmation Flow

## Problem

The current booking payment flow includes an intermediate "processing" page (`/bookings/processing`) that serves as a waiting room between Stripe Checkout and the confirmation page. This page polls `GET /bookings/{id}/status` every 2 seconds, waiting for the Stripe webhook to fire and flip the booking to `PAID`, then redirects to confirmation.

This is unnecessary because:
1. **Stripe already handles the payment UX** — the user waits on Stripe's hosted page, not ours
2. **`verifyPayment` already exists** — it checks Stripe session status directly and finalizes the booking synchronously, without depending on webhook timing
3. **The processing steps are cosmetic** — inventory is reserved at booking creation (pre-payment), so "Reserving Spots" and "Booking Confirmed" steps flip instantly once the webhook fires. There's no real async work happening.

## Proposed Change

Redirect users directly from Stripe Checkout to `/bookings/{id}/confirmation`, eliminating the processing page entirely.

### Current Flow
```
/bookings/{id}/pay → Stripe Checkout → /bookings/processing (poll loop) → /bookings/{id}/confirmation
```

### New Flow
```
/bookings/{id}/pay → Stripe Checkout → /bookings/{id}/confirmation
```

The confirmation page will call `verifyPayment` on mount to synchronously finalize the booking (if the webhook hasn't already). This handles the race condition where Stripe redirects the user before the webhook arrives.

## Scope

### In scope
- Change `returnUrl` in `/bookings/[id]/pay/page.tsx` to point to confirmation page
- Update `StripeService.createCheckoutSession` success/cancel URL patterns
- Update `/bookings/[id]/confirmation/page.tsx` to call `verifyPayment` on mount and handle the brief "confirming payment" state
- Remove `/bookings/processing/` page
- Remove `ProcessingSteps` component
- Clean up `buildProcessingSteps` and `getBookingStatus` if no longer needed elsewhere

### Out of scope
- Changes to the booking creation flow
- Changes to inventory reservation logic
- Changes to the webhook handler (it remains as a fallback, idempotent)
- Changes to the cancellation flow

## Non-goals
- Adding new post-payment processing steps (e.g., ticket generation, email notifications)
- Changing when inventory is reserved (pre-payment vs post-payment)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `verifyPayment` fails (Stripe API error) | Falls back to polling or showing "check your bookings" message. Webhook still finalizes eventually. |
| User lands on confirmation before payment is processed | Confirmation page shows brief loading state while `verifyPayment` runs |
| Stripe cancel redirect needs a destination | Redirect to `/bookings/{id}` (booking detail) instead of processing page |

## Files Affected

| File | Change |
|------|--------|
| `apps/web/app/(site)/bookings/[id]/pay/page.tsx` | Update `returnUrl` |
| `apps/server/src/modules/payments/stripe.service.ts` | Adjust URL patterns |
| `apps/web/app/(site)/bookings/[id]/confirmation/page.tsx` | Add `verifyPayment` call on mount |
| `apps/web/app/(site)/bookings/processing/page.tsx` | **Delete** |
| `apps/web/components/bookings/processing-steps.tsx` | **Delete** |
| `apps/server/src/modules/bookings/bookings.service.ts` | Remove `buildProcessingSteps`, evaluate `getBookingStatus` |
| `apps/web/lib/api/bookings.ts` | Remove `getBookingStatus` client function if unused |
| `apps/web/lib/types/booking.ts` | Remove `BookingStatusResponse` type if unused |
