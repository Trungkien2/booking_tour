## 1. Database & Migration

- [x] 1.1 Add `notificationPreferences` JSON field (nullable) to User model in `schema.prisma`
- [x] 1.2 Create `LoginHistory` model with fields: id, userId (FK to User), loginAt, ipAddress, userAgent
- [x] 1.3 Run `prisma migrate dev --name enhance_user_profile` and regenerate client

## 2. Backend - Notification Preferences

- [x] 2.1 Create `NotificationPreferencesDto` with boolean fields: bookingConfirmations, tourUpdates, promotions, tripReminders
- [x] 2.2 Add `GET /users/me/notifications` endpoint in `UsersMeController` — returns saved preferences or defaults (all true)
- [x] 2.3 Add `PATCH /users/me/notifications` endpoint in `UsersMeController` — validates and saves preferences JSON
- [x] 2.4 Implement `getNotificationPreferences(userId)` and `updateNotificationPreferences(userId, dto)` in `UsersService`

## 3. Backend - Login History & Sessions

- [x] 3.1 Create `LoginHistory` Prisma queries in `UsersService`: `recordLogin(userId, ip, userAgent)` and `getLoginHistory(userId, limit=10)`
- [x] 3.2 Add `GET /users/me/sessions` endpoint in `UsersMeController` — returns last 10 login history entries
- [x] 3.3 Modify `AuthService.login()` to call `recordLogin()` after successful authentication, passing IP and user agent from request

## 4. Backend - Account Self-Deletion

- [x] 4.1 Create `DeleteAccountDto` with `password` field (required string)
- [x] 4.2 Add `DELETE /users/me` endpoint in `UsersMeController` — verifies password, soft-deletes user (sets `deletedAt`, `active = false`)
- [x] 4.3 Implement `deleteMyAccount(userId, password)` in `UsersService` — verify password with bcrypt, perform soft delete

## 5. Backend - Unit Tests

- [x] 5.1 Unit tests for `getNotificationPreferences` and `updateNotificationPreferences`
- [x] 5.2 Unit tests for `recordLogin` and `getLoginHistory`
- [x] 5.3 Unit tests for `deleteMyAccount` — correct password succeeds, wrong password throws, sets deletedAt and active=false

## 6. Frontend - Profile Tab Navigation

- [x] 6.1 Refactor `ProfileSidebar` to support tab-based navigation with active state (Personal Info, My Bookings, Favorites, Notifications, Security)
- [x] 6.2 Update `ProfileContent` to render the correct tab component based on active tab selection
- [x] 6.3 Persist active tab in URL hash (e.g., `#bookings`, `#favorites`) so it survives page refresh

## 7. Frontend - Booking History Tab

- [x] 7.1 Create `BookingHistoryTab` component that fetches user bookings via existing `GET /bookings` API
- [x] 7.2 Display booking list items with: tour name, cover image, booking date, travel date, traveler count, total price, status badge
- [x] 7.3 Add status filter bar (All, Upcoming, Completed, Cancelled)
- [x] 7.4 Add empty state with "No bookings yet" message and CTA to browse tours
- [x] 7.5 Add "View Details" action navigating to `/bookings/{id}` and "Cancel" action for PENDING bookings with confirmation dialog

## 8. Frontend - Favorites Tab

- [x] 8.1 Create `FavoritesTab` component that fetches user favorites via existing `GET /favorites` API
- [x] 8.2 Display favorites as a grid of tour cards with: cover image, name, price, duration, rating, location
- [x] 8.3 Add "Remove" action with optimistic UI update (remove from list immediately, call API)
- [x] 8.4 Add empty state with "No saved tours yet" message and CTA to browse tours
- [x] 8.5 Tour card click navigates to `/tours/{slug}`

## 9. Frontend - Notifications Tab

- [x] 9.1 Create `NotificationsTab` component that fetches preferences via `GET /users/me/notifications`
- [x] 9.2 Display 4 toggle groups: Booking Confirmations, Tour Updates, Promotions & Offers, Trip Reminders — with descriptions
- [x] 9.3 Add "Save" button that calls `PATCH /users/me/notifications` and shows success/error toast
- [x] 9.4 Default all toggles to enabled when preferences are null

## 10. Frontend - Security Tab

- [x] 10.1 Create `SecurityTab` component with three sections: Sign-in Method, Login History, Delete Account
- [x] 10.2 Sign-in Method section: reuse existing password change trigger (show `lastPasswordChangeAt`, "Change Password" button opens `ChangePasswordModal`)
- [x] 10.3 Login History section: fetch `GET /users/me/sessions`, display last 10 entries with date, masked IP, browser/device info
- [x] 10.4 Delete Account section: "Delete Account" button opens confirmation modal requiring password entry
- [x] 10.5 Create `DeleteAccountModal` component — password input, warning text, confirm/cancel buttons, calls `DELETE /users/me`, clears auth, redirects to home

## 11. Frontend - API Client Functions

- [x] 11.1 Add `getNotificationPreferences()` and `updateNotificationPreferences(dto)` in `lib/api/users.ts`
- [x] 11.2 Add `getLoginHistory()` in `lib/api/users.ts`
- [x] 11.3 Add `deleteMyAccount(password)` in `lib/api/users.ts`
