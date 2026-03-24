# Guest Checkout via Auto-Created User Account

## Problem

Currently, unauthenticated users who try to checkout from the cart are redirected to `/login?redirect=/cart`. After logging in or registering, they return to the cart and must click checkout again. This creates friction:

1. Two-click checkout (checkout → login → checkout again)
2. Registration requires password upfront, which is a barrier for impulse bookings
3. Users who just want to book a tour are forced into a full account creation flow

## Proposed Change

Allow guest checkout by auto-creating a User account with a random password when an unauthenticated user checks out. The guest provides only their **email** and **full name**. After successful booking + payment, they receive an email invitation to set a password and claim their account.

This preserves the entire existing booking/payment flow unchanged — the guest user gets a real `userId` and JWT token, so all downstream services (BookingsService, PaymentsService, StripeService) work identically.

## Flow

```
Guest clicks "Checkout" on cart
  → Guest checkout form appears (email + full name)
  → POST /auth/guest-register { email, fullName }
  → Backend creates User (random password) + returns JWT tokens
  → Frontend stores tokens (same as normal login)
  → Checkout proceeds normally (createBooking → pay → Stripe → confirmation)
```

If the email already exists:
- Show message: "An account with this email already exists. Please log in."
- Provide login link with redirect back to cart

## Scope

### In scope
- New `POST /auth/guest-register` endpoint
- Guest checkout form component on cart page
- Frontend logic to auto-authenticate after guest registration
- "Set your password" prompt on confirmation page (optional, nice-to-have)

### Out of scope
- Email verification for guest accounts
- "Set password" email sending (can be added later)
- Guest checkout from tour detail "Book Now" button (only cart for now)
- Merging duplicate guest accounts

## Non-goals
- Making `userId` nullable on Booking/Payment models
- Creating a separate "guest" booking flow
- Supporting checkout without any user identification

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Spam account creation | Rate limit `/auth/guest-register` (stricter than normal endpoints) |
| Email already exists | Return clear error, prompt to log in instead |
| Guest never sets password | Account still works — they can use "forgot password" flow anytime |
| Orphaned guest accounts | Can be cleaned up via scheduled task later (not in scope) |
