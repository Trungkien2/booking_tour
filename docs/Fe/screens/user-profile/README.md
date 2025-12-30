# User Profile Screen

## Overview

User profile management page allowing users to view and edit their personal information, preferences, and security settings.

## Design Reference

- **Design file**: `docs/Fe/design/user_profile_page/screen.png`
- **HTML reference**: `docs/Fe/design/user_profile_page/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-007` |
| Route | `/profile` |
| Access | Authenticated (USER, ADMIN, GUIDE) |
| Layout | Main Layout with Profile Sidebar |

## Key Features

1. Profile sidebar navigation
2. Personal information form
3. Avatar upload
4. Email verification status
5. Travel preferences
6. Password change
7. Account actions

## UI Components

### Profile Sidebar
```yaml
user_info:
  avatar: true
  name: "{fullName}"
  subtitle: "Member since {year}"

navigation:
  - id: "personal_info"
    label: "Personal Info"
    icon: "User"
    active: true
  - id: "my_bookings"
    label: "My Bookings"
    icon: "Calendar"
    link: "/bookings"
  - id: "payment_methods"
    label: "Payment Methods"
    icon: "CreditCard"
  - id: "security"
    label: "Security"
    icon: "Shield"
  - id: "notifications"
    label: "Notifications"
    icon: "Bell"

footer:
  - id: "logout"
    label: "Logout"
    icon: "LogOut"
    style: "danger"
```

### Personal Information Form
```yaml
header:
  title: "My Profile"
  subtitle: "Manage your personal information and account settings"

profile_header:
  avatar:
    size: "large"
    editable: true
    upload_action: "change_avatar"
  name: "{fullName}"
  subtitle: "{memberType}" # e.g., "Travel Enthusiast"
  badge: "Verified Member" # if email verified
  joined: "Joined {date}"
  action: "Edit Public Profile"

form_sections:
  - title: "Personal Information"
    fields:
      - id: "firstName"
        label: "First Name"
        type: "text"
        required: true
      - id: "lastName"
        label: "Last Name"
        type: "text"
        required: true
      - id: "email"
        label: "Email Address"
        type: "email"
        readonly: true
        verification_status: true
        verify_action: "VERIFY"
      - id: "phone"
        label: "Phone Number"
        type: "tel"
      - id: "address"
        label: "Address"
        type: "text"
      - id: "bio"
        label: "Bio"
        type: "textarea"
        max_chars: 500
        placeholder: "Tell us about yourself..."

  - title: "Travel Preferences"
    fields:
      - id: "vegetarian_meals"
        label: "Vegetarian Meals"
        description: "Request special meals"
        type: "toggle"
      - id: "window_seat"
        label: "Window Seat"
        description: "Preferred on flights"
        type: "toggle"

  - title: "Sign-in Method"
    fields:
      - id: "password"
        label: "Password"
        type: "password_display"
        last_changed: "{date}"
        action: "Change Password"
```

## Actions

### Save Changes
- Validate form
- Call PATCH /users/me
- Show success toast

### Change Avatar
- Open file picker
- Upload image
- Update avatar preview

### Verify Email
- Send verification email
- Show confirmation message

### Change Password
- Open password change modal
- Require current password
- Validate new password strength

## API Endpoints

```yaml
GET /users/me:
  description: Get current user profile

PATCH /users/me:
  description: Update user profile

POST /users/me/avatar:
  description: Upload new avatar

POST /auth/send-verification:
  description: Send email verification

PATCH /users/me/password:
  description: Change password
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
