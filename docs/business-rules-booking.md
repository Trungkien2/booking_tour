# Business Rules: Booking System

> Quy tắc "bất di bất dịch" mà code Backend phải tuân thủ.
> Mọi vi phạm rule = **bug nghiêm trọng**.
>
> Tài liệu liên quan: [business-logic-booking.md](./business-logic-booking.md) (luồng xử lý chi tiết)

---

## 1. Pricing Rules (Quy tắc về Giá)

### Rule P1: Age-Based Pricing

Phân loại hành khách và tính giá dựa trên `AgeGroup`:

| AgeGroup | Độ tuổi | Tỷ lệ giá | Ghi chú |
|----------|---------|------------|---------|
| `ADULT` | > 12 tuổi | **100%** `tour.priceAdult` | Bắt buộc tối thiểu 1 |
| `CHILD` | 5 - 12 tuổi | **75%** `tour.priceChild` | Có thể 0 |
| `INFANT` | < 5 tuổi | **Miễn phí** (0 VND) | Vẫn phải kê khai thông tin, tính vào headcount |

**Validation:**
- Hệ thống có thể xác định `ageGroup` từ `dateOfBirth` (nếu có) hoặc cho khách chọn thủ công.
- Nếu xác định từ `dateOfBirth`, tuổi tính tại thời điểm `schedule.startDate` (ngày khởi hành), **không phải** ngày đặt.

### Rule P2: Price Snapshot (Bất biến)

> **Giá vé PHẢI được lưu cứng vào `booking_travelers.price` tại thời điểm đặt.**

- Khi tạo `BookingTraveler`, field `price` = giá tính toán tại thời điểm đó.
- Nếu sau này Admin sửa giá Tour → **Đơn hàng cũ KHÔNG ĐƯỢC thay đổi giá.**
- `Booking.totalPrice` = SUM(`BookingTraveler.price`) + taxes.
- Khi hiển thị đơn hàng cũ, **luôn dùng `BookingTraveler.price`**, không bao giờ query lại `Tour.priceAdult/priceChild`.

```
ĐÚNG:  booking.totalPrice = 2,500,000 (đã lưu)
SAI:   booking.totalPrice = tour.priceAdult * 2 (query lại giá hiện tại)
```

### Rule P3: Tax Calculation

```
subtotal = SUM(traveler.price for each traveler)
taxes    = ROUND(subtotal × TAX_RATE, 2)     // TAX_RATE = 10%
total    = subtotal + taxes
```

- `TAX_RATE` là constant hệ thống (`0.10`), có thể cấu hình nhưng **không thay đổi retroactively** cho đơn cũ.
- Làm tròn 2 chữ số thập phân: `Math.round(value * 100) / 100`.

---

## 2. Inventory Rules (Quy tắc về Tồn Kho)

### Rule I1: No Overbooking (Tuyệt đối)

> **KHÔNG BAO GIỜ được phép `currentCapacity > maxCapacity`.**

- Đây là invariant cứng nhất của hệ thống.
- Mọi thao tác tăng `currentCapacity` phải kiểm tra trong transaction:
  ```
  IF (currentCapacity + newTravelers > maxCapacity) → REJECT
  ```
- Nếu bằng cách nào đó `currentCapacity > maxCapacity` (data corruption) → Alert admin ngay.

### Rule I2: Immediate Hold on Booking (Giữ chỗ tức thì)

> **Khi tạo Booking ở trạng thái `PENDING`, hệ thống PHẢI cộng ngay vào `currentCapacity`.**

- Lý do: Tránh 10 người cùng thấy "còn 2 chỗ" và đều tạo đơn PENDING.
- Luồng:
  ```
  Khách bấm "Đặt" → currentCapacity += travelers (ngay lập tức)
  Khách thanh toán  → Giữ nguyên currentCapacity
  Timeout 15 phút   → currentCapacity -= travelers (nhả chỗ)
  ```

### Rule I3: Immediate Release on Cancel (Nhả chỗ tức thì)

> **Khi hủy đơn (bất kể lý do), PHẢI giảm `currentCapacity` ngay lập tức.**

- Áp dụng cho: Timeout PENDING, khách tự hủy, admin force cancel.
- Chỗ trống phải available cho khách khác đặt **ngay**, không chờ refund xong.

### Rule I4: Optimistic Locking (Bắt buộc)

> **Mọi thao tác thay đổi `currentCapacity` PHẢI dùng optimistic locking qua `version`.**

```typescript
// Pattern bắt buộc
const result = await prisma.tourSchedule.updateMany({
  where: {
    id: scheduleId,
    version: expectedVersion,  // ← Bắt buộc
  },
  data: {
    currentCapacity: { increment: travelers },
    version: { increment: 1 },
  },
});

if (result.count === 0) {
  throw new ConflictException('Conflict: vui lòng thử lại');
}
```

- Không có ngoại lệ. Background job cũng phải tuân thủ rule này.

---

## 3. Schedule Rules (Quy tắc Lịch Trình)

### Rule S1: Booking Cutoff (Đóng đặt chỗ)

> **Không cho phép đặt tour trước giờ khởi hành < 24 giờ.**

```typescript
const hoursUntilDeparture = differenceInHours(schedule.startDate, now());
if (hoursUntilDeparture < 24) {
  throw new BadRequestException('Đã quá hạn đặt tour (cần trước 24h)');
}
```

- Lý do: Đơn vị vận hành cần thời gian chuẩn bị xe cộ, hướng dẫn viên, tài liệu.
- Rule này check tại thời điểm **tạo booking**, không phải lúc browse.

### Rule S2: Auto Status Transition

> **`currentCapacity` thay đổi → Tự động cập nhật `status`.**

| Điều kiện | Status mới |
|-----------|------------|
| `currentCapacity >= maxCapacity` | `SOLD_OUT` |
| `currentCapacity < maxCapacity` AND đang `SOLD_OUT` | `OPEN` |
| `startDate < now()` | `COMPLETED` (background job) |

- Admin có thể force `CLOSED` bất kỳ lúc nào (ví dụ: thời tiết xấu).
- Không bao giờ tự động chuyển sang `CLOSED` - chỉ admin hoặc hệ thống mới được.

### Rule S3: Status Guard

> **Chỉ cho phép đặt chỗ khi `schedule.status = OPEN`.**

| Status | Cho phép đặt? | Cho phép hủy? |
|--------|--------------|---------------|
| `OPEN` | Yes | Yes |
| `SOLD_OUT` | No | Yes (sẽ mở lại OPEN) |
| `CLOSED` | No | Yes (admin quyết định) |
| `COMPLETED` | No | No |

---

## 4. Booking Rules (Quy tắc Đặt Tour)

### Rule B1: Minimum Travelers

> **Mỗi booking phải có tối thiểu 1 ADULT.**

```typescript
if (adults < 1) {
  throw new BadRequestException('Cần ít nhất 1 người lớn');
}
```

### Rule B2: Reservation TTL

> **Đơn PENDING có tối đa 15 phút để hoàn tất thanh toán.**

- Sau 15 phút: Background job tự động cancel + release stock.
- TTL tính từ `Booking.bookingDate` (thời điểm tạo đơn).
- Constant: `RESERVATION_TTL_MINUTES = 15`.

### Rule B3: Status Transition Guard

> **Booking chỉ được chuyển trạng thái theo luồng hợp lệ.**

```
Allowed transitions:
  PENDING   → PAID        (thanh toán thành công)
  PENDING   → CANCELLED   (timeout hoặc khách hủy)
  PAID      → CANCELLED   (khách yêu cầu hủy)
  CANCELLED → REFUNDED    (refund hoàn tất)

Forbidden:
  PAID      → PENDING     ✗ (không quay lại)
  CANCELLED → PAID        ✗ (không phục hồi đơn đã hủy)
  REFUNDED  → *           ✗ (terminal state)
```

---

## 5. Cancellation & Refund Rules (Quy tắc Hủy Tour)

### Rule C1: Cancellation Policy (Mặc định)

| Rule | Khoảng cách đến ngày đi | Hoàn tiền | Phí phạt |
|------|--------------------------|-----------|----------|
| Early | >= 15 ngày | **70%** | 30% (bù chi phí vận hành) |
| Standard | 2 - 14 ngày | **50%** | 50% |
| Late | < 2 ngày (48 giờ) | **0%** | 100% (không hoàn tiền) |

```typescript
function calculateRefundPercentage(daysUntilDeparture: number): number {
  if (daysUntilDeparture >= 15) return 70;
  if (daysUntilDeparture >= 2)  return 50;
  return 0;  // Late cancellation
}
```

### Rule C2: Pending Cancellation (Miễn phí)

> **Đơn PENDING (chưa thanh toán) → Hủy miễn phí, nhả chỗ, KHÔNG tạo Refund.**

- Không áp dụng cancellation policy vì chưa thu tiền.

### Rule C3: Refund Calculation

```typescript
const refundPercentage = calculateRefundPercentage(daysUntilDeparture);
const refundAmount = Math.round(booking.totalPrice * refundPercentage) / 100;
```

- `refundAmount` lưu vào `Refund.amount`.
- Nếu `refundAmount = 0` → Vẫn tạo Refund record với `amount = 0` và `reason = "late_cancellation"` để truy vết.

### Rule C4: Late Cancellation Confirmation

> **Nếu `refundPercentage = 0`, UI PHẢI hiện cảnh báo rõ ràng trước khi cho hủy.**

```
⚠️ "Bạn sẽ KHÔNG được hoàn tiền. Vẫn muốn hủy để nhường chỗ không?"
   [Xác nhận hủy]  [Quay lại]
```

- Backend nhận thêm field `confirmNoRefund: true` để double-check ý định.

### Rule C5: Admin Override

> **Admin có thể force cancel với hoàn tiền 100% bất kể thời gian.**

- Đánh dấu `Refund.reason = "admin_cancelled"`.
- Ghi log audit trail: ai cancel, lý do, timestamp.

---

## 6. Bounded Contexts (Gom nhóm Module)

### Module Map

```
┌─────────────────────────────────────────────────────┐
│                    API Gateway                       │
│              (Auth, Rate Limiting)                    │
└────────┬──────────────┬──────────────┬──────────────┘
         │              │              │
    ┌────▼────┐   ┌─────▼─────┐  ┌────▼────┐
    │ Catalog │   │ Inventory │  │  Sales  │
    │ Module  │   │  Module   │  │ Module  │
    └────┬────┘   └─────┬─────┘  └────┬────┘
         │              │              │
         └──────────────┴──────────────┘
                        │
                  ┌─────▼─────┐
                  │  Payment  │
                  │  Module   │
                  └───────────┘
```

### Chi tiết từng Module

#### 1. Catalog Module (Hiển thị Tour)

| Thuộc tính | Giá trị |
|------------|---------|
| **Trách nhiệm** | Quản lý thông tin Tour (CRUD), hiển thị chi tiết, quản lý Review |
| **Bảng DB** | `tours`, `reviews`, `user_favorites` |
| **Public API** | `GET /tours`, `GET /tours/:slug`, `GET /tours/:id/reviews` |
| **Admin API** | `POST/PATCH/DELETE /admin/tours` |
| **Business Logic** | Soft delete (`deletedAt`), search/filter, SEO (slug), rating aggregation |
| **Không chạm vào** | Inventory, Booking, Payment |

#### 2. Inventory Module (Quản lý Tồn Kho)

| Thuộc tính | Giá trị |
|------------|---------|
| **Trách nhiệm** | Quản lý `TourSchedule`. Check chỗ trống, giữ chỗ, trả chỗ |
| **Bảng DB** | `tour_schedules` |
| **Core Functions** | `checkAvailability()`, `reserveStock()`, `releaseStock()` |
| **Invariants** | Rule I1 (no overbooking), Rule I4 (optimistic lock), Rule S2 (auto status) |
| **Consumers** | Sales Module gọi khi tạo/hủy booking |

```typescript
// Interface mà Inventory Module expose
interface InventoryService {
  checkAvailability(scheduleId: number, travelers: number): Promise<AvailabilityResult>;
  reserveStock(scheduleId: number, travelers: number): Promise<void>;   // throws ConflictException
  releaseStock(scheduleId: number, travelers: number): Promise<void>;
  getSchedules(tourId: number, from?: Date, to?: Date): Promise<TourSchedule[]>;
}
```

#### 3. Sales Module (Quản lý Booking)

| Thuộc tính | Giá trị |
|------------|---------|
| **Trách nhiệm** | Quản lý `Booking` lifecycle. Tính giá (`PriceCalculator`). Xử lý hủy/refund |
| **Bảng DB** | `bookings`, `booking_travelers` |
| **Core Functions** | `createBooking()`, `cancelBooking()`, `calculatePrice()`, `calculateRefund()` |
| **Dependencies** | Inventory Module (reserve/release), Payment Module (charge/refund) |
| **Invariants** | Rule P2 (snapshot), Rule B1 (min 1 adult), Rule B2 (TTL 15m), Rule C1 (refund policy) |

```typescript
// Orchestration trong Sales Module
async createBooking(dto: CreateBookingDto): Promise<Booking> {
  // 1. Validate (Rule B1, S1, S3)
  // 2. Calculate price (Rule P1, P2, P3)
  // 3. Reserve stock via Inventory Module (Rule I1, I2, I4)
  // 4. Create Booking + BookingTravelers (Rule P2)
  // 5. Return booking for payment
}

async cancelBooking(bookingId: number, userId: number): Promise<CancelResult> {
  // 1. Validate booking ownership + status (Rule B3)
  // 2. Calculate refund (Rule C1, C2, C3)
  // 3. Release stock via Inventory Module (Rule I3)
  // 4. Update booking status
  // 5. Create Refund record if needed
  // 6. Trigger async refund processing
}
```

#### 4. Payment Module (Thanh toán & Hoàn tiền)

| Thuộc tính | Giá trị |
|------------|---------|
| **Trách nhiệm** | Xử lý thanh toán qua payment gateway. Quản lý refund lifecycle |
| **Bảng DB** | `payments`, `refunds` |
| **Core Functions** | `createPayment()`, `processPayment()`, `processRefund()` |
| **Providers** | Stripe, PayPal (pluggable via Strategy pattern) |
| **Consumers** | Sales Module gọi khi cần charge/refund |

```typescript
interface PaymentService {
  createPayment(bookingId: number, amount: Decimal, provider: string): Promise<Payment>;
  processPayment(paymentId: number): Promise<PaymentResult>;
  processRefund(refundId: number): Promise<RefundResult>;
}
```

### Module Interaction Map

```
Khách đặt tour:
  Sales.createBooking()
    → Inventory.reserveStock()          // Giữ chỗ
    → Sales.calculatePrice()            // Tính giá + snapshot
    → Payment.createPayment()           // Tạo payment intent

Khách thanh toán:
  Payment.processPayment()
    → Sales.confirmBooking()            // Booking: PAID

Khách hủy:
  Sales.cancelBooking()
    → Sales.calculateRefund()           // Tính hoàn tiền
    → Inventory.releaseStock()          // Nhả chỗ
    → Payment.processRefund() [async]   // Hoàn tiền qua gateway

Timeout PENDING (Background Job):
  BookingScheduler.expirePending()
    → Sales.cancelBooking()             // Auto cancel
    → Inventory.releaseStock()          // Nhả chỗ
```

---

## 7. Tổng hợp Rules Reference

| ID | Rule | Module | Mức độ |
|----|------|--------|--------|
| P1 | Age-based pricing | Sales | Critical |
| P2 | Price snapshot bất biến | Sales | Critical |
| P3 | Tax calculation rounding | Sales | Important |
| I1 | No overbooking | Inventory | Critical |
| I2 | Immediate hold on PENDING | Inventory | Critical |
| I3 | Immediate release on cancel | Inventory | Critical |
| I4 | Optimistic locking bắt buộc | Inventory | Critical |
| S1 | Booking cutoff 24h | Inventory | Important |
| S2 | Auto status transition | Inventory | Important |
| S3 | Status guard for booking | Inventory | Important |
| B1 | Min 1 adult per booking | Sales | Important |
| B2 | Reservation TTL 15 min | Sales | Critical |
| B3 | Status transition guard | Sales | Critical |
| C1 | Cancellation policy (15d/2d) | Sales | Important |
| C2 | Pending = free cancel | Sales | Important |
| C3 | Refund calculation | Sales | Important |
| C4 | Late cancel confirmation | Sales + FE | Important |
| C5 | Admin override 100% refund | Sales | Normal |
