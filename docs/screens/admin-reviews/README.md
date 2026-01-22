# Admin Review Management Screen

## Overview

Admin page for moderating and managing customer reviews across all tours.

## Design Reference

- **Design file**: `docs/Fe/design/admin_review_&_feedback_management/screen.png`
- **HTML reference**: `docs/Fe/design/admin_review_&_feedback_management/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-014` |
| Route | `/admin/reviews` |
| Access | ADMIN only |
| Layout | Admin Layout |

## Key Features

1. Review statistics (Pending Approval, Average Rating, Total Feedback)
2. Filter by tour, status, and rating
3. Review list with approval actions
4. Reply to reviews
5. Flag/remove inappropriate reviews
6. Export reviews

## UI Components

### Page Header
```yaml
title: "Review Management"
subtitle: "Moderate and respond to customer feedback across all tours."

actions:
  - label: "Export CSV"
    icon: "Download"
    style: "outline"
```

### Statistics Cards
```yaml
cards:
  - label: "Pending Approval"
    value: "12"
    sub_text: "Requires attention"
    color: "yellow"

  - label: "Average Rating"
    value: "4.8"
    icon: "Star"
    trend: "+0.2 this month"

  - label: "Total Feedback"
    value: "3,450"
    sub_text: "All time"
```

### Filters
```yaml
filters:
  - id: "tour"
    label: "All Tours"
    type: "dropdown"
    options: "dynamic from tours"

  - id: "status"
    label: "All Statuses"
    type: "dropdown"
    options:
      - "All"
      - "Pending"
      - "Approved"
      - "Rejected"

  - id: "rating"
    label: "Any Rating"
    type: "dropdown"
    options:
      - "Any"
      - "5 Stars"
      - "4 Stars"
      - "3 Stars"
      - "2 Stars"
      - "1 Star"

search:
  placeholder: "Search by keyword, user, or tour..."
```

### Review List
```yaml
layout: "card_list"

review_card:
  header:
    avatar: true
    name: "{userName}"
    rating: "star display"
    tour_name: "{tourName}"
    booking_date: "{date}"

  content:
    comment: "{reviewText}"
    helpful_count: "{helpful} people found this helpful"

  status_badge:
    PENDING:
      color: "yellow"
      label: "Pending Approval"
    APPROVED:
      color: "green"
      label: "Approved"
    REJECTED:
      color: "red"
      label: "Rejected"
    SPAM:
      color: "gray"
      label: "Flagged as Spam"

  admin_reply:
    show_if: "has_reply"
    label: "Your reply"
    content: "{replyText}"

  actions:
    PENDING:
      - label: "Approve"
        style: "success"
        icon: "Check"
      - label: "Reject"
        style: "danger"
        icon: "X"
      - label: "Reply"
        style: "outline"
        icon: "MessageSquare"
    APPROVED:
      - label: "Reply"
        style: "outline"
      - label: "Remove"
        style: "danger"
    REJECTED:
      - label: "Approve"
        style: "success"
      - label: "Delete"
        style: "danger"

pagination:
  type: "load_more"
  initial: 10
```

### Reply Modal
```yaml
title: "Reply to Review"

review_preview:
  user: "{userName}"
  rating: "{rating}"
  comment: "{comment}"

fields:
  - id: "reply"
    label: "Your Reply"
    type: "textarea"
    placeholder: "Write a professional response..."
    max_chars: 500

actions:
  - label: "Cancel"
    style: "outline"
  - label: "Post Reply"
    style: "primary"
```

## Actions

### Approve Review
- Update status to APPROVED
- Review becomes visible on tour page
- Notify user (optional)

### Reject Review
- Update status to REJECTED
- Review hidden from public
- Optional: send reason to user

### Reply to Review
- Add admin response
- Visible below review on tour page

### Flag as Spam
- Mark as spam
- Hide from public
- Add to spam filter training

## API Endpoints

```yaml
GET /admin/reviews:
  params:
    - tourId: number
    - status: string
    - rating: number
    - search: string
    - page: number
    - limit: number

PATCH /admin/reviews/{id}/approve:
  description: Approve a review

PATCH /admin/reviews/{id}/reject:
  description: Reject a review
  body:
    reason: string (optional)

POST /admin/reviews/{id}/reply:
  description: Reply to a review
  body:
    reply: string

DELETE /admin/reviews/{id}:
  description: Delete a review

GET /admin/reviews/export:
  description: Export reviews to CSV
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
