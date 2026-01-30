---
name: project-context
description: Comprehensive project context for the Booking Tour monorepo. Provides architecture overview, tech stack details, coding conventions, and development guidelines. This skill is loaded automatically to provide essential project context for all development tasks.
compatibility: opencode
metadata:
  audience: all
  workflow: context
---

# Project Context - Booking Tour

You are working on **Booking Tour**, a full-stack tour booking platform built with a modern monorepo architecture.

## Architecture Overview

```
booking-tour/
├── apps/
│   ├── server/              # NestJS 10 backend API
│   │   ├── src/
│   │   │   ├── modules/     # Feature modules (tours, bookings, payments, auth)
│   │   │   ├── common/      # Shared utilities, guards, decorators
│   │   │   ├── config/      # Configuration files
│   │   │   └── prisma/      # Prisma service
│   │   ├── prisma/          # Database schema & migrations
│   │   └── test/            # E2E tests
│   └── web/                 # Next.js 16 frontend
│       ├── app/             # App Router pages
│       │   ├── (auth)/      # Auth route group (login, register)
│       │   ├── (dashboard)/ # Dashboard routes (my-bookings, profile)
│       │   └── api/         # API routes (if needed)
│       ├── components/      # Page-specific components
│       └── lib/             # Utilities, hooks, validations, API functions
├── packages/
│   ├── ui/                  # Shared React components (@repo/ui)
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
├── docs/                    # Documentation and TDDs
├── docker-compose.yml       # PostgreSQL & Redis services
└── turbo.json               # Turborepo configuration
```

## Tech Stack

### Backend (apps/server)

| Technology      | Version | Purpose                |
| --------------- | ------- | ---------------------- |
| NestJS          | 10      | Server-side framework  |
| Prisma          | 7       | Type-safe ORM          |
| PostgreSQL      | 15      | Primary database       |
| Redis           | Alpine  | Caching layer          |
| TypeScript      | 5.9     | Language (strict mode) |
| class-validator | -       | DTO validation         |

### Frontend (apps/web)

| Technology      | Version | Purpose                      |
| --------------- | ------- | ---------------------------- |
| Next.js         | 16      | React framework (App Router) |
| React           | 19      | UI library                   |
| TypeScript      | 5.9     | Language (strict mode)       |
| Tailwind CSS    | -       | Styling                      |
| Shadcn UI       | -       | Component library            |
| react-hook-form | -       | Form management              |
| Zod             | -       | Schema validation            |

### DevOps

| Technology | Purpose                  |
| ---------- | ------------------------ |
| Turborepo  | Monorepo build system    |
| pnpm       | Package manager (v9.0.0) |
| Docker     | Containerization         |

## Core Domain Models

```
User (USER, ADMIN, GUIDE)
  └── Booking
        ├── BookingTraveler (price snapshot)
        ├── Payment
        │     └── Refund
        └── TourSchedule (optimistic locking with version)
              └── Tour
                    ├── TourImage
                    └── Review
```

### Critical Patterns

1. **Optimistic Locking** (TourSchedule)
   - `version` field prevents race conditions
   - Always check version in transactions when updating capacity

2. **Price Snapshot** (BookingTraveler)
   - Store price at booking time, not current price
   - Ensures consistency when tour prices change

3. **Status Enums**
   - BookingStatus: `PENDING → PAID → CANCELLED/REFUNDED`
   - PaymentStatus: `PENDING → SUCCESS/FAILED`
   - ScheduleStatus: `OPEN → SOLD_OUT/CLOSED/COMPLETED`

## Coding Standards

### TypeScript

- **Strict mode** enabled
- **PascalCase** for Classes/Components
- **camelCase** for functions/variables
- Prefer `const` over `let`, avoid `var`
- Explicit return types for public methods
- No `any` types

### File Naming

| Type       | Convention                        | Example                      |
| ---------- | --------------------------------- | ---------------------------- |
| Components | kebab-case                        | `register-form.tsx`          |
| Classes    | PascalCase                        | `RegisterDto`, `AuthService` |
| Methods    | camelCase                         | `checkEmailAvailability()`   |
| DTOs       | kebab-case file, PascalCase class | `register-response.dto.ts`   |

### Git Commits

Format: `type(scope): message`

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting
- **refactor**: Code restructure
- **test**: Tests
- **chore**: Maintenance

## Backend Rules (NestJS)

### Module Structure

```typescript
// modules/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── dto/
│   ├── <action>.dto.ts
│   └── <action>-response.dto.ts
└── interfaces/ (if needed)
```

### Key Principles

1. **Dependency Injection**: Always inject via constructor with `@Injectable()`
2. **Error Handling**: Use NestJS Exception Filters
3. **Validation**: DTOs with `class-validator` decorators
4. **Database Access**: Always use `PrismaService`

### Prisma Best Practices

```typescript
// Always use select/include to fetch only needed data
const tour = await this.prisma.tour.findUnique({
  where: { id },
  select: { id: true, name: true, priceAdult: true }
});

// Use transactions for critical operations
await this.prisma.$transaction([
  this.prisma.tourSchedule.update({ ... }),
  this.prisma.booking.create({ ... }),
  this.prisma.payment.create({ ... })
]);
```

### API Design

- RESTful conventions
- Versioning: `/api/v1/...`
- Consistent response format
- Pagination: cursor-based or offset-based

## Frontend Rules (Next.js)

### App Router Structure

```
app/
├── (auth)/           # Route groups
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── my-bookings/page.tsx
│   └── profile/page.tsx
└── layout.tsx
```

### Component Types

| Type             | Directive      | Use Case                    |
| ---------------- | -------------- | --------------------------- |
| Server Component | (none)         | Static pages, data fetching |
| Client Component | `'use client'` | Forms, interactivity, hooks |
| Shared UI        | `@repo/ui/*`   | Button, Input, Card, etc.   |

### Data Fetching

- **Server Components**: Direct fetch or async components
- **Client Components**: React Query or SWR
- **Forms**: react-hook-form + Zod

### API Integration

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFunction(data: RequestType): Promise<ResponseType> {
  const response = await fetch(`${API_URL}/endpoint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}
```

## Database Rules (Prisma)

### Schema Conventions

- **Models**: PascalCase (`User`, `TourSchedule`)
- **Fields**: camelCase in code, snake_case in DB with `@map`
- **Tables**: snake_case with `@@map`

### Data Types

- **Money**: `Decimal` with precision `(10, 2)` or `(12, 2)`
- **Dates**: `DateTime` with `@default(now())`
- **JSON**: `Json` type for flexible data (images, metadata)

### Migration Commands

```bash
# Development
pnpm prisma migrate dev --name migration_name

# Production
pnpm prisma migrate deploy

# Generate client
pnpm prisma generate

# Studio
pnpm prisma studio
```

## Development Commands

### Root Level (Turborepo)

```bash
pnpm dev          # Run all apps
pnpm build        # Build all apps
pnpm lint         # ESLint check
pnpm format       # Prettier format
pnpm check-types  # TypeScript check
```

### Server (apps/server)

```bash
pnpm start:dev    # Development with hot reload
pnpm start:prod   # Production
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm test:cov     # Coverage report
```

### Frontend (apps/web)

```bash
pnpm dev          # Development
pnpm build        # Production build
```

## Environment Setup

### Docker Services

```bash
docker-compose up -d
# PostgreSQL: localhost:5432
# Redis: localhost:6380
```

### Environment Variables

```env
# apps/server/.env
DATABASE_URL="postgresql://admin:admin@localhost:5432/booking_tour?schema=public"
```

## Available Skills

When working on specific tasks, consider loading these specialized skills:

| Skill               | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `tdd-generation`    | Generate technical design documents from feature requests    |
| `task-breakdown`    | Break down TDDs into actionable task checklists              |
| `scaffold-backend`  | Create NestJS module structure (DTOs, Controllers, Services) |
| `scaffold-frontend` | Create Next.js pages and components structure                |
| `implementation`    | Implement tasks according to TDDs and checklists             |
| `code-review`       | Senior architect code review with severity levels            |

## Key Business Flows

### Booking Flow (Critical Path)

1. User selects tour and schedule
2. Check availability (slots > 0)
3. Create booking with travelers (price snapshot)
4. Process payment
5. Update schedule capacity with optimistic locking
6. Confirm booking

### Payment Flow

1. Create pending payment record
2. Process with payment gateway (Stripe/PayPal)
3. Update payment status
4. Update booking status on success
5. Handle refunds if needed
