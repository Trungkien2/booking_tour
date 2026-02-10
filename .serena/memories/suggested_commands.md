# Suggested Commands - Booking Tour

## Development Workflow

### Initial Setup

```bash
# Install dependencies
pnpm install

# Start database and Redis
docker-compose up -d

# Run migrations
cd apps/server && pnpm prisma migrate dev

# Start all apps
pnpm dev
```

### Daily Development

#### Root Level Commands

```bash
pnpm dev              # Run all apps in development mode
pnpm build            # Build all apps
pnpm lint             # Lint all apps with ESLint
pnpm format           # Format code with Prettier
pnpm check-types      # TypeScript type checking across all apps
```

#### Filter to Specific App

```bash
pnpm turbo dev --filter=server    # Run only backend (port 4000)
pnpm turbo dev --filter=web       # Run only frontend (port 3000)
pnpm turbo build --filter=server  # Build only backend
pnpm turbo lint --filter=web      # Lint only frontend
```

### Backend (Server) Commands

```bash
cd apps/server

# Development
pnpm start:dev        # Start with hot reload
pnpm start:prod       # Start in production mode

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:cov         # Run tests with coverage report
pnpm test:e2e         # Run E2E tests

# Linting & Formatting
pnpm lint             # Lint and auto-fix
pnpm format           # Format with Prettier
```

### Prisma Commands

```bash
cd apps/server

# Migrations
pnpm prisma migrate dev --name <migration-name>   # Create new migration
pnpm prisma migrate reset                         # Reset database
pnpm prisma migrate deploy                        # Deploy migrations (production)

# Client Generation
pnpm prisma generate                              # Generate Prisma Client

# Database Tools
pnpm prisma studio                                # Open Prisma Studio GUI
pnpm prisma db seed                               # Run seed script
pnpm prisma db push                               # Push schema without migration (dev only)
```

### Frontend (Web) Commands

```bash
cd apps/web

# Development
pnpm dev              # Start Next.js dev server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server

# Type Checking
pnpm check-types      # Generate types and check TypeScript

# Linting
pnpm lint             # Lint with ESLint
```

### Docker Commands

```bash
# Start services
docker-compose up -d              # Start PostgreSQL (5432) and Redis (6380)

# Stop services
docker-compose down               # Stop all services
docker-compose down -v            # Stop and remove volumes

# View logs
docker-compose logs postgres      # View PostgreSQL logs
docker-compose logs redis         # View Redis logs
```

### NestJS CLI (Backend)

```bash
cd apps/server

# Generate resources
nest generate module <name>       # Generate module
nest generate controller <name>   # Generate controller
nest generate service <name>      # Generate service
nest generate resource <name>     # Generate complete CRUD resource
```

### Git Commands (Darwin/macOS)

```bash
# Standard git workflow
git status                        # Check status
git add .                         # Stage all changes
git commit -m "type(scope): msg"  # Commit with convention
git push                          # Push to remote

# Useful commands
git log --oneline --graph         # View commit history
git diff                          # View unstaged changes
git diff --staged                 # View staged changes
```

### System Utilities (Darwin/macOS)

```bash
# File operations
ls -la                            # List files with details
find . -name "*.ts"               # Find TypeScript files
grep -r "pattern" .               # Search pattern in files

# Process management
lsof -i :4000                     # Check what's using port 4000
kill -9 <PID>                     # Kill process by PID

# Package management
pnpm why <package>                # Why is package installed
pnpm outdated                     # Check outdated packages
```

## Task Completion Checklist

After completing a coding task, run:

1. `pnpm format` - Format code
2. `pnpm lint` - Check and fix linting issues
3. `pnpm check-types` - Verify TypeScript types
4. `pnpm test` (if applicable) - Run tests
5. Review changes with `git diff`
6. Commit with proper format: `type(scope): message`
