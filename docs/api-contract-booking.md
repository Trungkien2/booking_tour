# API Contract: Booking Module

> Định nghĩa chi tiết tất cả API endpoints phục vụ feature Booking.
> Base URL: `http://localhost:4000`
>
> Tài liệu liên quan:
> - [business-logic-booking.md](./business-logic-booking.md) — Luồng xử lý
> - [business-rules-booking.md](./business-rules-booking.md) — Quy tắc nghiệp vụ

---

## Mục lục

| # | Nhóm | Prefix | Auth |
|---|-------|--------|------|
| 1 | [Booking (User)](#1-booking-user) | `/bookings` | JWT Required |
| 2 | [Payment](#2-payment) | `/bookings/:id/payment` | JWT Required |
| 3 | [Cancellation & Refund](#3-cancellation--refund) | `/bookings/:id/cancel` | JWT Required |
| 4 | [Admin Bookings](#4-admin-bookings) | `/admin/bookings` | JWT + ADMIN Role |

---

## 1. Booking (User)

### 1.1 `POST /bookings` — Tạo booking mới

> **Rule áp dụng:** I1, I2, I4 (inventory), P1, P2, P3 (pricing), S1, S3 (schedule), B1 (min 1 adult)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "scheduleId": 1,
  "travelers": [
    {
      "fullName": "Nguyen Van A",
      "gender": "male",
      "ageGroup": "ADULT"
    },
    {
      "fullName": "Nguyen Thi B",
      "gender": "female",
      "ageGroup": "ADULT"
    },
    {
      "fullName": "Nguyen Van C",
      "gender": "male",
      "ageGroup": "CHILD"
    }
  ],
  "note": "Chúng tôi cần xe lăn cho 1 người"
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `scheduleId` | Required, int, schedule phải tồn tại + status = OPEN |
| `travelers` | Required, array, min 1 item |
| `travelers[].fullName` | Required, string, 2-100 chars |
| `travelers[].gender` | Optional, enum: `male`, `female`, `other` |
| `travelers[].ageGroup` | Required, enum: `ADULT`, `CHILD`, `BABY` |
| `note` | Optional, string, max 500 chars |

**Business Validation (Service layer):**
| Check | Error | Rule |
|-------|-------|------|
| Ít nhất 1 ADULT trong travelers | 400 `At least 1 adult required` | B1 |
| Schedule.status = OPEN | 400 `Schedule is not available` | S3 |
| startDate > now() + 24h | 400 `Booking cutoff: must book 24h before departure` | S1 |
| totalTravelers <= availableSpots | 400 `Not enough spots available` | I1 |
| Optimistic lock version match | 409 `Conflict: please try again` | I4 |

**Success Response: `201 Created`**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "status": "PENDING",
    "bookingDate": "2026-02-10T10:30:00.000Z",
    "expiresAt": "2026-02-10T10:45:00.000Z",
    "tour": {
      "id": 1,
      "name": "Đà Lạt 3N2Đ",
      "slug": "da-lat-3n2d",
      "coverImage": "https://..."
    },
    "schedule": {
      "id": 1,
      "startDate": "2026-03-15T00:00:00.000Z",
      "availableSpots": 8
    },
    "travelers": [
      {
        "id": 1,
        "fullName": "Nguyen Van A",
        "ageGroup": "ADULT",
        "price": 899.00
      },
      {
        "id": 2,
        "fullName": "Nguyen Thi B",
        "ageGroup": "ADULT",
        "price": 899.00
      },
      {
        "id": 3,
        "fullName": "Nguyen Van C",
        "ageGroup": "CHILD",
        "price": 674.25
      }
    ],
    "priceBreakdown": {
      "subtotal": 2472.25,
      "taxes": 247.23,
      "total": 2719.48
    },
    "totalPrice": 2719.48,
    "note": "Chúng tôi cần xe lăn cho 1 người"
  }
}
```

**Transaction Flow (Backend):**
```
BEGIN TRANSACTION
  1. Validate schedule (status, cutoff, version)
  2. Calculate price per traveler (Rule P1)
  3. Reserve stock: currentCapacity += travelers (Rule I2)
  4. Increment version (Rule I4)
  5. Auto SOLD_OUT if full (Rule S2)
  6. Create Booking (status: PENDING)
  7. Create BookingTraveler[] with snapshot price (Rule P2)
COMMIT
```

---

### 1.2 `GET /bookings/me` — Danh sách booking của user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `status` | string | `all` | `upcoming`, `completed`, `cancelled`, `all` |
| `search` | string | — | Tìm theo tên tour hoặc location |
| `sort` | string | `date_desc` | `date_asc`, `date_desc` |
| `page` | int | 1 | Min 1 |
| `limit` | int | 10 | Min 1, Max 50 |

**Status mapping:**
| Tab | DB Status filter |
|-----|-----------------|
| `upcoming` | `PENDING`, `PAID` WHERE schedule.startDate >= now() |
| `completed` | `PAID` WHERE schedule.startDate < now() |
| `cancelled` | `CANCELLED`, `REFUNDED` |
| `all` | Tất cả |

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 42,
        "status": "PAID",
        "bookingDate": "2026-02-10T10:30:00.000Z",
        "totalPrice": 2719.48,
        "travelerCount": 3,
        "tour": {
          "id": 1,
          "name": "Đà Lạt 3N2Đ",
          "slug": "da-lat-3n2d",
          "coverImage": "https://...",
          "location": "Đà Lạt, Vietnam",
          "durationDays": 3
        },
        "schedule": {
          "id": 1,
          "startDate": "2026-03-15T00:00:00.000Z"
        },
        "canCancel": true,
        "canModify": true
      }
    ],
    "tabs": {
      "upcoming": 3,
      "completed": 12,
      "cancelled": 2
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

**Logic `canCancel` / `canModify`:**
```
canCancel = status IN ('PENDING', 'PAID') AND schedule.startDate > now()
canModify = status = 'PAID' AND schedule.startDate > now() + 48h
```

---

### 1.3 `GET /bookings/:id` — Chi tiết booking

**Headers:**
```
Authorization: Bearer <access_token>
```

**Authorization:** User chỉ xem được booking của mình (`booking.userId = req.user.userId`).

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "status": "PAID",
    "bookingDate": "2026-02-10T10:30:00.000Z",
    "totalPrice": 2719.48,
    "note": "Chúng tôi cần xe lăn cho 1 người",
    "tour": {
      "id": 1,
      "name": "Đà Lạt 3N2Đ",
      "slug": "da-lat-3n2d",
      "coverImage": "https://...",
      "images": ["img1.jpg", "img2.jpg"],
      "location": "Đà Lạt, Vietnam",
      "durationDays": 3,
      "meetingPoint": {
        "name": "Đà Lạt Airport",
        "address": "Số 1, Trần Phú, Đà Lạt",
        "coordinates": { "lat": 11.75, "lng": 108.37 },
        "instructions": "Tập trung tại cổng chính"
      },
      "cancellationPolicy": "Free cancellation 15 days before"
    },
    "schedule": {
      "id": 1,
      "startDate": "2026-03-15T00:00:00.000Z"
    },
    "travelers": [
      {
        "id": 1,
        "fullName": "Nguyen Van A",
        "gender": "male",
        "ageGroup": "ADULT",
        "price": 899.00
      },
      {
        "id": 2,
        "fullName": "Nguyen Thi B",
        "gender": "female",
        "ageGroup": "ADULT",
        "price": 899.00
      },
      {
        "id": 3,
        "fullName": "Nguyen Van C",
        "gender": "male",
        "ageGroup": "CHILD",
        "price": 674.25
      }
    ],
    "priceBreakdown": {
      "adults": { "count": 2, "unitPrice": 899.00, "total": 1798.00 },
      "children": { "count": 1, "unitPrice": 674.25, "total": 674.25 },
      "infants": { "count": 0, "unitPrice": 0, "total": 0 },
      "subtotal": 2472.25,
      "taxes": 247.23,
      "total": 2719.48
    },
    "payments": [
      {
        "id": 1,
        "amount": 2719.48,
        "provider": "stripe",
        "status": "SUCCESS",
        "createdAt": "2026-02-10T10:32:00.000Z"
      }
    ],
    "refunds": [],
    "cancellation": {
      "canCancel": true,
      "daysUntilDeparture": 33,
      "refundPercentage": 70,
      "estimatedRefund": 1903.64
    }
  }
}
```

**Error Responses:**
| Status | Khi nào |
|--------|---------|
| 401 | Chưa đăng nhập |
| 403 | Booking không thuộc user này |
| 404 | Booking không tồn tại |

---

### 1.4 `GET /bookings/:id/status` — Poll trạng thái (cho Processing page)

> Dùng cho màn hình Booking Processing (SCR-006), poll mỗi 2 giây.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "bookingId": 42,
    "status": "PAID",
    "steps": [
      { "id": "payment_verified", "label": "Payment Verified", "status": "completed" },
      { "id": "reserving_spots", "label": "Reserving Spots", "status": "completed" },
      { "id": "generating_tickets", "label": "Generating Tickets", "status": "in_progress" }
    ],
    "redirectUrl": null
  }
}
```

**Status progression:**
| Booking Status | Steps State | Frontend Action |
|---------------|------------|-----------------|
| `PENDING` | step 1 in_progress | Tiếp tục poll |
| `PAID` | all completed | `redirectUrl = /bookings/42/confirmation` |
| `CANCELLED` | step failed | Hiện error + retry/support |

---

## 2. Payment

### 2.1 `POST /bookings/:id/payment` — Tạo payment intent

> Gọi sau khi tạo booking thành công, trước khi redirect đến payment gateway.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "provider": "stripe",
  "returnUrl": "http://localhost:3000/bookings/processing"
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `provider` | Required, enum: `stripe`, `paypal` |
| `returnUrl` | Required, valid URL |

**Business Validation:**
| Check | Error |
|-------|-------|
| Booking exists + belongs to user | 403 |
| Booking.status = PENDING | 400 `Booking is not in PENDING status` |
| Booking not expired (< 15 min) | 400 `Booking reservation has expired` |
| No existing SUCCESS payment | 400 `Booking already paid` |

**Success Response: `201 Created`**
```json
{
  "success": true,
  "data": {
    "paymentId": 1,
    "provider": "stripe",
    "amount": 2719.48,
    "currency": "USD",
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_xxx",
    "expiresAt": "2026-02-10T10:45:00.000Z"
  }
}
```

---

### 2.2 `POST /bookings/:id/payment/webhook` — Payment gateway callback

> Webhook từ Stripe/PayPal gọi khi thanh toán hoàn tất. **Không cần JWT.**

**Headers:**
```
Content-Type: application/json
Stripe-Signature: <webhook_signature>
```

**Request Body (Stripe example):**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxx",
      "payment_status": "paid",
      "metadata": {
        "bookingId": "42",
        "paymentId": "1"
      }
    }
  }
}
```

**Backend Processing:**
```
1. Verify webhook signature (Stripe/PayPal)
2. Find Payment by transactionId
3. Update Payment.status → SUCCESS
4. Update Booking.status → PAID
5. Gửi email xác nhận + vé điện tử (async)
```

**Response: `200 OK`**
```json
{ "received": true }
```

---

### 2.3 `POST /bookings/:id/payment/verify` — Verify payment (fallback)

> Client gọi sau khi redirect từ payment gateway, phòng trường hợp webhook chậm.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "bookingId": 42,
    "paymentStatus": "SUCCESS",
    "bookingStatus": "PAID"
  }
}
```

---

## 3. Cancellation & Refund

### 3.1 `GET /bookings/:id/cancellation-preview` — Xem trước thông tin hủy

> Gọi trước khi user confirm hủy, hiện refund estimate.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Business Validation:**
| Check | Error |
|-------|-------|
| Booking exists + belongs to user | 403/404 |
| Booking.status IN (PENDING, PAID) | 400 `Cannot cancel this booking` |
| Schedule.status != COMPLETED | 400 `Tour already completed` |

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "bookingId": 42,
    "currentStatus": "PAID",
    "schedule": {
      "startDate": "2026-03-15T00:00:00.000Z"
    },
    "daysUntilDeparture": 33,
    "cancellationPolicy": {
      "tier": "early",
      "refundPercentage": 70,
      "penaltyPercentage": 30,
      "description": "Hủy trước >= 15 ngày: hoàn 70%, phí phạt 30%"
    },
    "refundEstimate": {
      "totalPaid": 2719.48,
      "refundAmount": 1903.64,
      "penaltyAmount": 815.84
    },
    "requiresConfirmation": false
  }
}
```

**Khi `refundPercentage = 0` (late cancellation):**
```json
{
  "success": true,
  "data": {
    "daysUntilDeparture": 1,
    "cancellationPolicy": {
      "tier": "late",
      "refundPercentage": 0,
      "penaltyPercentage": 100,
      "description": "Hủy trước < 2 ngày: không hoàn tiền"
    },
    "refundEstimate": {
      "totalPaid": 2719.48,
      "refundAmount": 0,
      "penaltyAmount": 2719.48
    },
    "requiresConfirmation": true,
    "confirmationMessage": "Bạn sẽ KHÔNG được hoàn tiền. Vẫn muốn hủy để nhường chỗ không?"
  }
}
```

---

### 3.2 `PATCH /bookings/:id/cancel` — Xác nhận hủy booking

> **Rule áp dụng:** C1-C5 (cancellation), I3 (release stock), I4 (optimistic lock), B3 (status guard)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Thay đổi kế hoạch",
  "confirmNoRefund": false
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `reason` | Optional, string, max 500 chars |
| `confirmNoRefund` | Required if `refundPercentage = 0`, phải = `true` (Rule C4) |

**Business Validation:**
| Check | Error | Rule |
|-------|-------|------|
| Booking.status IN (PENDING, PAID) | 400 `Cannot cancel` | B3 |
| Nếu late cancel: `confirmNoRefund = true` | 400 `Must confirm no refund` | C4 |

**Transaction Flow (Backend):**
```
BEGIN TRANSACTION
  1. Booking.status → CANCELLED
  2. Nếu status trước đó = PAID AND refundAmount > 0:
     → Tạo Refund (status: PENDING, amount: refundAmount)
  3. Nếu status trước đó = PAID AND refundAmount = 0:
     → Tạo Refund (status: COMPLETED, amount: 0, reason: "late_cancellation")
  4. Release stock: currentCapacity -= travelers (Rule I3)
  5. Increment version (Rule I4)
  6. Nếu schedule.status = SOLD_OUT → OPEN (Rule S2)
COMMIT
```

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "bookingId": 42,
    "status": "CANCELLED",
    "cancelledAt": "2026-02-10T12:00:00.000Z",
    "refund": {
      "id": 1,
      "amount": 1903.64,
      "status": "PENDING",
      "estimatedProcessingDays": 5
    }
  }
}
```

**Khi hủy đơn PENDING (chưa pay):**
```json
{
  "success": true,
  "data": {
    "bookingId": 42,
    "status": "CANCELLED",
    "cancelledAt": "2026-02-10T12:00:00.000Z",
    "refund": null
  }
}
```

---

## 4. Admin Bookings

> Tất cả endpoints yêu cầu `JWT + Role = ADMIN`.

### 4.1 `GET /admin/bookings` — Danh sách tất cả bookings

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `search` | string | — | Tìm theo booking ID, tên khách, email |
| `status` | string | `all` | `PENDING`, `PAID`, `CANCELLED`, `REFUNDED`, `all` |
| `tourId` | int | — | Filter theo tour |
| `dateFrom` | ISO date | — | Schedule startDate >= dateFrom |
| `dateTo` | ISO date | — | Schedule startDate <= dateTo |
| `sort` | string | `booking_date_desc` | `booking_date_asc`, `booking_date_desc`, `amount_asc`, `amount_desc` |
| `page` | int | 1 | Min 1 |
| `limit` | int | 10 | Min 1, Max 50 |

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalRevenue": 12450.00,
      "totalBookings": 14,
      "activeBookings": 2,
      "occupancyRate": 85
    },
    "bookings": [
      {
        "id": 42,
        "status": "PAID",
        "bookingDate": "2026-02-10T10:30:00.000Z",
        "totalPrice": 2719.48,
        "travelerCount": 3,
        "customer": {
          "id": 5,
          "fullName": "Nguyen Van A",
          "email": "a@example.com",
          "avatarUrl": null
        },
        "tour": {
          "id": 1,
          "name": "Đà Lạt 3N2Đ"
        },
        "schedule": {
          "id": 1,
          "startDate": "2026-03-15T00:00:00.000Z"
        },
        "payment": {
          "status": "SUCCESS",
          "provider": "stripe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 14,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 4.2 `GET /admin/bookings/:id` — Chi tiết booking (Admin)

Giống `GET /bookings/:id` nhưng:
- Không check ownership (admin xem được tất cả)
- Bao gồm thêm thông tin customer đầy đủ (email, phone)
- Bao gồm audit log (nếu có)

---

### 4.3 `PATCH /admin/bookings/:id/status` — Admin cập nhật status

**Request Body:**
```json
{
  "status": "CANCELLED",
  "reason": "Khách yêu cầu qua hotline",
  "forceFullRefund": true
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `status` | Required, enum: `PAID`, `CANCELLED` |
| `reason` | Required when cancelling, max 500 chars |
| `forceFullRefund` | Optional, boolean (Rule C5: admin override 100% refund) |

**Khi `forceFullRefund = true`:**
- Tạo Refund với `amount = booking.totalPrice` (100%)
- `Refund.reason = "admin_cancelled: {reason}"`
- Release stock như thường

---

### 4.4 `POST /admin/bookings/:id/refund` — Admin xử lý refund thủ công

> Dùng khi auto refund qua gateway thất bại, admin xử lý tay.

**Request Body:**
```json
{
  "amount": 1903.64,
  "reason": "Refund qua chuyển khoản ngân hàng",
  "gatewayRefundId": "manual_20260210"
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `amount` | Required, number > 0, <= booking.totalPrice |
| `reason` | Required, string, max 500 chars |
| `gatewayRefundId` | Optional, string (nếu đã xử lý ngoài hệ thống) |

**Backend Processing:**
```
1. Tạo hoặc update Refund record
2. Refund.status → COMPLETED
3. Refund.gatewayRefundId = gatewayRefundId
4. Booking.status → REFUNDED
5. Gửi email thông báo hoàn tiền cho khách
```

**Success Response: `200 OK`**
```json
{
  "success": true,
  "data": {
    "refundId": 1,
    "amount": 1903.64,
    "status": "COMPLETED",
    "bookingStatus": "REFUNDED"
  }
}
```

---

### 4.5 `GET /admin/bookings/export` — Export CSV

**Query Parameters:** Giống `GET /admin/bookings` (dùng cùng filters).

**Response: `200 OK` (Content-Type: text/csv)**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="bookings_2026-02-01_2026-02-10.csv"
```

**CSV Columns:**
```csv
Booking ID,Customer,Email,Tour,Schedule Date,Travelers,Total Price,Status,Payment Status,Payment Provider,Booking Date
42,Nguyen Van A,a@example.com,Đà Lạt 3N2Đ,2026-03-15,3,2719.48,PAID,SUCCESS,stripe,2026-02-10
```

---

## 5. Error Response Format

Tất cả endpoints trả error theo format thống nhất:

```json
{
  "statusCode": 400,
  "message": "At least 1 adult required",
  "error": "Bad Request"
}
```

### Error Code Reference

| HTTP Status | Khi nào | Ví dụ |
|-------------|---------|-------|
| 400 | Validation fail, business rule violation | Min 1 adult, booking cutoff, expired reservation |
| 401 | Chưa đăng nhập | Token missing/expired |
| 403 | Không có quyền | User xem booking người khác, USER gọi admin API |
| 404 | Resource không tồn tại | Booking ID, Schedule ID không có |
| 409 | Conflict (optimistic lock) | Race condition khi reserve stock |

---

## 6. Mapping: Screen → API

| Screen | APIs sử dụng |
|--------|-------------|
| **Tour Detail** (BookingCard) | `POST /bookings` |
| **Booking Processing** (SCR-006) | `POST /bookings/:id/payment`, `GET /bookings/:id/status` |
| **Booking Confirmation** (SCR-005) | `GET /bookings/:id`, `POST /bookings/:id/payment/verify` |
| **My Bookings** (SCR-008) | `GET /bookings/me`, `GET /bookings/:id/cancellation-preview`, `PATCH /bookings/:id/cancel` |
| **Admin Bookings** (SCR-012) | `GET /admin/bookings`, `GET /admin/bookings/:id`, `PATCH /admin/bookings/:id/status`, `POST /admin/bookings/:id/refund`, `GET /admin/bookings/export` |

---

## 7. Schema Cần Bổ Sung

Dựa trên API contract, schema Prisma hiện tại cần bổ sung:

```prisma
model Booking {
  // ... existing fields ...
  cancelledAt   DateTime?     @map("cancelled_at")     // Thời điểm hủy
  cancelReason  String?       @map("cancel_reason")    // Lý do hủy

  @@index([userId])
  @@index([status])
  @@index([bookingDate])
}

model Payment {
  // ... existing fields ...
  provider      String        // Cần thêm enum nếu muốn strict
  checkoutUrl   String?       @map("checkout_url")     // URL redirect đến gateway
  expiresAt     DateTime?     @map("expires_at")       // Payment expiry

  @@index([bookingId])
  @@index([transactionId])
}

model Refund {
  // ... existing fields ...
  processedAt   DateTime?     @map("processed_at")     // Thời điểm xử lý xong

  @@index([bookingId])
  @@index([status])
}
```
