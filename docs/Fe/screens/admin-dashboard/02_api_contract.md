# Admin Dashboard - API Contract

## 1. Get Dashboard Statistics

### Endpoint
```
GET /admin/dashboard/stats
```

### Request Headers
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | `month` | Comparison period (week, month, year) |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "totalRevenue": {
      "value": 124500,
      "currency": "USD",
      "trend": {
        "value": 12,
        "direction": "up",
        "comparison": "vs last month"
      }
    },
    "totalBookings": {
      "value": 1240,
      "trend": {
        "value": 8,
        "direction": "up",
        "comparison": "vs last month"
      }
    },
    "activeTours": {
      "value": 42,
      "trend": {
        "value": 3,
        "direction": "up",
        "comparison": "vs last month"
      }
    },
    "newUsers": {
      "value": 85,
      "trend": {
        "value": 5,
        "direction": "up",
        "comparison": "vs last month"
      }
    },
    "lastUpdated": "2025-01-15T10:30:00Z"
  }
}
```

---

## 2. Get Revenue Trend

### Endpoint
```
GET /admin/dashboard/revenue-trend
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | `30d` | Time period (7d, 30d, 90d, 1y) |
| `granularity` | string | No | `week` | Data granularity (day, week, month) |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 12450,
      "currency": "USD",
      "trend": {
        "value": 9.8,
        "direction": "up",
        "comparison": "Last 30 Days"
      }
    },
    "chartData": [
      {
        "label": "Week 1",
        "value": 2800,
        "date": "2024-12-16"
      },
      {
        "label": "Week 2",
        "value": 3200,
        "date": "2024-12-23"
      },
      {
        "label": "Week 3",
        "value": 2950,
        "date": "2024-12-30"
      },
      {
        "label": "Week 4",
        "value": 3500,
        "date": "2025-01-06"
      }
    ]
  }
}
```

---

## 3. Get Recent Bookings

### Endpoint
```
GET /admin/dashboard/recent-bookings
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | `5` | Number of bookings to return |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1,
        "customer": {
          "id": 10,
          "fullName": "John Doe",
          "email": "john@example.com",
          "avatar": "https://..."
        },
        "tour": {
          "id": 5,
          "name": "Alpine Adventure"
        },
        "bookingDate": "2025-01-15",
        "amount": 450.00,
        "currency": "USD",
        "status": "PAID"
      },
      {
        "id": 2,
        "customer": {
          "id": 11,
          "fullName": "Jane Smith",
          "email": "jane@example.com"
        },
        "tour": {
          "id": 8,
          "name": "Beach Paradise"
        },
        "bookingDate": "2025-01-14",
        "amount": 680.00,
        "currency": "USD",
        "status": "PENDING"
      }
    ],
    "total": 1240
  }
}
```

---

## 4. Get Top Performing Tours

### Endpoint
```
GET /admin/dashboard/top-tours
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | `5` | Number of tours to return |
| `period` | string | No | `month` | Time period (week, month, year) |
| `sortBy` | string | No | `revenue` | Sort by (revenue, bookings) |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "rank": 1,
        "id": 5,
        "name": "Alpine Adventure",
        "coverImage": "https://...",
        "revenue": 24500,
        "currency": "USD",
        "bookings": 156
      },
      {
        "rank": 2,
        "id": 8,
        "name": "Beach Paradise",
        "coverImage": "https://...",
        "revenue": 18200,
        "currency": "USD",
        "bookings": 124
      }
    ]
  }
}
```

---

## 5. Combined Dashboard Data

### Endpoint
```
GET /admin/dashboard
```

### Description
Returns all dashboard data in a single request for initial load optimization.

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "stats": { /* Same as /stats response */ },
    "revenueTrend": { /* Same as /revenue-trend response */ },
    "recentBookings": { /* Same as /recent-bookings response */ },
    "topTours": { /* Same as /top-tours response */ },
    "lastUpdated": "2025-01-15T10:30:00Z"
  }
}
```

---

## 6. Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Please log in to access this resource"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access admin dashboard"
  }
}
```

---

## 7. Error Code Reference

| Code | HTTP Status | Description | UI Action |
|------|-------------|-------------|-----------|
| `UNAUTHORIZED` | 401 | Not logged in | Redirect to login |
| `FORBIDDEN` | 403 | Not admin role | Redirect to home |
| `SERVER_ERROR` | 500 | Server error | Show error message |
