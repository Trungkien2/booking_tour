# Admin Dashboard - Acceptance Criteria

## Feature: Admin Dashboard Overview

### Scenario 1: View dashboard as admin
```gherkin
Given I am logged in as an admin
When I navigate to "/admin/dashboard"
Then I should see the admin sidebar
And I should see the page title "Dashboard Overview"
And I should see 4 statistics cards
And I should see the revenue trend chart
And I should see quick action buttons
And I should see recent bookings table
And I should see top performing tours list
```

### Scenario 2: Statistics cards display correctly
```gherkin
Given I am on the admin dashboard
Then I should see the "Total Revenue" card with a dollar value
And I should see the "Total Bookings" card with a number
And I should see the "Active Tours" card with a number
And I should see the "New Users" card with a number
And each card should show a trend indicator (up/down arrow)
And each card should show the comparison text "vs last month"
```

### Scenario 3: Revenue trend chart interaction
```gherkin
Given I am on the admin dashboard
When I hover over a point on the revenue chart
Then I should see a tooltip with the exact value
And I should see the week/date label
When I click "View Report"
Then I should be navigated to "/admin/reports"
```

### Scenario 4: Quick action - Add New Tour
```gherkin
Given I am on the admin dashboard
When I click the "Add New Tour" button
Then I should be navigated to "/admin/tours/new"
```

### Scenario 5: Quick action - Create Booking
```gherkin
Given I am on the admin dashboard
When I click the "Create Booking" button
Then I should be navigated to "/admin/bookings/new"
```

### Scenario 6: Quick action - Invite User
```gherkin
Given I am on the admin dashboard
When I click the "Invite User" button
Then a modal should open with the invite user form
```

### Scenario 7: Recent bookings table
```gherkin
Given I am on the admin dashboard
Then I should see the recent bookings table with columns:
  | Column | Content |
  | Customer | Name and email |
  | Tour | Tour name |
  | Date | Booking date |
  | Amount | Price with currency |
  | Status | Status badge (PAID, PENDING, etc.) |
And I should see at most 5 bookings
When I click "View All"
Then I should be navigated to "/admin/bookings"
```

### Scenario 8: Top performing tours list
```gherkin
Given I am on the admin dashboard
Then I should see the top performing tours list
And each tour should show:
  | Field | Content |
  | Rank | Position number |
  | Name | Tour name |
  | Revenue | Revenue amount |
And tours should be sorted by revenue descending
```

### Scenario 9: Dashboard auto-refresh
```gherkin
Given I am on the admin dashboard
And the data was loaded at "10:30:00"
When 60 seconds have passed
Then the dashboard data should refresh automatically
And the "Last updated" text should show "Just now"
And there should be no loading indicator during auto-refresh
```

### Scenario 10: Loading state
```gherkin
Given I am logged in as admin
When I navigate to "/admin/dashboard"
Then I should see skeleton loaders for:
  | Component |
  | Statistics cards |
  | Revenue chart |
  | Recent bookings table |
  | Top tours list |
And the skeletons should be replaced with data when loaded
```

### Scenario 11: Error state
```gherkin
Given I am on the admin dashboard
And the API returns an error
Then I should see an error message
And I should see a "Retry" button
When I click "Retry"
Then the data should be fetched again
```

### Scenario 12: Access denied - Non-admin user
```gherkin
Given I am logged in as a regular USER
When I navigate to "/admin/dashboard"
Then I should be redirected to the home page
And I should see a toast message "Access denied"
```

### Scenario 13: Access denied - Not logged in
```gherkin
Given I am not logged in
When I navigate to "/admin/dashboard"
Then I should be redirected to "/login"
And the return URL should be saved
```

### Scenario 14: Sidebar navigation
```gherkin
Given I am on the admin dashboard
Then the "Dashboard" menu item should be highlighted
When I click on "Tours" in the sidebar
Then I should be navigated to "/admin/tours"
When I click on "Logout" in the sidebar
Then I should be logged out
And I should be redirected to "/login"
```

### Scenario 15: Responsive - Tablet view
```gherkin
Given I am viewing the admin dashboard on a tablet (768px - 1280px)
Then the sidebar should be collapsed (icons only)
And the statistics cards should be in 2 columns
And the chart and quick actions should be stacked
```

### Scenario 16: Responsive - Mobile view
```gherkin
Given I am viewing the admin dashboard on mobile (< 768px)
Then the sidebar should be hidden
And I should see a hamburger menu button
When I click the hamburger menu
Then the sidebar should slide in from the left
And the statistics cards should be in 1 column
```

### Scenario 17: Empty state - No bookings
```gherkin
Given I am on the admin dashboard
And there are no bookings yet
Then the recent bookings section should show "No recent bookings"
And the statistics cards should show 0 values
```
