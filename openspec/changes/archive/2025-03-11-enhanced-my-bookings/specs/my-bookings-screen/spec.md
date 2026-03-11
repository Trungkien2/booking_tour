## ADDED Requirements

### Requirement: My bookings list by status
The system SHALL provide an authenticated `/bookings` screen that lists the current user's bookings segmented into Upcoming, Completed, and Cancelled tabs, with each tab showing only bookings that match its status.

#### Scenario: View upcoming bookings
- **WHEN** an authenticated user opens `/bookings` with status filter set to `upcoming`
- **THEN** the system SHALL display only bookings that are in a cancellable or pending state and whose schedule start date is today or in the future

#### Scenario: View completed bookings
- **WHEN** an authenticated user opens `/bookings` with status filter set to `completed`
- **THEN** the system SHALL display only bookings that have a completed status and whose schedule start date is in the past

#### Scenario: View cancelled bookings
- **WHEN** an authenticated user opens `/bookings` with status filter set to `cancelled`
- **THEN** the system SHALL display only bookings that have a cancelled status

### Requirement: Search and filter bookings
The system SHALL allow users to search and filter their bookings on the `/bookings` screen using tour name, location, sort order, and pagination controls.

#### Scenario: Search by tour name or location
- **WHEN** the user enters a search term matching a tour name or location and submits the search on `/bookings`
- **THEN** the system SHALL restrict the visible bookings to those whose tour name or primary location textually matches the search term

#### Scenario: Sort by date
- **WHEN** the user selects a sort option of `Newest First` or `Oldest First` on `/bookings`
- **THEN** the system SHALL order the visible bookings by schedule start date in descending or ascending order respectively

#### Scenario: Paginate results
- **WHEN** there are more bookings matching the current filters than fit on a single page
- **THEN** the system SHALL provide pagination or \"Load more\" controls and SHALL load the next page of bookings when the user requests more results

### Requirement: Booking card content and actions
The system SHALL render each booking as a booking card showing status, tour information, traveler count, total price, and context-appropriate actions.

#### Scenario: Display booking card information
- **WHEN** bookings are displayed on the `/bookings` screen
- **THEN** each booking card SHALL show status badge, tour name, booking identifier, schedule date range, location, traveler count, and total price as defined in the My Bookings screen specification

#### Scenario: Contextual actions by status
- **WHEN** a booking card is rendered for a booking
- **THEN** the system SHALL enable or disable actions (Cancel Booking, View Details, Complete Payment, Modify) according to the booking status and SHALL hide or disable actions that are not allowed for that status

### Requirement: Empty states by tab
The system SHALL display a contextual empty state when there are no bookings for the selected tab on `/bookings`.

#### Scenario: Upcoming tab empty state
- **WHEN** the user views the Upcoming tab and has no upcoming bookings
- **THEN** the system SHALL show an empty state with messaging encouraging the user to browse tours and a call-to-action that navigates to the tours listing

#### Scenario: Completed and Cancelled empty states
- **WHEN** the user views the Completed or Cancelled tab and has no bookings in that state
- **THEN** the system SHALL show an empty state message indicating that there are no completed or cancelled bookings respectively, without a primary call-to-action

