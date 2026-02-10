# Business Logic: Booking & Payment Flow

> Tài liệu mô tả chi tiết luồng nghiệp vụ đặt tour, thanh toán và hủy tour.

---

## 1. Tổng quan Status Flow

```
Booking:   PENDING ──→ PAID ──→ CANCELLED ──→ REFUNDED
Payment:   PENDING ──→ SUCCESS / FAILED
Refund:    PENDING ──→ PROCESSING ──→ COMPLETED / FAILED
Schedule:  OPEN ──→ SOLD_OUT / CLOSED ──→ COMPLETED
```

---

## 2. Luồng Đặt Tour & Thanh Toán

### User Story

> Khách chọn Tour "Đà Lạt 3N2Đ" → Chọn ngày đi → Nhập thông tin người đi → Thanh toán → Nhận vé.

### Step-by-step

#### Bước 1: Select Tour & Schedule

- Khách chọn Tour từ danh sách hoặc trang chi tiết.
- Khách chọn ngày đi (schedule) từ danh sách lịch trình khả dụng.
- Hệ thống kiểm tra:
  - Schedule có status = `OPEN`
  - `availableSpots = maxCapacity - currentCapacity > 0`
- Nếu hết chỗ → Hiện "Sold Out", không cho chọn.

#### Bước 2: Input Travelers

- Khách nhập số lượng người đi theo loại:
  | Loại | AgeGroup | Mô tả |
  |------|----------|-------|
  | Người lớn | `ADULT` | Từ 13 tuổi trở lên |
  | Trẻ em | `CHILD` | Từ 2-12 tuổi |
  | Em bé | `BABY` | Dưới 2 tuổi (miễn phí, nếu áp dụng) |

- Ràng buộc:
  - Tối thiểu 1 người lớn (ADULT)
  - Tổng số người ≤ `availableSpots` của schedule
  - Tổng số người ≤ `maxGroupSize` của tour

- Khách nhập thông tin chi tiết từng người:
  - `fullName` (bắt buộc)
  - `gender` (tùy chọn)
  - `ageGroup` (ADULT / CHILD / BABY)

#### Bước 3: Calculate Price

- Hệ thống tính giá dựa trên **snapshot giá tại thời điểm đặt**:

```
priceBreakdown = {
  adults:   số_người_lớn × tour.priceAdult,
  children: số_trẻ_em    × tour.priceChild,
  subtotal: adults + children,
  taxes:    subtotal × TAX_RATE (10%),
  total:    subtotal + taxes
}
```

- **Quan trọng:** Giá được snapshot vào `BookingTraveler.price` → Không bao giờ dùng giá hiện tại của tour cho đơn hàng cũ.

#### Bước 4: Reserve (Giữ Chỗ Tạm Thời) ⚠️ Critical

Khi khách bấm **"Đặt ngay"**, hệ thống thực hiện trong **1 transaction**:

```
BEGIN TRANSACTION
  1. Kiểm tra schedule.status = 'OPEN'
  2. Kiểm tra schedule.version = expected_version  (Optimistic Lock)
  3. Kiểm tra availableSpots >= totalTravelers
  4. Tăng schedule.currentCapacity += totalTravelers
  5. Tăng schedule.version += 1
  6. Nếu currentCapacity >= maxCapacity → Đổi status = 'SOLD_OUT'
  7. Tạo Booking (status: PENDING)
  8. Tạo BookingTraveler[] với price snapshot
COMMIT
```

- **Optimistic Locking:** Nếu `version` không khớp (có người khác đặt đồng thời) → Rollback, thông báo "Chỗ vừa được người khác đặt, vui lòng thử lại."
- **Reservation TTL:** Đơn PENDING có **15 phút** để thanh toán.
- Background job chạy mỗi phút kiểm tra đơn PENDING quá hạn → Auto cancel + release stock.

#### Bước 5: Payment

- Khách được redirect đến trang thanh toán.
- Phương thức hỗ trợ: Stripe, PayPal (hoặc chuyển khoản ngân hàng).
- Hệ thống tạo `Payment` record với status `PENDING`.

#### Bước 6: Finalize

**Thanh toán thành công:**
```
1. Payment.status → SUCCESS
2. Booking.status → PAID
3. Gửi email xác nhận + vé điện tử
4. (Optional) Gửi SMS thông báo
```

**Thanh toán thất bại / Hết giờ (15 phút):**
```
1. Payment.status → FAILED (nếu có)
2. Booking.status → CANCELLED
3. Release Stock: schedule.currentCapacity -= totalTravelers
4. schedule.version += 1
5. Nếu schedule trước đó là SOLD_OUT → Đổi lại OPEN
6. Thông báo cho khách (email/in-app)
```

---

## 3. Luồng Hủy Tour & Hoàn Tiền

### User Story

> Khách đã thanh toán muốn hủy đơn → Hệ thống tính tiền hoàn lại theo chính sách → Xử lý refund.

### Chính sách hủy (Cancellation Policy)

| Rule | Điều kiện | Hoàn tiền | Phí phạt |
|------|-----------|-----------|----------|
| A1 | Đơn PENDING (chưa thanh toán) | Hủy miễn phí, nhả chỗ ngay | 0% |
| B1 | Hủy trước ngày đi >= 15 ngày | Hoàn **70%** | 30% (bù chi phí vận hành) |
| B2 | Hủy trước ngày đi 2 - 14 ngày | Hoàn **50%** | 50% |
| B3 | Hủy trước ngày đi < 2 ngày (48h) | **Không hoàn tiền** (0%) | 100% |

> **Lưu ý:** Chính sách có thể được custom theo từng tour (`Tour.cancellationPolicy`). Bảng trên là policy mặc định.
> Chi tiết rules: xem [business-rules-booking.md](./business-rules-booking.md)

### Step-by-step

#### Bước 1: Request Cancel

- Khách vào trang "My Bookings" → Chọn đơn cần hủy → Bấm "Hủy Tour".
- Chỉ cho phép hủy đơn có status = `PAID` hoặc `PENDING`.

#### Bước 2: Calculate Refund

- Hệ thống tính khoảng cách từ **ngày hiện tại** đến **ngày khởi hành** (`schedule.startDate`):

```typescript
const daysUntilDeparture = differenceInDays(schedule.startDate, now());

let refundPercentage: number;
if (daysUntilDeparture >= 15) {
  refundPercentage = 70;   // Early: hoàn 70%, phạt 30%
} else if (daysUntilDeparture >= 2) {
  refundPercentage = 50;   // Standard: hoàn 50%, phạt 50%
} else {
  refundPercentage = 0;    // Late (<48h): không hoàn tiền
}

const refundAmount = Math.round(booking.totalPrice * refundPercentage) / 100;
```

#### Bước 3: Confirm with User

- Hiển thị thông tin xác nhận:

| Trường hợp | UI hiển thị |
|-------------|-------------|
| `refundPercentage = 0` | ⚠️ "Bạn sẽ **không được hoàn tiền**. Vẫn muốn hủy để nhường chỗ không?" |
| `refundPercentage > 0` | "Bạn sẽ được hoàn lại **{refundAmount}** ({refundPercentage}%). Xác nhận hủy?" |

- Khách xác nhận hoặc quay lại.

#### Bước 4: Execute Cancellation ⚠️ Critical

Thực hiện trong **1 transaction**:

```
BEGIN TRANSACTION
  1. Booking.status → CANCELLED
  2. Nếu refundAmount > 0:
     a. Tạo Refund record (status: PENDING, amount: refundAmount)
     b. Payment.status giữ nguyên SUCCESS (đã thu tiền thực tế)
  3. Release Stock:
     a. schedule.currentCapacity -= totalTravelers
     b. schedule.version += 1
     c. Nếu schedule.status = 'SOLD_OUT' → Đổi lại 'OPEN'
COMMIT
```

- **QUAN TRỌNG:** Luôn nhả chỗ (`release stock`) ngay lập tức khi hủy, cho dù khách có được hoàn tiền hay không → Chỗ trống sẵn cho khách khác đặt.

#### Bước 5: Process Refund (Async)

- Nếu có refund:
  ```
  1. Refund.status → PROCESSING
  2. Gọi payment gateway để refund (Stripe refund API, etc.)
  3. Nếu thành công:
     a. Refund.status → COMPLETED
     b. Refund.gatewayRefundId = <id từ gateway>
     c. Booking.status → REFUNDED
     d. Gửi email thông báo hoàn tiền thành công
  4. Nếu thất bại:
     a. Refund.status → FAILED
     b. Alert admin để xử lý thủ công
  ```

---

## 4. Inventory Management (Quản lý Tồn Kho)

### Nguyên tắc cốt lõi

| Hành động | currentCapacity | version | Ghi chú |
|-----------|----------------|---------|---------|
| Đặt chỗ (Reserve) | `+= travelers` | `+= 1` | Trong transaction với optimistic lock |
| Hủy đơn (Cancel) | `-= travelers` | `+= 1` | Nhả chỗ ngay lập tức |
| Timeout PENDING | `-= travelers` | `+= 1` | Background job xử lý |

### Auto Status Change

```
Sau mỗi lần cập nhật currentCapacity:
  if (currentCapacity >= maxCapacity) → status = 'SOLD_OUT'
  if (currentCapacity < maxCapacity && status = 'SOLD_OUT') → status = 'OPEN'
```

### Race Condition Prevention

- Dùng **Optimistic Locking** qua field `TourSchedule.version`.
- Mỗi transaction phải:
  1. Đọc `version` hiện tại
  2. Khi update, thêm `WHERE version = expectedVersion`
  3. Nếu affected rows = 0 → Conflict → Retry hoặc báo lỗi

```typescript
// Prisma example
const updated = await prisma.tourSchedule.updateMany({
  where: { id: scheduleId, version: currentVersion },
  data: {
    currentCapacity: { increment: totalTravelers },
    version: { increment: 1 },
  },
});

if (updated.count === 0) {
  throw new ConflictException('Schedule was modified. Please try again.');
}
```

---

## 5. Background Jobs

| Job | Schedule | Mô tả |
|-----|----------|-------|
| `expire-pending-bookings` | Mỗi 1 phút | Tìm Booking PENDING quá 15 phút → Cancel + Release stock |
| `process-refunds` | Mỗi 5 phút | Tìm Refund PENDING → Gọi payment gateway xử lý |
| `close-past-schedules` | Mỗi ngày 00:00 | Schedule có `startDate < today` → Status = COMPLETED |

---

## 6. Database Models Liên Quan

```
Tour ──1:N──→ TourSchedule ──1:N──→ Booking ──1:N──→ BookingTraveler
                                        │
                                        ├──1:N──→ Payment ──1:N──→ Refund
                                        └──N:1──→ User
```

| Model | Vai trò |
|-------|---------|
| `TourSchedule` | Quản lý inventory (capacity + version cho optimistic lock) |
| `Booking` | Đơn đặt tour (PENDING → PAID → CANCELLED → REFUNDED) |
| `BookingTraveler` | Thông tin từng người đi + **price snapshot** |
| `Payment` | Record thanh toán (PENDING → SUCCESS / FAILED) |
| `Refund` | Record hoàn tiền (PENDING → PROCESSING → COMPLETED / FAILED) |

---

## 7. Edge Cases & Error Handling

| Case | Xử lý |
|------|-------|
| 2 khách đặt cùng lúc, chỉ còn 1 chỗ | Optimistic lock → Người đầu thành công, người sau nhận lỗi Conflict |
| Khách đặt xong nhưng không thanh toán | Background job auto-cancel sau 15 phút, nhả chỗ |
| Payment gateway timeout | Giữ booking PENDING, retry payment hoặc khách thử lại |
| Refund gateway lỗi | Refund.status = FAILED, alert admin xử lý thủ công |
| Khách hủy đơn PENDING (chưa pay) | Hủy miễn phí, nhả chỗ ngay, không tạo Refund |
| Schedule đã COMPLETED/CLOSED | Không cho đặt mới, không cho hủy |
| Admin force cancel | Hoàn 100% bất kể thời gian, đánh dấu reason = "admin_cancelled" |
