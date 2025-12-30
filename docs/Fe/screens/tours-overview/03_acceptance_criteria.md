# Tours Overview - Acceptance Criteria

## Feature: Browse Tours

### Scenario 1: View tours list on home page
```gherkin
Given I am on the home page
Then I should see the hero section with search bar
And I should see the "Popular Tours This Season" section
And I should see a grid of tour cards
And each tour card should display:
  | Element | Content |
  | Image | Tour cover image |
  | Title | Tour name |
  | Rating | Star rating and review count |
  | Location | Tour location |
  | Duration | Number of days |
  | Price | Starting price |
  | Book Now | CTA button |
```

### Scenario 2: Search for tours
```gherkin
Given I am on the home page
When I type "Bali" in the search box
And I press Enter
Then I should see tours filtered by "Bali"
And the URL should update to "/?search=Bali"
And I should see a message showing result count
```

### Scenario 3: Search with no results
```gherkin
Given I am on the home page
When I search for "XYZ123NonExistent"
Then I should see "No tours found" message
And I should see search suggestions
And I should see a "Clear filters" button
```

### Scenario 4: Filter by price range
```gherkin
Given I am on the tours page
When I click the "Price" dropdown
And I select "Under $500"
Then I should see only tours with price less than $500
And the URL should update to include "priceMax=500"
And I should be on page 1
```

### Scenario 5: Filter by difficulty
```gherkin
Given I am on the tours page
When I click the "Difficulty" dropdown
And I select "Moderate"
Then I should see only tours with moderate difficulty
And the URL should update to include "difficulty=moderate"
```

### Scenario 6: Sort tours by price
```gherkin
Given I am on the tours page
When I click on "Price" sort option
Then I should see tours sorted by price ascending
When I click on "Price" again
Then I should see tours sorted by price descending
```

### Scenario 7: Pagination - Navigate pages
```gherkin
Given I am on the tours page
And there are 42 tours total
And 8 tours are displayed per page
Then I should see pagination showing "Page 1 of 6"
When I click page "2"
Then I should see the next 8 tours
And the URL should update to "?page=2"
And I should be scrolled to the top of the tour list
```

### Scenario 8: Pagination - Previous/Next
```gherkin
Given I am on page 3 of tours
When I click "Previous"
Then I should be on page 2
When I click "Next"
Then I should be on page 3
```

### Scenario 9: Load more tours (mobile)
```gherkin
Given I am viewing tours on mobile
And I have scrolled through the first 8 tours
When I click "Show More Tours"
Then 8 more tours should be appended to the list
And the "Show More Tours" button should remain visible if more tours exist
```

### Scenario 10: Tour card click - Navigate to detail
```gherkin
Given I am on the tours page
When I click on a tour card
Then I should be navigated to "/tours/{slug}"
```

### Scenario 11: Book Now button
```gherkin
Given I am on the tours page
When I click "Book Now" on a tour card
Then I should be navigated to "/tours/{slug}"
```

### Scenario 12: Loading state
```gherkin
Given I am on the home page
When the page is loading
Then I should see skeleton cards (8 items)
And the search bar should be visible
And the filter dropdowns should be disabled
When the data is loaded
Then the skeletons should be replaced with actual tour cards
```

### Scenario 13: Error state
```gherkin
Given I am on the tours page
And the API returns an error
Then I should see an error message
And I should see a "Retry" button
When I click "Retry"
Then the tours should be fetched again
```

### Scenario 14: URL state persistence
```gherkin
Given I have searched for "Paris" and filtered by "moderate" difficulty
When I refresh the page
Then the search input should show "Paris"
And the difficulty filter should show "Moderate"
And I should see the filtered results
```

### Scenario 15: Responsive - Tablet view
```gherkin
Given I am viewing the tours page on a tablet (768px - 1024px)
Then the tour cards should be in 2 columns
And the filters should be horizontally scrollable
```

### Scenario 16: Responsive - Mobile view
```gherkin
Given I am viewing the tours page on mobile (< 768px)
Then the tour cards should be in 1 column
And the filters should be accessible via a filter button
When I click the filter button
Then a filter drawer/modal should open
```

### Scenario 17: Featured tours badge
```gherkin
Given I am on the tours page
And a tour is marked as featured
Then I should see a "Featured" badge on that tour card
```

### Scenario 18: Search suggestions
```gherkin
Given I am on the home page
When I type "Ba" in the search box
Then I should see search suggestions dropdown
And suggestions should include matching tours and destinations
When I click on a suggestion
Then I should be navigated to the relevant page
```
