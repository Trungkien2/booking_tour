# Booking Tour - Project Overview

## Purpose

Full-stack tour booking platform (nền tảng đặt tour du lịch) with modern monorepo architecture.

## Key Features

- **Tour Management**: Tour listings with details (price, duration, location), multiple images, ratings/reviews
- **Booking System**: Schedule management with capacity tracking, optimistic locking for race conditions, multiple traveler types (adult, child, infant)
- **Payment Integration**: Multiple payment gateways (Stripe, PayPal), refund management
- **User Management**: Role-based access (USER, ADMIN, GUIDE), booking and payment history

## Tech Stack

### Backend (apps/server)

- **NestJS 10**: Node.js server-side framework
- **Prisma 6**: Type-safe ORM
- **PostgreSQL**: Relational database
- **Passport.js**: JWT authentication
- **TypeScript 5.9.2**: Programming language

### Frontend (apps/web)

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS 4**: Styling with cascade layers
- **Zustand**: State management
- **React Hook Form + Zod**: Form validation
- **TypeScript 5.9.2**: Programming language

### DevOps & Tooling

- **Turborepo**: Monorepo build system
- **pnpm 9.0.0**: Package manager
- **Docker**: Containerization for PostgreSQL and Redis
- **Jest**: Testing framework

## Monorepo Structure

```
booking-tour/
├── apps/
│   ├── server/              # NestJS backend (port 4000)
│   │   ├── src/modules/     # Feature modules
│   │   ├── prisma/          # Schema & migrations
│   │   └── test/            # E2E tests
│   └── web/                 # Next.js frontend (port 3000)
│       ├── app/             # App Router pages
│       └── components/      # React components
├── packages/
│   ├── ui/                  # Shared React components (@repo/ui)
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
├── .cursor/                 # Cursor IDE rules & skills
├── docker-compose.yml       # PostgreSQL + Redis
└── turbo.json              # Turborepo config
```

## Database Models (Core)

- **User**: Users with roles (USER, ADMIN, GUIDE)
- **Tour**: Tour information
- **TourSchedule**: Departure schedules with capacity management (uses optimistic locking via `version` field)
- **Booking**: Tour bookings
- **BookingTraveler**: Traveler details with price snapshots (stores price at booking time)
- **Payment**: Payment transactions
- **Refund**: Refund records
- **Review**: Tour reviews and ratings

## Critical Domain Patterns

1. **Optimistic Locking**: `TourSchedule.version` field prevents race conditions; always increment within transactions when updating capacity
2. **Price Snapshots**: `BookingTraveler.price` stores price at booking time; never use current tour price for historical bookings
3. **Status Flows**:
   - Booking: PENDING → PAID → CANCELLED/REFUNDED
   - Payment: PENDING → SUCCESS/FAILED
   - Schedule: OPEN → SOLD_OUT/CLOSED/COMPLETED
4. **Transactions**: Use database transactions for booking flow to ensure data consistency

## System Requirements

- Node.js >= 18
- pnpm >= 9.0.0
- Docker & Docker Compose
