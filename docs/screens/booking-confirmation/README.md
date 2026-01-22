# Booking Confirmation Screen

## Overview

Success page displayed after a booking is completed, showing booking summary and next steps.

## Design Reference

- **Design file**: `docs/Fe/design/tour_confirmation_page/screen.png`
- **HTML reference**: `docs/Fe/design/tour_confirmation_page/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-005` |
| Route | `/bookings/[id]/confirmation` |
| Access | Authenticated (booking owner only) |
| Layout | Main Layout |

## Key Features

1. Success message with checkmark
2. Booking summary card
3. Tour details with map
4. Price breakdown
5. Action buttons (Manage Booking, Download Invoice, Print)
6. Next steps guide (Check email, Review meeting point, Prepare for pickup)
7. Support contact section

## UI Components

### Success Header
- Green checkmark icon
- "Booking Confirmed!" title
- Confirmation email message

### Booking Summary Card
- Booking ID (e.g., #TRV-40912)
- Status badge (Confirmed)
- Map preview with location
- Tour name and location
- Date and duration
- Participants count
- Price breakdown (Adults, Children, Taxes & Fees)
- Total price
- Cancellation policy link

### What Happens Next Section
1. Check your email - E-ticket and receipt sent
2. Review meeting point - Check itinerary for location
3. Prepare for pickup - Be ready 10 minutes early

### Action Buttons
- Manage Booking (primary)
- Download Invoice
- Print

### Support Section
- Need help message
- Contact Support button

## API Endpoints

```yaml
GET /bookings/{id}:
  description: Get booking details for confirmation page
  auth: required
  response: BookingDetail with tour, schedule, travelers, payment
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
