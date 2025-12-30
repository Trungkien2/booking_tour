# Login Screen - Resource Mapper

## 1. Request Mapping (UI → API)

### Login Form → POST /auth/login

| UI Field | UI Type | API Field | API Type | Transform | Notes |
|----------|---------|-----------|----------|-----------|-------|
| Email | `string` | `email` | `string` | `trim().toLowerCase()` | Trim whitespace, lowercase |
| Password | `string` | `password` | `string` | None | Send as-is |

### Example Transform
```typescript
// UI Form Data
const formData = {
  email: "  User@Example.com  ",
  password: "password123"
};

// API Request Body
const requestBody = {
  email: "user@example.com",  // trimmed + lowercased
  password: "password123"
};
```

---

## 2. Response Mapping (API → UI)

### POST /auth/login Response → Auth Store

| API Field | API Type | Store Field | Store Type | Transform | Notes |
|-----------|----------|-------------|------------|-----------|-------|
| `data.user.id` | `number` | `user.id` | `number` | None | |
| `data.user.email` | `string` | `user.email` | `string` | None | |
| `data.user.fullName` | `string` | `user.fullName` | `string` | None | |
| `data.user.phone` | `string \| null` | `user.phone` | `string \| null` | None | |
| `data.user.role` | `string` | `user.role` | `Role` | Type cast | "USER" \| "ADMIN" \| "GUIDE" |
| `data.accessToken` | `string` | `accessToken` | `string` | None | |
| `data.refreshToken` | `string` | `refreshToken` | `string` | None | |

### Example Transform
```typescript
// API Response
const apiResponse = {
  success: true,
  data: {
    user: {
      id: 1,
      email: "user@example.com",
      fullName: "John Doe",
      phone: "+1234567890",
      role: "USER"
    },
    accessToken: "eyJ...",
    refreshToken: "eyJ..."
  }
};

// Auth Store State
const authState = {
  user: {
    id: 1,
    email: "user@example.com",
    fullName: "John Doe",
    phone: "+1234567890",
    role: "USER" as Role
  },
  accessToken: "eyJ...",
  refreshToken: "eyJ...",
  isAuthenticated: true
};
```

---

## 3. Error Mapping (API → UI)

### Error Response → Form Errors

| API Error Code | HTTP Status | UI Display | Field Highlight |
|----------------|-------------|------------|-----------------|
| `VALIDATION_ERROR` | 400 | Inline field errors | Specific fields |
| `INVALID_CREDENTIALS` | 401 | Toast: "Email or password is incorrect" | Both fields |
| `ACCOUNT_DISABLED` | 403 | Alert: "Your account has been disabled" | None |
| `TOO_MANY_ATTEMPTS` | 429 | Toast: "Too many attempts. Try again later." | None |
| `SERVER_ERROR` | 500 | Toast: "Something went wrong. Please try again." | None |

### Example Error Transform
```typescript
// API Error Response
const apiError = {
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: [
      { field: "email", message: "Email is required" },
      { field: "password", message: "Password must be at least 6 characters" }
    ]
  }
};

// UI Form Errors (react-hook-form)
const formErrors = {
  email: { message: "Email is required" },
  password: { message: "Password must be at least 6 characters" }
};
```

---

## 4. Validation Rules

### Client-Side Validation (Zod Schema)
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

---

## 5. Mock Data

### Mock Success Response
```typescript
export const mockLoginSuccess = {
  success: true,
  data: {
    user: {
      id: 1,
      email: "demo@example.com",
      fullName: "Demo User",
      phone: "+1234567890",
      role: "USER"
    },
    accessToken: "mock_access_token_123",
    refreshToken: "mock_refresh_token_456"
  }
};
```

### Mock Error Response
```typescript
export const mockLoginError = {
  success: false,
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Email or password is incorrect"
  }
};
```

---

## 6. Type Definitions

```typescript
// types/auth.ts

export type Role = 'USER' | 'ADMIN' | 'GUIDE';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
```
