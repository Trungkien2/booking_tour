# 01. Product Requirements Document (PRD)

> Defines the project scope, goals, and core features.
> Used by AI to understand "what needs to be built."

---

## Document Information

| Item         | Value           |
| ------------ | --------------- |
| Project Name | `Booking Tour`  |
| Version      | 1.0             |
| Date         | `2025-01-XX`    |
| Author       | `Dev Team`      |

---

## 1. Product Overview

### 1.1 Product Vision

```
A comprehensive tour booking platform that allows users to browse tours, make reservations, process payments, and leave reviews. The platform includes both a customer-facing web application and an admin panel for tour management.
```

### 1.2 Core Value Proposition

| Value                      | Description                                                     |
| -------------------------- | --------------------------------------------------------------- |
| **Easy Booking**           | Simple and intuitive tour booking experience                    |
| **Real-time Availability** | Live schedule and capacity management                           |
| **Secure Payments**        | Multiple payment providers (Stripe, PayPal)                     |
| **Review System**          | User reviews and ratings for tours                              |

### 1.3 Target Users

| Priority  | User Segment | Core Needs                                          |
| --------- | ------------ | --------------------------------------------------- |
| Primary   | Customers    | Browse tours, make bookings, pay online             |
| Primary   | Admins       | Manage tours, schedules, bookings, view reports     |
| Secondary | Tour Guides  | View assigned tours, manage travelers               |

---

## 2. Success Metrics

### 2.1 Business Goals

| Goal              | Metric                  | Target Value    |
| ----------------- | ----------------------- | --------------- |
| MVP Launch        | Core features completed | Phase 1         |
| User Acquisition  | Registered users        | 1000+ users     |

### 2.2 Technical Success Metrics

| Metric              | Target Value | Measurement Method |
| ------------------- | ------------ | ------------------ |
| System Availability | 99.9%        | Monthly downtime   |
| API Response Time   | < 500ms      | P95 baseline       |
| Page Load Time      | < 3s         | Lighthouse LCP     |
| Error Rate          | < 0.1%       | Sentry monitoring  |

---

## 3. User Role Definitions

### 3.1 Role Hierarchy

```yaml
roles:
  - name: USER
    description: Regular customer who can browse and book tours
    permissions:
      - View tours
      - Make bookings
      - Make payments
      - Write reviews
      - View own bookings

  - name: ADMIN
    description: Full system access for tour and booking management
    permissions:
      - All USER permissions
      - Manage tours (CRUD)
      - Manage schedules (CRUD)
      - Manage bookings
      - Process refunds
      - View reports
      - Manage users

  - name: GUIDE
    description: Tour guide with limited access
    permissions:
      - View assigned tours
      - View travelers for assigned tours
```

### 3.2 Role Summary

| Role ID | Role Name | Core Permissions          | Data Scope          |
| ------- | --------- | ------------------------- | ------------------- |
| USER    | Customer  | Book tours, pay, review   | Own data only       |
| ADMIN   | Admin     | Full system management    | All data            |
| GUIDE   | Guide     | View assigned tours       | Assigned tours only |

---

## 4. Feature Requirements

### 4.1 Feature Priority (MoSCoW)

| Priority   | Definition                                | Included in MVP |
| ---------- | ----------------------------------------- | --------------- |
| **Must**   | Essential features, cannot launch without | Yes             |
| **Should** | Important but alternatives possible       | If possible     |
| **Could**  | Nice to have                              | No              |
| **Won't**  | Excluded from this version                | No              |

### 4.2 Feature List

```yaml
features:
  # === Phase 1: Authentication ===
  - id: 'FR-1.1'
    name: 'User Registration'
    priority: 'Must'
    description: 'Users can register with email and password'
    acceptance_criteria:
      - 'AC-1.1.1: Registration form with email, password, fullName, phone'
      - 'AC-1.1.2: Email validation and uniqueness check'
      - 'AC-1.1.3: Password hashing before storage'

  - id: 'FR-1.2'
    name: 'User Login'
    priority: 'Must'
    description: 'Users can login with email and password'
    acceptance_criteria:
      - 'AC-1.2.1: Login with correct credentials returns JWT tokens'
      - 'AC-1.2.2: Error message for incorrect credentials'
      - 'AC-1.2.3: Token refresh mechanism'

  # === Phase 2: Tour Catalog ===
  - id: 'FR-2.1'
    name: 'Tour Listing'
    priority: 'Must'
    description: 'Display list of available tours with pagination, filtering'
    acceptance_criteria:
      - 'AC-2.1.1: List tours with name, image, price, duration, rating'
      - 'AC-2.1.2: Filter by location, price range, duration'
      - 'AC-2.1.3: Sort by price, rating, date'

  - id: 'FR-2.2'
    name: 'Tour Detail'
    priority: 'Must'
    description: 'View detailed tour information'
    acceptance_criteria:
      - 'AC-2.2.1: Display full tour details with images gallery'
      - 'AC-2.2.2: Show available schedules with capacity'
      - 'AC-2.2.3: Display reviews and ratings'

  - id: 'FR-2.3'
    name: 'Tour Management (Admin)'
    priority: 'Must'
    description: 'Admins can create, update, delete tours'
    acceptance_criteria:
      - 'AC-2.3.1: Create tour with all required fields'
      - 'AC-2.3.2: Upload multiple images'
      - 'AC-2.3.3: Edit and delete tours'

  # === Phase 3: Schedule & Capacity ===
  - id: 'FR-3.1'
    name: 'Schedule Management'
    priority: 'Must'
    description: 'Manage tour schedules with capacity'
    acceptance_criteria:
      - 'AC-3.1.1: Create schedule with start date and max capacity'
      - 'AC-3.1.2: Track current capacity in real-time'
      - 'AC-3.1.3: Auto-update status (OPEN, SOLD_OUT, CLOSED, COMPLETED)'

  - id: 'FR-3.2'
    name: 'Optimistic Locking'
    priority: 'Must'
    description: 'Prevent overbooking with optimistic locking'
    acceptance_criteria:
      - 'AC-3.2.1: Version field for race condition prevention'
      - 'AC-3.2.2: Retry mechanism on version conflict'

  # === Phase 4: Booking ===
  - id: 'FR-4.1'
    name: 'Create Booking'
    priority: 'Must'
    description: 'Users can book a tour schedule'
    acceptance_criteria:
      - 'AC-4.1.1: Select schedule and add travelers'
      - 'AC-4.1.2: Add traveler details (name, gender, age group)'
      - 'AC-4.1.3: Calculate total price based on travelers'
      - 'AC-4.1.4: Create booking with PENDING status'

  - id: 'FR-4.2'
    name: 'Booking Management'
    priority: 'Must'
    description: 'Users can view and cancel bookings'
    acceptance_criteria:
      - 'AC-4.2.1: View booking history with status'
      - 'AC-4.2.2: Cancel pending bookings'
      - 'AC-4.2.3: View booking details with travelers'

  # === Phase 5: Payment ===
  - id: 'FR-5.1'
    name: 'Payment Processing'
    priority: 'Must'
    description: 'Process payments via Stripe/PayPal'
    acceptance_criteria:
      - 'AC-5.1.1: Integrate Stripe payment'
      - 'AC-5.1.2: Integrate PayPal payment'
      - 'AC-5.1.3: Handle payment success/failure webhooks'
      - 'AC-5.1.4: Update booking status to PAID on success'

  - id: 'FR-5.2'
    name: 'Refund Processing'
    priority: 'Should'
    description: 'Process refunds for cancelled bookings'
    acceptance_criteria:
      - 'AC-5.2.1: Admin can initiate refund'
      - 'AC-5.2.2: Track refund status (PENDING, PROCESSING, COMPLETED, FAILED)'
      - 'AC-5.2.3: Update booking status to REFUNDED'

  # === Phase 6: Reviews ===
  - id: 'FR-6.1'
    name: 'Review System'
    priority: 'Should'
    description: 'Users can review completed tours'
    acceptance_criteria:
      - 'AC-6.1.1: Submit review with rating (1-5) and comment'
      - 'AC-6.1.2: Only users who completed the tour can review'
      - 'AC-6.1.3: Calculate and update tour average rating'
```

### 4.3 Detailed Acceptance Criteria per Feature

```gherkin
Feature: FR-4.1 Create Booking

Scenario: Successful booking creation
  Given user is authenticated
  And schedule "Hanoi City Tour - Jan 15" has available capacity
  When user selects the schedule
  And adds 2 adult travelers and 1 child traveler
  And confirms booking
  Then booking is created with status "PENDING"
  And total price is calculated correctly
  And schedule capacity is updated

Scenario: Booking fails due to no availability
  Given user is authenticated
  And schedule "Hanoi City Tour - Jan 15" is SOLD_OUT
  When user attempts to book
  Then error message "This schedule is sold out" is displayed
  And no booking is created
```

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID     | Requirement       | Target Value  |
| ------ | ----------------- | ------------- |
| NFR-P1 | Page load time    | < 3s (LCP)    |
| NFR-P2 | API response time | < 500ms (P95) |
| NFR-P3 | Concurrent users  | 1000+         |

### 5.2 Security

| ID     | Requirement                  | Implementation Method    |
| ------ | ---------------------------- | ------------------------ |
| NFR-S1 | Data transmission encryption | TLS 1.3                  |
| NFR-S2 | Authentication tokens        | JWT (Access + Refresh)   |
| NFR-S3 | Password storage             | bcrypt hashing           |
| NFR-S4 | Input validation             | Server-side validation   |

### 5.3 Accessibility

| ID     | Requirement           | Standard                |
| ------ | --------------------- | ----------------------- |
| NFR-A1 | Keyboard navigation   | All features accessible |
| NFR-A2 | Screen reader support | WCAG 2.1 AA             |
| NFR-A3 | Color contrast        | 4.5:1 or higher         |

---

## 6. Data Models

### 6.1 Core Entities

```yaml
entities:
  User:
    fields:
      - id: Int (PK, auto-increment)
      - email: String (unique)
      - password: String (hashed)
      - fullName: String (optional)
      - phone: String (optional)
      - role: Enum (USER, ADMIN, GUIDE)
      - createdAt: DateTime
      - updatedAt: DateTime
    relations:
      - bookings: Booking[] (1:N)
      - reviews: Review[] (1:N)
      - payments: Payment[] (1:N)

  Tour:
    fields:
      - id: Int (PK)
      - name: String
      - slug: String (unique, SEO URL)
      - summary: String (optional)
      - description: Text (optional)
      - coverImage: String (optional)
      - images: Json (array of image URLs)
      - durationDays: Int
      - priceAdult: Decimal(10,2)
      - priceChild: Decimal(10,2)
      - location: String (optional)
      - ratingAverage: Decimal(2,1) (default: 0)
    relations:
      - schedules: TourSchedule[] (1:N)
      - reviews: Review[] (1:N)

  TourSchedule:
    fields:
      - id: Int (PK)
      - tourId: Int (FK)
      - startDate: DateTime
      - maxCapacity: Int
      - currentCapacity: Int (default: 0)
      - status: Enum (OPEN, SOLD_OUT, CLOSED, COMPLETED)
      - version: Int (for optimistic locking)
    relations:
      - tour: Tour (N:1)
      - bookings: Booking[] (1:N)

  Booking:
    fields:
      - id: Int (PK)
      - userId: Int (FK)
      - scheduleId: Int (FK)
      - bookingDate: DateTime (default: now)
      - totalPrice: Decimal(12,2)
      - status: Enum (PENDING, PAID, CANCELLED, REFUNDED)
      - note: String (optional)
    relations:
      - user: User (N:1)
      - schedule: TourSchedule (N:1)
      - travelers: BookingTraveler[] (1:N)
      - payments: Payment[] (1:N)
      - refunds: Refund[] (1:N)

  BookingTraveler:
    fields:
      - id: Int (PK)
      - bookingId: Int (FK)
      - fullName: String
      - gender: String (optional)
      - ageGroup: Enum (ADULT, CHILD, BABY)
      - price: Decimal(10,2) (price snapshot)
    relations:
      - booking: Booking (N:1)

  Payment:
    fields:
      - id: Int (PK)
      - bookingId: Int (FK)
      - userId: Int (FK)
      - amount: Decimal(12,2)
      - provider: String (stripe, paypal)
      - transactionId: String
      - status: Enum (PENDING, SUCCESS, FAILED)
      - createdAt: DateTime
    relations:
      - booking: Booking (N:1)
      - user: User (N:1)
      - refunds: Refund[] (1:N)

  Refund:
    fields:
      - id: Int (PK)
      - bookingId: Int (FK)
      - paymentId: Int (FK)
      - amount: Decimal(12,2)
      - reason: String (optional)
      - status: Enum (PENDING, PROCESSING, COMPLETED, FAILED)
      - gatewayRefundId: String (optional)
      - createdAt: DateTime
    relations:
      - booking: Booking (N:1)
      - payment: Payment (N:1)

  Review:
    fields:
      - id: Int (PK)
      - tourId: Int (FK)
      - userId: Int (FK)
      - rating: Int (1-5)
      - comment: Text (optional)
      - createdAt: DateTime
    relations:
      - tour: Tour (N:1)
      - user: User (N:1)
```

---

## 7. Scope Definition

### 7.1 In-Scope (Included)

```yaml
in_scope:
  - User authentication (register, login, JWT tokens)
  - Tour catalog with search and filtering
  - Tour schedule management with capacity tracking
  - Booking system with traveler management
  - Payment integration (Stripe, PayPal)
  - Refund processing
  - Review and rating system
  - Admin panel for tour/booking management
  - Responsive web design (mobile, tablet, desktop)
```

### 7.2 Out-of-Scope (Excluded)

```yaml
out_scope:
  - Mobile native app (iOS/Android)
  - Social login (Google, Facebook)
  - Real-time chat support
  - Multi-language support (i18n)
  - Email notifications
  - SMS notifications
```

### 7.3 Future Considerations

```yaml
future_consideration:
  - feature: 'Email notifications'
    target_phase: 'Phase 2'
  - feature: 'Multi-language support'
    target_phase: 'Phase 2'
  - feature: 'Mobile app'
    target_phase: 'Phase 3'
  - feature: 'Social login'
    target_phase: 'Phase 2'
```

---

## 8. Terminology

| Term            | Definition                                    | Example                    |
| --------------- | --------------------------------------------- | -------------------------- |
| Tour            | A travel package offered to customers         | "Hanoi City Tour 3 Days"   |
| Schedule        | A specific departure date for a tour          | Jan 15, 2025 departure     |
| Booking         | A reservation made by a user                  | User books 3 seats         |
| Traveler        | A person included in a booking                | Adult or Child passenger   |
| Age Group       | Category for pricing (ADULT, CHILD, BABY)     | Child gets 50% discount    |
| Capacity        | Maximum number of travelers per schedule      | 30 seats per departure     |

---

## Checklist

Check when PRD is complete:

- [x] All roles defined (USER, ADMIN, GUIDE)
- [x] Unique IDs assigned to features
- [x] Given/When/Then AC written for Must features
- [x] Performance/security requirement target values specified
- [x] In-Scope/Out-of-Scope clearly distinguished
- [x] Data models defined with relations
