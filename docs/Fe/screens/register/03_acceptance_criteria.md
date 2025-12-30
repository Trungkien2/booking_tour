# Registration Screen - Acceptance Criteria

## Feature: User Registration

### Scenario 1: Successful registration
```gherkin
Given I am on the registration page
When I enter "Jane Doe" in the full name field
And I enter "jane@example.com" in the email field
And I enter "+1234567890" in the phone field
And I select "United States" as the country
And I enter "Password123!" in the password field
And I enter "Password123!" in the confirm password field
And I check the terms agreement checkbox
And I click the "Register Account" button
Then I should see a loading spinner
And I should see a success message
And I should be redirected to the login page
```

### Scenario 2: Registration fails - email already exists
```gherkin
Given I am on the registration page
And an account with "existing@example.com" already exists
When I fill in the registration form with "existing@example.com"
And I click the "Register Account" button
Then I should see an error message "An account with this email already exists"
And I should see a link to "Log in instead"
```

### Scenario 3: Registration fails - validation errors
```gherkin
Given I am on the registration page
When I click the "Register Account" button without filling any fields
Then I should see error messages for all required fields:
  | Field | Error Message |
  | Full Name | Full name is required |
  | Email | Email is required |
  | Password | Password is required |
  | Confirm Password | Please confirm your password |
  | Terms | You must agree to the terms |
```

### Scenario 4: Password strength indicator - Weak
```gherkin
Given I am on the registration page
When I enter "pass" in the password field
Then I should see the password strength indicator
And it should show "Weak" in red color
```

### Scenario 5: Password strength indicator - Medium
```gherkin
Given I am on the registration page
When I enter "Password1" in the password field
Then I should see the password strength indicator
And it should show "Medium Strength" in yellow color
```

### Scenario 6: Password strength indicator - Strong
```gherkin
Given I am on the registration page
When I enter "Password123!" in the password field
Then I should see the password strength indicator
And it should show "Strong" in green color
```

### Scenario 7: Passwords do not match
```gherkin
Given I am on the registration page
When I enter "Password123!" in the password field
And I enter "DifferentPassword" in the confirm password field
And I click outside the confirm password field
Then I should see an error message "Passwords do not match"
```

### Scenario 8: Invalid email format
```gherkin
Given I am on the registration page
When I enter "invalid-email" in the email field
And I click outside the email field
Then I should see an error message "Please enter a valid email"
```

### Scenario 9: Terms not agreed
```gherkin
Given I am on the registration page
And I have filled all other fields correctly
But I have not checked the terms agreement checkbox
When I click the "Register Account" button
Then I should see an error message "You must agree to the terms"
And the form should not be submitted
```

### Scenario 10: Social registration with Google
```gherkin
Given I am on the registration page
When I click the "Google" button
Then I should be redirected to Google OAuth
When I complete Google authentication
Then I should be redirected back to the app
And I should be logged in automatically
And I should be redirected to the home page
```

### Scenario 11: Navigate to login
```gherkin
Given I am on the registration page
When I click the "Log in" link
Then I should be navigated to "/login"
```

### Scenario 12: Terms and Privacy links
```gherkin
Given I am on the registration page
When I click the "Terms of Use" link
Then a new tab should open with the terms page
When I click the "Privacy Policy" link
Then a new tab should open with the privacy policy page
```

### Scenario 13: Phone number with country code
```gherkin
Given I am on the registration page
When I select "Vietnam" as the country
Then the phone field prefix should update to "+84"
When I enter "912345678" in the phone field
Then the full phone number should be "+84912345678"
```

### Scenario 14: Real-time email availability check
```gherkin
Given I am on the registration page
When I enter "existing@example.com" in the email field
And I click outside the email field
Then the system should check email availability
And I should see a message "This email is already registered"
```

### Scenario 15: Already authenticated user
```gherkin
Given I am already logged in
When I navigate to the registration page
Then I should be redirected to the home page
```
