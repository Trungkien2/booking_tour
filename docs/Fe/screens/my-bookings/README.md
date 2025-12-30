# My Bookings Screen

## Overview

User's booking history page showing upcoming, completed, and cancelled bookings with filtering and search capabilities.

## Design Reference

- **Design file**: `docs/Fe/design/user_tour_management/screen.png`
- **HTML reference**: `docs/Fe/design/user_tour_management/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-008` |
| Route | `/bookings` |
| Access | Authenticated (USER, ADMIN, GUIDE) |
| Layout | Main Layout |

## Key Features

1. Tab navigation (Upcoming, Completed, Cancelled)
2. Search by name or location
3. Sort and filter options
4. Booking cards with status
5. Quick actions (Cancel, View Details, Complete Payment, Modify)
6. Pagination / Load More

## UI Components

### Page Header
```yaml
title: "My Bookings"
subtitle: "Manage your travel itinerary, view details, and modify upcoming trips."
```

### Tab Navigation
```yaml
tabs:
  - id: "upcoming"
    label: "Upcoming"
    count: 3
    active: true
  - id: "completed"
    label: "Completed"
    count: 12
  - id: "cancelled"
    label: "Cancelled"
    count: 2
```

### Search & Filters
```yaml
search:
  placeholder: "Search by tour name or location"
  icon: "Search"

filters:
  - id: "sort"
    label: "Sort by Date"
    options:
      - "Newest First"
      - "Oldest First"
  - id: "price_range"
    label: "Price Range"
    type: "dropdown"
```

### Booking Card
```yaml
layout: "horizontal"

status_badge:
  position: "top-left"
  variants:
    - CONFIRMED: { color: "green", label: "Confirmed" }
    - PENDING: { color: "yellow", label: "Pending Payment" }
    - CANCELLED: { color: "red", label: "Cancelled" }
    - COMPLETED: { color: "gray", label: "Completed" }

image:
  aspect: "16:9"
  size: "medium"

content:
  title: "{tourName}"
  booking_id: "BOOKING ID: #{id}"
  details:
    - icon: "Calendar"
      label: "{startDate} - {endDate}"
    - icon: "MapPin"
      label: "{location}"
    - icon: "Users"
      label: "{travelerCount} Travelers"

price:
  value: "${totalPrice}"
  alignment: "right"

actions:
  CONFIRMED:
    - label: "Cancel Booking"
      style: "outline"
      action: "cancel"
    - label: "Modify"
      style: "outline"
    - label: "View Details"
      style: "primary"
  PENDING:
    - label: "Complete payment to confirm"
      style: "link"
    - label: "Complete Payment"
      style: "primary"
  COMPLETED:
    - label: "Cancel Booking"
      style: "outline"
      disabled: true
    - label: "Modify"
      style: "outline"
      disabled: true
    - label: "View Details"
      style: "primary"
```

### Empty State
```yaml
upcoming_empty:
  icon: "Calendar"
  title: "No upcoming bookings"
  description: "Start planning your next adventure!"
  action:
    label: "Browse Tours"
    link: "/tours"

completed_empty:
  title: "No completed trips yet"
  description: "Your completed trips will appear here."

cancelled_empty:
  title: "No cancelled bookings"
```

## Actions

### Cancel Booking
- Confirm dialog with cancellation policy
- Call PATCH /bookings/{id}/cancel
- Show refund information
- Update booking status

### View Details
- Navigate to /bookings/{id}

### Complete Payment
- Navigate to payment page
- Resume booking flow

### Modify Booking
- Open modification dialog
- Change date or travelers
- Show price difference

## API Endpoints

```yaml
GET /bookings/me:
  params:
    - status: "upcoming" | "completed" | "cancelled"
    - search: string
    - sort: "date_asc" | "date_desc"
    - page: number
    - limit: number

GET /bookings/{id}:
  description: Get booking details

PATCH /bookings/{id}/cancel:
  description: Cancel a booking
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
