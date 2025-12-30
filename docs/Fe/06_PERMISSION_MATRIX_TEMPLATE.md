# 06. Permission Matrix

> Defines role-based access permissions and UI visibility rules.
> Essential for AI to accurately implement "who can do what."

---

## Document Information

| Item         | Value          |
| ------------ | -------------- |
| Project Name | `Booking Tour` |
| Version      | 1.0            |
| Date         | `2025-01-XX`   |

---

## 1. Role Definitions

### 1.1 Role System

```yaml
note: 'Role-based access control (RBAC) with 3 roles'
implementation: 'User.role field in database (enum: USER, ADMIN, GUIDE)'
storage: 'user.role in auth store'

roles:
  - name: 'USER'
    description: 'Regular customer who can browse and book tours'
    default: true

  - name: 'ADMIN'
    description: 'Administrator with full system access'
    default: false

  - name: 'GUIDE'
    description: 'Tour guide with limited access to assigned tours'
    default: false
```

### 1.2 Data Scope per Role

```yaml
data_scope:
  USER:
    tours: 'All published tours (read-only)'
    schedules: 'All open schedules (read-only)'
    bookings: 'Own bookings only'
    reviews: 'Own reviews only'
    payments: 'Own payments only'
    users: 'Own profile only'

  ADMIN:
    tours: 'All tours (full CRUD)'
    schedules: 'All schedules (full CRUD)'
    bookings: 'All bookings (read, update status)'
    reviews: 'All reviews (read, delete)'
    payments: 'All payments (read, process refunds)'
    users: 'All users (read, update role)'
    refunds: 'All refunds (full CRUD)'

  GUIDE:
    tours: 'Assigned tours only (read-only)'
    schedules: 'Assigned schedules only (read-only)'
    bookings: 'Assigned tour bookings (read travelers)'
    reviews: 'None'
    payments: 'None'
    users: 'Own profile only'
```

---

## 2. Page Access Permissions

### 2.1 Page Access Matrix

| Page                  | Path                  | USER | ADMIN | GUIDE | Anonymous |
| --------------------- | --------------------- | ---- | ----- | ----- | --------- |
| Home                  | `/`                   | ✅   | ✅    | ✅    | ✅        |
| Tour List             | `/tours`              | ✅   | ✅    | ✅    | ✅        |
| Tour Detail           | `/tours/[slug]`       | ✅   | ✅    | ✅    | ✅        |
| Login                 | `/login`              | ❌   | ❌    | ❌    | ✅        |
| Register              | `/register`           | ❌   | ❌    | ❌    | ✅        |
| My Bookings           | `/bookings`           | ✅   | ✅    | ✅    | ❌        |
| Booking Detail        | `/bookings/[id]`      | ✅   | ✅    | ✅    | ❌        |
| Profile               | `/profile`            | ✅   | ✅    | ✅    | ❌        |
| Admin Dashboard       | `/admin/dashboard`    | ❌   | ✅    | ❌    | ❌        |
| Admin Tours           | `/admin/tours`        | ❌   | ✅    | ❌    | ❌        |
| Admin Tour Create     | `/admin/tours/new`    | ❌   | ✅    | ❌    | ❌        |
| Admin Tour Edit       | `/admin/tours/[id]`   | ❌   | ✅    | ❌    | ❌        |
| Admin Bookings        | `/admin/bookings`     | ❌   | ✅    | ❌    | ❌        |
| Admin Users           | `/admin/users`        | ❌   | ✅    | ❌    | ❌        |
| Admin Refunds         | `/admin/refunds`      | ❌   | ✅    | ❌    | ❌        |
| Guide Dashboard       | `/guide/dashboard`    | ❌   | ❌    | ✅    | ❌        |
| Guide Tours           | `/guide/tours`        | ❌   | ❌    | ✅    | ❌        |

### 2.2 Route Protection Configuration

```typescript
// Route protection configuration
const routeConfig = {
  public: ['/', '/tours', '/tours/[slug]', '/login', '/register'],

  authenticated: ['/bookings', '/bookings/[id]', '/profile'],

  admin: [
    '/admin',
    '/admin/dashboard',
    '/admin/tours',
    '/admin/tours/new',
    '/admin/tours/[id]',
    '/admin/bookings',
    '/admin/users',
    '/admin/refunds',
  ],

  guide: ['/guide', '/guide/dashboard', '/guide/tours'],
};
```

### 2.3 Navigation Menu Visibility

```yaml
navigation:
  # Main Navigation (all authenticated users)
  main:
    - menu_id: 'tours'
      label: 'Tours'
      path: '/tours'
      visible_to: ['USER', 'ADMIN', 'GUIDE', 'ANONYMOUS']

    - menu_id: 'my_bookings'
      label: 'My Bookings'
      path: '/bookings'
      visible_to: ['USER', 'ADMIN', 'GUIDE']

    - menu_id: 'profile'
      label: 'Profile'
      path: '/profile'
      visible_to: ['USER', 'ADMIN', 'GUIDE']

  # Admin Sidebar
  admin:
    - menu_id: 'dashboard'
      label: 'Dashboard'
      path: '/admin/dashboard'
      icon: 'LayoutDashboard'
      visible_to: ['ADMIN']

    - menu_id: 'tours'
      label: 'Tours'
      path: '/admin/tours'
      icon: 'Map'
      visible_to: ['ADMIN']

    - menu_id: 'bookings'
      label: 'Bookings'
      path: '/admin/bookings'
      icon: 'Calendar'
      visible_to: ['ADMIN']

    - menu_id: 'users'
      label: 'Users'
      path: '/admin/users'
      icon: 'Users'
      visible_to: ['ADMIN']

    - menu_id: 'refunds'
      label: 'Refunds'
      path: '/admin/refunds'
      icon: 'RefreshCcw'
      visible_to: ['ADMIN']

  # Guide Sidebar
  guide:
    - menu_id: 'dashboard'
      label: 'Dashboard'
      path: '/guide/dashboard'
      icon: 'LayoutDashboard'
      visible_to: ['GUIDE']

    - menu_id: 'my_tours'
      label: 'My Tours'
      path: '/guide/tours'
      icon: 'Map'
      visible_to: ['GUIDE']
```

---

## 3. Feature Permission Matrix

### 3.1 Tour Permissions

| Action            | USER | ADMIN | GUIDE |
| ----------------- | ---- | ----- | ----- |
| View tour list    | ✅   | ✅    | ✅    |
| View tour detail  | ✅   | ✅    | ✅    |
| Create tour       | ❌   | ✅    | ❌    |
| Update tour       | ❌   | ✅    | ❌    |
| Delete tour       | ❌   | ✅    | ❌    |
| Upload images     | ❌   | ✅    | ❌    |

### 3.2 Schedule Permissions

| Action              | USER | ADMIN | GUIDE |
| ------------------- | ---- | ----- | ----- |
| View schedules      | ✅   | ✅    | ✅    |
| Create schedule     | ❌   | ✅    | ❌    |
| Update schedule     | ❌   | ✅    | ❌    |
| Delete schedule     | ❌   | ✅    | ❌    |
| Close schedule      | ❌   | ✅    | ❌    |
| View capacity       | ✅   | ✅    | ✅    |

### 3.3 Booking Permissions

| Action                | USER         | ADMIN | GUIDE        |
| --------------------- | ------------ | ----- | ------------ |
| Create booking        | ✅           | ✅    | ❌           |
| View own bookings     | ✅           | ✅    | ✅           |
| View all bookings     | ❌           | ✅    | ❌           |
| View booking detail   | Own only     | ✅    | Assigned     |
| Cancel own booking    | ✅ (pending) | ✅    | ❌           |
| Update booking status | ❌           | ✅    | ❌           |
| View travelers        | Own only     | ✅    | Assigned     |

### 3.4 Payment & Refund Permissions

| Action               | USER     | ADMIN | GUIDE |
| -------------------- | -------- | ----- | ----- |
| Make payment         | ✅       | ❌    | ❌    |
| View own payments    | ✅       | ✅    | ❌    |
| View all payments    | ❌       | ✅    | ❌    |
| Initiate refund      | ❌       | ✅    | ❌    |
| Process refund       | ❌       | ✅    | ❌    |
| View refund status   | Own only | ✅    | ❌    |

### 3.5 Review Permissions

| Action             | USER     | ADMIN | GUIDE |
| ------------------ | -------- | ----- | ----- |
| Create review      | ✅       | ❌    | ❌    |
| View reviews       | ✅       | ✅    | ✅    |
| Update own review  | ✅       | ❌    | ❌    |
| Delete own review  | ✅       | ✅    | ❌    |
| Delete any review  | ❌       | ✅    | ❌    |

### 3.6 User Management Permissions

| Action           | USER     | ADMIN | GUIDE    |
| ---------------- | -------- | ----- | -------- |
| View own profile | ✅       | ✅    | ✅       |
| Update profile   | Own only | ✅    | Own only |
| View all users   | ❌       | ✅    | ❌       |
| Update user role | ❌       | ✅    | ❌       |
| Delete user      | ❌       | ✅    | ❌       |

---

## 4. UI Element Visibility Rules

### 4.1 Button Visibility Matrix

```yaml
button_visibility:
  # Tour List Page
  tour_list_page:
    create_tour_button:
      visible_to: ['ADMIN']
      location: 'header'

  # Tour Detail Page
  tour_detail_page:
    book_now_button:
      visible_to: ['USER', 'ADMIN', 'GUIDE']
      enabled_condition: 'isAuthenticated && hasAvailableSchedule'

    edit_tour_button:
      visible_to: ['ADMIN']
      location: 'header'

    delete_tour_button:
      visible_to: ['ADMIN']
      location: 'header'
      confirmation: true

  # Booking List Page
  booking_list_page:
    cancel_booking_button:
      visible_to: ['USER', 'ADMIN']
      enabled_condition: "booking.status === 'PENDING'"

    view_all_bookings_toggle:
      visible_to: ['ADMIN']

  # Booking Detail Page
  booking_detail_page:
    cancel_button:
      visible_to: ['USER', 'ADMIN']
      enabled_condition: "booking.status === 'PENDING'"

    process_refund_button:
      visible_to: ['ADMIN']
      enabled_condition: "booking.status === 'PAID'"

    update_status_dropdown:
      visible_to: ['ADMIN']

  # Review Section
  review_section:
    write_review_button:
      visible_to: ['USER']
      enabled_condition: 'hasCompletedBooking && !hasReviewed'

    delete_review_button:
      visible_to: ['ADMIN']

  # Admin Pages
  admin_tour_page:
    create_button:
      visible_to: ['ADMIN']

    edit_button:
      visible_to: ['ADMIN']

    delete_button:
      visible_to: ['ADMIN']
      confirmation: true

  admin_user_page:
    change_role_button:
      visible_to: ['ADMIN']
      enabled_condition: 'user.id !== currentUser.id'
```

### 4.2 Form Field Visibility

```yaml
field_visibility:
  # Booking Form
  booking_form:
    - field: 'travelers'
      visible_to: ['USER', 'ADMIN', 'GUIDE']
      editable_by: ['USER']

    - field: 'note'
      visible_to: ['USER', 'ADMIN', 'GUIDE']
      editable_by: ['USER', 'ADMIN']

    - field: 'status'
      visible_to: ['ADMIN']
      editable_by: ['ADMIN']

  # User Profile Form
  profile_form:
    - field: 'email'
      visible_to: ['USER', 'ADMIN', 'GUIDE']
      editable_by: [] # Read-only

    - field: 'fullName'
      visible_to: ['USER', 'ADMIN', 'GUIDE']
      editable_by: ['USER', 'ADMIN', 'GUIDE']

    - field: 'phone'
      visible_to: ['USER', 'ADMIN', 'GUIDE']
      editable_by: ['USER', 'ADMIN', 'GUIDE']

    - field: 'role'
      visible_to: ['ADMIN']
      editable_by: ['ADMIN']
```

---

## 5. Permission Check Implementation

### 5.1 Role Check Hook

```typescript
// hooks/use-role.ts
import { useAuthStore } from '@/stores/auth.store';

type Role = 'USER' | 'ADMIN' | 'GUIDE';

export function useRole() {
  const { user, isAuthenticated } = useAuthStore();

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!isAuthenticated || !user) return false;

    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }

    return user.role === roles;
  };

  const isAdmin = user?.role === 'ADMIN';
  const isGuide = user?.role === 'GUIDE';
  const isUser = user?.role === 'USER';

  return {
    role: user?.role,
    hasRole,
    isAdmin,
    isGuide,
    isUser,
    isAuthenticated,
  };
}
```

### 5.2 Role Guard Component

```typescript
// components/common/role-guard.tsx
'use client';

import { useRole } from '@/hooks/use-role';
import { redirect } from 'next/navigation';

type Role = 'USER' | 'ADMIN' | 'GUIDE';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback,
  redirectTo,
}: RoleGuardProps) {
  const { hasRole, isAuthenticated } = useRole();

  if (!isAuthenticated) {
    if (redirectTo) {
      redirect(redirectTo);
    }
    return fallback || null;
  }

  if (!hasRole(allowedRoles)) {
    if (redirectTo) {
      redirect(redirectTo);
    }
    return fallback || null;
  }

  return <>{children}</>;
}

// Usage Examples
<RoleGuard allowedRoles={['ADMIN']}>
  <AdminDashboard />
</RoleGuard>

<RoleGuard
  allowedRoles={['ADMIN', 'GUIDE']}
  fallback={<AccessDenied />}
>
  <TourManagement />
</RoleGuard>

<RoleGuard
  allowedRoles={['ADMIN']}
  redirectTo="/login"
>
  <AdminPage />
</RoleGuard>
```

### 5.3 Conditional Rendering Helper

```typescript
// components/common/can.tsx
'use client';

import { useRole } from '@/hooks/use-role';

type Role = 'USER' | 'ADMIN' | 'GUIDE';

interface CanProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ roles, children, fallback = null }: CanProps) {
  const { hasRole } = useRole();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Usage
<Can roles={['ADMIN']}>
  <Button onClick={handleDelete}>Delete Tour</Button>
</Can>

<Can roles={['USER']} fallback={<LoginPrompt />}>
  <Button onClick={handleBookNow}>Book Now</Button>
</Can>

<Can roles={['ADMIN', 'GUIDE']}>
  <ViewTravelersButton />
</Can>
```

---

## 6. Permission Error Handling

### 6.1 UX on Permission Denied

```yaml
permission_denied_ux:
  # Page access denied
  page_access_denied:
    behavior: 'redirect'
    redirect_to: '/login' # or '/' for anonymous
    toast_message: 'You do not have permission to access this page'
    toast_type: 'warning'

  # Button/action hidden
  action_hidden:
    behavior: 'hide'
    alternative: null

  # Button/action disabled
  action_disabled:
    behavior: 'disable'
    cursor: 'not-allowed'
    tooltip: 'You do not have permission to perform this action'

  # API 403 response
  api_403:
    toast_message: 'Permission denied'
    toast_type: 'error'
    action: 'Stay on page'
```

### 6.2 Middleware Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/', '/tours', '/login', '/register'];
const adminRoutes = ['/admin'];
const guideRoutes = ['/guide'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - always accessible
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('accessToken')?.value;

  // No token - redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token and extract role
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // Admin routes - check ADMIN role
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Guide routes - check GUIDE role
    if (guideRoutes.some((route) => pathname.startsWith(route))) {
      if (role !== 'GUIDE') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch {
    // Invalid token - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 7. Permission Constants

```typescript
// lib/constants/roles.ts
export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  GUIDE: 'GUIDE',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Role display names
export const ROLE_LABELS: Record<Role, string> = {
  USER: 'Customer',
  ADMIN: 'Administrator',
  GUIDE: 'Tour Guide',
};

// Role colors (for badges, etc.)
export const ROLE_COLORS: Record<Role, string> = {
  USER: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-red-100 text-red-800',
  GUIDE: 'bg-green-100 text-green-800',
};
```

---

## Checklist

Check when Permission Matrix is complete:

- [x] Role definitions documented (USER, ADMIN, GUIDE)
- [x] Data scope per role defined
- [x] Page access permissions matrix completed
- [x] Feature permissions matrix completed (CRUD for each resource)
- [x] UI element visibility rules defined
- [x] Permission check implementation documented (useRole hook, RoleGuard component)
- [x] Permission error handling UX defined
- [x] Middleware protection implemented
