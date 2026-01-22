# Task Checklist: User Registration

> Generated from: `tdd-register.md`
> Feature: User Registration (SCR-002)
> Route: `/register`

---

## Phase 1: Backend (NestJS)

### 1.1 DTOs
- [x] **Task 1.1**: [BE] Create `apps/server/src/modules/auth/dto/register.dto.ts` ✅ (Completed)
  - Add `RegisterDto` class with validation decorators
  - Fields: `fullName` (required, min 2), `email` (required, email), `password` (required, min 8, pattern), `phone` (optional), `country` (optional)
  
- [x] **Task 1.2**: [BE] Create `apps/server/src/modules/auth/dto/register-response.dto.ts` ✅ (Completed)
  - Add `RegisterResponseDto` class with user object and message

- [x] **Task 1.3**: [BE] Create `apps/server/src/modules/auth/dto/check-email.dto.ts` ✅ (Completed)
  - Add `CheckEmailDto` with email validation
  - Add `CheckEmailResponseDto` with `available` boolean and optional `message`

### 1.2 Service Layer
- [x] **Task 1.4**: [BE] Implement `AuthService.register()` method in `apps/server/src/modules/auth/auth.service.ts` ✅ (Completed)
  - [x] Check if email already exists (case-insensitive)
  - [x] Hash password with bcrypt (salt rounds: 10)
  - [x] Create user in database via Prisma
  - [x] Return user data and success message
  - [x] Throw `ConflictException` if email exists

- [x] **Task 1.5**: [BE] Implement `AuthService.checkEmailAvailability()` method ✅ (Completed)
  - [x] Query database for existing email
  - [x] Return `{ available: true/false, message? }`

### 1.3 Controller Layer
- [x] **Task 1.6**: [BE] Add `POST /auth/register` endpoint in `apps/server/src/modules/auth/auth.controller.ts` ✅ (Completed)
  - Add `@Post('register')` decorator
  - Add `@HttpCode(HttpStatus.CREATED)` 
  - Add `@Throttle({ default: { limit: 5, ttl: 60 } })` for rate limiting
  - Inject `RegisterDto` via `@Body()`

- [x] **Task 1.7**: [BE] Add `GET /auth/check-email` endpoint ✅ (Completed)
  - Add `@Get('check-email')` decorator
  - Add `@Throttle({ default: { limit: 10, ttl: 60 } })`
  - Use `@Query()` to get email parameter

### 1.4 Countries Endpoint (Optional)
- [x] **Task 1.8**: [BE] Create `apps/server/src/modules/countries/countries.module.ts` ✅ (Completed)
  - Create simple module for countries list

- [x] **Task 1.9**: [BE] Create `apps/server/src/modules/countries/countries.controller.ts` ✅ (Completed)
  - Add `GET /api/countries` endpoint
  - Return static list of countries with code, name, dialCode, flag

- [x] **Task 1.10**: [BE] Register `CountriesModule` in `AppModule` ✅ (Completed)

---

## Phase 2: Frontend - API & Validation

### 2.1 Validation Schema
- [ ] **Task 2.1**: [FE] Add `registerSchema` to `apps/web/lib/validations/auth.ts`
  - [ ] `fullName`: required, min 2 characters
  - [ ] `email`: required, valid email format
  - [ ] `phone`: optional, valid phone pattern
  - [ ] `country`: optional string
  - [ ] `password`: required, min 8 chars, must contain uppercase, lowercase, number
  - [ ] `confirmPassword`: required, must match password
  - [ ] `agreeTerms`: required, must be true
  - [ ] Export `RegisterFormData` type

### 2.2 API Functions
- [ ] **Task 2.2**: [FE] Add `register()` function to `apps/web/lib/api/auth.ts`
  - Define `RegisterRequest` interface
  - Define `RegisterResponse` interface
  - Implement POST request to `/auth/register`
  - Handle error responses

- [ ] **Task 2.3**: [FE] Add `checkEmail()` function to `apps/web/lib/api/auth.ts`
  - Define `CheckEmailResponse` interface
  - Implement GET request to `/auth/check-email`
  - Handle error responses

- [ ] **Task 2.4**: [FE] Create `apps/web/lib/api/countries.ts`
  - Define `Country` interface
  - Implement `getCountries()` function
  - GET request to `/api/countries`

### 2.3 Install Dependencies
- [ ] **Task 2.5**: [FE] Install `use-debounce` package
  ```bash
  cd apps/web && pnpm add use-debounce
  ```

---

## Phase 3: Frontend - UI Components

### 3.1 Password Strength Component
- [ ] **Task 3.1**: [FE] Create `apps/web/components/auth/password-strength.tsx`
  - [ ] Implement `calculatePasswordStrength()` function
    - Check length >= 8, >= 12
    - Check lowercase, uppercase, number, special char
    - Return score, level (weak/medium/strong), color, label, percentage
  - [ ] Create progress bar UI with color based on strength
  - [ ] Create requirements checklist with checkmarks
  - [ ] Export `PasswordStrength` component

### 3.2 Country Select Component
- [ ] **Task 3.2**: [FE] Create `apps/web/components/auth/country-select.tsx`
  - [ ] Fetch countries list on mount via `getCountries()`
  - [ ] Show loading state while fetching
  - [ ] Render select dropdown with flag + name
  - [ ] Call `onChange` with `{ code, dialCode }` on selection
  - [ ] Export `CountrySelect` component

### 3.3 Register Form Component
- [ ] **Task 3.3**: [FE] Create `apps/web/components/auth/register-form.tsx` - Form Setup
  - [ ] Setup `useForm` with `zodResolver(registerSchema)`
  - [ ] Setup state: `isLoading`, `apiError`, `emailStatus`, `selectedCountry`
  - [ ] Setup `showPassword`, `showConfirmPassword` toggles

- [ ] **Task 3.4**: [FE] Implement email availability check (debounced)
  - [ ] Use `useDebouncedCallback` (500ms)
  - [ ] Call `checkEmail()` API on email change
  - [ ] Update `emailStatus`: 'idle' | 'checking' | 'available' | 'taken'
  - [ ] Show status indicator icon (spinner, checkmark, X)

- [ ] **Task 3.5**: [FE] Implement form fields UI
  - [ ] Full Name input with validation error
  - [ ] Email input with availability status indicator
  - [ ] Country select with phone dial code prefix
  - [ ] Phone input with country dial code
  - [ ] Password input with show/hide toggle
  - [ ] Password strength indicator (conditional)
  - [ ] Confirm password input with show/hide toggle
  - [ ] Terms checkbox with links to Terms & Privacy

- [ ] **Task 3.6**: [FE] Implement form submission
  - [ ] Format phone with country dial code
  - [ ] Call `register()` API
  - [ ] Handle success: redirect to `/login?registered=true`
  - [ ] Handle error: show API error message
  - [ ] Disable submit when invalid, loading, or email taken

- [ ] **Task 3.7**: [FE] Add Social Buttons section
  - [ ] Reuse existing `SocialButtons` component
  - [ ] Add "OR CONTINUE WITH" divider

- [ ] **Task 3.8**: [FE] Add Login link footer
  - [ ] "Already have an account? Log in" link

### 3.4 Register Page
- [ ] **Task 3.9**: [FE] Create `apps/web/app/(auth)/register/page.tsx`
  - [ ] Add page metadata (title, description)
  - [ ] Add header with title and subtitle
  - [ ] Import and render `RegisterForm` component

### 3.5 Auth Redirect
- [ ] **Task 3.10**: [FE] Handle authenticated user redirect
  - [ ] Check if user is already logged in
  - [ ] Redirect to homepage if authenticated
  - [ ] Can be handled in `(auth)/layout.tsx` or middleware

---

## Phase 4: Testing

### 4.1 Backend Unit Tests
- [ ] **Task 4.1**: [TEST] Add register tests to `apps/server/src/modules/auth/auth.service.spec.ts`
  - [ ] Test: should create a new user successfully
  - [ ] Test: should throw ConflictException if email exists
  - [ ] Test: should hash password with bcrypt
  - [ ] Test: should normalize email to lowercase

- [ ] **Task 4.2**: [TEST] Add checkEmailAvailability tests
  - [ ] Test: should return available: true for new email
  - [ ] Test: should return available: false for existing email

### 4.2 Backend E2E Tests
- [ ] **Task 4.3**: [TEST] Create `apps/server/test/auth-register.e2e-spec.ts`
  - [ ] Test: POST /auth/register - should register new user (201)
  - [ ] Test: POST /auth/register - should return 409 for duplicate email
  - [ ] Test: POST /auth/register - should return 400 for invalid data
  - [ ] Test: POST /auth/register - should rate limit after 5 requests (429)
  - [ ] Test: GET /auth/check-email - available email
  - [ ] Test: GET /auth/check-email - taken email

### 4.3 Frontend Component Tests
- [ ] **Task 4.4**: [TEST] Create `apps/web/components/auth/__tests__/password-strength.test.tsx`
  - [ ] Test: shows Weak for short passwords
  - [ ] Test: shows Medium for decent passwords  
  - [ ] Test: shows Strong for complex passwords
  - [ ] Test: shows correct requirement checkmarks

- [ ] **Task 4.5**: [TEST] Create `apps/web/components/auth/__tests__/register-form.test.tsx`
  - [ ] Test: renders all form fields
  - [ ] Test: shows validation errors for empty required fields
  - [ ] Test: shows password strength indicator when typing
  - [ ] Test: shows error when passwords do not match
  - [ ] Test: disables submit when terms not checked
  - [ ] Test: calls register API on valid submit
  - [ ] Test: shows API error message on failure
  - [ ] Test: redirects to login on success

---

## Phase 5: Integration & QA

### 5.1 Manual Testing
- [ ] **Task 5.1**: [QA] Test happy path registration flow
  - [ ] Fill all fields correctly
  - [ ] Submit form
  - [ ] Verify user created in database
  - [ ] Verify redirect to login

- [ ] **Task 5.2**: [QA] Test validation scenarios
  - [ ] Empty required fields show errors
  - [ ] Invalid email format shows error
  - [ ] Weak password shows error
  - [ ] Mismatched passwords show error
  - [ ] Unchecked terms prevents submit

- [ ] **Task 5.3**: [QA] Test email availability check
  - [ ] New email shows green checkmark
  - [ ] Existing email shows red X and message
  - [ ] Loading state shows spinner

- [ ] **Task 5.4**: [QA] Test error scenarios
  - [ ] Duplicate email shows 409 error
  - [ ] Server error shows generic message
  - [ ] Rate limiting shows appropriate message

### 5.2 Responsive & Accessibility
- [ ] **Task 5.5**: [QA] Test responsive design
  - [ ] Desktop (>= 1024px): Two columns layout
  - [ ] Tablet (768px - 1024px): Adjusted layout
  - [ ] Mobile (< 768px): Single column, hero hidden

- [ ] **Task 5.6**: [QA] Test accessibility
  - [ ] All form fields have visible labels
  - [ ] Tab order follows visual layout
  - [ ] Error messages associated with fields (aria)
  - [ ] Password requirements announced to screen readers
  - [ ] Terms links open in new tab

---

## Summary

| Phase | Tasks | Estimated |
|-------|-------|-----------|
| Phase 1: Backend | 10 tasks | 4-6 hours |
| Phase 2: FE API/Validation | 5 tasks | 2-3 hours |
| Phase 3: FE UI Components | 10 tasks | 6-8 hours |
| Phase 4: Testing | 5 tasks | 3-4 hours |
| Phase 5: Integration & QA | 6 tasks | 2-3 hours |
| **Total** | **36 tasks** | **17-24 hours** |

---

## Dependencies Graph

```
Phase 1 (Backend)
    ├── Task 1.1-1.3 (DTOs) 
    │       ↓
    ├── Task 1.4-1.5 (Service) 
    │       ↓
    └── Task 1.6-1.7 (Controller)
    
    ├── Task 1.8-1.10 (Countries - independent)

Phase 2 (FE API) - depends on Phase 1
    ├── Task 2.1 (Validation Schema)
    ├── Task 2.2-2.4 (API Functions)
    └── Task 2.5 (Dependencies)

Phase 3 (FE UI) - depends on Phase 2
    ├── Task 3.1 (PasswordStrength) 
    ├── Task 3.2 (CountrySelect) - depends on Task 2.4
    ├── Task 3.3-3.8 (RegisterForm) - depends on 3.1, 3.2
    └── Task 3.9-3.10 (Page)

Phase 4 (Testing) - parallel with Phase 3
    ├── Task 4.1-4.3 (Backend tests) - after Phase 1
    └── Task 4.4-4.5 (Frontend tests) - after Phase 3

Phase 5 (QA) - after all phases
```

---

## Quick Start Commands

```bash
# Backend development
cd apps/server
pnpm dev

# Frontend development  
cd apps/web
pnpm dev

# Install frontend dependency
cd apps/web
pnpm add use-debounce

# Run backend tests
cd apps/server
pnpm test
pnpm test:e2e

# Run frontend tests
cd apps/web
pnpm test
```
