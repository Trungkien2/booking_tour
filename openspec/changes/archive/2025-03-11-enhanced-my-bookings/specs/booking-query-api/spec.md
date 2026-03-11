## MODIFIED Requirements

### Requirement: Query current user's bookings
The system SHALL provide an API endpoint `GET /bookings/me` that returns a paginated list of bookings belonging to the authenticated user, filtered and sorted according to query parameters used by the `/bookings` screen.

#### Scenario: List bookings by status
- **WHEN** a client calls `GET /bookings/me` with a `status` query parameter of `upcoming`, `completed`, or `cancelled`
- **THEN** the system SHALL return only bookings for the authenticated user that match the requested logical status grouping and SHALL include metadata needed for the My Bookings cards (booking id, status, tour name, location, schedule date range, traveler count, and total price)

#### Scenario: Search and sort bookings
- **WHEN** a client calls `GET /bookings/me` with `search` and `sort` query parameters
- **THEN** the system SHALL restrict results to bookings whose tour name or primary location matches the search term and SHALL order the results by schedule start date according to the requested sort order

#### Scenario: Paginate bookings
- **WHEN** a client calls `GET /bookings/me` with `page` and `limit` query parameters
- **THEN** the system SHALL return only the bookings for the requested page, SHALL respect an upper bound on `limit`, and SHALL include pagination metadata sufficient for the client to render \"Load more\" or page navigation

### Requirement: Fetch booking details by id
The system SHALL provide an API endpoint `GET /bookings/{id}` that returns booking details for the authenticated user's booking identified by `{id}`.

#### Scenario: Fetch existing booking details
- **WHEN** a client calls `GET /bookings/{id}` for a booking that belongs to the authenticated user
- **THEN** the system SHALL return detailed booking information including tour data, schedule data, traveler list, price breakdown where available, and current booking status

#### Scenario: Enforce access control on booking details
- **WHEN** a client calls `GET /bookings/{id}` for a booking that does not belong to the authenticated user
- **THEN** the system SHALL reject the request with an appropriate authorization error and SHALL not disclose whether the booking id exists for another user

