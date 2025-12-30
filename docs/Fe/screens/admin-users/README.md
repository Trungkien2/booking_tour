# Admin User Management Screen

## Overview

Admin page for managing platform users including customers, guides, and other admins with role management capabilities.

## Design Reference

- **Design file**: `docs/Fe/design/admin_user_management/screen.png`
- **HTML reference**: `docs/Fe/design/admin_user_management/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-013` |
| Route | `/admin/users` |
| Access | ADMIN only |
| Layout | Admin Layout |

## Key Features

1. User list with search and filters
2. Role-based filtering (All, Admin, Guide, Customer)
3. Status filtering (Active, Inactive, Pending)
4. User table with role badges
5. Add new user button
6. Role change functionality
7. User status toggle

## UI Components

### Page Header
```yaml
title: "User Management"
subtitle: "Manage access, roles, and account statuses for all platform users."

actions:
  - label: "Add New User"
    icon: "Plus"
    style: "primary"
    action: "open_add_user_modal"
```

### Search & Filters
```yaml
search:
  placeholder: "Search users by name or email..."
  icon: "Search"

filters:
  - id: "role"
    label: "Role"
    type: "dropdown"
    options:
      - label: "All"
        value: ""
      - label: "Admin"
        value: "ADMIN"
      - label: "Guide"
        value: "GUIDE"
      - label: "Customer"
        value: "USER"

  - id: "status"
    label: "Status"
    type: "dropdown"
    options:
      - label: "All"
        value: ""
      - label: "Active"
        value: "active"
      - label: "Inactive"
        value: "inactive"
      - label: "Pending"
        value: "pending"

  - id: "sort"
    label: "Sort By"
    type: "dropdown"
    options:
      - label: "Newest"
        value: "created_desc"
      - label: "Oldest"
        value: "created_asc"
      - label: "Name A-Z"
        value: "name_asc"
```

### Users Table
```yaml
columns:
  - id: "checkbox"
    type: "selection"

  - id: "user"
    label: "User"
    content: "avatar + name + email"

  - id: "role"
    label: "Role"
    content: "role badge"

  - id: "status"
    label: "Status"
    content: "status indicator"

  - id: "lastLogin"
    label: "Last Login"
    format: "relative_date"

  - id: "actions"
    label: "Actions"
    content: "more menu"

role_badges:
  ADMIN:
    color: "red"
    label: "Admin"
  GUIDE:
    color: "blue"
    label: "Guide"
  USER:
    color: "gray"
    label: "Customer"

status_indicators:
  active:
    color: "green"
    icon: "circle-filled"
    label: "Active"
  inactive:
    color: "red"
    icon: "circle-filled"
    label: "Inactive"
  pending:
    color: "yellow"
    icon: "circle-filled"
    label: "Pending"

row_actions:
  - label: "View Profile"
    action: "/admin/users/{id}"
  - label: "Change Role"
    action: "open_role_modal"
  - label: "Deactivate"
    action: "confirm_deactivate"
    visible_if: "status === 'active'"
  - label: "Activate"
    action: "confirm_activate"
    visible_if: "status === 'inactive'"
  - label: "Delete"
    action: "confirm_delete"
    style: "danger"

pagination:
  type: "numbered"
  items_per_page: 10
  total_display: "Showing 1-5 of 128 users"
```

### Add User Modal
```yaml
title: "Add New User"

fields:
  - id: "fullName"
    label: "Full Name"
    type: "text"
    required: true

  - id: "email"
    label: "Email"
    type: "email"
    required: true

  - id: "role"
    label: "Role"
    type: "select"
    options:
      - "Customer"
      - "Guide"
      - "Admin"
    default: "Customer"

  - id: "sendInvite"
    label: "Send invitation email"
    type: "checkbox"
    default: true

actions:
  - label: "Cancel"
    style: "outline"
  - label: "Add User"
    style: "primary"
```

### Change Role Modal
```yaml
title: "Change User Role"
user_info: "display current user"

fields:
  - id: "role"
    label: "New Role"
    type: "radio"
    options:
      - label: "Customer"
        value: "USER"
        description: "Can browse and book tours"
      - label: "Guide"
        value: "GUIDE"
        description: "Can view assigned tours"
      - label: "Admin"
        value: "ADMIN"
        description: "Full system access"

warning: "Changing role may affect user's access to certain features."

actions:
  - label: "Cancel"
    style: "outline"
  - label: "Change Role"
    style: "primary"
```

## API Endpoints

```yaml
GET /admin/users:
  params:
    - search: string
    - role: string
    - status: string
    - page: number
    - limit: number
    - sort: string

GET /admin/users/{id}:
  description: Get user details

POST /admin/users:
  description: Create new user (invite)
  body:
    fullName: string
    email: string
    role: string
    sendInvite: boolean

PATCH /admin/users/{id}:
  description: Update user

PATCH /admin/users/{id}/role:
  description: Change user role
  body:
    role: "USER" | "ADMIN" | "GUIDE"

PATCH /admin/users/{id}/status:
  description: Activate/deactivate user
  body:
    active: boolean

DELETE /admin/users/{id}:
  description: Delete user (soft delete)
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
