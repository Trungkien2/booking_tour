# Admin Refund Management + Stripe Refund Processing

## Problem

1. **Refunds are never processed through Stripe** — Both user cancellation and admin cancellation create `Refund` records with `status: 'PENDING'`, but nothing ever calls `StripeService.createRefund()` to actually refund money to the user.

2. **No admin UI to manage refunds** — Admin can see refund records on the booking detail page but cannot process, approve, or manage them. There's no centralized view of all pending refunds.

## Proposed Changes

### A. Stripe Refund Processing

When a refund record is created (via user cancel or admin cancel), process it through Stripe immediately within the same flow. Update the refund record with the Stripe refund ID and mark it as `COMPLETED`.

### B. Admin Refunds Page

Add `/admin/refunds` page showing all refunds with filtering by status. Admin can:
- View all refunds (PENDING, PROCESSING, COMPLETED, FAILED)
- Process pending refunds manually (retry failed ones)
- See which booking/payment each refund belongs to

## Scope

### In scope
- Process refunds through Stripe in `cancelBooking` (user cancel)
- Process refunds through Stripe in `adminUpdateStatus` (admin cancel)
- New `GET /api/admin/refunds` endpoint with filters
- New `POST /api/admin/refunds/:id/process` endpoint to manually process a pending refund
- New `/admin/refunds` page with table, filters, and process action
- Add "Refunds" to admin sidebar navigation

### Out of scope
- Partial refunds UI (backend already supports via `adminCreateRefund`)
- Refund email notifications
- Refund analytics/reports
