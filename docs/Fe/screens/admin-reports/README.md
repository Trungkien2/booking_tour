# Admin Reports & Analytics Screen

## Overview

Admin analytics dashboard with comprehensive reports on revenue, bookings, customers, and tour performance.

## Design Reference

- **Design file**: `docs/Fe/design/admin_reports_&_analytics/screen.png`
- **HTML reference**: `docs/Fe/design/admin_reports_&_analytics/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-015` |
| Route | `/admin/reports` |
| Access | ADMIN only |
| Layout | Admin Layout |

## Key Features

1. Date range selector
2. Key metrics cards
3. Revenue & Bookings trend chart
4. Top categories pie chart
5. Daily engagement chart
6. Popular tours table
7. Export report functionality

## UI Components

### Page Header
```yaml
title: "Analytics Dashboard"
subtitle: "Overview for {date}"

date_selector:
  type: "dropdown"
  options:
    - "Last 7 Days"
    - "Last 30 Days"
    - "Last 90 Days"
    - "This Year"
    - "Custom Range"

actions:
  - label: "Export Report"
    icon: "Download"
    style: "primary"
```

### Key Metrics Cards
```yaml
cards:
  - label: "Total Revenue"
    value: "$124,500"
    trend: "+12%"
    trend_text: "vs last month"
    trend_color: "green"
    icon: "DollarSign"

  - label: "Total Bookings"
    value: "1,450"
    trend: "+9%"
    trend_text: "vs last month"
    icon: "Calendar"

  - label: "New Customers"
    value: "320"
    trend: "+25%"
    trend_text: "vs last month"
    icon: "Users"

  - label: "Avg. Tour Rating"
    value: "4.8"
    sub_text: "/5.0"
    trend: "-0.2"
    trend_text: "vs last month"
    trend_color: "red"
    icon: "Star"
```

### Revenue & Bookings Chart
```yaml
title: "Revenue & Bookings Trend"
subtitle: "Monthly performance overview"

chart:
  type: "line"
  dual_axis: true
  period: "4 weeks"

  datasets:
    - label: "Revenue"
      color: "blue"
      axis: "left"
      format: "currency"
    - label: "Projected"
      color: "blue-dashed"
      axis: "left"

  legend:
    position: "top-right"
    items:
      - "Revenue"
      - "Projected"
```

### Top Categories Chart
```yaml
title: "Top Categories"
value: "1.4k"
subtitle: "Total bookings"

chart:
  type: "donut"

  data:
    - label: "Adventure"
      value: 40
      color: "blue"
    - label: "City"
      value: 30
      color: "green"
    - label: "Food"
      value: 30
      color: "orange"

legend:
  position: "right"
  show_percentage: true
```

### Daily Engagement Chart
```yaml
title: "Daily Engagement"

chart:
  type: "bar"
  period: "week"
  x_axis: ["M", "T", "W", "T", "F", "S", "S"]

  metrics:
    - label: "Page Views"
    - label: "Bookings"
```

### Popular Tours Table
```yaml
title: "Popular Tours"

search:
  placeholder: "Search tours..."

columns:
  - id: "tour"
    label: "Tour Name"
    content: "image + name"

  - id: "bookings"
    label: "Total Bookings"
    sortable: true

  - id: "revenue"
    label: "Revenue"
    sortable: true
    format: "currency"

  - id: "rating"
    label: "Rating"
    sortable: true
    content: "star + value"

  - id: "trend"
    label: "Trend"
    content: "sparkline or arrow"

pagination:
  type: "simple"
  items_per_page: 5
```

## Export Options

### Report Types
```yaml
exports:
  - type: "revenue_report"
    label: "Revenue Report"
    format: ["PDF", "CSV", "Excel"]

  - type: "bookings_report"
    label: "Bookings Report"
    format: ["PDF", "CSV", "Excel"]

  - type: "customer_report"
    label: "Customer Report"
    format: ["CSV", "Excel"]

  - type: "tour_performance"
    label: "Tour Performance"
    format: ["PDF", "CSV"]
```

## API Endpoints

```yaml
GET /admin/reports/overview:
  params:
    - period: "7d" | "30d" | "90d" | "1y" | "custom"
    - from: date (if custom)
    - to: date (if custom)
  response:
    - metrics: KPI cards data
    - revenueTrend: chart data
    - categories: pie chart data
    - engagement: bar chart data

GET /admin/reports/popular-tours:
  params:
    - period: string
    - limit: number
    - sort: "bookings" | "revenue" | "rating"

GET /admin/reports/export:
  params:
    - type: string
    - format: "pdf" | "csv" | "excel"
    - period: string
  response:
    - downloadUrl: string
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
