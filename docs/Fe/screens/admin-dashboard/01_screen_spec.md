# Admin Dashboard Screen Specification

## 1. Screen Overview

| Item | Value |
|------|-------|
| Screen ID | `SCR-010` |
| Screen Name | Admin Dashboard |
| Route | `/admin/dashboard` |
| Layout | Admin Layout |
| Access Level | ADMIN only |

## 2. Screen States

### 2.1 Loading State
- Show skeleton loaders for all cards
- Show skeleton for chart area
- Show skeleton rows in tables

### 2.2 Success State
- Display all statistics with data
- Render revenue chart
- Show recent bookings
- Show top tours

### 2.3 Empty State
- Show "No data available" for empty sections
- Still display cards with 0 values

### 2.4 Error State
- Show error message with retry button
- Partial errors: show error in specific section only

### 2.5 403 State
- Redirect to home page
- Show toast: "Access denied"

## 3. UI Components

### 3.1 Admin Sidebar
```yaml
logo:
  text: "TourAdmin"
  subtitle: "Management Portal"

navigation:
  - id: "dashboard"
    label: "Dashboard"
    icon: "LayoutDashboard"
    path: "/admin/dashboard"
    active: true

  - id: "tours"
    label: "Tours"
    icon: "Map"
    path: "/admin/tours"

  - id: "bookings"
    label: "Bookings"
    icon: "Calendar"
    path: "/admin/bookings"

  - id: "users"
    label: "Users"
    icon: "Users"
    path: "/admin/users"

  - id: "reports"
    label: "Reports"
    icon: "BarChart"
    path: "/admin/reports"

  - id: "settings"
    label: "Settings"
    icon: "Settings"
    path: "/admin/settings"

footer:
  - id: "logout"
    label: "Logout"
    icon: "LogOut"
    action: "logout"
```

### 3.2 Page Header
```yaml
title: "Dashboard Overview"
subtitle: "Welcome back, Admin. Here is what is happening today."
metadata:
  label: "Last updated"
  value: "Just now"
  auto_refresh: true
  refresh_interval: 60000  # 1 minute
```

### 3.3 Statistics Cards
```yaml
cards:
  - id: "total_revenue"
    label: "Total Revenue"
    value: "$124,500"
    icon: "DollarSign"
    icon_bg: "blue"
    trend:
      value: "+12%"
      direction: "up"
      comparison: "vs last month"
      color: "green"

  - id: "total_bookings"
    label: "Total Bookings"
    value: "1,240"
    icon: "Calendar"
    icon_bg: "green"
    trend:
      value: "+8%"
      direction: "up"
      comparison: "vs last month"
      color: "green"

  - id: "active_tours"
    label: "Active Tours"
    value: "42"
    icon: "Map"
    icon_bg: "purple"
    trend:
      value: "+3"
      direction: "up"
      comparison: "vs last month"
      color: "green"

  - id: "new_users"
    label: "New Users"
    value: "85"
    icon: "Users"
    icon_bg: "orange"
    trend:
      value: "+5%"
      direction: "up"
      comparison: "vs last month"
      color: "green"
```

### 3.4 Revenue Trend Chart
```yaml
title: "Revenue Trends"
value: "$12,450"
trend: "+9.8% Last 30 Days"
action:
  label: "View Report"
  link: "/admin/reports"

chart:
  type: "line"
  period: "4 weeks"
  x_axis: ["Week 1", "Week 2", "Week 3", "Week 4"]
  data_points: true
  fill: true
  color: "blue"
```

### 3.5 Quick Actions
```yaml
title: "Quick Actions"
buttons:
  - id: "add_tour"
    label: "Add New Tour"
    icon: "Plus"
    style: "primary"
    action: "/admin/tours/new"

  - id: "create_booking"
    label: "Create Booking"
    icon: "Calendar"
    style: "secondary"
    action: "/admin/bookings/new"

  - id: "invite_user"
    label: "Invite User"
    icon: "UserPlus"
    style: "secondary"
    action: "open_modal:invite_user"
```

### 3.6 Recent Bookings Table
```yaml
title: "Recent Bookings"
action:
  label: "View All"
  link: "/admin/bookings"

table:
  columns:
    - id: "customer"
      label: "CUSTOMER"
      width: "30%"
    - id: "tour"
      label: "TOUR"
      width: "25%"
    - id: "date"
      label: "DATE"
      width: "15%"
    - id: "amount"
      label: "AMOUNT"
      width: "15%"
    - id: "status"
      label: "STATUS"
      width: "15%"

  row_limit: 5
  empty_message: "No recent bookings"
```

### 3.7 Top Performing Tours
```yaml
title: "Top Performing Tours"

list:
  - rank: 1
    name: "Alpine Adventure"
    revenue: "$24.5k"
    bookings: 156

  - rank: 2
    name: "Beach Paradise"
    revenue: "$18.2k"
    bookings: 124

  - rank: 3
    name: "City Explorer"
    revenue: "$15.8k"
    bookings: 98

display_limit: 5
```

## 4. Actions & Events

### 4.1 Auto Refresh
```yaml
trigger: "Every 60 seconds"
action:
  - Fetch latest statistics
  - Update cards
  - Update chart
  - Update tables
  - Show "Last updated: Just now"
```

### 4.2 Quick Action - Add Tour
```yaml
trigger: "Click 'Add New Tour' button"
action:
  - Navigate to /admin/tours/new
```

### 4.3 View All Bookings
```yaml
trigger: "Click 'View All' link"
action:
  - Navigate to /admin/bookings
```

## 5. Responsive Behavior

```yaml
desktop: # >= 1280px
  layout: "Sidebar expanded + Content"
  sidebar_width: "280px"
  stats_cards: "4 columns"
  chart_section: "2 columns (chart | quick actions)"
  tables: "2 columns (bookings | top tours)"

tablet: # 768px - 1280px
  layout: "Sidebar collapsed + Content"
  sidebar_width: "80px (icons only)"
  stats_cards: "2 columns"
  chart_section: "1 column"
  tables: "1 column (stacked)"

mobile: # < 768px
  layout: "No sidebar (hamburger menu)"
  stats_cards: "1 column"
  chart_section: "1 column"
  tables: "1 column"
```

## 6. Data Refresh Strategy

```yaml
initial_load:
  - Fetch all dashboard data in parallel
  - Show skeleton until all data loaded

background_refresh:
  interval: 60000  # 1 minute
  strategy: "silent"  # No loading indicator
  on_error: "Keep previous data, show subtle error"

manual_refresh:
  trigger: "Pull to refresh (mobile) or refresh button"
  strategy: "Show loading indicator"
```
