# Registration Screen - Resource Mapper

## 1. Request Mapping (UI → API)

### Registration Form → POST /auth/register

| UI Field | UI Type | API Field | API Type | Transform | Notes |
|----------|---------|-----------|----------|-----------|-------|
| Full Name | `string` | `fullName` | `string` | `trim()` | Remove extra spaces |
| Email | `string` | `email` | `string` | `trim().toLowerCase()` | Normalize email |
| Phone | `string` | `phone` | `string` | `formatPhone()` | Include country code |
| Country | `string` | `country` | `string` | None | ISO code (US, VN) |
| Password | `string` | `password` | `string` | None | Send as-is |
| Confirm Password | `string` | - | - | - | Not sent to API |

### Example Transform
```typescript
// UI Form Data
const formData = {
  fullName: "  Jane Doe  ",
  email: "Jane@Example.COM",
  phone: "912345678",
  country: "VN",
  password: "Password123!",
  confirmPassword: "Password123!",
  agreeTerms: true
};

// API Request Body
const requestBody = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "+84912345678",
  country: "VN",
  password: "Password123!"
};
```

---

## 2. Response Mapping (API → UI)

### POST /auth/register Response

| API Field | API Type | UI Action | Notes |
|-----------|----------|-----------|-------|
| `data.user` | `object` | Store in memory | For success message |
| `data.message` | `string` | Display toast | Success notification |
| `data.accessToken` | `string?` | Store in auth | If auto-login enabled |
| `data.refreshToken` | `string?` | Store in auth | If auto-login enabled |

### Example Transform
```typescript
// API Response (no auto-login)
const apiResponse = {
  success: true,
  data: {
    user: {
      id: 1,
      email: "jane@example.com",
      fullName: "Jane Doe"
    },
    message: "Account created successfully"
  }
};

// UI Actions
showToast("success", "Account created successfully");
redirect("/login");
```

---

## 3. Countries List Mapping

### GET /api/countries Response → Dropdown Options

| API Field | UI Component | Transform |
|-----------|--------------|-----------|
| `data[].code` | `option.value` | None |
| `data[].name` | `option.label` | None |
| `data[].dialCode` | Phone prefix | Auto-update |
| `data[].flag` | `option.icon` | Display emoji |

### Example
```typescript
// API Response
const countries = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" }
];

// Select Options
const options = countries.map(c => ({
  value: c.code,
  label: `${c.flag} ${c.name}`,
  dialCode: c.dialCode
}));
```

---

## 4. Error Mapping

| API Error Code | HTTP | UI Display | Field Highlight |
|----------------|------|------------|-----------------|
| `VALIDATION_ERROR` | 400 | Inline errors | Specific fields |
| `EMAIL_EXISTS` | 409 | Toast + suggestion | Email field |
| `WEAK_PASSWORD` | 400 | Inline error | Password field |
| `SERVER_ERROR` | 500 | Toast error | None |

---

## 5. Validation Schema

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[0-9]{10,15}$/.test(val),
      'Please enter a valid phone number'
    ),

  country: z.string().optional(),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),

  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),

  agreeTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
```

---

## 6. Password Strength Calculator

```typescript
export function calculatePasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  color: string;
  label: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score, level: 'weak', color: 'red', label: 'Weak' };
  } else if (score <= 4) {
    return { score, level: 'medium', color: 'yellow', label: 'Medium Strength' };
  } else {
    return { score, level: 'strong', color: 'green', label: 'Strong' };
  }
}
```

---

## 7. Type Definitions

```typescript
// types/auth.ts

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
}

export interface RegisterResponse {
  success: true;
  data: {
    user: {
      id: number;
      email: string;
      fullName: string;
      role: string;
      createdAt: string;
    };
    message: string;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
```

---

## 8. Mock Data

```typescript
export const mockRegisterSuccess = {
  success: true,
  data: {
    user: {
      id: 1,
      email: "jane@example.com",
      fullName: "Jane Doe",
      role: "USER",
      createdAt: "2025-01-15T10:30:00Z"
    },
    message: "Account created successfully. Please log in."
  }
};

export const mockCountries = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" }
];
```
