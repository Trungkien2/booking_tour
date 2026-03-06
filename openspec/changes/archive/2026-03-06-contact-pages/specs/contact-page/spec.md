## ADDED Requirements

### Requirement: Contact page is reachable and uses site layout

The system SHALL provide a public Contact page at the route `/contact`. The page MUST be rendered within the existing site layout (site header and footer) so navigation and branding are consistent with the rest of the public site.

#### Scenario: User opens Contact from navigation

- **WHEN** a user visits `/contact` or clicks the "Contact" link in the site header or footer
- **THEN** the Contact page is displayed with the same site header and footer as other public pages (e.g. home, tours, about)

#### Scenario: Contact route resolves successfully

- **WHEN** a client requests GET `/contact`
- **THEN** the server responds with a successful page (200) and the Contact content is visible; the user MUST NOT see a 404 for `/contact`

### Requirement: Contact page displays a contact form

The Contact page SHALL display a "Send us a message" form with the following fields: full name (text), email address (email), subject (select dropdown with options: General Inquiry, Booking Support, Refund Request, Partnership), and message (textarea). A "Send Message" submit button SHALL be present.

#### Scenario: User sees all form fields

- **WHEN** a user views the Contact page
- **THEN** the form displays fields for full name, email address, subject dropdown, and message textarea, along with a "Send Message" button

#### Scenario: Subject dropdown contains expected options

- **WHEN** a user opens the subject dropdown
- **THEN** the options include: General Inquiry, Booking Support, Refund Request, Partnership

### Requirement: Contact page displays contact information cards

The Contact page SHALL display contact method cards for phone, email, and office address. Each card MUST show an icon, a title, and the relevant contact detail.

#### Scenario: User sees contact info cards

- **WHEN** a user views the Contact page
- **THEN** three contact cards are visible: "Call Us" with phone number, "Email Us" with email address, and "Visit Office" with physical address

### Requirement: Contact page displays social media links

The Contact page SHALL display a "Follow Us" section with social media icon links.

#### Scenario: User sees social links

- **WHEN** a user views the Contact page
- **THEN** a "Follow Us" section is visible with at least 4 social media icon links

### Requirement: Contact page displays a map section

The Contact page SHALL display a map section showing the office location with an overlay card displaying the headquarters address.

#### Scenario: User sees map and address overlay

- **WHEN** a user views the Contact page
- **THEN** a map image is visible with an overlay card showing "Our Headquarters" and the office address

### Requirement: Contact page displays FAQ teaser

The Contact page SHALL display a "Frequently Asked Questions" teaser section with a link to a help center.

#### Scenario: User sees FAQ teaser

- **WHEN** a user views the Contact page
- **THEN** a section titled "Frequently Asked Questions" is visible with descriptive text and a "Visit Help Center" link

### Requirement: Contact page is responsive

The Contact page SHALL render correctly on mobile, tablet, and desktop viewports. On smaller screens, the layout MUST stack vertically (contact info above the form). On larger screens, the layout MUST use a side-by-side grid (contact info on the left, form and map on the right).

#### Scenario: Desktop layout

- **WHEN** a user views the Contact page on a screen wider than 1024px
- **THEN** contact info cards are in a left column and the form/map are in a wider right column (3-column grid with 1:2 ratio)

#### Scenario: Mobile layout

- **WHEN** a user views the Contact page on a screen narrower than 1024px
- **THEN** all sections stack vertically in a single column
