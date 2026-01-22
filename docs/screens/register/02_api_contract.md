# Registration Screen - API Contract

## 1. Register New User

### Endpoint
```
POST /auth/register
```

### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "fullName": "string (required, min 2 chars)",
  "email": "string (required, email format)",
  "password": "string (required, min 8 chars)",
  "phone": "string (optional)",
  "country": "string (optional, ISO country code)"
}
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "phone": "+1234567890",
      "role": "USER",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "message": "Account created successfully. Please log in."
  }
}
```

### Alternative: Auto-login Response (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "phone": "+1234567890",
      "role": "USER"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

#### 409 Conflict - Email Already Exists
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

---

## 2. Check Email Availability

### Endpoint
```
GET /auth/check-email?email={email}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

### Email Taken Response (200)
```json
{
  "success": true,
  "data": {
    "available": false,
    "message": "This email is already registered"
  }
}
```

---

## 3. Social Registration (Google)

### Endpoint
```
POST /auth/google
```

### Request Body
```json
{
  "idToken": "string (Google ID token)"
}
```

### Success Response (200/201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@gmail.com",
      "fullName": "Jane Doe",
      "role": "USER"
    },
    "accessToken": "...",
    "refreshToken": "...",
    "isNewUser": true
  }
}
```

---

## 4. Get Countries List

### Endpoint
```
GET /api/countries
```

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "code": "US",
      "name": "United States",
      "dialCode": "+1",
      "flag": "🇺🇸"
    },
    {
      "code": "VN",
      "name": "Vietnam",
      "dialCode": "+84",
      "flag": "🇻🇳"
    }
  ]
}
```

---

## 5. Error Code Reference

| Code | HTTP Status | Description | UI Action |
|------|-------------|-------------|-----------|
| `VALIDATION_ERROR` | 400 | Invalid input data | Show field errors |
| `EMAIL_EXISTS` | 409 | Email already registered | Show error, suggest login |
| `WEAK_PASSWORD` | 400 | Password too weak | Show password requirements |
| `INVALID_PHONE` | 400 | Invalid phone format | Show phone format hint |
| `SERVER_ERROR` | 500 | Server error | Show generic error |
