# Admin Booking Management Screen

## Overview

Admin page for managing all bookings with comprehensive filtering, status updates, and payment tracking.

## Design Reference

- **Design file**: `docs/Fe/design/admin_booking_management/screen.png`
- **HTML reference**: `docs/Fe/design/admin_booking_management/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-012` |
| Route | `/admin/bookings` |
| Access | ADMIN only |
| Layout | Admin Layout |

## Key Features

1. Booking statistics (Revenue, Bookings, Active, Occupancy Rate)
2. Advanced search and filters
3. Booking table with status badges
4. Quick status update actions
5. Export functionality
6. Create booking button
7. Date range filter

## UI Components

### Page Header
```yaml
breadcrumb:
  - label: "Dashboard"
    link: "/admin/dashboard"
  - label: "Booking Management"
    current: true

title: "Bookings"
subtitle: "Manage tour bookings, track payments, and update reservation statuses from a single view."

actions:
  - label: "Export"
    icon: "Download"
    style: "outline"
    action: "export_csv"
  - label: "Create Booking"
    icon: "Plus"
    style: "primary"
    action: "/admin/bookings/new"
```

### Statistics Cards
```yaml
cards:
  - label: "Total Revenue"
    value: "$12,450"
    trend: "+12%"
    trend_color: "green"
    icon: "DollarSign"

  - label: "Total Bookings"
    value: "14"
    icon: "Calendar"
    sub_badges:
      - label: "2 Active"
        color: "green"

  - label: "Occupancy Rate"
    value: "85%"
    icon: "PieChart"
```

### Filters
```yaml
search:
  placeholder: "Search booking ID, customer name..."

date_filter:
  type: "date_range"
  presets:
    - "Last 30 Days"
    - "Last 7 Days"
    - "Today"
    - "Custom"

status_filter:
  label: "Status"
  options:
    - "All"
    - "Pending"
    - "Paid"
    - "Cancelled"
    - "Refunded"

tour_filter:
  label: "Tour Type"
  type: "dropdown"
  options: "dynamic from tours"
```

### Bookings Table
```yaml
columns:
  - id: "checkbox"
    type: "selection"

  - id: "bookingId"
    label: "Booking ID"
    sortable: true
    link: "/admin/bookings/{id}"

  - id: "customer"
    label: "Customer"
    content: "avatar + name + email"

  - id: "tour"
    label: "Tour"

  - id: "dateTime"
    label: "Date & Time"
    sortable: true

  - id: "amount"
    label: "Amount"
    sortable: true

  - id: "status"
    label: "Status"
    content: "status badge"

  - id: "actions"
    label: ""
    content: "more menu"

status_badges:
  PENDING:
    color: "yellow"
    label: "Pending"
  PAID:
    color: "green"
    label: "Paid"
  CANCELLED:
    color: "red"
    label: "Cancelled"
  REFUNDED:
    color: "purple"
    label: "Refunded"

row_actions:
  - label: "View Details"
    action: "/admin/bookings/{id}"
  - label: "Update Status"
    action: "open_status_modal"
  - label: "Process Refund"
    action: "open_refund_modal"
    visible_if: "status === 'PAID'"
  - label: "Cancel Booking"
    action: "confirm_cancel"
    visible_if: "status === 'PENDING'"

pagination:
  type: "numbered"
  items_per_page: 10
  total_display: "Showing 1-10 of 45 results"
```

## Actions

### Update Booking Status
- Open modal with status options
- Update via API
- Show success toast
- Refresh table row

### Process Refund
- Open refund modal
- Show payment details
- Enter refund amount (full/partial)
- Process via payment gateway
- Update booking status to REFUNDED

### Export Bookings
- Export filtered results to CSV
- Include all booking details
- Date range in filename

### Create Manual Booking
- Navigate to create booking form
- Admin can book on behalf of customer

## API Endpoints

```yaml
GET /admin/bookings:
  params:
    - search: string
    - status: string
    - tourId: number
    - dateFrom: string
    - dateTo: string
    - page: number
    - limit: number
    - sort: string

GET /admin/bookings/{id}:
  description: Get booking details

PATCH /admin/bookings/{id}/status:
  description: Update booking status
  body:
    status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED"

POST /admin/bookings/{id}/refund:
  description: Process refund
  body:
    amount: number
    reason: string

GET /admin/bookings/export:
  description: Export bookings to CSV
  params: same as list
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
