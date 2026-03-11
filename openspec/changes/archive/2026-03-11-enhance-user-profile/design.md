## Context

The profile page (`/profile`) already supports personal info editing, avatar upload, password change, and email verification. The backend has full CRUD for bookings (`BookingsController.getUserBookings`) and favorites (`FavoritesController.getUserFavorites`). The User model already has `lastLoginAt`, `active`, and `deletedAt` fields from the admin management feature.

What's missing: the profile frontend doesn't expose booking history, favorites, notification preferences, or account security — users must navigate to separate pages or have no access to these features at all.

## Goals / Non-Goals

**Goals:**

- Add tabbed navigation within profile for: Personal Info, Booking History, Favorites, Notifications, Security
- Reuse existing backend APIs for bookings and favorites (no new endpoints needed for these)
- Add `notificationPreferences` JSON field to User model for email notification toggles
- Add `GET/PATCH /users/me/notifications` endpoints for notification preferences
- Add `GET /users/me/sessions` endpoint returning login history (leverage `lastLoginAt` + new `LoginHistory` model)
- Add `DELETE /users/me` endpoint for account self-deletion (soft delete with confirmation)
- Provide a polished, responsive UI consistent with the existing profile design

**Non-Goals:**

- Real-time push notifications or WebSocket-based notifications
- Two-factor authentication (2FA) implementation
- OAuth/social login session management
- Email sending infrastructure (notification preferences are stored but email dispatch is future work)
- Session revocation (active sessions are display-only for now)

## Decisions

### 1. Tab-based navigation vs separate pages

**Decision**: Tab-based navigation within the profile page, replacing the current sidebar links.

**Rationale**: Keeps all account management in one place, reduces navigation friction. The sidebar already has placeholder items (My Bookings, Payment Methods, Security, Notifications) — we convert these to functional tabs.

**Alternative considered**: Separate routes (`/profile/bookings`, `/profile/favorites`). Rejected because it adds routing complexity and the content is lightweight enough for client-side tab switching.

### 2. Notification preferences storage

**Decision**: Store as JSON field `notificationPreferences` on User model (same pattern as `preferences`).

**Rationale**: Simple boolean toggles (booking confirmations, tour updates, promotions, reminders) don't warrant a separate table. JSON is flexible for adding new notification types later.

**Alternative considered**: Separate `NotificationPreference` table with rows per type. Overkill for ~4 boolean toggles.

### 3. Login history tracking

**Decision**: Create a new `LoginHistory` model to track login events (timestamp, IP, user agent). Display the last 10 entries in the security tab.

**Rationale**: `lastLoginAt` on User only stores the most recent login. A history table enables showing a meaningful security timeline. Recording happens in `AuthService.login()`.

**Alternative considered**: Just showing `lastLoginAt` — too limited for a security section.

### 4. Account self-deletion

**Decision**: Soft delete via `DELETE /users/me` — sets `deletedAt` timestamp and `active = false`. Requires password confirmation in request body.

**Rationale**: Soft delete is already the pattern used by admin user management. Password confirmation prevents accidental deletion. The user's data is retained for bookings/payment records integrity.

**Alternative considered**: Hard delete with cascade — rejected due to foreign key constraints on bookings/payments and audit requirements.

### 5. Favorites display in profile

**Decision**: Reuse existing `GET /favorites` API, display as a grid of tour cards within the profile tab.

**Rationale**: The API already returns tour details with the favorite. No backend changes needed.

## Risks / Trade-offs

- **[Login history table growth]** → Mitigation: Only store last 50 entries per user; add a scheduled cleanup job or rely on the existing scheduler module.
- **[Notification preferences are stored but not acted on]** → Mitigation: Clearly document this as preferences-only for now; email dispatch is a separate future feature. UI should not imply immediate effect.
- **[Tab state lost on page refresh]** → Mitigation: Use URL hash (`#bookings`, `#favorites`) or query param to persist active tab.
- **[Account deletion is irreversible from user perspective]** → Mitigation: Require password confirmation + show clear warning. Admin can still see soft-deleted users.

## Migration Plan

1. Add `notificationPreferences` JSON field to User model (nullable, defaults to null)
2. Create `LoginHistory` model (id, userId, loginAt, ipAddress, userAgent)
3. Run `prisma migrate dev --name enhance_user_profile`
4. Deploy backend changes (new endpoints + login history recording)
5. Deploy frontend tab UI
6. Rollback: revert migration, remove new endpoints — existing profile functionality unaffected
