# Registration Screen Specification

## 1. Screen Overview

| Item | Value |
|------|-------|
| Screen ID | `SCR-002` |
| Screen Name | Registration |
| Route | `/register` |
| Layout | Auth Layout |
| Access Level | Anonymous only |

## 2. Screen States

### 2.1 Default State
- Display registration form with empty fields
- Register button disabled until form is valid
- Password strength indicator hidden

### 2.2 Loading State
- Show spinner on Register button
- Disable all form inputs
- Disable social buttons

### 2.3 Success State
- Show success message
- Redirect to login page OR auto-login

### 2.4 Error State
- Display error message
- Highlight invalid fields
- Keep form values

### 2.5 403 State
- N/A (public page)

## 3. UI Components

### 3.1 Header
```yaml
logo:
  text: "TourBooker"
  link: "/"
navigation:
  - label: "Home"
    link: "/"
  - label: "Tours"
    link: "/tours"
  - label: "About Us"
    link: "/about"
  - label: "Contact"
    link: "/contact"
  - label: "Log In"
    link: "/login"
    style: "primary button"
```

### 3.2 Hero Section (Left Side)
```yaml
background_image: "road-mountains.jpg"
quote:
  text: "The journey of a thousand miles begins with a single step."
  author: "Lao Tzu"
badge:
  icon: "compass"
  text: "Explore over 50 countries"
```

### 3.3 Registration Form
```yaml
title: "Create your account"
subtitle: "Join us to discover and book exclusive tours around the world."

form_fields:
  - id: "fullName"
    label: "Full Name"
    type: "text"
    placeholder: "e.g. Jane Doe"
    required: true
    validation:
      - rule: "required"
        message: "Full name is required"
      - rule: "minLength:2"
        message: "Name must be at least 2 characters"

  - id: "email"
    label: "Email Address"
    type: "email"
    placeholder: "e.g. jane@example.com"
    required: true
    validation:
      - rule: "required"
        message: "Email is required"
      - rule: "email"
        message: "Please enter a valid email"

  - id: "phone"
    label: "Phone Number"
    type: "tel"
    placeholder: "+1 (555) 000-0000"
    required: false
    prefix: "country_selector"

  - id: "country"
    label: "Country"
    type: "select"
    placeholder: "Select a country"
    required: false
    options: "countries_list"

  - id: "password"
    label: "Password"
    type: "password"
    placeholder: "••••••••"
    required: true
    show_strength: true
    validation:
      - rule: "required"
        message: "Password is required"
      - rule: "minLength:8"
        message: "Password must be at least 8 characters"
      - rule: "pattern"
        value: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"
        message: "Must contain uppercase, lowercase, and number"

  - id: "confirmPassword"
    label: "Confirm Password"
    type: "password"
    placeholder: "••••••••"
    required: true
    validation:
      - rule: "required"
        message: "Please confirm your password"
      - rule: "match:password"
        message: "Passwords do not match"

password_strength:
  levels:
    - name: "Weak"
      color: "red"
      criteria: "< 8 chars"
    - name: "Medium"
      color: "yellow"
      criteria: "8+ chars, mixed case"
    - name: "Strong"
      color: "green"
      criteria: "8+ chars, mixed case, numbers, symbols"

terms_checkbox:
  id: "agreeTerms"
  label: "By creating an account, I agree to the Terms of Use and Privacy Policy."
  required: true
  links:
    - text: "Terms of Use"
      url: "/terms"
    - text: "Privacy Policy"
      url: "/privacy"

submit_button:
  label: "Register Account"
  loading_label: "Creating account..."
  style: "primary full-width"

login_link:
  text: "Already have an account?"
  link_text: "Log in"
  link: "/login"

social_divider: "OR CONTINUE WITH"

social_buttons:
  - provider: "google"
    label: "Google"
    icon: "google"
  - provider: "facebook"
    label: "Facebook"
    icon: "facebook"
```

## 4. Actions & Events

### 4.1 Form Submit
```yaml
trigger: "Click Register button"
validation:
  - Validate all required fields
  - Check password strength
  - Verify passwords match
  - Check terms agreement
action:
  - Call POST /auth/register
  - On success: Show success, redirect to login
  - On error: Show error message
```

### 4.2 Password Strength Check
```yaml
trigger: "On password input change"
action:
  - Calculate strength based on criteria
  - Update strength indicator
  - Show/hide strength bar
```

### 4.3 Country Selection
```yaml
trigger: "Select country from dropdown"
action:
  - Update phone prefix automatically
  - Store country value
```

## 5. Responsive Behavior

```yaml
desktop: # >= 1024px
  layout: "Two columns (hero | form)"
  hero_width: "40%"
  form_width: "60%"

tablet: # 768px - 1024px
  layout: "Two columns"
  hero_width: "35%"
  form_width: "65%"

mobile: # < 768px
  layout: "Single column"
  hero: "Hidden"
  form_width: "100%"
```

## 6. Accessibility

- All form fields have visible labels
- Password requirements announced to screen readers
- Error messages associated with fields
- Terms links open in new tab with warning
- Tab order follows visual layout
