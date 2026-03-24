# Design: Guest Checkout

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Cart Page (cart-content.tsx)                                        │
│                                                                     │
│  User clicks "Checkout"                                             │
│       │                                                             │
│       ├─ isAuthenticated() === true → existing flow (createBooking) │
│       │                                                             │
│       └─ isAuthenticated() === false                                │
│            │                                                        │
│            ▼                                                        │
│  ┌──────────────────────────────────┐                               │
│  │  GuestCheckoutForm (NEW)         │                               │
│  │  ├── email input                 │                               │
│  │  ├── fullName input              │                               │
│  │  └── "Continue as Guest" button  │                               │
│  └──────────┬───────────────────────┘                               │
│             │                                                       │
│             ▼                                                       │
│  POST /auth/guest-register { email, fullName }                      │
│       │                                                             │
│       ├─ Backend creates User (random password, role=USER)          │
│       ├─ Returns { accessToken, refreshToken, user }                │
│       └─ Frontend stores tokens via useAuth().login()               │
│             │                                                       │
│             ▼                                                       │
│  Now authenticated → proceed with existing checkout flow            │
│  (createBooking → /bookings/{id}/pay → Stripe → confirmation)      │
└─────────────────────────────────────────────────────────────────────┘
```

## Backend: New Endpoint

### `POST /auth/guest-register`

Added to existing `AuthController` and `AuthService`. No new module needed.

```typescript
// AuthController
@Public()
@Throttle({ default: { limit: 5, ttl: 60000 } }) // stricter rate limit
@Post('guest-register')
async guestRegister(@Body() dto: GuestRegisterDto) {
  return this.authService.guestRegister(dto);
}
```

### AuthService.guestRegister

```typescript
async guestRegister(dto: GuestRegisterDto) {
  const { email, fullName } = dto;

  // Check if email already exists
  const existing = await this.prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    throw new ConflictException(
      'An account with this email already exists. Please log in.',
    );
  }

  // Create user with random password
  const randomPassword = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const user = await this.prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      role: 'USER',
    },
  });

  // Generate tokens (same as login)
  const accessToken = this.generateAccessToken(user.id, user.email, user.role);
  const refreshToken = await this.generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}
```

### GuestRegisterDto

```typescript
export class GuestRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;
}
```

## Frontend Changes

### 1. New API function: `guestRegister`

In `apps/web/lib/api/auth.ts`:

```typescript
export async function guestRegister(
  email: string,
  fullName: string,
): Promise<{ accessToken: string; refreshToken: string; user: User }> {
  const res = await fetch(`${API_URL}/auth/guest-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Guest registration failed');
  }
  return res.json();
}
```

### 2. New component: `GuestCheckoutForm`

In `apps/web/components/cart/guest-checkout-form.tsx`:

- Simple form: email + fullName inputs
- Zod validation (email format, fullName required)
- "Continue as Guest" submit button
- "Already have an account? Log in" link → `/login?redirect=/cart`
- Error handling (email exists → show login prompt)
- On success: calls `onAuthenticated()` callback

### 3. Modified: `CartContent`

Current behavior when not authenticated:
```typescript
if (!isAuthenticated() || !accessToken) {
  router.push("/login?redirect=/cart");
  return;
}
```

New behavior:
```typescript
const [showGuestForm, setShowGuestForm] = useState(false);

const handleCheckout = async () => {
  if (!isAuthenticated() || !accessToken) {
    setShowGuestForm(true);  // show inline form instead of redirect
    return;
  }
  // ... existing checkout logic
};

const handleGuestAuthenticated = () => {
  setShowGuestForm(false);
  // tokens are now stored, re-trigger checkout
  handleCheckout();
};
```

The `GuestCheckoutForm` is shown inline in the cart page (below the cart summary or as a modal), not as a separate route.

### 4. Auth store integration

The `useAuth` hook/store needs to handle the guest register response the same way it handles login — store `accessToken`, `refreshToken`, and `user` in state/localStorage. The existing `login` or `setTokens` method should work directly.

## Design Decisions

1. **Same User model, no schema changes** — Guest users are regular Users with a random password. This means zero changes to Booking, Payment, or any downstream service.

2. **Inline form, not redirect** — The guest form appears on the cart page itself. No redirect to a separate page, no context loss.

3. **Auto-proceed after authentication** — Once the guest registers and tokens are stored, checkout continues automatically. One-click experience after filling the form.

4. **Stricter rate limiting** — `/auth/guest-register` gets a tighter rate limit (5 req/min) than other endpoints to prevent spam account creation.

5. **ConflictException for existing email** — If the email exists, we don't silently log them in (security risk). We tell them to log in explicitly.

6. **No "guest" role** — Guest users get `role: USER`. There's no behavioral difference between a guest-created account and a normally registered one. They can set a password later via "forgot password" to fully claim their account.
