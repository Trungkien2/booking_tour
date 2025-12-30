# Login Screen - Acceptance Criteria

## Feature: User Login

### Scenario 1: Successful login with valid credentials
```gherkin
Given I am on the login page
And I am not authenticated
When I enter "user@example.com" in the email field
And I enter "password123" in the password field
And I click the "Sign In" button
Then I should see a loading spinner on the button
And I should be redirected to the home page
And I should see my name in the header
And my session should be stored
```

### Scenario 2: Login fails with invalid email format
```gherkin
Given I am on the login page
When I enter "invalid-email" in the email field
And I click outside the email field
Then I should see an error message "Please enter a valid email"
And the email field should have a red border
And the "Sign In" button should be disabled
```

### Scenario 3: Login fails with wrong password
```gherkin
Given I am on the login page
When I enter "user@example.com" in the email field
And I enter "wrongpassword" in the password field
And I click the "Sign In" button
Then I should see an error message "Email or password is incorrect"
And the password field should be cleared
And the email field should retain its value
```

### Scenario 4: Login fails with empty fields
```gherkin
Given I am on the login page
When I click the "Sign In" button without entering any data
Then I should see an error message "Email is required" for the email field
And I should see an error message "Password is required" for the password field
```

### Scenario 5: Login with Google
```gherkin
Given I am on the login page
When I click the "Continue with Google" button
Then I should be redirected to Google OAuth page
When I complete Google authentication
Then I should be redirected back to the app
And I should be logged in
And I should be redirected to the home page
```

### Scenario 6: Login with Apple
```gherkin
Given I am on the login page
When I click the "Continue with Apple" button
Then I should be redirected to Apple Sign In
When I complete Apple authentication
Then I should be redirected back to the app
And I should be logged in
```

### Scenario 7: Navigate to forgot password
```gherkin
Given I am on the login page
When I click the "Forgot Password?" link
Then I should be navigated to "/forgot-password"
```

### Scenario 8: Navigate to registration
```gherkin
Given I am on the login page
When I click the "Sign Up" link
Then I should be navigated to "/register"
```

### Scenario 9: Already authenticated user visits login
```gherkin
Given I am already logged in
When I navigate to the login page
Then I should be redirected to the home page
```

### Scenario 10: Account is disabled
```gherkin
Given I am on the login page
And my account has been disabled
When I enter valid credentials
And I click the "Sign In" button
Then I should see an error message "Your account has been disabled"
And I should remain on the login page
```

### Scenario 11: Rate limiting
```gherkin
Given I am on the login page
When I attempt to login 5 times with wrong credentials
Then I should see an error message "Too many attempts. Please try again later."
And the "Sign In" button should be disabled for 60 seconds
```

### Scenario 12: Responsive - Mobile view
```gherkin
Given I am viewing the login page on a mobile device (width < 768px)
Then I should only see the login form
And the hero image section should be hidden
And the form should be full width
```

### Scenario 13: Form validation on blur
```gherkin
Given I am on the login page
When I enter "test" in the email field
And I move focus to the password field
Then I should see an error message "Please enter a valid email"
```

### Scenario 14: Password visibility toggle
```gherkin
Given I am on the login page
When I enter "password123" in the password field
Then the password should be masked (shown as dots)
When I click the "show password" icon
Then the password should be visible as plain text
```
