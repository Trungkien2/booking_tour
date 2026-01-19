## Task Checklist: Login Feature

**Backend (NestJS)**
- [x] Task 1: Create `AuthModule`, `AuthService`, and `AuthController`. ✅ (Scaffolded)
- [x] Task 2: Implement `LoginDto` with class-validator rules (email, minLength). ✅ (Scaffolded)
- [ ] Task 3: Implement `validateUser` in `AuthService` (check email, compare password bcrypt). 🚧 (TODO in code)
- [ ] Task 4: Implement `login` method in `AuthService` (generate JWT tokens). 🚧 (TODO in code)
- [x] Task 5: Implement `POST /auth/login` endpoint in `AuthController`. ✅ (Scaffolded)
- [x] Task 6: Implement Rate Limiting (`@nestjs/throttler`) for login endpoint. ✅ (Scaffolded - @Throttle decorator added)
- [ ] Task 7: Unit tests for `AuthService`.

**Frontend (Next.js)**
- [x] Task 8: Create `LoginForm` component (`apps/web/components/auth/login-form.tsx`) using React Hook Form and Zod. ✅ (Scaffolded)
- [x] Task 9: Implement `LoginPage` (`apps/web/app/(auth)/login/page.tsx`) integrating `LoginForm`. ✅ (Scaffolded)
- [x] Task 10: Implement API integration service (`apps/web/lib/api/auth.ts`) for calling `/auth/login`. ✅ (Scaffolded)
- [x] Task 11: Implement token storage logic (Cookies/Context). ✅ (Scaffolded - useAuth hook + token utils)
- [x] Task 12: Handle UI states (Loading, Error, Success/Redirect). ✅ (Scaffolded - states in LoginForm)
- [x] Task 13: Responsive styling (Mobile/Desktop views) matching design. ✅ (Scaffolded - Tailwind responsive classes)

**Integration & E2E**
- [ ] Task 14: Verify login flow from UI to Backend and DB.
- [ ] Task 15: Manual test: Invalid credentials, Rate limiting.

---

## 📝 Notes:
- ✅ = Completed (structure/scaffold ready)
- 🚧 = Needs implementation (TODO comments in code)
- Tasks 3, 4, 7, 14, 15 require business logic implementation
- All dependencies installed: `class-validator`, `class-transformer`
- See `SCAFFOLD_SUMMARY.md` for detailed file list
