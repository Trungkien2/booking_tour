## ADDED Requirements

### Requirement: Profile booking history tab
The profile page SHALL include a "My Bookings" tab that displays the authenticated user's booking history. The tab SHALL be accessible from the profile sidebar/tab navigation.

#### Scenario: View booking history tab
- **WHEN** user navigates to profile and clicks "My Bookings" tab
- **THEN** system SHALL display a list of all user's bookings ordered by creation date (newest first)

#### Scenario: Booking list item display
- **WHEN** booking history is loaded
- **THEN** each booking item SHALL display: tour name, tour cover image, booking date, travel date, number of travelers, total price, and booking status badge (PENDING/PAID/CANCELLED/REFUNDED)

#### Scenario: Empty booking history
- **WHEN** user has no bookings
- **THEN** system SHALL display an empty state with message "No bookings yet" and a CTA button linking to the tours browse page

### Requirement: Booking history filtering
The booking history tab SHALL allow users to filter bookings by status.

#### Scenario: Filter by status
- **WHEN** user selects a status filter (All, Upcoming, Completed, Cancelled)
- **THEN** system SHALL display only bookings matching the selected status

#### Scenario: Default filter
- **WHEN** booking history tab is first opened
- **THEN** the "All" filter SHALL be selected by default

### Requirement: Booking quick actions
Each booking item SHALL provide contextual actions based on booking status.

#### Scenario: View booking detail
- **WHEN** user clicks on a booking item or "View Details" action
- **THEN** system SHALL navigate to `/bookings/{id}` detail page

#### Scenario: Cancel pending booking
- **WHEN** user clicks "Cancel" on a PENDING booking
- **THEN** system SHALL show a confirmation dialog before proceeding with cancellation via the existing cancellation API
