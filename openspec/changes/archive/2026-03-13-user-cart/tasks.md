## 1. Cart Store (Zustand)

- [x] 1.1 Create `apps/web/lib/hooks/use-cart.ts` with Zustand store + `persist` middleware (localStorage key: `cart-storage`)
- [x] 1.2 Implement state: `items` array of `CartItem` with fields: id (uuid), tourId, tourName, tourSlug, coverImage, scheduleId, startDate, travelers, pricePerAdult, pricePerChild, itemTotal, addedAt
- [x] 1.3 Implement actions: `addItem` (prevent duplicate tour+schedule — update travelers if exists), `removeItem`, `updateTravelers`, `clearCart`
- [x] 1.4 Implement computed getters: `getItemCount`, `getSubtotal` (sum of itemTotal), `getServiceFee` (e.g. flat $15 or percentage), `getTotal` (subtotal + fee)

## 2. Header Cart Icon

- [x] 2.1 Add cart icon button in `components/layout/site-header.tsx` — position between nav links and user avatar
- [x] 2.2 Show item count badge (small circle with number) when cart has items, hidden when empty
- [x] 2.3 Click navigates to `/cart` using `next/link`
- [x] 2.4 Use `useCart` store to read item count (handle SSR hydration mismatch with `useEffect` + mounted state)

## 3. Cart Page

- [x] 3.1 Create `apps/web/app/(site)/cart/page.tsx` — server component wrapper with client cart content
- [x] 3.2 Create `apps/web/components/cart/cart-content.tsx` — main client component with 2-column grid layout (matching design mockup)
- [x] 3.3 Create `apps/web/components/cart/cart-item.tsx` — individual cart item card: tour image (w-48), tour name, date with calendar icon, traveler count with person icon, price per person, total price, delete button (trash icon, hover red)
- [x] 3.4 Create `apps/web/components/cart/cart-summary.tsx` — sticky right panel: subtotal, service fee, total, "Proceed to Checkout" button (primary blue, full width), "Secure payment powered by Stripe" text, free cancellation info box
- [x] 3.5 Create `apps/web/components/cart/cart-empty.tsx` — empty state: icon, "Your cart is empty" message, "Browse Tours" CTA button linking to `/tours`
- [x] 3.6 Add "Add another tour" link at bottom of cart items list, linking to `/tours`

## 4. Add to Cart (Tour Detail)

- [x] 4.1 Add "Add to Cart" button on tour detail booking card — secondary style (outline/ghost), below or beside existing "Book Now" button
- [x] 4.2 On click: collect selected schedule + travelers from booking card state → call `useCart.addItem()` with tour data + schedule + travelers + price snapshot
- [x] 4.3 Show success toast/notification: "Added to cart" with link to view cart
- [x] 4.4 If same tour+schedule already in cart, update travelers and show "Cart updated" toast
- [x] 4.5 Disable "Add to Cart" if no schedule selected or no travelers added (same validation as "Book Now")

## 5. Checkout Flow

- [x] 5.1 On "Proceed to Checkout" click: validate user is authenticated (redirect to login if not), validate cart not empty
- [x] 5.2 Show loading state on checkout button ("Creating bookings...")
- [x] 5.3 Create bookings sequentially: for each cart item, call `POST /bookings` with `{ scheduleId, travelers, note }`. Collect created booking IDs
- [x] 5.4 Handle errors: if a booking fails (sold out, schedule closed, etc.), show error for that specific item, mark it in cart, continue with remaining items
- [x] 5.5 On success (at least 1 booking created): clear successful items from cart, redirect to `/bookings/{firstBookingId}/pay` to start payment flow
- [x] 5.6 After first payment completes and user reaches confirmation page, show "You have X more bookings to pay" banner if remaining unpaid bookings exist, with link to next booking's pay page

## 6. Responsive & Polish

- [x] 6.1 Mobile layout: stack columns vertically (items full width, then summary), cart item image on top
- [x] 6.2 Handle Zustand hydration: use `useEffect` + `useState` mounted flag to avoid SSR mismatch for cart icon badge and cart page content
- [x] 6.3 Add page title "Your Shopping Cart" with subtitle "Review and confirm your selected adventures" (matching design)
- [x] 6.4 Style consistency: use existing Tailwind classes, match border-radius, shadows, colors with rest of the app
