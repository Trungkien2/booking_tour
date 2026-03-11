## MODIFIED Requirements

### Requirement: User can cancel eligible bookings
The system SHALL allow a user to cancel their own eligible bookings from the `/bookings` screen using a clear confirmation flow and SHALL update booking status and refund information consistently across the system.

#### Scenario: Cancel upcoming confirmed booking
- **WHEN** a user views an upcoming booking on `/bookings` with a status that is cancellable and chooses \"Cancel Booking\" and confirms the cancellation
- **THEN** the system SHALL change the booking status to CANCELLED, trigger the appropriate refund or credit logic according to existing business rules, and update the booking card to reflect the cancelled state

#### Scenario: Prevent cancellation of ineligible bookings
- **WHEN** a user attempts to cancel a booking on `/bookings` that is not in a cancellable state (including completed bookings or bookings past the allowed cancellation window)
- **THEN** the system SHALL prevent the cancellation, SHALL not change the booking status, and SHALL present a message explaining why the booking cannot be cancelled

#### Scenario: Consistent cancellation via API
- **WHEN** the frontend issues a `PATCH /bookings/{id}/cancel` request for a booking owned by the current user
- **THEN** the backend SHALL validate ownership and eligibility, perform the cancellation transaction atomically, and return an updated booking summary suitable for refreshing the `/bookings` screen

