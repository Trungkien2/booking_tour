# Design: Admin Refund Management

## A. Stripe Refund Processing

### Flow Change

```
BEFORE:
cancelBooking() → Refund { status: 'PENDING' } → (nothing happens)

AFTER:
cancelBooking() → Refund { status: 'PENDING' }
                → PaymentsService.processRefund(refundId)
                → StripeService.createRefund(paymentIntentId, amount)
                → Refund { status: 'COMPLETED', gatewayRefundId, processedAt }
```

### processRefund Method (PaymentsService)

```typescript
async processRefund(refundId: number) {
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: { payment: true },
  });

  // Get payment intent from Stripe session
  const session = await stripeService.retrieveSession(refund.payment.transactionId);
  const paymentIntentId = session.payment_intent as string;

  try {
    const stripeRefund = await stripeService.createRefund(paymentIntentId, Number(refund.amount));

    await prisma.refund.update({
      where: { id: refundId },
      data: {
        status: 'COMPLETED',
        gatewayRefundId: stripeRefund.id,
        processedAt: new Date(),
      },
    });
  } catch (error) {
    await prisma.refund.update({
      where: { id: refundId },
      data: { status: 'FAILED' },
    });
    throw error;
  }
}
```

### Integration Points

1. **BookingsService.cancelBooking** — After creating the refund record in the transaction, call `processRefund` outside the transaction (Stripe call should not block DB transaction).

2. **BookingsService.adminUpdateStatus** — Same: after creating refund with `forceFullRefund`, process it.

3. Both flows: if Stripe refund fails, the refund record stays as `FAILED` but the booking cancellation still succeeds. Admin can retry later from the refunds page.

## B. Admin API Endpoints

### GET /api/admin/refunds

```typescript
// Query params
{
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  page?: number;    // default 1
  limit?: number;   // default 20
}

// Response
{
  refunds: Array<{
    id: number;
    amount: number;
    reason: string | null;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    gatewayRefundId: string | null;
    createdAt: string;
    processedAt: string | null;
    booking: {
      id: number;
      status: string;
      totalPrice: number;
      user: { id: number; fullName: string; email: string; };
    };
    payment: {
      id: number;
      provider: string;
      transactionId: string;
    };
  }>;
  pagination: { page, limit, total, totalPages };
  stats: {
    pending: number;
    completed: number;
    failed: number;
    totalRefunded: number;
  };
}
```

### POST /api/admin/refunds/:id/process

Manually trigger Stripe refund for a PENDING or FAILED refund.

```typescript
// Response: updated refund record
{
  id: number;
  status: 'COMPLETED' | 'FAILED';
  gatewayRefundId: string | null;
  processedAt: string | null;
}
```

## C. Admin Refunds Page

```
┌─────────────────────────────────────────────────────────────┐
│  Refunds                                                     │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐ │
│  │ Pending  │ │Completed │ │  Failed  │ │ Total Refunded │ │
│  │    3     │ │   12     │ │    1     │ │   $4,250.00    │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘ │
│                                                              │
│  Filter: [All ▼] [Status ▼]                                │
│                                                              │
│  ┌─────┬────────┬──────────┬────────┬────────────┬────────┐ │
│  │ ID  │Booking │ Customer │ Amount │   Status   │ Action │ │
│  ├─────┼────────┼──────────┼────────┼────────────┼────────┤ │
│  │ #5  │ #23    │ John D.  │ $350   │ ● PENDING  │[Process│ │
│  │ #4  │ #21    │ Jane S.  │ $500   │ ✓ COMPLETED│   —    │ │
│  │ #3  │ #18    │ Bob K.   │ $200   │ ✗ FAILED   │[Retry] │ │
│  └─────┴────────┴──────────┴────────┴────────────┴────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- Stats cards at top (pending count, completed count, failed count, total refunded)
- Table with refund records
- Filter by status
- "Process" button for PENDING refunds, "Retry" for FAILED
- Booking ID links to `/admin/bookings/{id}`

## Design Decisions

1. **Process refund outside transaction** — Stripe API call happens after DB transaction commits. If Stripe fails, the cancellation still succeeds; refund is marked FAILED and can be retried.

2. **Add to existing controllers** — Refund endpoints go on `BookingsAdminController` since refunds are tightly coupled to bookings. No separate RefundsModule needed.

3. **Sidebar nav update** — Replace the "Payments" link (which has no page) with "Refunds", or add "Refunds" as a separate entry.
