# Tour Detail Screen Specification

## 1. Screen Overview

| Item | Value |
|------|-------|
| Screen ID | `SCR-004` |
| Screen Name | Tour Detail |
| Route | `/tours/[slug]` |
| Layout | Main Layout |
| Access Level | Public (booking requires auth) |

## 2. Screen States

### 2.1 Loading State
- Show skeleton for images
- Show skeleton for content sections
- Show skeleton for booking card

### 2.2 Success State
- Display all tour information
- Show available schedules
- Enable booking functionality

### 2.3 Error State (404)
- Show "Tour not found" message
- Provide link back to tours list

### 2.4 Empty Reviews State
- Show "No reviews yet" message
- Show "Be the first to review" CTA (if eligible)

## 3. UI Components

### 3.1 Page Header
```yaml
breadcrumb:
  - label: "Home"
    link: "/"
  - label: "Tours"
    link: "/tours"
  - label: "{tourName}"
    current: true

actions:
  - icon: "Heart"
    label: "Save"
    action: "toggle_favorite"
  - icon: "Share"
    label: "Share"
    action: "open_share_modal"
```

### 3.2 Hero Section
```yaml
title: "{tourName}"
subtitle:
  - icon: "MapPin"
    text: "{location}"
  - icon: "Star"
    text: "{rating} ({reviewCount} reviews)"

image_gallery:
  layout: "hero_with_thumbnails"
  hero_aspect: "16:9"
  thumbnails: 4
  lightbox: true
```

### 3.3 Experience Highlights
```yaml
section_title: "Experience Highlights"
highlights:
  - icon: "Compass"
    label: "Paddle through lands"
  - icon: "Sun"
    label: "Scenic hiking"
  - icon: "Users"
    label: "Local guide"
  - icon: "Mountain"
    label: "Small groups"
  - icon: "MapPin"
    label: "Meeting point"
```

### 3.4 About This Tour
```yaml
section_title: "About This Tour"
content:
  type: "rich_text"
  expandable: true
  max_lines: 6
  expand_label: "Read more"
  collapse_label: "Show less"
```

### 3.5 Itinerary
```yaml
section_title: "Itinerary"
layout: "accordion" # or "timeline"

days:
  - day: 1
    title: "Arrival & First Paddle"
    description: "..."
    expanded: true # First day expanded by default

  - day: 2
    title: "Deep Forest Exploration"
    description: "..."
    expanded: false
```

### 3.6 What's Included
```yaml
section_title: "What's Included"
layout: "two_columns"

included:
  - icon: "Check"
    label: "Professional guide"
  - icon: "Check"
    label: "All equipment"
  - icon: "Check"
    label: "Meals as per itinerary"
  - icon: "Check"
    label: "Hotel transfers"

not_included:
  - icon: "X"
    label: "International flights"
  - icon: "X"
    label: "Travel insurance"
  - icon: "X"
    label: "Personal expenses"
```

### 3.7 Meeting Point
```yaml
section_title: "Meeting Point"
map:
  type: "interactive" # Google Maps or Mapbox
  center: [lat, lng]
  zoom: 15
  marker: true

address:
  name: "Starting Point Name"
  street: "123 Main Street"
  city: "City, Country"
  instructions: "Look for our guide with the orange flag"
```

### 3.8 Booking Card (Sticky Sidebar)
```yaml
position: "sticky"
sticky_offset: "80px"

price_display:
  label: "From"
  value: "${priceAdult}"
  suffix: "/person"

schedule_picker:
  label: "Select Date"
  type: "calendar_dropdown"
  show_availability: true
  status_colors:
    OPEN: "green"
    SOLD_OUT: "red"
    CLOSED: "gray"

travelers:
  - type: "adult"
    label: "Adults"
    price: "${priceAdult}"
    min: 1
    max: 10
    default: 2

  - type: "child"
    label: "Children"
    price: "${priceChild}"
    sublabel: "Ages 3-12"
    min: 0
    max: 10
    default: 0

price_breakdown:
  show: true
  items:
    - label: "Adults x {count}"
      value: "${amount}"
    - label: "Children x {count}"
      value: "${amount}"
    - label: "Taxes & Fees"
      value: "${amount}"
  total:
    label: "Total"
    value: "${totalAmount}"

cta_button:
  label: "Book Now"
  loading_label: "Processing..."
  style: "primary full-width"
  disabled_states:
    - "No schedule selected"
    - "Schedule sold out"
    - "No travelers selected"
```

### 3.9 Reviews Section
```yaml
section_title: "Reviews"
summary:
  average_rating: "{ratingAverage}"
  total_reviews: "{reviewCount}"
  rating_distribution:
    5: 80
    4: 15
    3: 3
    2: 1
    1: 1

review_list:
  sort_options:
    - label: "Most Recent"
      value: "recent"
    - label: "Highest Rated"
      value: "rating_desc"
    - label: "Lowest Rated"
      value: "rating_asc"

  pagination:
    type: "load_more"
    initial: 5
    load_count: 5

review_card:
  avatar: true
  name: "{userName}"
  date: "{createdAt}"
  rating: "{rating}"
  comment: "{comment}"
  helpful_button: true
```

## 4. Actions & Events

### 4.1 Select Schedule
```yaml
trigger: "Click on calendar date"
action:
  - Check availability
  - Update selected schedule
  - Recalculate price
  - Enable/disable Book Now button
```

### 4.2 Update Travelers
```yaml
trigger: "Change traveler count (+/-)"
validation:
  - Min 1 adult required
  - Max capacity check
action:
  - Update traveler counts
  - Recalculate total price
```

### 4.3 Book Now
```yaml
trigger: "Click Book Now button"
preconditions:
  - Schedule selected
  - Schedule has availability
  - At least 1 adult selected
action:
  authenticated:
    - Navigate to booking confirmation
    - Pass booking data
  anonymous:
    - Save booking intent
    - Redirect to login
    - After login, restore intent
```

## 5. Responsive Behavior

```yaml
desktop: # >= 1024px
  layout: "Two columns (content 60% | booking 40%)"
  booking_card: "Sticky sidebar"
  image_gallery: "Hero with 4 thumbnails"

tablet: # 768px - 1024px
  layout: "Single column"
  booking_card: "Fixed bottom bar"
  image_gallery: "Carousel"

mobile: # < 768px
  layout: "Single column"
  booking_card: "Fixed bottom bar (collapsed)"
  image_gallery: "Carousel"
  expand_booking: "Tap to expand"
```

## 6. SEO & Meta

```yaml
title: "{tourName} | TravelCo"
description: "{summary}"
og_image: "{coverImage}"
structured_data:
  type: "Product"
  fields:
    - name
    - description
    - image
    - offers (price, availability)
    - aggregateRating
```
