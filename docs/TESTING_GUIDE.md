# Booking Flow - Testing Guide

> Hướng dẫn test end-to-end booking flow cho MVP

---

## 1. Setup

### 1.1. Khởi động infrastructure

```bash
# Start PostgreSQL + Redis
docker-compose up -d

# Migrate DB
cd apps/server && pnpm prisma migrate dev

# Seed data mẫu
pnpm prisma db seed

# Start app (từ root)
cd ../..
pnpm dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:3000

### 1.2. Fix Stripe keys

File `apps/server/.env` hiện đang bị **đảo ngược** 2 key. Sửa lại:

```env
STRIPE_SECRET_KEY=sk_test_xxx          # Bắt đầu bằng sk_test_
STRIPE_WEBHOOK_SECRET=whsec_xxx        # Bắt đầu bằng whsec_ (lấy từ Stripe CLI hoặc Dashboard)
```

> Lấy key từ https://dashboard.stripe.com/test/apikeys (Test mode)

### 1.3. Accounts có sẵn (từ seed)

| Email                    | Password       | Role  |
| ------------------------ | -------------- | ----- |
| `admin@bookingtour.com`  | `Password123!` | ADMIN |
| `jane@example.com`       | `Password123!` | USER  |
| `john@example.com`       | `Password123!` | USER  |

### 1.4. Data có sẵn (từ seed)

- **8 tours** (7 PUBLISHED, 1 DRAFT)
- **6 schedules** (4 OPEN, 1 SOLD_OUT, 1 OPEN nhưng trống)
- **5 bookings** mẫu (PAID, PENDING, CANCELLED, REFUNDED)
- **5 reviews**, **3 favorites**

---

## 2. Test Flows

### Flow A: Đặt tour + Thanh toán (Happy Path)

| # | Hành động | URL / Thao tác | Kết quả mong đợi |
|---|-----------|----------------|-------------------|
| A1 | Đăng nhập | http://localhost:3000/login → `jane@example.com` / `Password123!` | Redirect về homepage |
| A2 | Duyệt tours | http://localhost:3000/tours | Thấy danh sách tours, thử filter/search |
| A3 | Xem chi tiết | Click tour "Hạ Long Bay 2D1N" | Thấy gallery, itinerary, reviews, booking card |
| A4 | Chọn schedule | Booking card bên phải → chọn ngày khởi hành | Thấy ngày available (tháng sau) |
| A5 | Thêm travelers | 2 Adults + 1 Child, điền tên | Thấy price breakdown cập nhật |
| A6 | Submit booking | Click "Book Now" | Tạo booking PENDING, redirect tới payment |
| A7 | Thanh toán | Redirect sang Stripe Checkout | Thấy form thanh toán Stripe |
| A8 | Điền card test | `4242 4242 4242 4242`, expiry bất kỳ, CVC bất kỳ | Thanh toán thành công |
| A9 | Processing | Auto redirect về `/bookings/processing` | Thấy polling, loading steps |
| A10 | Confirmation | Auto redirect về `/bookings/{id}/confirmation` | Thấy booking summary, trạng thái PAID |

### Flow B: Xem lịch sử booking

| # | Hành động | URL / Thao tác | Kết quả mong đợi |
|---|-----------|----------------|-------------------|
| B1 | Vào My Bookings | http://localhost:3000/bookings | Thấy tabs: Upcoming / Completed / Cancelled |
| B2 | Tab Upcoming | Click "Upcoming" | Thấy bookings PAID chưa tới ngày đi |
| B3 | Tab Cancelled | Click "Cancelled" | Thấy bookings đã hủy (từ seed) |
| B4 | Xem chi tiết | Click vào 1 booking | Thấy tour info, travelers, payment history |

### Flow C: Hủy booking

| # | Hành động | URL / Thao tác | Kết quả mong đợi |
|---|-----------|----------------|-------------------|
| C1 | Chọn booking | My Bookings → chọn 1 booking PAID | Thấy nút "Cancel" |
| C2 | Click Cancel | Click "Cancel Booking" | Thấy dialog preview: refund amount, penalty |
| C3 | Confirm | Nhập lý do, confirm | Booking chuyển CANCELLED, inventory được release |

### Flow D: Booking hết hạn tự động

| # | Hành động | URL / Thao tác | Kết quả mong đợi |
|---|-----------|----------------|-------------------|
| D1 | Tạo booking | Làm flow A1-A6 nhưng **KHÔNG thanh toán** | Booking PENDING, hết hạn 15 phút |
| D2 | Chờ 15 phút | Hoặc check server logs | Cron job tự cancel + release inventory |
| D3 | Kiểm tra | Vào My Bookings | Booking chuyển CANCELLED |

### Flow E: Edge cases

| # | Test case | Cách test | Kết quả mong đợi |
|---|-----------|-----------|-------------------|
| E1 | Không có adult | Tạo booking chỉ với CHILD | `400: At least 1 adult required` |
| E2 | Schedule SOLD_OUT | Book schedule đã full (Hạ Long tuần sau) | `400: not available` |
| E3 | Quá giờ cutoff | Tạo schedule ngày mai, thử book | `400: less than 24 hours` |
| E4 | Booking expired | Tạo booking, đợi 15 phút, thử pay | `400: expired` |
| E5 | Truy cập booking người khác | Login jane, truy cập booking của john | `403: Not authorized` |
| E6 | Stripe card bị từ chối | Dùng card `4000 0000 0000 0002` | Payment failed |

---

## 3. Test bằng API (không cần frontend)

Dùng khi muốn test nhanh backend hoặc chưa setup Stripe:

```bash
# === LOGIN ===
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"Password123!"}' | jq .

# Copy access_token, dùng cho các request sau
TOKEN="<paste_token_here>"

# === XEM TOURS ===
curl -s http://localhost:4000/tours | jq .

# === XEM CHI TIẾT TOUR ===
curl -s http://localhost:4000/tours/ha-long-bay-2d1n | jq .

# === TẠO BOOKING ===
curl -s -X POST http://localhost:4000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "scheduleId": 1,
    "travelers": [
      {"fullName":"Jane Doe","ageGroup":"ADULT"},
      {"fullName":"Kid Doe","ageGroup":"CHILD"}
    ],
    "note": "Test booking"
  }' | jq .

# Copy booking id từ response
BOOKING_ID=<id>

# === TẠO PAYMENT (cần Stripe key đúng) ===
curl -s -X POST http://localhost:4000/bookings/$BOOKING_ID/payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "provider": "stripe",
    "returnUrl": "http://localhost:3000/bookings/processing"
  }' | jq .

# → Response có checkoutUrl → mở trên browser để pay

# === XEM BOOKINGS CỦA USER ===
curl -s http://localhost:4000/bookings/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# === XEM CHI TIẾT BOOKING ===
curl -s http://localhost:4000/bookings/$BOOKING_ID \
  -H "Authorization: Bearer $TOKEN" | jq .

# === VERIFY PAYMENT (sau khi pay trên Stripe) ===
curl -s -X POST http://localhost:4000/bookings/$BOOKING_ID/payment/verify \
  -H "Authorization: Bearer $TOKEN" | jq .

# === HỦY BOOKING ===
curl -s -X POST http://localhost:4000/bookings/$BOOKING_ID/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"reason": "Change of plans"}' | jq .
```

---

## 4. Stripe Test Cards

| Card Number | Kết quả |
|-------------|---------|
| `4242 4242 4242 4242` | Thanh toán thành công |
| `4000 0000 0000 0002` | Card bị từ chối |
| `4000 0000 0000 3220` | Yêu cầu 3D Secure |

Expiry: bất kỳ tháng/năm tương lai. CVC: bất kỳ 3 số.

---

## 5. Booking Flow Diagram

```
User browses tours
        │
        ▼
Tour Detail (/tours/[slug])
   - Xem info, reviews, schedules
   - Chọn schedule + travelers
        │
        ▼
Create Booking (POST /bookings)
   - Validate: min 1 adult, schedule OPEN, >24h cutoff
   - Reserve inventory (optimistic locking)
   - Status: PENDING, TTL: 15 phút
        │
        ▼
Create Payment (POST /bookings/:id/payment)
   - Tạo Stripe Checkout Session
   - Redirect user sang Stripe
        │
        ▼
Stripe Checkout
   - User điền card + pay
   - Stripe gọi webhook HOẶC user redirect về app
        │
        ├── Webhook (tự động): checkout.session.completed
        │   → Payment: SUCCESS, Booking: PAID
        │
        └── Verify (polling fallback): POST /bookings/:id/payment/verify
            → Check Stripe session → update nếu paid
        │
        ▼
Processing Page (/bookings/processing)
   - Polling verify mỗi 2s, timeout 5 phút
   - Auto-redirect khi PAID
        │
        ▼
Confirmation Page (/bookings/:id/confirmation) ✅
        │
        ▼
My Bookings (/bookings)
   - Xem history, cancel, xem chi tiết
        │
        ▼
Cancel (optional)
   - Preview refund amount
   - Confirm → release inventory
   - Status: CANCELLED

Background:
   - Cron (mỗi phút): auto-cancel PENDING quá 15 phút
   - Cron (mỗi ngày 00:00): đóng schedules đã qua
```
