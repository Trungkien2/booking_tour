# Login Feature - Scaffold Summary

## ✅ Files Created

### Backend (NestJS) - 10 files

#### Module & Core

- `apps/server/src/modules/auth/auth.module.ts` - Module chính, đăng ký controller, service, và JWT
- `apps/server/src/modules/auth/auth.controller.ts` - Controller xử lý các endpoint: `/auth/login`, `/auth/google`, `/auth/apple`
- `apps/server/src/modules/auth/auth.service.ts` - Service chứa business logic: validateUser, login, validateOAuthLogin

#### DTOs

- `apps/server/src/modules/auth/dto/login.dto.ts` - DTO cho email/password login với validation
- `apps/server/src/modules/auth/dto/social-login.dto.ts` - DTO cho Google/Apple login
- `apps/server/src/modules/auth/dto/login-response.dto.ts` - DTO cho response (tokens + user info)

#### Guards & Strategies

- `apps/server/src/modules/auth/guards/jwt-auth.guard.ts` - Guard bảo vệ các route cần authentication
- `apps/server/src/modules/auth/guards/local-auth.guard.ts` - Guard cho local authentication
- `apps/server/src/modules/auth/strategies/jwt.strategy.ts` - Passport JWT strategy
- `apps/server/src/modules/auth/strategies/local.strategy.ts` - Passport Local strategy

### Frontend (Next.js) - 10 files

#### Pages & Layouts

- `apps/web/app/(auth)/login/page.tsx` - Login page với responsive design (2 columns)
- `apps/web/app/(auth)/layout.tsx` - Layout cho các auth pages

#### Components

- `apps/web/components/auth/login-form.tsx` - Form component với React Hook Form + Zod validation
- `apps/web/components/auth/social-buttons.tsx` - Buttons cho Google/Apple login
- `apps/web/components/ui/input.tsx` - Reusable Input component

#### Services & Hooks

- `apps/web/lib/api/auth.ts` - API service gọi backend endpoints
- `apps/web/lib/hooks/use-auth.ts` - Zustand hook quản lý auth state
- `apps/web/lib/utils/token.ts` - Utilities cho token storage/retrieval

#### Validation & Types

- `apps/web/lib/validations/auth.ts` - Zod schemas cho form validation
- `apps/web/types/auth.ts` - TypeScript interfaces cho auth

## 📦 Required Dependencies

### Backend

```bash
cd apps/server
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcrypt @nestjs/throttler
pnpm add -D @types/passport-jwt @types/passport-local @types/bcrypt
```

### Frontend

```bash
cd apps/web
pnpm add react-hook-form @hookform/resolvers zod zustand
```

## 🔧 Next Steps

### Backend

1. Install dependencies
2. Import `AuthModule` vào `AppModule`
3. Configure JWT secret trong `.env`
4. Implement business logic trong `AuthService`
5. Setup Prisma để query User model
6. Add ThrottlerModule vào AppModule

### Frontend

1. Install dependencies
2. Configure `NEXT_PUBLIC_API_URL` trong `.env.local`
3. Implement token storage logic
4. Wire up `useAuth` hook với login form
5. Add redirect logic sau khi login thành công
6. Implement Google/Apple OAuth flow

## 🎯 Integration Points

### Backend → Database

- `AuthService.validateUser()` cần query User từ Prisma
- So sánh password với bcrypt

### Frontend → Backend

- `login()` function gọi `POST /auth/login`
- `socialLogin()` function gọi `POST /auth/google` hoặc `/auth/apple`

### Token Flow

1. Backend generate JWT tokens
2. Frontend nhận tokens trong response
3. Store tokens (localStorage hoặc cookies)
4. Attach access token vào headers cho các request tiếp theo

## ⚠️ TODO Comments

Tất cả các file đều có `// TODO:` comments đánh dấu nơi cần implement business logic. Tìm kiếm "TODO" để xem các phần cần hoàn thiện.

## 📝 Notes

- Rate limiting đã được setup cho `/auth/login` endpoint (5 requests/minute)
- Password visibility toggle đã có trong login form
- Responsive design: Single column (mobile) / Two columns (desktop)
- Error handling structure đã được setup
- Form validation với Zod (frontend) và class-validator (backend)
