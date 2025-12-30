# 02. Frontend Architecture

> Defines tech stack, folder structure, state management, and infrastructure.
> Essential for AI to understand "how to build."

---

## Document Information

| Item         | Value          |
| ------------ | -------------- |
| Project Name | `Booking Tour` |
| Version      | 1.0            |
| Date         | `2025-01-XX`   |

---

## 1. Tech Stack

### 1.1 Core Stack

```yaml
framework:
  name: 'Next.js'
  version: '16.1.0'
  rendering: 'Server-side rendering (SSR) + Static Generation (SSG)'
  router: 'App Router'

language:
  name: 'TypeScript'
  version: '5.9.2'
  strict_mode: true

styling:
  primary: 'Tailwind CSS'
  version: '4.1.18'
  component_lib: 'shadcn/ui'
  css_framework: 'Utility-first with CSS variables'

state_management:
  server_state: 'TanStack Query (React Query)'
  client_state: 'Zustand'
  form_state: 'React Hook Form + Zod'

package_manager: 'pnpm'
pnpm_version: '9.0.0'
monorepo: true
monorepo_tool: 'Turborepo'
```

### 1.2 Key Libraries

| Purpose          | Library              | Version    | Notes                          |
| ---------------- | -------------------- | ---------- | ------------------------------ |
| UI Components    | shadcn/ui            | latest     | Radix UI based components      |
| HTTP Client      | fetch / axios        | native     | API communication              |
| Date             | date-fns             | latest     | Date handling                  |
| Form             | react-hook-form      | latest     | Form management                |
| Validation       | zod                  | latest     | Schema validation              |
| Icons            | lucide-react         | latest     | Icon library                   |
| Animation        | tw-animate-css       | latest     | Tailwind animations            |
| Class Merge      | clsx + tailwind-merge| latest     | Conditional class names        |

### 1.3 Development Tools

```yaml
linter: 'ESLint'
eslint_version: '9.39.1'
formatter: 'Prettier'
build_tool: 'Turborepo + Next.js'
dev_server_port: 3000
```

---

## 2. Project Structure

### 2.1 Monorepo Structure

```
booking-tour/
├── apps/
│   ├── server/              # NestJS backend API
│   │   ├── src/
│   │   ├── prisma/
│   │   └── test/
│   └── web/                 # Next.js frontend
│       ├── app/             # App Router pages
│       ├── components/      # React components
│       ├── lib/             # Utility functions
│       ├── hooks/           # Custom hooks
│       ├── stores/          # Zustand stores
│       ├── services/        # API services
│       ├── types/           # TypeScript types
│       └── public/          # Static assets
├── packages/
│   ├── ui/                  # Shared React components
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

### 2.2 Frontend Folder Structure (apps/web)

```
apps/web/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (main)/               # Main layout group
│   │   ├── tours/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── bookings/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (admin)/              # Admin layout group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tours/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── bookings/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                  # API routes (if needed)
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles + Tailwind
│
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/               # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── nav.tsx
│   ├── tours/                # Tour-related components
│   │   ├── tour-card.tsx
│   │   ├── tour-list.tsx
│   │   ├── tour-detail.tsx
│   │   ├── tour-form.tsx
│   │   └── schedule-picker.tsx
│   ├── bookings/             # Booking-related components
│   │   ├── booking-form.tsx
│   │   ├── booking-card.tsx
│   │   ├── traveler-form.tsx
│   │   └── payment-form.tsx
│   ├── reviews/              # Review-related components
│   │   ├── review-card.tsx
│   │   ├── review-form.tsx
│   │   └── review-list.tsx
│   └── common/               # Common/shared components
│       ├── loading.tsx
│       ├── error-boundary.tsx
│       ├── pagination.tsx
│       └── search-input.tsx
│
├── hooks/                    # Custom React hooks
│   ├── use-auth.ts
│   ├── use-tours.ts
│   ├── use-bookings.ts
│   └── use-debounce.ts
│
├── services/                 # API service functions
│   ├── api-client.ts         # Axios/fetch client
│   ├── auth.service.ts
│   ├── tour.service.ts
│   ├── booking.service.ts
│   ├── payment.service.ts
│   └── review.service.ts
│
├── stores/                   # Zustand stores
│   ├── auth.store.ts
│   ├── cart.store.ts
│   └── ui.store.ts
│
├── types/                    # TypeScript types
│   ├── user.ts
│   ├── tour.ts
│   ├── booking.ts
│   ├── payment.ts
│   └── api.ts
│
├── lib/                      # Utility functions
│   ├── utils.ts              # cn() and helpers
│   ├── constants.ts          # App constants
│   └── validators.ts         # Zod schemas
│
├── public/                   # Static assets
│   ├── images/
│   └── icons/
│
├── components.json           # shadcn/ui config
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

### 2.3 File Naming Rules

```yaml
components:
  pattern: 'kebab-case for files'
  example: 'tour-card.tsx, booking-form.tsx'
  export: 'Named export (export function TourCard)'

hooks:
  pattern: 'kebab-case with use- prefix'
  example: 'use-auth.ts, use-tours.ts'
  export: 'Named export (export function useAuth)'

services:
  pattern: 'kebab-case with .service suffix'
  example: 'tour.service.ts, auth.service.ts'
  export: 'Named exports for functions'

stores:
  pattern: 'kebab-case with .store suffix'
  example: 'auth.store.ts, cart.store.ts'
  export: 'Named export (export const useAuthStore)'

types:
  pattern: 'kebab-case for files, PascalCase for types'
  example: 'user.ts → export interface User'

pages:
  pattern: 'Next.js App Router convention'
  example: 'app/tours/[slug]/page.tsx'
```

### 2.4 Import Rules

```typescript
// Path alias configuration (tsconfig.json)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// Import order
// 1. React/Next.js
// 2. External libraries
// 3. Internal aliases (@/...)
// 4. Relative paths (./, ../)
// 5. Types
// 6. Styles

// Example:
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { TourCard } from './tour-card';
import type { Tour } from '@/types/tour';
```

---

## 3. State Management

### 3.1 State Classification

```yaml
server_state:
  tool: 'TanStack Query'
  examples:
    - 'Tour list fetched from API'
    - 'Booking details'
    - 'User profile'
  caching: 'staleTime: 5min, gcTime: 30min'

client_state:
  tool: 'Zustand'
  examples:
    - 'Authentication state (user, tokens)'
    - 'Shopping cart / booking draft'
    - 'UI state (sidebar, modals)'
    - 'Theme (dark/light)'

form_state:
  tool: 'React Hook Form + Zod'
  examples:
    - 'Login form'
    - 'Booking form with travelers'
    - 'Tour creation form'

url_state:
  tool: 'Next.js searchParams / nuqs'
  examples:
    - 'Current page number'
    - 'Filter options'
    - 'Sort order'
```

### 3.2 TanStack Query Pattern

```typescript
// Query Key Factory pattern
// lib/query-keys.ts
export const queryKeys = {
  tours: {
    all: ['tours'] as const,
    lists: () => [...queryKeys.tours.all, 'list'] as const,
    list: (filters: TourFilters) => [...queryKeys.tours.lists(), filters] as const,
    details: () => [...queryKeys.tours.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.tours.details(), slug] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (userId: number) => [...queryKeys.bookings.lists(), userId] as const,
    detail: (id: number) => [...queryKeys.bookings.all, 'detail', id] as const,
  },
};

// Query Hook Pattern
// hooks/use-tours.ts
export function useTours(filters: TourFilters) {
  return useQuery({
    queryKey: queryKeys.tours.list(filters),
    queryFn: () => tourService.getList(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTour(slug: string) {
  return useQuery({
    queryKey: queryKeys.tours.detail(slug),
    queryFn: () => tourService.getBySlug(slug),
    enabled: !!slug,
  });
}

// Mutation Hook Pattern
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      toast.success('Booking created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
}
```

### 3.3 Zustand Store Pattern

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN' | 'GUIDE';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// stores/cart.store.ts (Booking draft)
interface CartState {
  scheduleId: number | null;
  travelers: Traveler[];

  setSchedule: (scheduleId: number) => void;
  addTraveler: (traveler: Traveler) => void;
  removeTraveler: (index: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  scheduleId: null,
  travelers: [],

  setSchedule: (scheduleId) => set({ scheduleId }),
  addTraveler: (traveler) =>
    set((state) => ({ travelers: [...state.travelers, traveler] })),
  removeTraveler: (index) =>
    set((state) => ({
      travelers: state.travelers.filter((_, i) => i !== index),
    })),
  clearCart: () => set({ scheduleId: null, travelers: [] }),
}));
```

---

## 4. API Communication

### 4.1 API Client Setup

```typescript
// services/api-client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Authorization token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      const { refreshToken, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          useAuthStore.getState().login(
            data.user,
            data.accessToken,
            data.refreshToken
          );

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          logout();
          window.location.href = '/login';
        }
      } else {
        logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);
```

### 4.2 Service Pattern

```typescript
// services/tour.service.ts
import { apiClient } from './api-client';
import type { Tour, TourFilters, PaginatedResponse } from '@/types';

export const tourService = {
  getList: async (filters: TourFilters): Promise<PaginatedResponse<Tour>> => {
    return apiClient.get('/tours', { params: filters });
  },

  getBySlug: async (slug: string): Promise<Tour> => {
    return apiClient.get(`/tours/${slug}`);
  },

  create: async (data: CreateTourDto): Promise<Tour> => {
    return apiClient.post('/tours', data);
  },

  update: async (id: number, data: UpdateTourDto): Promise<Tour> => {
    return apiClient.patch(`/tours/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/tours/${id}`);
  },
};

// services/booking.service.ts
export const bookingService = {
  create: async (data: CreateBookingDto): Promise<Booking> => {
    return apiClient.post('/bookings', data);
  },

  getMyBookings: async (): Promise<Booking[]> => {
    return apiClient.get('/bookings/me');
  },

  getById: async (id: number): Promise<Booking> => {
    return apiClient.get(`/bookings/${id}`);
  },

  cancel: async (id: number): Promise<Booking> => {
    return apiClient.patch(`/bookings/${id}/cancel`);
  },
};
```

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```yaml
login_flow:
  1: 'User submits login form'
  2: 'POST /auth/login → { user, accessToken, refreshToken }'
  3: 'Store tokens in Zustand (persisted to localStorage)'
  4: 'Redirect to dashboard/home'

token_refresh:
  trigger: 'On 401 response'
  endpoint: 'POST /auth/refresh'
  process: 'Get new tokens, retry original request'
  fallback: 'Logout and redirect to /login'

logout_flow:
  1: 'Call useAuthStore.logout()'
  2: 'Clear all stored tokens'
  3: 'Redirect to /login'
```

### 5.2 Route Protection

```typescript
// middleware.ts (Next.js Middleware)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // Public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin routes - check role (simplified, actual implementation may vary)
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    // Role check would be done server-side or via API
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 5.3 Role-Based Access Component

```typescript
// components/common/role-guard.tsx
'use client';

import { useAuthStore } from '@/stores/auth.store';
import { redirect } from 'next/navigation';

type Role = 'USER' | 'ADMIN' | 'GUIDE';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect('/login');
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Usage
<RoleGuard allowedRoles={['ADMIN']}>
  <AdminDashboard />
</RoleGuard>
```

---

## 6. Layout & Routing

### 6.1 Layout Structure

```yaml
layouts:
  - name: 'AuthLayout'
    path: 'app/(auth)/layout.tsx'
    features:
      - 'No header/sidebar'
      - 'Centered form layout'
    pages: ['/login', '/register']

  - name: 'MainLayout'
    path: 'app/(main)/layout.tsx'
    features:
      - 'Header with navigation'
      - 'Footer'
      - 'Responsive container'
    pages: ['/tours', '/bookings', '/profile']

  - name: 'AdminLayout'
    path: 'app/(admin)/layout.tsx'
    features:
      - 'Sidebar navigation'
      - 'Admin header'
      - 'Role protection (ADMIN only)'
    pages: ['/admin/*']
```

### 6.2 Responsive Breakpoints

```yaml
breakpoints: # Tailwind CSS defaults
  sm: '640px'
  md: '768px'
  lg: '1024px'
  xl: '1280px'
  2xl: '1536px'

layout_behavior:
  mobile: # < 768px
    sidebar: 'Hidden, accessible via hamburger menu'
    navigation: 'Bottom navigation or drawer'
    cards: 'Full width, stacked'

  tablet: # 768px - 1024px
    sidebar: 'Collapsed by default'
    navigation: 'Top header'
    cards: '2 columns grid'

  desktop: # >= 1024px
    sidebar: 'Expanded'
    navigation: 'Top header'
    cards: '3-4 columns grid'
```

---

## 7. Environment Configuration

### 7.1 Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:4000

# .env.production (production)
NEXT_PUBLIC_API_URL=https://api.booking-tour.com

# Usage in code:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## Checklist

Check when Frontend Architecture is complete:

- [x] Tech stack versions specified
- [x] Folder structure defined
- [x] Naming rules defined
- [x] State management strategy defined
- [x] API communication patterns defined
- [x] Authentication/authorization flows defined
- [x] Environment variables listed
