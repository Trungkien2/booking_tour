# 07. Acceptance Criteria

> Defines completion criteria for feature implementation and test scenarios.
> Essential for AI to understand "how to verify" and write test code.

---

## Document Information

| Item         | Value              |
| ------------ | ------------------ |
| Project Name | `{{PROJECT_NAME}}` |
| Version      | 1.0                |
| Date         | `{{DATE}}`         |

---

## 1. AC Writing Rules

### 1.1 Given-When-Then Format

```gherkin
# ⭐ All ACs are written in Given-When-Then format.

Feature: [Feature ID] [Feature Name]

  Background:
    Given [Common precondition]

  Scenario: [Scenario ID] [Scenario Description]
    Given [Precondition - initial state]
    And [Additional precondition]
    When [User action]
    And [Additional action]
    Then [Expected result]
    And [Additional verification]
```

### 1.2 Scenario ID Scheme

```yaml
scenario_id_format: 'AC-{FeatureID}.{ScenarioNumber}'

# Examples:
# AC-1.1.1: First scenario of feature FR-1.1
# AC-1.1.2: Second scenario of feature FR-1.1
# AC-2.3.1: First scenario of feature FR-2.3
```

### 1.3 Required Scenario Types

```yaml
# ⭐ Define the following scenario types for all features.

required_scenarios:
  - type: 'happy_path'
    description: 'Normal success case'
    priority: 'Must'

  - type: 'validation_error'
    description: 'Input validation failure'
    priority: 'Must'

  - type: 'permission_denied'
    description: 'Unauthorized user access'
    priority: 'Must'

  - type: 'not_found'
    description: 'Accessing non-existent resource'
    priority: 'Should'

  - type: 'edge_case'
    description: 'Boundary values and special situations'
    priority: 'Should'

  - type: 'concurrent'
    description: 'Concurrent access/modification situations'
    priority: 'Could'
```

---

## 2. Feature-Specific AC Templates

### 2.1 Authentication Feature AC

```gherkin
Feature: FR-1.1 Email/Password Login

  Background:
    Given user "user@example.com" is registered with password "Password123!"
    And login page "/login" is accessed

  # === Happy Path ===
  Scenario: AC-1.1.1 Login success with correct credentials
    Given login form is displayed
    When "user@example.com" is entered in email field
    And "Password123!" is entered in password field
    And "Login" button is clicked
    Then navigate to dashboard page "/dashboard"
    And toast message "Welcome, {username}" is displayed
    And user name is displayed in sidebar
    And access token is stored in local storage

  # === Validation Error ===
  Scenario: AC-1.1.2 Login failure with incorrect password
    Given login form is displayed
    When "user@example.com" is entered in email field
    And "WrongPassword" is entered in password field
    And "Login" button is clicked
    Then inline error "Email or password is incorrect" is displayed
    And password field value is cleared
    And password field is focused
    And URL remains "/login"

  Scenario: AC-1.1.3 Login failure with non-existent email
    Given login form is displayed
    When "nonexistent@example.com" is entered in email field
    And "AnyPassword" is entered in password field
    And "Login" button is clicked
    Then inline error "Email or password is incorrect" is displayed
    # Security: Do not reveal email existence

  Scenario: AC-1.1.4 Login attempt with empty fields
    Given login form is displayed
    When "Login" button is clicked without entering anything
    Then error "Please enter email" is displayed on email field
    And error "Please enter password" is displayed on password field
    And "Login" button remains disabled

  # === Edge Case ===
  Scenario: AC-1.1.5 Invalid email format
    Given login form is displayed
    When "invalid-email" is entered in email field
    And "Password123!" is entered in password field
    And "Login" button is clicked
    Then error "Please enter a valid email format" is displayed on email field

  Scenario: AC-1.1.6 Access login page while logged in
    Given user is already logged in
    When "/login" page is directly accessed
    Then redirect to dashboard "/dashboard"

  Scenario: AC-1.1.7 Account lock after 5 consecutive login failures
    Given 4 consecutive login failures
    When 5th login fails
    Then message "Account is locked. Please try again after 10 minutes" is displayed
    And login button is disabled (for 10 minutes)
```

### 2.2 CRUD Feature AC

```gherkin
Feature: FR-2.1 {{Resource}} List View

  Background:
    Given logged in as user with "{{ROLE_2}}" role
    And 10 {{resource}} data items exist

  # === Happy Path ===
  Scenario: AC-2.1.1 {{Resource}} list normal view
    When "{{Resource}} Management" menu is clicked
    Then {{resource}} list page is displayed
    And 10 {{resource}} items are displayed in table
    And each row displays [name, status, assignee, created_at] columns
    And pagination shows "1-10 / 10"

  # === Empty State ===
  Scenario: AC-2.1.2 Empty state when no {{resource}}
    Given no {{resource}} data exists
    When "{{Resource}} Management" menu is clicked
    Then empty state message "No {{resource}} registered" is displayed
    And "Create New {{Resource}}" button is displayed

  # === Loading State ===
  Scenario: AC-2.1.3 Skeleton displayed during data loading
    Given API response is delayed (slow network)
    When "{{Resource}} Management" menu is clicked
    Then skeleton loader with 5 rows is displayed in table area
    And actual data replaces skeleton when loading completes

  # === Error State ===
  Scenario: AC-2.1.4 Error state displayed on API error
    Given API server error (500)
    When "{{Resource}} Management" menu is clicked
    Then error message "Failed to load data" is displayed
    And "Retry" button is displayed
    When "Retry" button is clicked
    Then API is called again

  # === Permission ===
  Scenario: AC-2.1.5 403 displayed for unauthorized user access
    Given logged in as user with "{{ROLE_3}}" role (no view permission)
    When "{{Resource}} Management" page is directly accessed
    Then 403 permission denied page is displayed
    And "Go to Dashboard" button is displayed


Feature: FR-2.2 {{Resource}} Create

  Background:
    Given logged in as user with "{{ROLE_2}}" role
    And {{resource}} list page is accessed

  # === Happy Path ===
  Scenario: AC-2.2.1 {{Resource}} normal creation
    When "New {{Resource}}" button is clicked
    Then {{resource}} creation modal is displayed
    When "Test {{Resource}}" is entered in name field
    And "Test description" is entered in description field
    And "John Doe" is selected from assignee dropdown
    And "Save" button is clicked
    Then modal closes
    And success toast "{{Resource}} created" is displayed
    And newly created {{resource}} is displayed in list (top)

  # === Validation Error ===
  Scenario: AC-2.2.2 Validation error when required field missing
    When "New {{Resource}}" button is clicked
    And name field is left empty
    And "Save" button is clicked
    Then error "Please enter name" is displayed on name field
    And "Save" button is disabled

  Scenario: AC-2.2.3 Server error on duplicate name
    Given "Existing {{Resource}}" name already exists
    When "New {{Resource}}" button is clicked
    And "Existing {{Resource}}" is entered in name field
    And "Save" button is clicked
    Then error "Name already in use" is displayed on name field
    And modal remains open

  # === Cancel ===
  Scenario: AC-2.2.4 Confirmation modal on creation cancel
    When "New {{Resource}}" button is clicked
    And "Test" is entered in name field (changes exist)
    And "Cancel" button or modal outside is clicked
    Then confirmation modal "You have unsaved changes. Close anyway?" is displayed
    When "Close" button is clicked
    Then modal closes
    And input content is deleted


Feature: FR-2.3 {{Resource}} Update

  Background:
    Given logged in as user with "{{ROLE_2}}" role
    And {{resource}} "Test Item" with ID "123" exists
    And {{resource}} detail page is accessed

  # === Happy Path ===
  Scenario: AC-2.3.1 {{Resource}} normal update
    When "Edit" button is clicked
    And name field is changed to "Updated Name"
    And "Save" button is clicked
    Then success toast "{{Resource}} updated" is displayed
    And detail page displays "Updated Name"
    And "Updated At" is updated to current time

  # === Optimistic Update ===
  Scenario: AC-2.3.2 Optimistic update applied
    When "Edit" button is clicked
    And name field is changed to "Updated Name"
    And "Save" button is clicked
    Then "Updated Name" is immediately reflected in UI (without loading)
    And final confirmation after API response
    # Rollback to original value on API failure

  # === Concurrent Edit ===
  Scenario: AC-2.3.3 Handling concurrent edit conflict
    Given another user is editing the same {{resource}}
    When "Save" button is clicked
    Then conflict notification "Another user has modified this" is displayed
    And options "Keep My Changes" / "Load Latest Data" are provided

  # === Locked Resource ===
  Scenario: AC-2.3.4 Attempt to edit locked {{resource}}
    Given {{resource}} status is "locked"
    When "Edit" button is checked
    Then "Edit" button is disabled or hidden
    And tooltip "This item is locked" is displayed


Feature: FR-2.4 {{Resource}} Delete

  Background:
    Given logged in as user with "{{ROLE_1}}" role
    And {{resource}} "Delete Target" with ID "123" exists

  # === Happy Path ===
  Scenario: AC-2.4.1 {{Resource}} normal delete
    When delete button on "Delete Target" row in list is clicked
    Then confirmation modal "Are you sure you want to delete?" is displayed
    And "Delete" and "Cancel" buttons are displayed
    When "Delete" button is clicked
    Then success toast "{{Resource}} deleted" is displayed
    And corresponding {{resource}} is removed from list
    And total count decreases by 1

  # === Cancel Delete ===
  Scenario: AC-2.4.2 Delete cancellation
    When delete button is clicked
    And "Cancel" is clicked in confirmation modal
    Then modal closes
    And {{resource}} remains

  # === Bulk Delete ===
  Scenario: AC-2.4.3 Multi-select delete
    Given 3 {{resource}} checkboxes are selected
    When "Delete Selected" button is clicked
    Then confirmation modal "Delete 3 items?" is displayed
    When "Delete" button is clicked
    Then toast "3 {{resource}} deleted" is displayed
    And 3 {{resource}} items are removed from list
```

### 2.3 Search/Filter Feature AC

```gherkin
Feature: FR-3.1 {{Resource}} Search and Filter

  Background:
    Given logged in as user with "{{ROLE_2}}" role
    And 50 {{resource}} items with various statuses exist
    And {{resource}} list page is accessed

  # === Search ===
  Scenario: AC-3.1.1 Keyword search
    When "test" is entered in search box
    And wait 300ms (debounce)
    Then only {{resource}} containing "test" is displayed
    And search result count is displayed (e.g., "5 results found")
    And matching text is highlighted

  Scenario: AC-3.1.2 No search results
    When "nonexistentkeyword" is entered in search box
    Then empty state "No search results" is displayed
    And guidance message "Try changing search term"

  Scenario: AC-3.1.3 Search term reset
    Given "test" is entered in search box
    When X button in search box is clicked
    Then search box is cleared
    And full {{resource}} list is displayed

  # === Filter ===
  Scenario: AC-3.1.4 Status filter applied
    When "Status" filter dropdown is clicked
    And "In Progress" option is selected
    Then only {{resource}} with "In Progress" status is displayed
    And filter chip "Status: In Progress" is displayed
    And URL reflects ?status=in_progress

  Scenario: AC-3.1.5 Multiple filters applied
    When "In Progress" is selected from "Status" filter
    And "John Doe" is selected from "Assignee" filter
    Then only {{resource}} with status "In Progress" and assignee "John Doe" is displayed
    And 2 filter chips are displayed

  Scenario: AC-3.1.6 Filter reset
    Given 2 filters are applied
    When "Reset Filters" button is clicked
    Then all filters are cleared
    And full {{resource}} list is displayed
    And URL query parameters are removed

  # === Sort ===
  Scenario: AC-3.1.7 Column sort
    When "Created At" column header is clicked
    Then sorted by created_at descending
    And descending icon is displayed on column header
    When "Created At" column header is clicked again
    Then sorted by created_at ascending

  # === Pagination ===
  Scenario: AC-3.1.8 Page navigation
    Given 50 data items, 20 per page
    When "2" is clicked in pagination
    Then {{resource}} items 21-40 are displayed
    And URL reflects ?page=2

  Scenario: AC-3.1.9 Page size change
    When "50" is selected from page size dropdown
    Then 50 items are displayed per page
    And URL reflects ?limit=50
```

---

## 3. Non-Functional Requirements AC

### 3.1 Performance AC

```gherkin
Feature: NFR-P1 Page Loading Performance

  Scenario: AC-P1.1 Initial page load time
    Given Fast 3G network condition
    When dashboard page is accessed
    Then LCP (Largest Contentful Paint) within 3 seconds
    And FID (First Input Delay) within 100ms
    And CLS (Cumulative Layout Shift) 0.1 or less

  Scenario: AC-P1.2 List page data load
    Given 1000 data items exist
    When {{resource}} list page is accessed
    Then first page (20 items) data displayed within 500ms
    And additional data loaded within 200ms on scroll

  Scenario: AC-P1.3 Search response time
    When keyword is entered in search box
    Then search results displayed within 1 second
    And no UI freezing during input
```

### 3.2 Accessibility AC

```gherkin
Feature: NFR-A1 Keyboard Accessibility

  Scenario: AC-A1.1 Complete login with keyboard only
    Given login page is accessed
    When Tab key moves to email field
    And email is entered
    And Tab key moves to password field
    And password is entered
    And Tab key moves to login button
    And Enter key is pressed
    Then login succeeds

  Scenario: AC-A1.2 Modal focus trap
    When modal opens
    Then focus moves to modal interior
    And Tab key cannot access elements outside modal
    And modal can be closed with Escape key

  Scenario: AC-A1.3 Screen reader support
    When screen reader is activated
    Then all buttons have appropriate labels read
    And form error messages are automatically read
    And table header and cell relationships are recognized
```

### 3.3 Security AC

```gherkin
Feature: NFR-S1 Authentication Security

  Scenario: AC-S1.1 Token expiration handling
    Given access token is expired
    When API request is attempted
    Then automatically attempt refresh with refresh token
    And redirect to login page on refresh failure

  Scenario: AC-S1.2 XSS prevention
    When "<script>alert('xss')</script>" is entered in input field
    And displayed on screen after save
    Then script does not execute
    And displayed as escaped text

  Scenario: AC-S1.3 CSRF prevention
    When API request is made
    Then CSRF token header is included
    And requests without token are rejected (403)
```

---

## 4. Test Code Integration

### 4.1 AC → Test Mapping

```typescript
// ⭐ Map AC ID to test describe/it

// __tests__/login.test.tsx
describe('FR-1.1 Email/Password Login', () => {
  // AC-1.1.1
  it('Login success with correct credentials', async () => {
    render(<LoginPage />);

    // Given: Login form is displayed
    expect(screen.getByRole('form')).toBeInTheDocument();

    // When: Email and password entered
    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Then: Navigate to dashboard
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  // AC-1.1.2
  it('Login failure with incorrect password', async () => {
    // ... test code
  });
});
```

### 4.2 E2E Test Example

```typescript
// e2e/login.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('FR-1.1 Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // AC-1.1.1
  test('Login success with correct credentials', async ({ page }) => {
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  // AC-1.1.2
  test('Login failure with incorrect password', async ({ page }) => {
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'WrongPassword');
    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=Email or password is incorrect')
    ).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

---

## 5. AC Verification Checklist

```yaml
# ⭐ Checklist for verifying each AC during QA

verification_checklist:
  FR-1.1:
    - id: 'AC-1.1.1'
      description: 'Login success with correct credentials'
      status: '[ ]' # [ ] Not verified, [P] Pass, [F] Fail
      tester: ''
      date: ''
      notes: ''

    - id: 'AC-1.1.2'
      description: 'Login failure with incorrect password'
      status: '[ ]'
      tester: ''
      date: ''
      notes: ''

    # ... remaining ACs
```

---

## Checklist

Check when Acceptance Criteria is complete:

- [ ] AC written for all Must features
- [ ] Given/When/Then format applied to all ACs
- [ ] Happy Path scenario included
- [ ] Validation Error scenario included
- [ ] Permission Denied scenario included
- [ ] Empty/Loading/Error state scenarios included
- [ ] Edge Case scenario included
- [ ] AC ID mapped to test code
- [ ] Non-functional requirements AC included
