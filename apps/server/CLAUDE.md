# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS backend API for a tour booking platform. Part of a Turborepo monorepo with a Next.js frontend (`apps/web`).

## Common Commands

```bash
# Development
pnpm start:dev              # Run server with hot reload (port 4000)
pnpm test                   # Run unit tests
pnpm test:watch             # Run tests in watch mode
pnpm test:e2e               # Run E2E tests
pnpm lint                   # ESLint with auto-fix

# Database (Prisma)
pnpm prisma migrate dev --name <name>   # Create migration
pnpm prisma migrate reset               # Reset database
pnpm prisma studio                      # Open Prisma Studio GUI
pnpm prisma generate                    # Regenerate Prisma Client
pnpm prisma db seed                     # Run seed script

# From root directory
pnpm dev                    # Run all apps (server + web)
pnpm build                  # Build all apps
pnpm turbo dev --filter=server  # Run only server
```

## Architecture

### Module Structure
```
src/
├── main.ts                 # Bootstrap: CORS, validation pipe, Swagger
├── app.module.ts           # Root module: imports feature modules
├── prisma/                 # Database service layer
└── modules/                # Feature modules
    ├── auth/               # JWT auth with refresh tokens
    │   ├── strategies/     # local, jwt, jwt-refresh
    │   ├── guards/         # Auth and role guards
    │   └── dto/
    ├── tours/              # Tour catalog management
    └── countries/          # Country reference data
```

### Key Patterns

**Authentication Flow**
- Passport.js with three strategies: local (login), jwt (access), jwt-refresh (token rotation)
- Guards: `JwtAuthGuard`, `JwtRefreshGuard`, `RolesGuard`
- Decorators: `@Public()` for unauthenticated routes, `@Roles()` for role-based access

**Optimistic Locking (Critical)**
- `TourSchedule.version` field prevents race conditions on capacity updates
- Always check and increment version within transactions when updating capacity

**Price Snapshots**
- `BookingTraveler.price` stores price at booking time, not current tour price
- Never fetch current price for historical bookings

**Transactions**
- Use `prisma.$transaction()` for multi-step operations (booking creation, payment processing)

## Database Schema (Key Models)

- **User** - Roles: USER, ADMIN, GUIDE
- **Tour** - Catalog with pricing (priceAdult, priceChild, priceInfant)
- **TourSchedule** - Capacity management with version field for optimistic locking
- **Booking** - Status: PENDING → PAID → CANCELLED/REFUNDED
- **BookingTraveler** - Individual travelers with price snapshot
- **Payment/Refund** - Transaction records

## Code Conventions

- TypeScript strict mode
- File naming: kebab-case for files, PascalCase for classes
- Each feature = 1 module with controller, service, DTOs
- DTOs use class-validator decorators
- Global ValidationPipe with whitelist and transform enabled
- Git commits: `type(scope): message` (feat, fix, docs, refactor, test, chore)

## API Configuration

- Port: 4000
- Swagger docs: /api (when enabled)
- Rate limiting: ThrottlerModule (5 requests/60 seconds default)
- CORS: Configured via CORS_ORIGIN environment variable

## Testing

- Unit tests: `*.spec.ts` files alongside source
- E2E tests: `test/*.e2e-spec.ts`
- Jest with ts-jest transformer
