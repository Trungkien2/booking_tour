## ADDED Requirements

### Requirement: Admin-only access to user management

The system SHALL restrict the Admin User Management UI and API to users with role ADMIN. Non-ADMIN users MUST NOT access the user list, user detail, or any admin user endpoints.

#### Scenario: Admin accesses user management page

- **WHEN** an authenticated user with role ADMIN requests GET /admin/users or the page at /admin/users
- **THEN** the system SHALL return the user list or render the page

#### Scenario: Non-admin is denied access

- **WHEN** an authenticated user without role ADMIN requests any /admin/users* endpoint or page
- **THEN** the system SHALL respond with 403 Forbidden or redirect away from the admin users area

### Requirement: Admin can list users with search and filters

The system SHALL provide an API and UI for admins to list users with optional search (name or email), filter by role (USER, ADMIN, GUIDE), filter by status (active, inactive, pending), sort order, and pagination.

#### Scenario: List with filters applied

- **WHEN** admin requests GET /admin/users with query params search, role, status, page, limit, sort
- **THEN** the system SHALL return a paginated list of users matching the filters and sort order

#### Scenario: Default list without filters

- **WHEN** admin requests GET /admin/users without query params
- **THEN** the system SHALL return the first page of users with a default sort (e.g. newest first)

### Requirement: Admin can view user detail

The system SHALL allow an admin to view a single user’s details by ID.

#### Scenario: View existing user

- **WHEN** admin requests GET /admin/users/:id for an existing user
- **THEN** the system SHALL return that user’s details (e.g. fullName, email, role, status, lastLogin, etc.)

#### Scenario: View non-existent user

- **WHEN** admin requests GET /admin/users/:id for a non-existent or invalid id
- **THEN** the system SHALL respond with 404 Not Found

### Requirement: Admin can change user role

The system SHALL allow an admin to update a user’s role to USER, ADMIN, or GUIDE via a dedicated endpoint and UI.

#### Scenario: Change role successfully

- **WHEN** admin sends PATCH /admin/users/:id/role with body { role: "GUIDE" } for an existing user
- **THEN** the system SHALL update that user’s role and return success

#### Scenario: Invalid role rejected

- **WHEN** admin sends PATCH /admin/users/:id/role with an invalid role value
- **THEN** the system SHALL respond with 400 Bad Request and SHALL NOT update the user

### Requirement: Admin can activate or deactivate user

The system SHALL allow an admin to set a user’s active status (activate or deactivate) so that inactive users cannot log in or are excluded from normal flows as defined by the system.

#### Scenario: Deactivate user

- **WHEN** admin sends PATCH /admin/users/:id/status with body { active: false }
- **THEN** the system SHALL mark the user as inactive and SHALL enforce that the user cannot log in (or as per business rule)

#### Scenario: Activate user

- **WHEN** admin sends PATCH /admin/users/:id/status with body { active: true }
- **THEN** the system SHALL mark the user as active

### Requirement: Admin can create (add) new user

The system SHALL allow an admin to create a new user (e.g. invite flow) with fullName, email, role, and optional sendInvite flag.

#### Scenario: Create user successfully

- **WHEN** admin sends POST /admin/users with valid fullName, email, role, and optional sendInvite
- **THEN** the system SHALL create the user and SHALL return 201 with the created user or invitation result

#### Scenario: Create user with duplicate email rejected

- **WHEN** admin sends POST /admin/users with an email that already exists
- **THEN** the system SHALL respond with 409 Conflict and SHALL NOT create a duplicate user

### Requirement: Admin can delete user (soft delete)

The system SHALL allow an admin to soft-delete a user so that the user record is marked as deleted but retained for audit.

#### Scenario: Soft delete user

- **WHEN** admin sends DELETE /admin/users/:id for an existing user
- **THEN** the system SHALL soft-delete the user (e.g. set deletedAt or equivalent) and SHALL respond with 204 No Content or success

#### Scenario: Delete non-existent user

- **WHEN** admin sends DELETE /admin/users/:id for a non-existent or already deleted user
- **THEN** the system SHALL respond with 404 Not Found
