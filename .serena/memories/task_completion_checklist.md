# Task Completion Checklist - Booking Tour

## Before Committing Code

Run these commands in order after completing any coding task:

### 1. Format Code

```bash
pnpm format
```

- Ensures consistent code formatting across the project
- Uses Prettier with shared config
- Formats TypeScript, TSX, and Markdown files

### 2. Lint Code

```bash
pnpm lint
```

- Checks for code quality issues
- Auto-fixes issues where possible
- Uses ESLint with shared config from `@repo/eslint-config`
- Fix any remaining errors manually

### 3. Type Check

```bash
pnpm check-types
```

- Verifies TypeScript types across all apps
- Catches type errors before runtime
- For frontend: Also generates Next.js types

### 4. Run Tests (if applicable)

```bash
# Backend tests
cd apps/server
pnpm test              # Unit tests
pnpm test:cov          # With coverage
pnpm test:e2e          # E2E tests (if modified critical flows)

# Frontend tests (when implemented)
cd apps/web
pnpm test
```

### 5. Review Changes

```bash
git status             # Check modified files
git diff               # Review unstaged changes
git diff --staged      # Review staged changes (if already added)
```

### 6. Verify Application Runs

```bash
pnpm dev               # Start all apps and verify no errors
```

- Check backend at http://localhost:4000
- Check frontend at http://localhost:3000
- Test the specific feature you modified

### 7. Commit with Convention

```bash
git add .
git commit -m "type(scope): message"
```

- Follow commit convention: `type(scope): message`
- Types: feat, fix, docs, style, refactor, test, chore
- Example: `feat(tours): add tour filtering by price range`

## Specific Scenarios

### After Backend Changes

1. Run `pnpm format` and `pnpm lint` in `apps/server`
2. Run `pnpm test` to ensure unit tests pass
3. If database schema changed:
   ```bash
   cd apps/server
   pnpm prisma migrate dev --name <migration-name>
   pnpm prisma generate
   ```
4. If critical flow modified, run `pnpm test:e2e`

### After Frontend Changes

1. Run `pnpm format` and `pnpm lint` in `apps/web`
2. Run `pnpm check-types` to verify Next.js types
3. Verify in browser (check responsive design)
4. Check browser console for errors
5. Test dark mode if applicable

### After Shared Package Changes

1. Run `pnpm format` and `pnpm lint` in the package
2. Run `pnpm build` from root to rebuild all apps
3. Test in both apps (server and web) that use the package

### After Database Schema Changes

1. Create migration: `pnpm prisma migrate dev --name <name>`
2. Regenerate client: `pnpm prisma generate`
3. Update seed if needed: `prisma/seed.ts`
4. Test migration: `pnpm prisma migrate reset` (dev only)
5. Update related DTOs and entities in backend
6. Run backend tests

### After Adding Dependencies

1. Use `pnpm add <package>` in the specific app/package
2. For shared dependencies, add to root or `packages/`
3. Run `pnpm install` from root to update lockfile
4. Verify `pnpm-lock.yaml` is updated
5. Document in README if it's a major dependency

## Common Issues & Fixes

### Linting Errors

- **Unused imports**: Remove them
- **Unused variables**: Remove or prefix with `_`
- **Any type**: Replace with proper type or `unknown`
- **Console.log**: Remove or replace with proper logging

### Type Errors

- **Implicit any**: Add explicit type annotations
- **Missing properties**: Check interface/type definitions
- **Wrong types**: Verify API response types match DTOs

### Test Failures

- **Outdated snapshots**: Run `pnpm test -u` to update
- **Mock issues**: Verify mock data matches real data structure
- **Async issues**: Ensure proper `await` usage

### Build Errors

- **Module not found**: Check import paths and dependencies
- **Circular dependencies**: Refactor to break the cycle
- **Missing env vars**: Check `.env` files

## Pre-Push Checklist

Before pushing to remote:

- [ ] All tests pass
- [ ] No linting errors
- [ ] No type errors
- [ ] Code is formatted
- [ ] Commit message follows convention
- [ ] Feature works in development
- [ ] No console errors in browser (frontend)
- [ ] Database migrations are included (if applicable)
- [ ] Documentation updated (if needed)

## CI/CD Considerations

The project uses Turborepo which will run:

- `turbo run lint` - Linting for all apps
- `turbo run check-types` - Type checking for all apps
- `turbo run build` - Build all apps
- `turbo run test` - Run tests (when configured)

Ensure all these pass locally before pushing.
