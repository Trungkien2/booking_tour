## Context

The booking system is fully functional: users browse tours → select schedule + travelers → create booking (PENDING, 15-min TTL) → pay via Stripe → confirmation. But it only supports booking one tour at a time. The design mockup at `docs/design/user_cart/screen.png` shows the target cart UI: a list of cart items (tour image, name, date, travelers, price) on the left, price summary panel (subtotal, service fee, insurance, total) on the right, with "Proceed to Checkout" button.

The frontend uses Zustand for state management (see `use-auth.ts`) with `persist` middleware for localStorage. The site header is at `components/layout/site-header.tsx`. Tour detail booking card is part of the tour detail page at `app/(site)/tours/[slug]/page.tsx`.

## Goals / Non-Goals

**Goals:**

- Client-side cart using Zustand + localStorage (no backend cart API needed)
- Cart page matching the design mockup with responsive layout
- Cart icon with item count badge in site header
- "Add to Cart" on tour detail page
- Checkout creates individual bookings per item using existing `POST /bookings` API
- Handle edge cases: duplicate tour+schedule, schedule sold out, expired items

**Non-Goals:**

- Backend cart persistence (DB-backed cart) — MVP uses client-side only
- Combined/bundled payment for multiple bookings in one Stripe session
- Insurance add-on (shown in design but not implemented in backend)
- "Add another tour" link functionality (just navigates to /tours)
- Cart sharing or multi-device sync

## Decisions

### 1. Cart storage: client-side vs server-side

**Decision**: Client-side Zustand store with localStorage persistence.

**Rationale**: No backend changes needed. Cart is ephemeral — items become bookings at checkout. Users don't need cross-device cart sync for MVP. Matches the existing pattern (auth store uses same approach).

**Trade-off**: Cart is lost if user clears browser data. Acceptable for MVP.

### 2. Checkout flow: batch vs sequential bookings

**Decision**: Sequential — create bookings one at a time, then redirect to payment for the first booking. After payment, auto-create payment for next, etc.

**Rationale**: The existing booking system creates one booking per schedule. Each booking has its own 15-min TTL and payment. Creating a batch endpoint would require significant backend changes. For MVP, we create all bookings at checkout (all PENDING), then process payments sequentially.

**Simplified MVP approach**: On "Proceed to Checkout", create all bookings → redirect to payment for the first one → after each payment completes, redirect to next → final confirmation shows all bookings.

### 3. Price calculation in cart

**Decision**: Show estimated prices from tour data in cart. Actual price is calculated server-side when booking is created.

**Rationale**: Tour prices may change between add-to-cart and checkout. Cart shows the price snapshot from when the item was added, with a note that final price is confirmed at checkout.

### 4. Cart item validation

**Decision**: Validate availability at checkout time, not continuously.

**Rationale**: Checking availability in real-time would require polling. Instead, validate when user clicks "Proceed to Checkout" — if a schedule is no longer available, show an error and let the user remove/update that item.

## Technical Design

### Cart Store (`lib/hooks/use-cart.ts`)

```typescript
interface CartItem {
  id: string;               // unique ID (uuid)
  tourId: number;
  tourName: string;
  tourSlug: string;
  coverImage: string;
  scheduleId: number;
  startDate: string;         // ISO date
  travelers: CartTraveler[];
  pricePerAdult: number;
  pricePerChild: number;
  itemTotal: number;         // calculated
  addedAt: string;           // ISO date
}

interface CartTraveler {
  fullName: string;
  ageGroup: 'ADULT' | 'CHILD' | 'BABY';
  gender?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateTravelers: (id: string, travelers: CartTraveler[]) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}
```

### Cart Page Layout (`app/(site)/cart/page.tsx`)

Following the design mockup:
- **Left column (2/3)**: List of cart items, each showing tour image, name, date, traveler count, price per person, total. Delete button per item. "Add another tour" link at bottom.
- **Right column (1/3)**: Sticky price summary panel — subtotal, service fee, total. "Proceed to Checkout" button. Free cancellation info box.
- **Empty state**: Message + CTA to browse tours.

### Checkout Flow

1. User clicks "Proceed to Checkout"
2. Frontend validates: user authenticated, cart not empty
3. For each cart item, call `POST /bookings` sequentially
4. If any booking fails (sold out, etc.), show error, keep remaining items
5. On success, redirect to `/bookings/{firstBookingId}/pay`
6. After payment, redirect to processing → confirmation
7. Clear completed items from cart

### Header Cart Icon

- Cart icon button in `site-header.tsx` between nav links and user avatar
- Badge showing item count (hidden when 0)
- Click navigates to `/cart`

### Tour Detail Integration

- Add "Add to Cart" button below/beside existing "Book Now" on the booking card
- Uses same schedule + traveler selection
- Shows toast "Added to cart" on success
- Prevents duplicate: same tour + same schedule = update existing item
