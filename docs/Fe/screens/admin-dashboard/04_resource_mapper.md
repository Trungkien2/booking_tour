# Admin Dashboard - Resource Mapper

## 1. Statistics Cards Mapping

### API → UI

| API Field | API Type | UI Component | UI Type | Transform |
|-----------|----------|--------------|---------|-----------|
| `stats.totalRevenue.value` | `number` | Card value | `string` | `formatCurrency()` |
| `stats.totalRevenue.trend.value` | `number` | Trend badge | `string` | `+${value}%` |
| `stats.totalRevenue.trend.direction` | `string` | Trend icon | `icon` | up → ArrowUp, down → ArrowDown |
| `stats.totalBookings.value` | `number` | Card value | `string` | `formatNumber()` |
| `stats.activeTours.value` | `number` | Card value | `string` | As-is |
| `stats.newUsers.value` | `number` | Card value | `string` | As-is |

### Example Transform
```typescript
// API Response
const apiStats = {
  totalRevenue: {
    value: 124500,
    currency: "USD",
    trend: { value: 12, direction: "up", comparison: "vs last month" }
  }
};

// UI Display
const cardData = {
  label: "Total Revenue",
  value: "$124,500",
  trend: {
    text: "+12%",
    icon: "ArrowUp",
    color: "text-green-600"
  },
  comparison: "vs last month"
};
```

---

## 2. Revenue Chart Mapping

### API → Chart.js Data

| API Field | Chart.js Field | Transform |
|-----------|---------------|-----------|
| `chartData[].label` | `labels[]` | Direct |
| `chartData[].value` | `datasets[0].data[]` | Direct |

### Example Transform
```typescript
// API Response
const apiChartData = {
  chartData: [
    { label: "Week 1", value: 2800, date: "2024-12-16" },
    { label: "Week 2", value: 3200, date: "2024-12-23" },
    { label: "Week 3", value: 2950, date: "2024-12-30" },
    { label: "Week 4", value: 3500, date: "2025-01-06" }
  ]
};

// Chart.js Data
const chartConfig = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [{
    label: "Revenue",
    data: [2800, 3200, 2950, 3500],
    borderColor: "rgb(59, 130, 246)",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    fill: true,
    tension: 0.4
  }]
};
```

---

## 3. Recent Bookings Table Mapping

### API → Table Rows

| API Field | Table Column | Transform |
|-----------|--------------|-----------|
| `customer.fullName` | Customer | Direct |
| `customer.email` | Customer (subtitle) | Direct |
| `customer.avatar` | Customer (avatar) | Avatar URL or initials |
| `tour.name` | Tour | Direct |
| `bookingDate` | Date | `formatDate('MMM DD, YYYY')` |
| `amount` | Amount | `formatCurrency()` |
| `status` | Status | Status badge component |

### Status Badge Mapping
```typescript
const statusConfig = {
  PENDING: { label: "Pending", variant: "warning", color: "yellow" },
  PAID: { label: "Paid", variant: "success", color: "green" },
  CANCELLED: { label: "Cancelled", variant: "destructive", color: "red" },
  REFUNDED: { label: "Refunded", variant: "secondary", color: "gray" }
};
```

### Example Transform
```typescript
// API Response
const apiBooking = {
  id: 1,
  customer: {
    fullName: "John Doe",
    email: "john@example.com",
    avatar: null
  },
  tour: { name: "Alpine Adventure" },
  bookingDate: "2025-01-15",
  amount: 450.00,
  status: "PAID"
};

// Table Row
const tableRow = {
  customer: {
    name: "John Doe",
    email: "john@example.com",
    avatar: null, // Show initials "JD"
  },
  tour: "Alpine Adventure",
  date: "Jan 15, 2025",
  amount: "$450.00",
  status: {
    label: "Paid",
    variant: "success"
  }
};
```

---

## 4. Top Tours Mapping

### API → List Items

| API Field | UI Field | Transform |
|-----------|----------|-----------|
| `rank` | Rank number | Direct |
| `name` | Tour name | Direct |
| `revenue` | Revenue | `formatCurrency()` short form |
| `bookings` | Bookings count | `${value} bookings` |

### Example Transform
```typescript
// API Response
const apiTour = {
  rank: 1,
  name: "Alpine Adventure",
  revenue: 24500,
  bookings: 156
};

// UI Display
const tourItem = {
  rank: 1,
  name: "Alpine Adventure",
  revenue: "$24.5k",
  subtitle: "156 bookings"
};
```

---

## 5. Utility Functions

```typescript
// lib/formatters.ts

export function formatCurrency(
  value: number,
  currency = 'USD',
  short = false
): string {
  if (short) {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}m`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDate(date: string, format = 'MMM DD, YYYY'): string {
  return dayjs(date).format(format);
}

export function formatTrend(value: number, direction: 'up' | 'down'): string {
  const prefix = direction === 'up' ? '+' : '-';
  return `${prefix}${Math.abs(value)}%`;
}
```

---

## 6. Type Definitions

```typescript
// types/dashboard.ts

export interface DashboardStats {
  totalRevenue: StatCard;
  totalBookings: StatCard;
  activeTours: StatCard;
  newUsers: StatCard;
  lastUpdated: string;
}

export interface StatCard {
  value: number;
  currency?: string;
  trend: {
    value: number;
    direction: 'up' | 'down';
    comparison: string;
  };
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date: string;
}

export interface RecentBooking {
  id: number;
  customer: {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
  };
  tour: {
    id: number;
    name: string;
  };
  bookingDate: string;
  amount: number;
  currency: string;
  status: BookingStatus;
}

export interface TopTour {
  rank: number;
  id: number;
  name: string;
  coverImage?: string;
  revenue: number;
  currency: string;
  bookings: number;
}

export type BookingStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
```

---

## 7. Mock Data

```typescript
export const mockDashboardData = {
  stats: {
    totalRevenue: {
      value: 124500,
      currency: "USD",
      trend: { value: 12, direction: "up", comparison: "vs last month" }
    },
    totalBookings: {
      value: 1240,
      trend: { value: 8, direction: "up", comparison: "vs last month" }
    },
    activeTours: {
      value: 42,
      trend: { value: 3, direction: "up", comparison: "vs last month" }
    },
    newUsers: {
      value: 85,
      trend: { value: 5, direction: "up", comparison: "vs last month" }
    }
  },
  chartData: [
    { label: "Week 1", value: 2800, date: "2024-12-16" },
    { label: "Week 2", value: 3200, date: "2024-12-23" },
    { label: "Week 3", value: 2950, date: "2024-12-30" },
    { label: "Week 4", value: 3500, date: "2025-01-06" }
  ],
  recentBookings: [
    {
      id: 1,
      customer: { id: 10, fullName: "John Doe", email: "john@example.com" },
      tour: { id: 5, name: "Alpine Adventure" },
      bookingDate: "2025-01-15",
      amount: 450,
      currency: "USD",
      status: "PAID"
    }
  ],
  topTours: [
    { rank: 1, id: 5, name: "Alpine Adventure", revenue: 24500, currency: "USD", bookings: 156 }
  ]
};
```
