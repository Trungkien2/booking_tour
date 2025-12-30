# Booking Processing Screen

## Overview

Loading/processing page shown while the booking is being finalized after payment.

## Design Reference

- **Design file**: `docs/Fe/design/booking_processing_screen/screen.png`
- **HTML reference**: `docs/Fe/design/booking_processing_screen/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-006` |
| Route | `/bookings/processing` |
| Access | Authenticated |
| Layout | Minimal Layout (no navigation) |

## Key Features

1. Animated loading spinner
2. Progress indicator with steps
3. Status messages
4. Warning message (do not close page)
5. Support contact link

## UI Components

### Processing Card
- Animated spinner/loader icon
- "Finalizing your adventure" title
- Subtitle: "Hang tight! We are securing your spots with the local operator. This usually takes less than a minute."

### Progress Bar
- Animated progress bar (e.g., 75%)
- Current step label (e.g., "Confirming availability...")

### Step Checklist
1. Payment Verified ✓ (completed)
2. Reserving Spots ○ (in progress, animated)
3. Generating Tickets (pending, grayed out)

### Warning Banner
- Yellow background
- Warning icon
- "Please do not close this window or refresh the page to avoid interrupting the booking process."

### Footer Links
- Need help? • Contact Support

## States

### Processing Steps
```yaml
steps:
  - id: payment_verified
    label: "Payment Verified"
    duration: 2s

  - id: reserving_spots
    label: "Reserving Spots"
    duration: 3-5s

  - id: generating_tickets
    label: "Generating Tickets"
    duration: 2s
```

### Success Flow
- All steps complete → Redirect to confirmation page

### Error Flow
- Show error message
- Provide retry or contact support options

## API Endpoints

```yaml
GET /bookings/{id}/status:
  description: Poll booking status during processing
  polling_interval: 2000ms
  responses:
    - status: PROCESSING
    - status: CONFIRMED → redirect to confirmation
    - status: FAILED → show error
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
