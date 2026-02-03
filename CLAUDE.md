# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack tour booking platform using Turborepo monorepo architecture.

## Monorepo Structure

```
apps/
├── server/           # NestJS backend API (port 4000)
└── web/              # Next.js 16 frontend (port 3000)
packages/
├── ui/               # Shared React components (@repo/ui)
├── eslint-config/    # Shared ESLint configuration
└── typescript-config/ # Shared TypeScript configuration
```

## Common Commands

```bash
# Root level - runs across all apps
pnpm dev              # Run all apps in development
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm format           # Format with Prettier
pnpm check-types      # TypeScript type checking

# Filter to specific app
pnpm turbo dev --filter=server
pnpm turbo dev --filter=web

# Infrastructure
docker-compose up -d  # Start PostgreSQL (5432) and Redis (6380)
```

## Tech Stack

- **Backend**: NestJS 10, Prisma 6, PostgreSQL, Passport.js (JWT auth)
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Zustand
- **Build**: Turborepo, pnpm workspaces
- **Testing**: Jest

## Critical Domain Patterns

### Optimistic Locking
`TourSchedule.version` field prevents race conditions. Always increment within transactions when updating capacity.

### Price Snapshots
`BookingTraveler.price` stores price at booking time. Never use current tour price for historical bookings.

### Status Flows
- Booking: PENDING → PAID → CANCELLED/REFUNDED
- Payment: PENDING → SUCCESS/FAILED
- Schedule: OPEN → SOLD_OUT/CLOSED/COMPLETED

## Development Setup

1. `pnpm install`
2. `docker-compose up -d`
3. `cd apps/server && pnpm prisma migrate dev`
4. `pnpm dev`

## Code Conventions

- TypeScript strict mode
- File naming: kebab-case
- Git commits: `type(scope): message`
- Shared components: `@repo/ui`

## Custom Commands

Available slash commands (in `.claude/commands/`):

| Command | Description |
|---------|-------------|
| `/tdd @<spec>` | Generate Technical Design Document from feature spec |
| `/tasks @<tdd>` | Generate task breakdown checklist from TDD |
| `/scaffold-be` | Scaffold NestJS backend structure (no business logic) |
| `/scaffold-fe` | Scaffold Next.js frontend structure (no complex logic) |
| `/implement` | Full implementation with business logic |
| `/review @<file>` | Code review with Senior Architect perspective |
| `/audit @<file>` | Security & performance audit |

**Workflow example:**
```
/tdd @docs/screens/register          # Generate TDD
/tasks @tdd-register.md              # Generate tasks
/scaffold-be @tasks.md @tdd.md Phase 1   # Scaffold backend
/scaffold-fe @tasks.md @tdd.md Phase 2   # Scaffold frontend
/implement @tasks.md @tdd.md         # Implement logic
/review @auth.service.ts             # Review code
```

## Environment Variables

Server (`apps/server/.env`):
```
DATABASE_URL="postgresql://admin:admin@localhost:5432/booking_tour?schema=public"
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
```
