# Tour Detail - Acceptance Criteria

## Feature: View Tour Details

### Scenario 1: View tour detail page
```gherkin
Given I navigate to "/tours/3-day-kayaking-adventure-norway"
Then I should see the tour title "3-Day Kayaking Adventure in Norway"
And I should see the tour location "Bergen, Norway"
And I should see the tour rating and review count
And I should see the image gallery
And I should see the price starting from "$1,200"
```

### Scenario 2: Image gallery interaction
```gherkin
Given I am on a tour detail page
When I click on a thumbnail image
Then the hero image should update to show the clicked image
When I click on the hero image
Then a lightbox should open with all images
And I should be able to navigate between images
```

### Scenario 3: Read tour description
```gherkin
Given I am on a tour detail page
And the description is longer than 6 lines
Then I should see a truncated description
And I should see a "Read more" button
When I click "Read more"
Then I should see the full description
And the button should change to "Show less"
```

### Scenario 4: View itinerary
```gherkin
Given I am on a tour detail page
Then I should see the itinerary section
And Day 1 should be expanded by default
When I click on Day 2
Then Day 2 should expand
And Day 1 should collapse
```

### Scenario 5: Select schedule date
```gherkin
Given I am on a tour detail page
When I click on the date picker
Then I should see a calendar with available dates
And available dates should be highlighted in green
And sold out dates should be highlighted in red
When I select an available date
Then the date should be displayed in the booking card
And the "Book Now" button should be enabled
```

### Scenario 6: Schedule sold out
```gherkin
Given I am on a tour detail page
And I click on a date that is sold out
Then I should see "Sold Out" label
And I should not be able to select that date
```

### Scenario 7: Update traveler count
```gherkin
Given I am on a tour detail page
And I have selected a schedule
When I click the "+" button for Adults
Then the adult count should increase by 1
And the total price should update
When I click the "-" button for Adults
Then the adult count should decrease by 1
And the total price should update
```

### Scenario 8: Minimum traveler validation
```gherkin
Given I am on a tour detail page
And I have 1 adult selected
When I try to decrease adults to 0
Then the count should remain at 1
And I should see a message "Minimum 1 adult required"
```

### Scenario 9: Maximum capacity validation
```gherkin
Given I am on a tour detail page
And I have selected a schedule with 4 available spots
When I try to add 5 total travelers
Then I should see an error "Only 4 spots available"
And the traveler count should not exceed available spots
```

### Scenario 10: Price breakdown
```gherkin
Given I am on a tour detail page
And I have selected 2 adults and 1 child
Then I should see the price breakdown:
  | Item | Amount |
  | Adults x 2 | $2,400 |
  | Children x 1 | $800 |
  | Taxes & Fees | $320 |
  | Total | $3,520 |
```

### Scenario 11: Book Now - Authenticated user
```gherkin
Given I am logged in
And I am on a tour detail page
And I have selected a valid schedule
And I have selected travelers
When I click "Book Now"
Then I should be navigated to the booking confirmation page
And my booking details should be preserved
```

### Scenario 12: Book Now - Anonymous user
```gherkin
Given I am not logged in
And I am on a tour detail page
And I have selected a valid schedule
When I click "Book Now"
Then I should be redirected to the login page
And after logging in, I should return to the booking flow
And my selections should be preserved
```

### Scenario 13: View reviews
```gherkin
Given I am on a tour detail page with reviews
Then I should see the review summary
And I should see the average rating
And I should see the rating distribution
And I should see a list of reviews
```

### Scenario 14: Load more reviews
```gherkin
Given I am on a tour detail page
And there are more than 5 reviews
Then I should see 5 reviews initially
And I should see a "Load More" button
When I click "Load More"
Then 5 more reviews should be loaded
And appended to the list
```

### Scenario 15: Sort reviews
```gherkin
Given I am on a tour detail page
When I select "Highest Rated" from the sort dropdown
Then reviews should be sorted by rating descending
```

### Scenario 16: View meeting point on map
```gherkin
Given I am on a tour detail page
Then I should see the meeting point section
And I should see an interactive map
And I should see a marker at the meeting point
And I should see the address and instructions
```

### Scenario 17: Share tour
```gherkin
Given I am on a tour detail page
When I click the "Share" button
Then a share modal should open
And I should see options to share via:
  | Platform |
  | Copy Link |
  | Facebook |
  | Twitter |
  | WhatsApp |
```

### Scenario 18: Save to favorites
```gherkin
Given I am logged in
And I am on a tour detail page
When I click the "Save" button
Then the tour should be added to my favorites
And the button should show "Saved"
When I click again
Then the tour should be removed from favorites
```

### Scenario 19: Tour not found
```gherkin
Given I navigate to "/tours/non-existent-tour"
Then I should see a 404 error page
And I should see "Tour not found" message
And I should see a link to browse all tours
```

### Scenario 20: Responsive - Mobile booking
```gherkin
Given I am viewing a tour on mobile
Then the booking card should be a fixed bar at the bottom
And it should show the price and "Book Now" button
When I tap the booking bar
Then it should expand to show full booking options
```
