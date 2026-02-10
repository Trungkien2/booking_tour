# Technical Design Document: Booking Feature

## 1. Overview

### 1.1 Purpose

Tài liệu thiết kế kỹ thuật cho **Booking Feature** — bao gồm toàn bộ luồng đặt tour, thanh toán, quản lý đơn hàng và hủy/hoàn tiền. Feature này trải dài 4 màn hình frontend và 3 module backend mới.

### 1.2 Scope

**Included (4 screens + 3 backend modules):**

| Screen | Route | SCR ID |
|--------|-------|--------|
| Booking Processing | `/bookings/processing` | SCR-006 |
| Booking Confirmation | `/bookings/[id]/confirmation` | SCR-005 |
| My Bookings | `/bookings` | SCR-008 |
| Admin Bookings | `/admin/bookings` | SCR-012 |

| Backend Module | Trách nhiệm |
|---------------|-------------|
| Sales Module (`modules/bookings/`) | Booking CRUD, price calculation, cancellation |
| Inventory Module (extend `modules/tours/`) | Reserve/release stock, optimistic locking |
| Payment Module (`modules/payments/`) | Stripe integration, webhook, refund processing |

**Excluded:**
- Tour Detail page (đã Done — SCR-004)
- Review submission (separate feature)
- Modify booking (v2 — chỉ cancel trong v1)

### 1.3 Related Documents

- [business-logic-booking.md](../../business-logic-booking.md) — Luồng xử lý chi tiết
- [business-rules-booking.md](../../business-rules-booking.md) — 18 invariant rules
- [api-contract-booking.md](../../api-contract-booking.md) — API endpoint specs

### 1.4 Related Features

- **Tour Detail** (SCR-004, Done): BookingCard → `POST /bookings`
- **User Auth** (SCR-001, Done): JWT required cho booking
- **Admin Tours** (Done): Tour + Schedule data

---

## 2. Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority | Screen |
|----|-------------|----------|--------|
| FR-001 | User tạo booking với travelers info | Must | Tour Detail → Processing |
| FR-002 | Hệ thống reserve stock ngay khi tạo PENDING | Must | Backend |
| FR-003 | User thanh toán qua Stripe | Must | Processing |
| FR-004 | Hệ thống tự động cancel đơn PENDING quá 15 phút | Must | Backend |
| FR-005 | User xem trang processing với progress steps | Must | Processing |
| FR-006 | User xem trang confirmation với booking summary | Must | Confirmation |
| FR-007 | User xem danh sách bookings (upcoming/completed/cancelled) | Must | My Bookings |
| FR-008 | User hủy booking với hiển thị refund preview | Must | My Bookings |
| FR-009 | User xem chi tiết booking | Must | My Bookings |
| FR-010 | Admin xem tất cả bookings với filters | Must | Admin Bookings |
| FR-011 | Admin cập nhật status booking | Must | Admin Bookings |
| FR-012 | Admin xử lý refund thủ công | Should | Admin Bookings |
| FR-013 | Admin export bookings CSV | Should | Admin Bookings |
| FR-014 | Admin xem statistics (revenue, booking count, occupancy) | Should | Admin Bookings |
| FR-015 | Gửi email xác nhận sau khi thanh toán thành công | Should | Backend |

### 2.2 User Stories

| Story | Description |
|-------|-------------|
| US-001 | Là khách, tôi muốn đặt tour và thanh toán online để có vé ngay |
| US-002 | Là khách, tôi muốn xem trạng thái đặt tour realtime trong khi chờ xử lý |
| US-003 | Là khách, tôi muốn xem tóm tắt booking sau khi thanh toán thành công |
| US-004 | Là khách, tôi muốn quản lý các đơn đặt tour (xem, hủy) |
| US-005 | Là khách, tôi muốn biết chính sách hoàn tiền trước khi hủy |
| US-006 | Là admin, tôi muốn quản lý tất cả bookings, cập nhật status, xử lý refund |

### 2.3 Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Create booking API < 500ms (bao gồm transaction) |
| **Performance** | My Bookings list API < 200ms |
| **Reliability** | Optimistic locking cho mọi thay đổi inventory |
| **Reliability** | Webhook idempotent (xử lý duplicate events) |
| **Security** | User chỉ xem/hủy booking của mình |
| **Security** | Webhook signature verification bắt buộc |
| **Security** | Admin endpoints yêu cầu ADMIN role |
| **Consistency** | PENDING TTL = 15 phút, background job chạy mỗi phút |

---

## 3. Technical Design

### 3.1 Database Schema Changes

#### 3.1.1 Extend Booking Model

```prisma
model Booking {
  id          Int           @id @default(autoincrement())
  userId      Int           @map("user_id")
  scheduleId  Int           @map("schedule_id")
  bookingDate DateTime      @default(now()) @map("booking_date")
  totalPrice  Decimal       @map("total_price") @db.Decimal(12, 2)
  status      BookingStatus @default(PENDING)
  note        String?

  // NEW FIELDS
  cancelledAt   DateTime?   @map("cancelled_at")
  cancelReason  String?     @map("cancel_reason")
  expiresAt     DateTime    @map("expires_at")  // bookingDate + 15 min

  user      User            @relation(fields: [userId], references: [id])
  schedule  TourSchedule    @relation(fields: [scheduleId], references: [id])
  travelers BookingTraveler[]
  payments  Payment[]
  refunds   Refund[]

  @@index([userId])
  @@index([status])
  @@index([bookingDate])
  @@index([expiresAt])
  @@map("bookings")
}
```

#### 3.1.2 Extend Payment Model

```prisma
model Payment {
  id            Int           @id @default(autoincrement())
  bookingId     Int           @map("booking_id")
  userId        Int           @map("user_id")
  amount        Decimal       @db.Decimal(12, 2)
  provider      String        // 'stripe', 'paypal'
  transactionId String        @map("transaction_id")
  status        PaymentStatus
  createdAt     DateTime      @default(now()) @map("created_at")

  // NEW FIELDS
  checkoutUrl   String?       @map("checkout_url")
  expiresAt     DateTime?     @map("expires_at")

  booking Booking @relation(fields: [bookingId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
  refunds Refund[]

  @@index([bookingId])
  @@index([transactionId])
  @@map("payments")
}
```

#### 3.1.3 Extend Refund Model

```prisma
model Refund {
  id              Int          @id @default(autoincrement())
  bookingId       Int          @map("booking_id")
  paymentId       Int          @map("payment_id")
  amount          Decimal      @db.Decimal(12, 2)
  reason          String?
  status          RefundStatus @default(PENDING)
  gatewayRefundId String?      @map("gateway_refund_id")
  createdAt       DateTime     @default(now()) @map("created_at")

  // NEW FIELD
  processedAt     DateTime?    @map("processed_at")

  booking Booking @relation(fields: [bookingId], references: [id])
  payment Payment @relation(fields: [paymentId], references: [id])

  @@index([bookingId])
  @@index([status])
  @@map("refunds")
}
```

#### 3.1.4 Migration

```bash
cd apps/server
pnpm prisma migrate dev --name add_booking_feature_fields
```

---

### 3.2 Backend Implementation (NestJS)

#### 3.2.1 Module Structure

```
apps/server/src/modules/
├── bookings/                          # NEW - Sales Module
│   ├── bookings.module.ts
│   ├── bookings.controller.ts         # User endpoints: /bookings/*
│   ├── bookings-admin.controller.ts   # Admin endpoints: /admin/bookings/*
│   ├── bookings.service.ts            # Core booking logic
│   ├── price-calculator.service.ts    # Pricing logic (Rule P1, P2, P3)
│   ├── cancellation.service.ts        # Cancel + refund calculation (Rule C1-C5)
│   ├── dto/
│   │   ├── create-booking.dto.ts
│   │   ├── booking-query.dto.ts
│   │   ├── cancel-booking.dto.ts
│   │   └── admin-booking-query.dto.ts
│   └── constants/
│       └── booking.constants.ts       # TTL, TAX_RATE, refund tiers
├── payments/                          # NEW - Payment Module
│   ├── payments.module.ts
│   ├── payments.controller.ts         # /bookings/:id/payment/*
│   ├── payments.service.ts
│   ├── stripe.service.ts              # Stripe SDK wrapper
│   ├── webhook.controller.ts          # POST /webhooks/stripe
│   └── dto/
│       ├── create-payment.dto.ts
│       └── webhook-event.dto.ts
├── inventory/                         # NEW - Inventory Module
│   ├── inventory.module.ts
│   ├── inventory.service.ts           # reserveStock, releaseStock, checkAvailability
│   └── inventory.constants.ts         # BOOKING_CUTOFF_HOURS = 24
├── scheduler/                         # NEW - Background Jobs
│   ├── scheduler.module.ts
│   └── booking-scheduler.service.ts   # Cron jobs
└── tours/                             # EXISTING - extend
    └── tours-public.service.ts        # checkAvailability đã có
```

#### 3.2.2 API Endpoints Summary

**User Booking (`/bookings`):**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/bookings` | Tạo booking mới | JWT |
| GET | `/bookings/me` | Danh sách booking user | JWT |
| GET | `/bookings/:id` | Chi tiết booking | JWT (owner) |
| GET | `/bookings/:id/status` | Poll status (processing) | JWT (owner) |
| GET | `/bookings/:id/cancellation-preview` | Xem trước refund | JWT (owner) |
| PATCH | `/bookings/:id/cancel` | Hủy booking | JWT (owner) |

**Payment (`/bookings/:id/payment`):**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/bookings/:id/payment` | Tạo payment intent | JWT |
| POST | `/bookings/:id/payment/verify` | Verify payment (fallback) | JWT |
| POST | `/webhooks/stripe` | Stripe webhook | Signature |

**Admin (`/admin/bookings`):**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/bookings` | List all bookings | ADMIN |
| GET | `/admin/bookings/:id` | Booking detail | ADMIN |
| PATCH | `/admin/bookings/:id/status` | Update status | ADMIN |
| POST | `/admin/bookings/:id/refund` | Manual refund | ADMIN |
| GET | `/admin/bookings/export` | Export CSV | ADMIN |

#### 3.2.3 Core Service: BookingsService

```typescript
@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private inventory: InventoryService,
    private priceCalc: PriceCalculatorService,
    private cancellation: CancellationService,
  ) {}

  /**
   * Create booking with stock reservation
   * Rules: I1, I2, I4, P1, P2, P3, S1, S3, B1
   */
  async createBooking(userId: number, dto: CreateBookingDto): Promise<Booking> {
    // 1. Validate min 1 adult (B1)
    // 2. Load schedule + tour
    // 3. Validate cutoff 24h (S1), status OPEN (S3)
    // 4. Calculate price per traveler (P1, P3)
    // 5. Transaction:
    //    a. reserveStock (I1, I2, I4) — throws ConflictException
    //    b. Create Booking (PENDING, expiresAt = now + 15min)
    //    c. Create BookingTraveler[] with snapshot price (P2)
    // 6. Return booking
  }

  /**
   * Get user bookings with tabs count
   */
  async getUserBookings(userId: number, query: BookingQueryDto) {
    // Filter by status tab, search, sort, paginate
    // Include tour, schedule info
    // Calculate canCancel, canModify per booking
    // Return tabs count: { upcoming, completed, cancelled }
  }

  /**
   * Get booking detail (with ownership check)
   */
  async getBookingDetail(bookingId: number, userId: number) {
    // Load full booking with relations
    // Check ownership (userId match)
    // Include cancellation preview (refund estimate)
    // Return full detail
  }

  /**
   * Get booking status for polling
   */
  async getBookingStatus(bookingId: number, userId: number) {
    // Return status + steps for processing page
  }

  /**
   * Cancel booking
   * Rules: B3, C1-C5, I3, I4
   */
  async cancelBooking(bookingId: number, userId: number, dto: CancelBookingDto) {
    // 1. Validate ownership + status guard (B3)
    // 2. Calculate refund (C1, C2, C3)
    // 3. If late cancel + no confirm → reject (C4)
    // 4. Transaction:
    //    a. Booking.status → CANCELLED
    //    b. Create Refund if applicable
    //    c. releaseStock (I3, I4)
    //    d. Auto OPEN if was SOLD_OUT (S2)
    // 5. Return cancel result
  }
}
```

#### 3.2.4 Core Service: InventoryService

```typescript
@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Reserve stock with optimistic locking
   * Rules: I1, I2, I4
   */
  async reserveStock(scheduleId: number, travelers: number): Promise<void> {
    const schedule = await this.prisma.tourSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule || schedule.status !== 'OPEN') {
      throw new BadRequestException('Schedule not available');
    }

    if (schedule.currentCapacity + travelers > schedule.maxCapacity) {
      throw new BadRequestException('Not enough spots');
    }

    const result = await this.prisma.tourSchedule.updateMany({
      where: { id: scheduleId, version: schedule.version },
      data: {
        currentCapacity: { increment: travelers },
        version: { increment: 1 },
        status: (schedule.currentCapacity + travelers >= schedule.maxCapacity)
          ? 'SOLD_OUT' : undefined,
      },
    });

    if (result.count === 0) {
      throw new ConflictException('Schedule modified, please retry');
    }
  }

  /**
   * Release stock (cancel/timeout)
   * Rules: I3, I4, S2
   */
  async releaseStock(scheduleId: number, travelers: number): Promise<void> {
    // Similar optimistic lock pattern
    // Auto revert SOLD_OUT → OPEN if capacity freed
  }
}
```

#### 3.2.5 Core Service: PriceCalculatorService

```typescript
@Injectable()
export class PriceCalculatorService {
  /**
   * Calculate price breakdown
   * Rules: P1, P3
   */
  calculatePrice(tour: Tour, travelers: TravelerInput[]): PriceBreakdown {
    let subtotal = 0;
    const travelerPrices = travelers.map(t => {
      let price: number;
      switch (t.ageGroup) {
        case 'ADULT':  price = Number(tour.priceAdult); break;
        case 'CHILD':  price = Number(tour.priceChild) * 0.75; break;
        case 'BABY':   price = 0; break;
      }
      subtotal += price;
      return { ...t, price: Math.round(price * 100) / 100 };
    });

    const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + taxes) * 100) / 100;

    return { travelerPrices, subtotal, taxes, total };
  }
}
```

#### 3.2.6 Core Service: CancellationService

```typescript
@Injectable()
export class CancellationService {
  /**
   * Calculate refund based on cancellation policy
   * Rules: C1, C2, C3
   */
  calculateRefund(booking: Booking, schedule: TourSchedule): CancellationPreview {
    if (booking.status === 'PENDING') {
      return { tier: 'free', refundPercentage: 100, refundAmount: 0, isPending: true };
    }

    const daysUntil = differenceInDays(schedule.startDate, new Date());
    let refundPercentage: number;
    let tier: string;

    if (daysUntil >= 15) {
      refundPercentage = 70; tier = 'early';
    } else if (daysUntil >= 2) {
      refundPercentage = 50; tier = 'standard';
    } else {
      refundPercentage = 0; tier = 'late';
    }

    const refundAmount = Math.round(Number(booking.totalPrice) * refundPercentage) / 100;

    return {
      tier,
      refundPercentage,
      refundAmount,
      penaltyAmount: Number(booking.totalPrice) - refundAmount,
      daysUntilDeparture: daysUntil,
      requiresConfirmation: refundPercentage === 0,
    };
  }
}
```

#### 3.2.7 Background Jobs: BookingSchedulerService

```typescript
@Injectable()
export class BookingSchedulerService {
  constructor(
    private bookings: BookingsService,
    private inventory: InventoryService,
  ) {}

  /**
   * Run every minute: expire pending bookings
   * Rule: B2
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async expirePendingBookings() {
    const expired = await this.prisma.booking.findMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: new Date() },
      },
      include: { travelers: true },
    });

    for (const booking of expired) {
      await this.prisma.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: 'CANCELLED', cancelReason: 'expired' },
        });
        await this.inventory.releaseStock(
          booking.scheduleId,
          booking.travelers.length,
        );
      });
    }
  }

  /**
   * Run daily at midnight: close past schedules
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async closePastSchedules() {
    await this.prisma.tourSchedule.updateMany({
      where: {
        startDate: { lt: new Date() },
        status: { in: ['OPEN', 'SOLD_OUT'] },
      },
      data: { status: 'COMPLETED' },
    });
  }
}
```

#### 3.2.8 Stripe Integration: StripeService

```typescript
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'));
  }

  async createCheckoutSession(booking: Booking, returnUrl: string) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Booking #${booking.id}` },
          unit_amount: Math.round(Number(booking.totalPrice) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?cancelled=true`,
      metadata: { bookingId: String(booking.id) },
    });
  }

  async verifyWebhookSignature(payload: Buffer, signature: string): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.config.get('STRIPE_WEBHOOK_SECRET'),
    );
  }

  async createRefund(paymentIntentId: string, amount: number) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
    });
  }
}
```

---

### 3.3 Frontend Implementation (Next.js)

#### 3.3.1 Routes & Pages

| Route | Page | Layout | Auth |
|-------|------|--------|------|
| `/bookings/processing` | Processing page (poll status) | Minimal | JWT |
| `/bookings/[id]/confirmation` | Confirmation page | Site | JWT |
| `/bookings` | My Bookings list | Site | JWT |
| `/admin/bookings` | Admin Bookings | Admin | ADMIN |

#### 3.3.2 Components Structure

```
apps/web/
├── app/
│   ├── (site)/
│   │   └── bookings/
│   │       ├── page.tsx                          # My Bookings list
│   │       ├── loading.tsx
│   │       ├── processing/
│   │       │   └── page.tsx                      # Processing (minimal layout)
│   │       └── [id]/
│   │           └── confirmation/
│   │               └── page.tsx                  # Confirmation
│   └── admin/
│       └── bookings/
│           └── page.tsx                          # Admin Bookings
├── components/
│   └── bookings/
│       ├── booking-card-item.tsx                 # Card in My Bookings list
│       ├── booking-detail-modal.tsx              # Detail popup
│       ├── booking-status-badge.tsx              # Status chip
│       ├── booking-tabs.tsx                      # Upcoming/Completed/Cancelled tabs
│       ├── cancel-booking-dialog.tsx             # Cancel confirm dialog
│       ├── processing-steps.tsx                  # Progress steps animation
│       ├── confirmation-summary.tsx              # Booking summary card
│       ├── confirmation-next-steps.tsx           # What happens next
│       └── admin/
│           ├── admin-bookings-table.tsx          # DataTable
│           ├── admin-bookings-stats.tsx          # Stats cards
│           ├── admin-bookings-filters.tsx        # Search + filters
│           ├── admin-status-update-modal.tsx     # Update status
│           └── admin-refund-modal.tsx            # Manual refund
├── lib/
│   ├── api/
│   │   └── bookings.ts                          # All booking API functions
│   └── types/
│       └── booking.ts                           # Booking TypeScript types
```

#### 3.3.3 Types

**File: `lib/types/booking.ts`**

```typescript
export type BookingStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type RefundStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface BookingTraveler {
  id: number;
  fullName: string;
  gender?: string;
  ageGroup: 'ADULT' | 'CHILD' | 'BABY';
  price: number;
}

export interface BookingListItem {
  id: number;
  status: BookingStatus;
  bookingDate: string;
  totalPrice: number;
  travelerCount: number;
  tour: {
    id: number;
    name: string;
    slug: string;
    coverImage: string;
    location: string;
    durationDays: number;
  };
  schedule: {
    id: number;
    startDate: string;
  };
  canCancel: boolean;
  canModify: boolean;
}

export interface BookingDetail extends BookingListItem {
  note?: string;
  travelers: BookingTraveler[];
  priceBreakdown: {
    adults: { count: number; unitPrice: number; total: number };
    children: { count: number; unitPrice: number; total: number };
    infants: { count: number; unitPrice: number; total: number };
    subtotal: number;
    taxes: number;
    total: number;
  };
  tour: BookingListItem['tour'] & {
    images: string[];
    meetingPoint?: {
      name: string;
      address: string;
      coordinates: { lat: number; lng: number };
      instructions: string;
    };
    cancellationPolicy?: string;
  };
  payments: Array<{
    id: number;
    amount: number;
    provider: string;
    status: PaymentStatus;
    createdAt: string;
  }>;
  refunds: Array<{
    id: number;
    amount: number;
    status: RefundStatus;
    reason?: string;
    createdAt: string;
  }>;
  cancellation: {
    canCancel: boolean;
    daysUntilDeparture: number;
    refundPercentage: number;
    estimatedRefund: number;
  };
}

export interface BookingStatusResponse {
  bookingId: number;
  status: BookingStatus;
  steps: Array<{
    id: string;
    label: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
  }>;
  redirectUrl: string | null;
}

export interface CancellationPreview {
  bookingId: number;
  daysUntilDeparture: number;
  cancellationPolicy: {
    tier: 'free' | 'early' | 'standard' | 'late';
    refundPercentage: number;
    penaltyPercentage: number;
    description: string;
  };
  refundEstimate: {
    totalPaid: number;
    refundAmount: number;
    penaltyAmount: number;
  };
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

export interface CreateBookingPayload {
  scheduleId: number;
  travelers: Array<{
    fullName: string;
    gender?: string;
    ageGroup: 'ADULT' | 'CHILD' | 'BABY';
  }>;
  note?: string;
}

export interface BookingsListResponse {
  bookings: BookingListItem[];
  tabs: { upcoming: number; completed: number; cancelled: number };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

#### 3.3.4 API Client

**File: `lib/api/bookings.ts`**

```typescript
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function createBooking(payload: CreateBookingPayload, token: string) {
  const res = await fetch(`${API}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getUserBookings(params: Record<string, string>, token: string) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/bookings/me?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json() as Promise<BookingsListResponse>;
}

export async function getBookingDetail(id: number, token: string) {
  const res = await fetch(`${API}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json() as Promise<BookingDetail>;
}

export async function getBookingStatus(id: number, token: string) {
  const res = await fetch(`${API}/bookings/${id}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json() as Promise<BookingStatusResponse>;
}

export async function getCancellationPreview(id: number, token: string) {
  const res = await fetch(`${API}/bookings/${id}/cancellation-preview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json() as Promise<CancellationPreview>;
}

export async function cancelBooking(id: number, body: { reason?: string; confirmNoRefund?: boolean }, token: string) {
  const res = await fetch(`${API}/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createPayment(bookingId: number, provider: string, token: string) {
  const res = await fetch(`${API}/bookings/${bookingId}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ provider, returnUrl: `${window.location.origin}/bookings/processing` }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function verifyPayment(bookingId: number, token: string) {
  const res = await fetch(`${API}/bookings/${bookingId}/payment/verify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
```

---

### 3.4 Logic Flows

#### 3.4.1 Create Booking + Payment Flow

```
User (Tour Detail)                Frontend                     Backend
     │                               │                           │
     │─── Click "Book Now" ─────────>│                           │
     │                               │── POST /bookings ────────>│
     │                               │                           │── Transaction:
     │                               │                           │   reserveStock()
     │                               │                           │   create Booking (PENDING)
     │                               │                           │   create BookingTraveler[]
     │                               │<── 201 { booking } ──────│
     │                               │                           │
     │                               │── POST /bookings/:id/    │
     │                               │   payment ──────────────>│
     │                               │                           │── Stripe.createCheckout()
     │                               │<── { checkoutUrl } ──────│
     │                               │                           │
     │<── Redirect to Stripe ────────│                           │
     │                               │                           │
     │─── Pay on Stripe ────────────>│ (Stripe)                  │
     │                               │                           │
     │<── Redirect to /processing ───│                           │
     │                               │                           │
     │                               │── Poll GET /status ──────>│ (every 2s)
     │                               │<── { steps, status } ────│
     │                               │                           │
     │                               │     (Webhook arrives) ───>│── Payment.status → SUCCESS
     │                               │                           │── Booking.status → PAID
     │                               │                           │── Send email
     │                               │                           │
     │                               │── Poll GET /status ──────>│
     │                               │<── { redirectUrl } ──────│
     │                               │                           │
     │<── Redirect to /confirmation ─│                           │
```

#### 3.4.2 Cancel Booking Flow

```
User (My Bookings)               Frontend                     Backend
     │                               │                           │
     │─── Click "Cancel" ───────────>│                           │
     │                               │── GET /cancellation-     │
     │                               │   preview ──────────────>│
     │                               │<── { refundEstimate } ──│
     │                               │                           │
     │<── Show confirm dialog ───────│                           │
     │                               │                           │
     │─── Confirm cancel ───────────>│                           │
     │                               │── PATCH /cancel ────────>│
     │                               │                           │── Transaction:
     │                               │                           │   Booking → CANCELLED
     │                               │                           │   Create Refund
     │                               │                           │   releaseStock()
     │                               │<── { result } ──────────│
     │                               │                           │
     │<── Show success + refund info─│                           │
```

---

### 3.5 Security & Performance

#### 3.5.1 Security

| Measure | Implementation |
|---------|---------------|
| Ownership check | `booking.userId === req.user.userId` trên mọi user endpoint |
| Admin guard | `@Roles('ADMIN')` + `RolesGuard` trên `/admin/*` |
| Webhook verify | `stripe.webhooks.constructEvent()` với signing secret |
| Idempotency | Check payment status trước khi update (skip nếu đã SUCCESS) |
| Input validation | DTOs với class-validator |
| Rate limiting | 5 req/min trên `POST /bookings` (chống spam) |

#### 3.5.2 Performance

| Optimization | Implementation |
|-------------|---------------|
| Transaction scope | Minimize transaction thời gian (chỉ DB ops) |
| Index trên booking queries | userId, status, bookingDate, expiresAt |
| Paginated list | Default 10/page, max 50 |
| Polling interval | 2s cho processing, stop sau 5 phút |
| Background job | `@nestjs/schedule` với `@Cron` |

---

## 4. Testing Plan

### 4.1 Backend Unit Tests

```
BookingsService:
  - createBooking: happy path, min 1 adult, cutoff 24h, full capacity
  - getUserBookings: filter by tab, pagination, search
  - getBookingDetail: ownership check, 404
  - cancelBooking: PENDING free, early/standard/late refund, confirm required

InventoryService:
  - reserveStock: success, overbooking reject, optimistic lock conflict
  - releaseStock: success, auto revert SOLD_OUT

PriceCalculatorService:
  - calculatePrice: adult/child/baby pricing, tax rounding

CancellationService:
  - calculateRefund: 15d+/2-14d/<2d tiers, PENDING free cancel

BookingSchedulerService:
  - expirePendingBookings: finds expired, cancels, releases stock
  - closePastSchedules: updates past schedules

StripeService:
  - createCheckoutSession, verifyWebhookSignature, createRefund
```

### 4.2 Backend E2E Tests

```
POST /bookings:        201 success, 400 validation, 409 conflict
GET /bookings/me:      200 with tabs, filter, pagination
GET /bookings/:id:     200 owner, 403 other user, 404
PATCH /bookings/:id/cancel:  200 success, 400 late without confirm
GET /admin/bookings:   200 admin, 403 user
PATCH /admin/bookings/:id/status:  200 admin update
```

### 4.3 Frontend Manual QA

```
Processing page:  progress animation, redirect on success, error state
Confirmation:     summary card, price breakdown, action buttons
My Bookings:      tab switch, search, cancel flow, empty states
Admin Bookings:   table, filters, status update, refund modal, export
```

---

## 5. Dependencies

| Package | Purpose | Install |
|---------|---------|---------|
| `stripe` | Payment gateway SDK | `pnpm add stripe` (server) |
| `@nestjs/schedule` | Cron jobs | `pnpm add @nestjs/schedule` (server) |
| `date-fns` | Date calculations | Already installed |

---

## 6. Environment Variables

```env
# apps/server/.env (NEW)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# apps/web/.env.local (NEW)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```
