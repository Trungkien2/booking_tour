## ADDED Requirements

### Requirement: Account security tab
The profile page SHALL include a "Security" tab displaying account security information and actions. The tab SHALL be accessible from the profile sidebar/tab navigation.

#### Scenario: View security tab
- **WHEN** user navigates to profile and clicks "Security" tab
- **THEN** system SHALL display: sign-in method section (existing password change), login history, and account deletion section

### Requirement: Login history display
The security tab SHALL display the user's recent login history.

#### Scenario: View login history
- **WHEN** user opens the security tab
- **THEN** system SHALL display the last 10 login events with: date/time, IP address (partially masked), and browser/device info (parsed from user agent)

#### Scenario: Empty login history
- **WHEN** user has no login history records
- **THEN** system SHALL display "No login history available"

### Requirement: Login history tracking
The backend SHALL record login events when users authenticate.

#### Scenario: Record login on successful authentication
- **WHEN** user successfully logs in via `POST /auth/login`
- **THEN** system SHALL create a LoginHistory record with userId, timestamp, IP address, and user agent string

#### Scenario: Login history API
- **WHEN** authenticated user calls `GET /users/me/sessions`
- **THEN** system SHALL return the last 10 login history entries ordered by most recent first

#### Scenario: Unauthenticated access to sessions
- **WHEN** unauthenticated request calls `GET /users/me/sessions`
- **THEN** system SHALL return 401 Unauthorized

### Requirement: Login history data model
The system SHALL store login history in a dedicated `LoginHistory` model.

#### Scenario: LoginHistory model structure
- **WHEN** a login event is recorded
- **THEN** system SHALL store: id (auto-increment), userId (foreign key to User), loginAt (timestamp), ipAddress (string, nullable), userAgent (string, nullable)

### Requirement: Account self-deletion
The security tab SHALL allow users to delete their own account via soft delete.

#### Scenario: Initiate account deletion
- **WHEN** user clicks "Delete Account" button in the security tab
- **THEN** system SHALL display a confirmation modal with warning text explaining the consequences

#### Scenario: Confirm account deletion with password
- **WHEN** user enters their current password in the deletion confirmation modal and confirms
- **THEN** system SHALL call `DELETE /users/me` with the password, soft-delete the account (set `deletedAt` and `active = false`), clear auth tokens, and redirect to the home page

#### Scenario: Wrong password on deletion
- **WHEN** user enters incorrect password in the deletion confirmation
- **THEN** system SHALL display an error message "Incorrect password" and NOT proceed with deletion

#### Scenario: Account deletion API
- **WHEN** authenticated user calls `DELETE /users/me` with valid password in request body
- **THEN** system SHALL verify the password, set `deletedAt = now()` and `active = false`, and return 200 success

#### Scenario: Unauthenticated account deletion
- **WHEN** unauthenticated request calls `DELETE /users/me`
- **THEN** system SHALL return 401 Unauthorized
