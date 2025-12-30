# Tour Detail - API Contract

## 1. Get Tour by Slug

### Endpoint
```
GET /tours/{slug}
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Tour URL slug |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "3-Day Kayaking Adventure in Norway",
    "slug": "3-day-kayaking-adventure-norway",
    "summary": "Experience the breathtaking fjords of Norway on this unforgettable kayaking adventure.",
    "description": "Full HTML/Markdown description...",
    "coverImage": "https://example.com/images/norway-hero.jpg",
    "images": [
      "https://example.com/images/norway-1.jpg",
      "https://example.com/images/norway-2.jpg",
      "https://example.com/images/norway-3.jpg",
      "https://example.com/images/norway-4.jpg"
    ],
    "durationDays": 3,
    "priceAdult": 1200,
    "priceChild": 800,
    "location": "Bergen, Norway",
    "coordinates": {
      "lat": 60.3913,
      "lng": 5.3221
    },
    "ratingAverage": 4.8,
    "reviewCount": 47,
    "difficulty": "moderate",
    "maxGroupSize": 12,
    "highlights": [
      {
        "icon": "compass",
        "label": "Paddle through fjords"
      },
      {
        "icon": "sun",
        "label": "Scenic hiking"
      },
      {
        "icon": "users",
        "label": "Expert local guide"
      },
      {
        "icon": "mountain",
        "label": "Small groups (max 12)"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival & First Paddle",
        "description": "Meet at Bergen harbor at 9:00 AM..."
      },
      {
        "day": 2,
        "title": "Deep Fjord Exploration",
        "description": "Full day of kayaking..."
      },
      {
        "day": 3,
        "title": "Return & Farewell",
        "description": "Final morning paddle..."
      }
    ],
    "included": [
      "Professional kayaking guide",
      "All kayaking equipment",
      "Waterproof gear",
      "Meals during the tour",
      "Hotel transfers"
    ],
    "notIncluded": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Gratuities"
    ],
    "meetingPoint": {
      "name": "Bergen Harbor Pier 7",
      "address": "Bradbenken 5, 5003 Bergen, Norway",
      "coordinates": {
        "lat": 60.3943,
        "lng": 5.3259
      },
      "instructions": "Look for our guide with the orange kayak flag near the harbor master's office."
    },
    "cancellationPolicy": "Free cancellation up to 7 days before the tour. 50% refund for cancellations 3-7 days before.",
    "createdAt": "2024-06-15T10:00:00Z",
    "updatedAt": "2025-01-10T14:30:00Z"
  }
}
```

### Error Response (404)
```json
{
  "success": false,
  "error": {
    "code": "TOUR_NOT_FOUND",
    "message": "Tour not found"
  }
}
```

---

## 2. Get Tour Schedules

### Endpoint
```
GET /tours/{tourId}/schedules
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | string | No | today | Start date (ISO format) |
| `to` | string | No | +3 months | End date (ISO format) |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "schedules": [
      {
        "id": 101,
        "tourId": 1,
        "startDate": "2025-02-15T09:00:00Z",
        "maxCapacity": 12,
        "currentCapacity": 8,
        "availableSpots": 4,
        "status": "OPEN",
        "priceAdult": 1200,
        "priceChild": 800
      },
      {
        "id": 102,
        "tourId": 1,
        "startDate": "2025-02-22T09:00:00Z",
        "maxCapacity": 12,
        "currentCapacity": 12,
        "availableSpots": 0,
        "status": "SOLD_OUT",
        "priceAdult": 1200,
        "priceChild": 800
      },
      {
        "id": 103,
        "tourId": 1,
        "startDate": "2025-03-01T09:00:00Z",
        "maxCapacity": 12,
        "currentCapacity": 0,
        "availableSpots": 12,
        "status": "OPEN",
        "priceAdult": 1250,
        "priceChild": 850
      }
    ]
  }
}
```

---

## 3. Get Tour Reviews

### Endpoint
```
GET /tours/{tourId}/reviews
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `5` | Reviews per page |
| `sort` | string | No | `recent` | Sort order (recent, rating_desc, rating_asc) |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 47,
      "distribution": {
        "5": 35,
        "4": 8,
        "3": 3,
        "2": 1,
        "1": 0
      }
    },
    "reviews": [
      {
        "id": 1,
        "user": {
          "id": 10,
          "fullName": "Sarah Johnson",
          "avatar": "https://..."
        },
        "rating": 5,
        "comment": "Absolutely incredible experience! The fjords were breathtaking and our guide Erik was amazing.",
        "createdAt": "2025-01-10T14:30:00Z",
        "helpful": 12
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 47,
      "totalPages": 10,
      "hasNext": true
    }
  }
}
```

---

## 4. Check Availability

### Endpoint
```
POST /tours/schedules/{scheduleId}/check-availability
```

### Request Body
```json
{
  "adults": 2,
  "children": 1
}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "available": true,
    "scheduleId": 101,
    "requestedSpots": 3,
    "availableSpots": 4,
    "priceBreakdown": {
      "adults": {
        "count": 2,
        "unitPrice": 1200,
        "total": 2400
      },
      "children": {
        "count": 1,
        "unitPrice": 800,
        "total": 800
      },
      "subtotal": 3200,
      "taxes": 320,
      "total": 3520
    }
  }
}
```

### Unavailable Response (200)
```json
{
  "success": true,
  "data": {
    "available": false,
    "scheduleId": 101,
    "requestedSpots": 5,
    "availableSpots": 4,
    "message": "Only 4 spots available for this date"
  }
}
```

---

## 5. Error Code Reference

| Code | HTTP Status | Description | UI Action |
|------|-------------|-------------|-----------|
| `TOUR_NOT_FOUND` | 404 | Tour doesn't exist | Show 404 page |
| `SCHEDULE_NOT_FOUND` | 404 | Schedule doesn't exist | Show error |
| `SCHEDULE_SOLD_OUT` | 400 | No spots available | Disable booking |
| `INVALID_TRAVELERS` | 400 | Invalid traveler count | Show validation error |
