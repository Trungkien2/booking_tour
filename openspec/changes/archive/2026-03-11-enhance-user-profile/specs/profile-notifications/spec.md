## ADDED Requirements

### Requirement: Notification preferences tab
The profile page SHALL include a "Notifications" tab for managing email notification preferences. The tab SHALL be accessible from the profile sidebar/tab navigation.

#### Scenario: View notification preferences
- **WHEN** user navigates to profile and clicks "Notifications" tab
- **THEN** system SHALL display grouped notification toggles with current saved preferences

#### Scenario: Default preferences for new users
- **WHEN** user has no saved notification preferences (null)
- **THEN** system SHALL display all toggles as enabled by default

### Requirement: Notification preference categories
The system SHALL support the following notification preference categories, each as a boolean toggle.

#### Scenario: Booking notifications toggle
- **WHEN** user views notification preferences
- **THEN** system SHALL display a "Booking Confirmations" toggle — controls emails for booking creation, payment confirmation, and cancellation

#### Scenario: Tour update notifications toggle
- **WHEN** user views notification preferences
- **THEN** system SHALL display a "Tour Updates" toggle — controls emails for schedule changes, availability alerts on favorited tours

#### Scenario: Promotional notifications toggle
- **WHEN** user views notification preferences
- **THEN** system SHALL display a "Promotions & Offers" toggle — controls marketing and promotional emails

#### Scenario: Reminder notifications toggle
- **WHEN** user views notification preferences
- **THEN** system SHALL display a "Trip Reminders" toggle — controls pre-trip reminder emails

### Requirement: Save notification preferences
The system SHALL persist notification preferences via `PATCH /users/me/notifications`.

#### Scenario: Save preferences
- **WHEN** user toggles any notification preference and clicks "Save"
- **THEN** system SHALL send updated preferences to the backend and display a success toast

#### Scenario: Retrieve saved preferences
- **WHEN** user opens the notifications tab
- **THEN** system SHALL fetch current preferences via `GET /users/me/notifications` and reflect them in the toggles

### Requirement: Notification preferences API
The backend SHALL expose endpoints for managing notification preferences.

#### Scenario: GET notification preferences
- **WHEN** authenticated user calls `GET /users/me/notifications`
- **THEN** system SHALL return the user's `notificationPreferences` JSON or default values if null

#### Scenario: PATCH notification preferences
- **WHEN** authenticated user calls `PATCH /users/me/notifications` with valid preference payload
- **THEN** system SHALL update the `notificationPreferences` field and return the updated preferences

#### Scenario: Unauthenticated access
- **WHEN** unauthenticated request calls notification preferences endpoints
- **THEN** system SHALL return 401 Unauthorized
