# Admin Tour Management Screen

## Overview

Admin page for managing tours including listing, creating, editing, and deleting tours with inventory tracking.

## Design Reference

- **Design file**: `docs/Fe/design/admin_tour_management/screen.png`
- **HTML reference**: `docs/Fe/design/admin_tour_management/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-011` |
| Route | `/admin/tours` |
| Access | ADMIN only |
| Layout | Admin Layout |

## Key Features

1. Tour statistics (Total, Active, Drafts, Fully Booked)
2. Search and filter tours
3. Tab filters (All Status, Published, Draft, Archived)
4. Tour table with inline actions
5. Create new tour button
6. Edit tour side panel/modal
7. Bulk actions

## UI Components

### Page Header
```yaml
title: "Tour Management"
subtitle: "Manage listings, inventory, and pricing details."

actions:
  - label: "Add New Tour"
    icon: "Plus"
    style: "primary"
    action: "/admin/tours/new"
```

### Statistics Cards
```yaml
cards:
  - label: "Total Tours"
    value: "45"
    trend: "+2%"
    icon: "Map"
  - label: "Active Tours"
    value: "32"
    trend: "0%"
    icon: "CheckCircle"
  - label: "Drafts"
    value: "8"
    trend: "+33%"
    icon: "FileEdit"
  - label: "Fully Booked"
    value: "5"
    trend: "-3%"
    icon: "Users"
```

### Filters & Search
```yaml
search:
  placeholder: "Search tours..."

tabs:
  - label: "All Status"
    value: ""
  - label: "Published"
    value: "published"
  - label: "Draft"
    value: "draft"
  - label: "Archived"
    value: "archived"
```

### Tours Table
```yaml
columns:
  - id: "tour"
    label: "Tour Name"
    sortable: true
    content: "image + name + location"

  - id: "price"
    label: "Price"
    sortable: true

  - id: "slots"
    label: "Slots"
    content: "booked/total with progress bar"

  - id: "status"
    label: "Status"
    content: "status badge"

  - id: "actions"
    label: "Actions"
    content: "edit, delete icons"

row_actions:
  - icon: "Edit"
    label: "Edit"
    action: "open_edit_panel"
  - icon: "Trash"
    label: "Delete"
    action: "confirm_delete"
    confirmation: true

pagination:
  type: "numbered"
  items_per_page: 10
```

### Edit Tour Panel
```yaml
type: "side_panel" # or "modal"
width: "500px"

header:
  title: "Edit Tour"
  close_button: true

form_fields:
  - id: "coverImage"
    type: "image_upload"
    label: "Cover Image"

  - id: "name"
    label: "Tour Title"
    type: "text"
    required: true

  - id: "location"
    label: "Location"
    type: "text"

  - id: "duration"
    label: "Duration (Days)"
    type: "number"

  - id: "priceAdult"
    label: "Price ($)"
    type: "number"

  - id: "slots"
    label: "Total Slots"
    type: "number"

  - id: "startDate"
    label: "Start Date"
    type: "date"

  - id: "status"
    label: "Status"
    type: "radio"
    options:
      - "Published"
      - "Draft"
      - "Closed"

  - id: "description"
    label: "Description"
    type: "textarea"

footer:
  - label: "Cancel"
    style: "outline"
    action: "close"
  - label: "Save Changes"
    style: "primary"
    action: "save"
```

## Actions

### Create Tour
- Navigate to /admin/tours/new
- Full page form for new tour

### Edit Tour
- Open side panel with tour data
- Save changes to API
- Update table row

### Delete Tour
- Show confirmation dialog
- Check for active bookings
- Soft delete or prevent if bookings exist

### Bulk Actions
- Select multiple tours
- Bulk publish/unpublish
- Bulk delete (drafts only)

## API Endpoints

```yaml
GET /admin/tours:
  params:
    - search: string
    - status: string
    - page: number
    - limit: number
    - sort: string

GET /admin/tours/{id}:
  description: Get tour details for editing

POST /admin/tours:
  description: Create new tour

PATCH /admin/tours/{id}:
  description: Update tour

DELETE /admin/tours/{id}:
  description: Delete tour (soft delete)
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
