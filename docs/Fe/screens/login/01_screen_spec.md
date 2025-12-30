# Login Screen Specification

## 1. Screen Overview

| Item | Value |
|------|-------|
| Screen ID | `SCR-001` |
| Screen Name | Login |
| Route | `/login` |
| Layout | Auth Layout |
| Access Level | Anonymous only |

## 2. Screen States

### 2.1 Default State
- Display login form with empty fields
- Social login buttons enabled
- Sign In button disabled until form is valid

### 2.2 Loading State
- Show spinner on Sign In button
- Disable all form inputs
- Disable social login buttons

### 2.3 Success State
- Redirect to `/` (home) or previous page
- Store tokens in auth store

### 2.4 Error State
- Display error message below form
- Highlight invalid fields with red border
- Keep form values (except password)

### 2.5 403/Unauthorized State
- N/A (public page)

## 3. UI Components

### 3.1 Header
```yaml
logo:
  text: "TourBooking"
  link: "/"
navigation:
  - label: "Home"
    link: "/"
  - label: "Tours"
    link: "/tours"
  - label: "Destinations"
    link: "/destinations"
  - label: "Sign Up"
    link: "/register"
    style: "primary button"
```

### 3.2 Login Form
```yaml
title: "Welcome back"
subtitle: "Plan your next adventure today"

social_buttons:
  - provider: "google"
    label: "Continue with Google"
    icon: "google"
  - provider: "apple"
    label: "Continue with Apple"
    icon: "apple"

divider: "Or continue with email"

form_fields:
  - id: "email"
    label: "Email or Username"
    type: "email"
    placeholder: "user@example.com"
    required: true
    validation:
      - rule: "required"
        message: "Email is required"
      - rule: "email"
        message: "Please enter a valid email"

  - id: "password"
    label: "Password"
    type: "password"
    placeholder: "Enter your password"
    required: true
    validation:
      - rule: "required"
        message: "Password is required"
      - rule: "minLength:6"
        message: "Password must be at least 6 characters"

forgot_password:
  label: "Forgot Password?"
  link: "/forgot-password"

submit_button:
  label: "Sign In"
  loading_label: "Signing in..."
  style: "primary full-width"

signup_link:
  text: "Don't have an account?"
  link_text: "Sign Up"
  link: "/register"
```

### 3.3 Hero Section (Right Side)
```yaml
background_image: "swiss-alps.jpg"
overlay: true
content:
  rating: "4.9/5 (4 reviews)"
  title: "Explore the Swiss Alps"
  description: "Discover breathtaking views and unforgettable hiking trails in one of the world's most beautiful destinations."
  testimonial:
    avatar: "sarah-jenkins.jpg"
    name: "Sarah Jenkins"
```

## 4. Actions & Events

### 4.1 Form Submit
```yaml
trigger: "Click Sign In button OR press Enter"
validation:
  - Validate all fields
  - Show inline errors if invalid
action:
  - Call POST /auth/login
  - On success: Store tokens, redirect
  - On error: Show error message
```

### 4.2 Social Login
```yaml
trigger: "Click Google/Apple button"
action:
  - Redirect to OAuth provider
  - Handle callback
  - Store tokens, redirect
```

### 4.3 Forgot Password
```yaml
trigger: "Click 'Forgot Password?' link"
action:
  - Navigate to /forgot-password
```

## 5. Responsive Behavior

```yaml
desktop: # >= 1024px
  layout: "Two columns (form | hero)"
  form_width: "50%"
  hero_width: "50%"

tablet: # 768px - 1024px
  layout: "Two columns"
  form_width: "50%"
  hero_width: "50%"

mobile: # < 768px
  layout: "Single column (form only)"
  hero: "Hidden"
  form_width: "100%"
```

## 6. Accessibility

- All form fields have labels
- Error messages linked to fields via aria-describedby
- Focus management after form submission
- Social buttons have accessible names
- Tab order: Email → Password → Forgot Password → Sign In → Social buttons
