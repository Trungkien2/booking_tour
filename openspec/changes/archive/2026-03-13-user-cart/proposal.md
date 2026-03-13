## Why

Currently, users can only book one tour at a time. If they want to book multiple tours, they must go through the entire booking → payment flow repeatedly. This creates friction, especially for travelers planning multi-destination trips. A shopping cart lets users collect multiple tours with their chosen schedules and travelers, then checkout everything in one session.

## What Changes

- Add a **Shopping Cart** page (`/cart`) where users can review selected tours before checkout.
- Add **"Add to Cart"** action on tour detail pages (alongside existing direct booking).
- Add a **cart icon with badge** in the site header showing item count.
- Add a **client-side cart store** (Zustand + localStorage) to persist cart items across sessions.
- On checkout, create individual bookings per cart item (each tour = 1 booking) and redirect to a combined payment flow.

## Capabilities

### New Capabilities

- `cart-store`: Zustand store with localStorage persistence. Stores cart items (tourId, scheduleId, travelers, price snapshot). No backend/DB needed — cart is purely client-side.
- `cart-page`: Cart page at `/cart` showing all items, price summary (subtotal + service fee), remove item, and "Proceed to Checkout" button.
- `cart-header-icon`: Cart icon in site header with item count badge.
- `add-to-cart`: "Add to Cart" button on tour detail page. Adds selected schedule + travelers to cart store.
- `cart-checkout`: Checkout flow that creates bookings for all cart items, then redirects to payment for the first PENDING booking (sequential payment or bundled).

### Modified Capabilities

- `site-header`: Add cart icon with badge next to user avatar.
- `tour-detail-booking-card`: Add "Add to Cart" button alongside existing "Book Now" button.

## Impact

- **Frontend**: New Zustand cart store, new `/cart` page, modified site header, modified tour detail booking card.
- **Backend**: No changes needed for MVP — reuses existing `POST /bookings` and payment endpoints. Each cart item becomes an individual booking.
- **Database**: No schema changes.
- **Dependencies**: Zustand (already installed), existing booking/payment APIs.
