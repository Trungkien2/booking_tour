# Design: Remove Booking Processing Page

## Architecture — Before vs After

```
BEFORE:
┌──────────────┐     ┌────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│ /bookings/   │────▶│ Stripe Checkout│────▶│ /bookings/processing│────▶│ /bookings/{id}/  │
│ {id}/pay     │     │ (external)     │     │ (polls status)      │     │ confirmation     │
└──────────────┘     └────────────────┘     └─────────────────────┘     └──────────────────┘
    returnUrl =                              Stripe success_url           Final destination
    /bookings/processing?booking_id=X        redirects here

AFTER:
┌──────────────┐     ┌────────────────┐     ┌──────────────────────────┐
│ /bookings/   │────▶│ Stripe Checkout│────▶│ /bookings/{id}/          │
│ {id}/pay     │     │ (external)     │     │ confirmation             │
└──────────────┘     └────────────────┘     └──────────────────────────┘
    returnUrl =                              Stripe success_url redirects
    /bookings/{id}/confirmation              here; calls verifyPayment()
```

## Key Flow Change

```
┌─────────────────────────────────────────────────────────────────────┐
│  /bookings/{id}/pay                                                 │
│       │                                                             │
│       ├─ createPayment(returnUrl = "/bookings/{id}/confirmation")   │
│       └─ window.location.href = checkoutUrl → Stripe                │
│                                                                     │
│  Stripe success → /bookings/{id}/confirmation                       │
│  Stripe cancel  → /bookings/{id}                                    │
│                                                                     │
│  /bookings/{id}/confirmation (on mount)                             │
│       │                                                             │
│       ├─ verifyPayment(bookingId, token)                            │
│       │    └─ Checks Stripe session → finalizePayment if paid       │
│       │    └─ Returns { paymentStatus, bookingStatus }              │
│       │                                                             │
│       ├─ If bookingStatus === "PAID" → show confirmation UI         │
│       ├─ If still PENDING → brief retry (up to 3 attempts, 2s gap) │
│       └─ If CANCELLED/FAILED → show error with link to /bookings   │
│                                                                     │
│  Webhook fires independently (idempotent, no conflict)              │
└─────────────────────────────────────────────────────────────────────┘
```

## Stripe URL Pattern Changes

### StripeService.createCheckoutSession

Currently the `returnUrl` is the full URL to `/bookings/processing?booking_id=X`. The success and cancel URLs are built from it:

```typescript
// BEFORE
success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`
cancel_url:  `${returnUrl}?cancelled=true&booking_id=${booking.id}`
// returnUrl = "http://localhost:3000/bookings/processing?booking_id=5"

// AFTER
success_url: `${returnUrl}?payment_status=success`
cancel_url:  `${cancelUrl}`
```

The pay page will now pass two separate URLs instead of one `returnUrl`:
- `returnUrl` = `origin/bookings/{id}/confirmation`
- `cancelUrl` = `origin/bookings/{id}`

This requires a small API change: `createPayment` and `createCheckoutSession` accept `cancelUrl` alongside `returnUrl`.

### Alternative: Keep Single returnUrl

To minimize backend changes, the pay page can pass `returnUrl = origin/bookings/{id}/confirmation` and the backend builds both URLs from it:

```typescript
success_url: `${returnUrl}?payment_status=success`
cancel_url:  `${returnUrl.replace('/confirmation', '')}`
```

**Decision**: Keep single `returnUrl` approach — simpler, fewer changes. The cancel URL is derived by stripping `/confirmation` from the return URL.

## Confirmation Page Changes

The confirmation page currently:
1. Calls `getBookingDetail(id, token)` on mount
2. Renders booking summary immediately

New behavior:
1. Call `verifyPayment(id, token)` first on mount
2. If `bookingStatus === 'PAID'` → proceed to fetch booking detail and render
3. If still `PENDING` → retry `verifyPayment` up to 3 times with 2s intervals
4. If still not PAID after retries → show message: "Payment is being processed. Check your bookings page for updates."
5. If `CANCELLED` or `FAILED` → show error state

This adds a brief "Confirming your payment..." loading state at the top of the existing flow. The existing skeleton loading UI covers this naturally.

## Files Deleted

| File | Reason |
|------|--------|
| `apps/web/app/(site)/bookings/processing/page.tsx` | Entire processing page removed |
| `apps/web/components/bookings/processing-steps.tsx` | Only used by processing page |

## Files Modified

| File | Change |
|------|--------|
| `apps/web/app/(site)/bookings/[id]/pay/page.tsx` | Change `returnUrl` from `/bookings/processing?booking_id=X` to `/bookings/{id}/confirmation` |
| `apps/server/src/modules/payments/stripe.service.ts` | Update `success_url` and `cancel_url` patterns |
| `apps/web/app/(site)/bookings/[id]/confirmation/page.tsx` | Add `verifyPayment` call on mount with retry logic |

## Backend Cleanup (Optional)

| Symbol | File | Action |
|--------|------|--------|
| `buildProcessingSteps` | `bookings.service.ts` | Remove — only used by `getBookingStatus` |
| `getBookingStatus` | `bookings.service.ts` | Keep but simplify — remove steps, return only `{ bookingId, status }`. Used by controller endpoint which may be called elsewhere. |
| `getBookingStatus` | `bookings.controller.ts` | Keep endpoint — useful for general status checks |

## Design Decisions

1. **Verify-first on confirmation page** — `verifyPayment` is called before `getBookingDetail`. This ensures the booking is finalized before we try to display it. If the webhook hasn't fired yet, `verifyPayment` checks Stripe directly and finalizes synchronously.

2. **Limited retries, not infinite polling** — Max 3 retries (6 seconds total) instead of the old 5-minute poll. If payment isn't confirmed after that, something is actually wrong — show a helpful message instead of spinning forever.

3. **Keep webhook handler unchanged** — The webhook remains as a reliable fallback. `finalizePayment` is idempotent, so both the webhook and `verifyPayment` can call it without conflict.

4. **Derive cancel URL from returnUrl** — Avoids changing the `createPayment` API signature. Cancel redirects to `/bookings/{id}` (booking detail page) where the user can retry payment.

5. **Keep `getBookingStatus` endpoint** — Even though the processing page is gone, the endpoint is useful for general status polling (e.g., from the bookings list). Just remove the `steps` array from its response.
