# 05. API Contract

> Mechanically and clearly defines API request/response specifications.
> Essential for AI to accurately implement data types, nullable fields, and error handling.

---

## Document Information

| Item         | Value                           |
| ------------ | ------------------------------- |
| Project Name | `{{PROJECT_NAME}}`              |
| API Version  | v1                              |
| Base URL     | `https://api.{{domain}}.com/v1` |

---

## 1. Common Rules

### 1.1 Request Headers

```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
X-Request-ID: {uuid}  # For tracking
```

### 1.2 Response Format

#### Success Response (Single)

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string; // ISO 8601
}
```

#### Success Response (List)

```typescript
interface ApiListResponse<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}
```

#### Error Response

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string; // Error code (e.g., AUTH001)
    message: string; // User-friendly message
    field?: string; // Field name on validation failure
    details?: object; // Detailed information (for development)
  };
  timestamp: string;
}
```

### 1.3 HTTP Status Codes

| Code | Meaning           | Frontend Handling                |
| ---- | ----------------- | -------------------------------- |
| 200  | Success           | Normal rendering                 |
| 201  | Created           | Success toast + redirect         |
| 204  | Deleted           | Success toast + list refresh     |
| 400  | Bad Request       | Inline error display             |
| 401  | Unauthorized      | Redirect to login page           |
| 403  | Forbidden         | Show 403 page                    |
| 404  | Not Found         | Show 404 page                    |
| 422  | Validation Failed | Field-specific error display     |
| 429  | Rate Limit        | "Please try again later" message |
| 500  | Server Error      | Error toast + retry button       |

### 1.4 Pagination

```http
GET /resource?page=1&limit=20&sort=created_at&order=desc
```

| Parameter | Type   | Default    | Max       |
| --------- | ------ | ---------- | --------- |
| page      | number | 1          | -         |
| limit     | number | 20         | 100       |
| sort      | string | created_at | -         |
| order     | enum   | desc       | asc, desc |

---

## 2. API Endpoint Specifications

### Template Format

```yaml
# ============================================================
# API: {{API_NAME}}
# ============================================================

endpoint:
  id: 'API-001'
  method: 'GET' # GET | POST | PUT | PATCH | DELETE
  path: '/api/{{resource}}'
  description: '{{API Description}}'
  auth_required: true
  allowed_roles: ['J', 'C', 'M']

# --- Request Parameters ---
request:
  path_params: # URL path parameters
    - name: 'id'
      type: 'string'
      format: 'uuid'
      required: true
      description: 'Resource unique ID'

  query_params: # Query parameters
    - name: 'status'
      type: 'enum'
      values: ['draft', 'confirmed', 'revision_requested']
      required: false
      default: null
      description: 'Status filter'

    - name: 'page'
      type: 'number'
      required: false
      default: 1
      min: 1

  body: # Request body (POST/PUT/PATCH)
    type: 'object'
    required_fields: ['email', 'password']
    fields:
      - name: 'email'
        type: 'string'
        format: 'email'
        required: true
        max_length: 255
        description: 'User email'

      - name: 'password'
        type: 'string'
        required: true
        min_length: 8
        max_length: 100
        description: 'Password'

# --- Response Spec ---
response:
  success:
    status_code: 200
    type: 'object'
    fields:
      - name: 'id'
        type: 'string'
        format: 'uuid'
        nullable: false
        description: 'Resource ID'

      - name: 'name'
        type: 'string'
        nullable: false
        max_length: 100

      - name: 'description'
        type: 'string'
        nullable: true # ⭐ nullable must be specified
        description: 'Description (may be absent)'

      - name: 'status'
        type: 'enum'
        values: ['draft', 'confirmed']
        nullable: false

      - name: 'created_at'
        type: 'string'
        format: 'datetime' # ISO 8601
        nullable: false

      - name: 'updated_at'
        type: 'string'
        format: 'datetime'
        nullable: false

      - name: 'assignee' # Nested object
        type: 'object'
        nullable: true # null when unassigned
        fields:
          - name: 'id'
            type: 'string'
          - name: 'name'
            type: 'string'
          - name: 'email'
            type: 'string'

# --- Error Cases ---
errors:
  - code: 'AUTH001'
    status: 401
    message: 'Email or password is incorrect'
    frontend_action: 'show_inline_error'

  - code: 'USER002'
    status: 409
    message: 'Email already registered'
    frontend_action: 'show_field_error'
    field: 'email'

  - code: 'GEN500'
    status: 500
    message: 'Server error occurred'
    frontend_action: 'show_toast_retry'

# --- Examples ---
examples:
  request:
    url: '/api/users?page=1&limit=20&status=active'
    body: |
      {
        "email": "user@example.com",
        "password": "password123!"
      }

  response_success: |
    {
      "success": true,
      "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "description": null,
        "status": "draft",
        "created_at": "2025-12-15T10:00:00Z",
        "updated_at": "2025-12-15T10:00:00Z",
        "assignee": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      },
      "timestamp": "2025-12-15T10:00:00Z"
    }

  response_error: |
    {
      "success": false,
      "error": {
        "code": "AUTH001",
        "message": "Email or password is incorrect"
      },
      "timestamp": "2025-12-15T10:00:00Z"
    }
```

---

## 3. Complete Error Code List

```typescript
// ⭐ Define all error codes and frontend handling methods.

export const ERROR_CODES = {
  // Authentication (AUTH)
  AUTH001: {
    message: 'Email or password is incorrect',
    status: 401,
    action: 'clear_password_focus',
  },
  AUTH002: {
    message: 'Please change your initial password',
    status: 401,
    action: 'redirect:/password-reset',
  },
  AUTH003: {
    message: 'Session expired',
    status: 401,
    action: 'redirect:/login',
  },

  // User (USER)
  USER001: {
    message: 'User not found',
    status: 404,
    action: 'show_toast',
  },
  USER002: {
    message: 'Email already registered',
    status: 409,
    action: 'show_field_error:email',
  },
  USER004: {
    message: 'No permission for this operation',
    status: 403,
    action: 'redirect:/403',
  },

  // Resource (RESOURCE)
  RES001: {
    message: 'Resource not found',
    status: 404,
    action: 'redirect:/404',
  },
  RES002: {
    message: 'Item already confirmed',
    status: 409,
    action: 'show_toast:warning',
  },

  // Validation (VALIDATION)
  VAL001: {
    message: 'Please check input values',
    status: 422,
    action: 'show_field_errors',
  },

  // Server (SERVER)
  GEN500: {
    message: 'Server error occurred',
    status: 500,
    action: 'show_toast:error:retry',
  },
} as const;
```

---

## 4. TypeScript Type Definitions

```typescript
// ⭐ Define types for frontend use, enabling auto-generation.

// === Common Types ===
export type UUID = string;
export type ISODateTime = string;

// === User Type ===
export interface User {
  id: UUID;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  department: string | null; // ⭐ nullable specified
  position: string | null;
  is_active: boolean;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// === List Response Type ===
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: ISODateTime;
}

// === Error Response Type ===
export interface ErrorResponse {
  success: false;
  error: {
    code: keyof typeof ERROR_CODES;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  };
  timestamp: ISODateTime;
}
```

---

## Checklist

Check when API Contract is complete:

- [ ] `type` specified for all fields
- [ ] `nullable: true` specified for nullable fields
- [ ] All possible `values` listed for enum fields
- [ ] `frontend_action` defined for all error codes
- [ ] Request/response example JSON included
- [ ] TypeScript types defined
