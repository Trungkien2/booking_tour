## ADDED Requirements

### Requirement: Profile favorites tab
The profile page SHALL include a "Favorites" tab displaying the user's saved/wishlisted tours. The tab SHALL be accessible from the profile sidebar/tab navigation.

#### Scenario: View favorites tab
- **WHEN** user navigates to profile and clicks "Favorites" tab
- **THEN** system SHALL display a grid of saved tour cards using the existing favorites API

#### Scenario: Favorite tour card display
- **WHEN** favorites are loaded
- **THEN** each tour card SHALL display: tour cover image, tour name, price (adult), duration, rating, and location/country

#### Scenario: Empty favorites
- **WHEN** user has no saved tours
- **THEN** system SHALL display an empty state with message "No saved tours yet" and a CTA button linking to the tours browse page

### Requirement: Favorites quick actions
Each favorite tour card SHALL provide quick actions for managing favorites.

#### Scenario: Remove from favorites
- **WHEN** user clicks the "Remove" / heart icon on a favorite tour card
- **THEN** system SHALL remove the tour from favorites via the existing API and update the UI immediately (optimistic update)

#### Scenario: View tour detail
- **WHEN** user clicks on a favorite tour card
- **THEN** system SHALL navigate to the tour detail page (`/tours/{slug}`)

#### Scenario: Book tour from favorites
- **WHEN** user clicks "Book Now" on a favorite tour card
- **THEN** system SHALL navigate to the tour detail page where the user can proceed with booking
