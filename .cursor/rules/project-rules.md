# Project Rules - Booking Tour

## Kiến trúc tổng quan

- **Monorepo**: Sử dụng Turborepo + pnpm workspace
- **Backend**: NestJS 10 với Prisma 7
- **Frontend**: Next.js 16 với App Router
- **Database**: PostgreSQL + Redis (Docker)

## Quy tắc chung

1. **Code Style**:
   - Sử dụng TypeScript strict mode
   - Tuân thủ ESLint và Prettier config từ `packages/eslint-config`
   - Đặt tên file: kebab-case cho components, camelCase cho utilities

2. **Git Commit**:
   - Format: `type(scope): message`
   - Types: feat, fix, docs, style, refactor, test, chore

3. **Import Paths**:
   - Backend: Relative imports trong cùng module, absolute cho cross-module
   - Frontend: Sử dụng `@repo/ui` cho shared components
   - Không dùng `../../` quá 2 levels

4. **Testing**:
   - Unit tests cho business logic
   - E2E tests cho critical flows (booking, payment)

## Monorepo Best Practices

- Shared code → `packages/`
- Apps → `apps/`
- Dependencies: Ưu tiên workspace packages trước khi install external
