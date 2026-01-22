# Login Screen - API Contract

## 1. Login with Email/Password

### Endpoint
```
POST /auth/login
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
  "email": "string (required, email format)",
  "password": "string (required, min 6 chars)"
}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "+1234567890",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
      }
    ]
  }
}
```

#### 401 Unauthorized - Invalid Credentials
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

#### 403 Forbidden - Account Disabled
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_DISABLED",
    "message": "Your account has been disabled. Please contact support."
  }
}
```

---

## 2. Social Login (Google)

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

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@gmail.com",
      "fullName": "John Doe",
      "role": "USER"
    },
    "accessToken": "...",
    "refreshToken": "...",
    "isNewUser": false
  }
}
```

---

## 3. Social Login (Apple)

### Endpoint
```
POST /auth/apple
```

### Request Body
```json
{
  "idToken": "string (Apple ID token)",
  "user": {
    "name": {
      "firstName": "string (optional)",
      "lastName": "string (optional)"
    }
  }
}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@privaterelay.appleid.com",
      "fullName": "John Doe",
      "role": "USER"
    },
    "accessToken": "...",
    "refreshToken": "...",
    "isNewUser": false
  }
}
```

---

## 4. Error Code Reference

| Code | HTTP Status | Description | UI Action |
|------|-------------|-------------|-----------|
| `VALIDATION_ERROR` | 400 | Invalid input data | Show field errors |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password | Show error toast |
| `ACCOUNT_DISABLED` | 403 | Account is disabled | Show error message |
| `ACCOUNT_NOT_VERIFIED` | 403 | Email not verified | Show verify prompt |
| `TOO_MANY_ATTEMPTS` | 429 | Rate limited | Show retry message |
| `SERVER_ERROR` | 500 | Server error | Show generic error |
