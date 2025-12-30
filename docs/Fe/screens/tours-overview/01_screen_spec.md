# Tours Overview Screen Specification

## 1. Screen Overview

| Item | Value |
|------|-------|
| Screen ID | `SCR-003` |
| Screen Name | Tours Overview |
| Route | `/` or `/tours` |
| Layout | Main Layout |
| Access Level | Public |

## 2. Screen States

### 2.1 Loading State
- Show skeleton cards (8 items)
- Hero section visible
- Filters disabled

### 2.2 Success State
- Display tour cards grid
- Show total count
- Enable filters and pagination

### 2.3 Empty State
- Show "No tours found" message
- Display search suggestions
- Show "Clear filters" button

### 2.4 Error State
- Show error message with retry button
- Keep filters visible

### 2.5 403 State
- N/A (public page)

## 3. UI Components

### 3.1 Header Navigation
```yaml
logo:
  text: "TravelCo"
  link: "/"

navigation:
  - label: "Destinations"
    link: "/destinations"
  - label: "About"
    link: "/about"
  - label: "Contact"
    link: "/contact"

actions:
  authenticated:
    - avatar_menu:
        items:
          - label: "My Bookings"
            link: "/bookings"
          - label: "Profile"
            link: "/profile"
          - divider: true
          - label: "Logout"
            action: "logout"
  anonymous:
    - label: "Book a Tour"
      link: "/tours"
      style: "primary button"
```

### 3.2 Hero Section
```yaml
background:
  type: "image"
  src: "hero-mountains.jpg"
  overlay: true
  overlay_opacity: 0.4

content:
  title: "Discover Your Next Adventure"
  subtitle: "Explore the world's most beautiful destinations with our curated tours."

search:
  placeholder: "Search destinations, tours, activities..."
  icon: "Search"
  action: "filter_tours"
  suggestions: true
```

### 3.3 Filter Bar
```yaml
title: "Popular Tours This Season"
subtitle: "Search through our most loved destinations for your next adventure."

filters:
  - id: "popular"
    type: "tab"
    options:
      - label: "Popular"
        value: "popular"
        default: true
      - label: "New"
        value: "new"

  - id: "price"
    type: "dropdown"
    label: "Price"
    options:
      - label: "All Prices"
        value: ""
      - label: "Under $500"
        value: "0-500"
      - label: "$500 - $1000"
        value: "500-1000"
      - label: "$1000 - $2000"
        value: "1000-2000"
      - label: "Over $2000"
        value: "2000+"

  - id: "difficulty"
    type: "dropdown"
    label: "Difficulty"
    options:
      - label: "All Levels"
        value: ""
      - label: "Easy"
        value: "easy"
      - label: "Moderate"
        value: "moderate"
      - label: "Challenging"
        value: "challenging"
```

### 3.4 Tour Card
```yaml
card_layout:
  image:
    aspect_ratio: "16:9"
    fallback: "placeholder-tour.jpg"
    badge:
      position: "top-left"
      content: "Featured" # optional

  content:
    title:
      max_lines: 2
      link: "/tours/{slug}"

    metadata:
      - icon: "Star"
        value: "{rating}"
        suffix: "({reviewCount} reviews)" # optional

      - icon: "MapPin"
        value: "{location}"

      - icon: "Clock"
        value: "{durationDays} Days"

    price:
      prefix: "From"
      value: "${priceAdult}"
      period: "/person"

    actions:
      - label: "Book Now"
        style: "primary"
        link: "/tours/{slug}"
```

### 3.5 Pagination
```yaml
type: "numbered"
show_total: true
items_per_page: 8
max_visible_pages: 5

components:
  - previous_button:
      label: "Previous"
      icon: "ChevronLeft"
  - page_numbers: true
  - next_button:
      label: "Next"
      icon: "ChevronRight"

load_more_option:
  enabled: true
  label: "Show More Tours"
  style: "secondary"
```

### 3.6 Footer
```yaml
brand:
  logo: "TravelCo"
  description: "Your trusted partner for unforgettable travel experiences."
  social:
    - icon: "Facebook"
      link: "#"
    - icon: "Twitter"
      link: "#"
    - icon: "Instagram"
      link: "#"

columns:
  - title: "Company"
    links:
      - label: "About Us"
        link: "/about"
      - label: "Careers"
        link: "/careers"
      - label: "Press"
        link: "/press"

  - title: "Support"
    links:
      - label: "Help Center"
        link: "/help"
      - label: "Contact Us"
        link: "/contact"
      - label: "FAQs"
        link: "/faq"

newsletter:
  title: "Subscribe"
  placeholder: "Enter your email"
  button: "Subscribe"

copyright: "© 2025 TravelCo. All rights reserved."
```

## 4. Actions & Events

### 4.1 Search Tours
```yaml
trigger: "Type in search box and press Enter OR click search icon"
debounce: 300ms
action:
  - Update URL params: ?search={query}
  - Call GET /tours with search param
  - Update tour list
```

### 4.2 Apply Filters
```yaml
trigger: "Select filter option"
action:
  - Update URL params
  - Call GET /tours with filter params
  - Reset to page 1
  - Update tour list
```

### 4.3 Pagination
```yaml
trigger: "Click page number or next/prev"
action:
  - Update URL params: ?page={n}
  - Call GET /tours with page param
  - Scroll to top of list
  - Update tour list
```

### 4.4 Load More
```yaml
trigger: "Click 'Show More Tours' button"
action:
  - Call GET /tours with next page
  - Append tours to existing list
  - Update pagination state
```

## 5. Responsive Behavior

```yaml
desktop: # >= 1280px
  hero_height: "500px"
  grid_columns: 4
  cards_per_row: 4

laptop: # 1024px - 1280px
  hero_height: "450px"
  grid_columns: 3
  cards_per_row: 3

tablet: # 768px - 1024px
  hero_height: "400px"
  grid_columns: 2
  cards_per_row: 2
  filters: "horizontal scroll"

mobile: # < 768px
  hero_height: "350px"
  grid_columns: 1
  cards_per_row: 1
  filters: "drawer/modal"
  search: "full width"
```

## 6. SEO & Performance

```yaml
seo:
  title: "Discover Amazing Tours | TravelCo"
  description: "Explore the world's most beautiful destinations..."
  og_image: "og-tours.jpg"

performance:
  image_loading: "lazy"
  above_fold_images: 4 # eager load first 4
  skeleton_count: 8
  prefetch_next_page: true
```
