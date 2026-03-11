## Why

The user profile page currently handles basic personal info, avatar, and password changes. Users lack visibility into their booking history, saved tours, notification preferences, and account security — all essential for a complete self-service account experience. Adding these sections reduces support burden and increases user engagement.

## What Changes

- Add **Booking History** tab within the profile page showing past/upcoming bookings with status, dates, tour info, and actions (view detail, cancel).
- Add **Favorites** tab showing saved/wishlisted tours with quick actions (remove, view tour, book now).
- Add **Notification Preferences** section with granular toggles for email notifications (booking confirmations, tour updates, promotions, reminders).
- Add **Account Security** section with login history, active sessions display, and account deletion (soft delete with confirmation).

## Capabilities

### New Capabilities

- `profile-booking-history`: Dedicated booking history tab within profile, leveraging existing `GET /bookings` API with profile-specific UI (timeline view, status badges, quick actions).
- `profile-favorites`: Favorites/wishlist tab within profile, leveraging existing favorites API (`GET /favorites`) with grid/list view and quick actions.
- `profile-notifications`: Notification preferences management — new backend endpoint to store/retrieve notification settings, frontend toggles UI.
- `profile-account-security`: Account security section — login history display, active sessions, account deletion flow with confirmation.

### Modified Capabilities

_(none — existing profile, favorites, and bookings APIs remain unchanged)_

## Impact

- **Frontend**: New tab components within profile page, updated sidebar navigation, new API client functions for notification preferences and security features.
- **Backend**: New endpoints for notification preferences (`GET/PATCH /users/me/notifications`), login history (`GET /users/me/sessions`), and account deletion (`DELETE /users/me`). New fields in User model (`notificationPreferences` JSON, `lastLoginAt`, `lastLoginIp`).
- **Database**: Migration to add notification preferences and login tracking fields to User model.
- **Dependencies**: Existing profile layout, favorites module, bookings module, auth module.
