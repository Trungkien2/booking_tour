# Tours Overview - API Contract

## 1. Get Tours List

### Endpoint
```
GET /tours
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `8` | Items per page |
| `search` | string | No | - | Search by name, location |
| `sort` | string | No | `popular` | Sort field (popular, price_asc, price_desc, rating, newest) |
| `priceMin` | number | No | - | Minimum price filter |
| `priceMax` | number | No | - | Maximum price filter |
| `difficulty` | string | No | - | Difficulty level (easy, moderate, challenging) |
| `duration` | string | No | - | Duration filter (1-3, 4-7, 8+) |
| `location` | string | No | - | Location filter |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "id": 1,
        "name": "Bali Island Escape",
        "slug": "bali-island-escape",
        "summary": "Experience the magic of Bali with this all-inclusive tour.",
        "coverImage": "https://example.com/images/bali.jpg",
        "images": [
          "https://example.com/images/bali-1.jpg",
          "https://example.com/images/bali-2.jpg"
        ],
        "durationDays": 5,
        "priceAdult": 899,
        "priceChild": 599,
        "location": "Bali, Indonesia",
        "ratingAverage": 4.8,
        "reviewCount": 124,
        "difficulty": "easy",
        "featured": true,
        "nextAvailableDate": "2025-02-15"
      },
      {
        "id": 2,
        "name": "Paris City of Lights",
        "slug": "paris-city-of-lights",
        "summary": "Discover the romantic streets of Paris.",
        "coverImage": "https://example.com/images/paris.jpg",
        "durationDays": 4,
        "priceAdult": 1200,
        "priceChild": 800,
        "location": "Paris, France",
        "ratingAverage": 4.5,
        "reviewCount": 89,
        "difficulty": "easy",
        "featured": false,
        "nextAvailableDate": "2025-01-28"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 8,
      "total": 42,
      "totalPages": 6,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Empty Response (200)
```json
{
  "success": true,
  "data": {
    "tours": [],
    "pagination": {
      "page": 1,
      "limit": 8,
      "total": 0,
      "totalPages": 0,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "message": "No tours found matching your criteria"
}
```

---

## 2. Get Featured Tours

### Endpoint
```
GET /tours/featured
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | `4` | Number of featured tours |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "id": 1,
        "name": "Bali Island Escape",
        "slug": "bali-island-escape",
        "coverImage": "https://...",
        "priceAdult": 899,
        "ratingAverage": 4.8,
        "location": "Bali, Indonesia"
      }
    ]
  }
}
```

---

## 3. Get Popular Destinations

### Endpoint
```
GET /destinations/popular
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "destinations": [
      {
        "id": 1,
        "name": "Bali",
        "country": "Indonesia",
        "image": "https://...",
        "tourCount": 15
      },
      {
        "id": 2,
        "name": "Paris",
        "country": "France",
        "image": "https://...",
        "tourCount": 12
      }
    ]
  }
}
```

---

## 4. Search Suggestions

### Endpoint
```
GET /tours/suggestions
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 2 chars) |
| `limit` | number | No | Max suggestions (default: 5) |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "tour",
        "id": 1,
        "name": "Bali Island Escape",
        "slug": "bali-island-escape"
      },
      {
        "type": "destination",
        "name": "Bali, Indonesia"
      }
    ]
  }
}
```

---

## 5. Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Invalid query parameters",
    "details": [
      {
        "field": "page",
        "message": "Page must be a positive integer"
      }
    ]
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "An error occurred while fetching tours"
  }
}
```

---

## 6. Error Code Reference

| Code | HTTP Status | Description | UI Action |
|------|-------------|-------------|-----------|
| `INVALID_PARAMS` | 400 | Invalid query params | Reset filters |
| `SERVER_ERROR` | 500 | Server error | Show retry button |
