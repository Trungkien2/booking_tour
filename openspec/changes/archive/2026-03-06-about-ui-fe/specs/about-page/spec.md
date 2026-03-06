## ADDED Requirements

### Requirement: About page is reachable and uses site layout

The system SHALL provide a public About page at the route `/about`. The page MUST be rendered within the existing site layout (site header and footer) so navigation and branding are consistent with the rest of the public site.

#### Scenario: User opens About from header

- **WHEN** a user visits `/about` or clicks the "About" link in the site header or footer
- **THEN** the About page is displayed with the same site header and footer as other public pages (e.g. home, tours)

#### Scenario: About route resolves successfully

- **WHEN** a client requests GET `/about`
- **THEN** the server responds with a successful page (e.g. 200) and the About content is visible; the user MUST NOT see a 404 for `/about`

### Requirement: About page presents company and mission content

The About page SHALL display company and mission narrative content so users can understand who operates the platform and what it stands for. The content MUST be readable and clearly structured (e.g. headings and paragraphs).

#### Scenario: User sees company and mission on About

- **WHEN** a user views the About page
- **THEN** at least one section with company/mission narrative is visible (e.g. "About us" or "Our mission") with readable text

### Requirement: About page may include optional sections

The About page MAY include optional sections such as values, team, or a contact/CTA. The system SHALL NOT require these sections; the page is valid with only the required company/mission content. If present, such sections MUST be clearly separated (e.g. by heading or layout) from the main narrative.

#### Scenario: About page with only required content

- **WHEN** the About page is implemented with only company/mission content
- **THEN** the page is valid and meets the About page requirements

#### Scenario: About page with optional sections

- **WHEN** the About page includes optional sections (e.g. values, team, contact CTA)
- **THEN** each section is visually distinct and does not replace the required company/mission content
