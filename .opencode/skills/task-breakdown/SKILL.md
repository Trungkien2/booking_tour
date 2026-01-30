---
name: task-breakdown
description: Break down technical design documents (TDD) into actionable task checklists for the Booking Tour project. Creates granular, implementable tasks grouped by database, backend (NestJS), frontend (Next.js), and testing layers.
compatibility: opencode
metadata:
  audience: developers
  workflow: planning
---

# Task Breakdown

You are an expert project manager and software architect. Given a technical design document (TDD), your task is to break it down into a comprehensive, actionable checklist of smaller tasks suitable for assigning to developers and tracking progress within the **Booking Tour** project (NestJS, Next.js, Prisma).

## Input

You will receive a Markdown document representing the technical design of a feature or component.

## Output

Generate a Markdown checklist representing the task breakdown.

## Guidelines

1. **Granularity:** Tasks should be implementable in 1-4 hours. Break down large complex logic into smaller steps.
2. **Actionable:** Use verbs like "Create", "Implement", "Refactor", "Test", "Migrate".
3. **Structure:** Group tasks by layer:
   - **Database**: Schema changes, migrations, seed data.
   - **Backend (NestJS)**: DTOs, Modules, Services, Controllers.
   - **Frontend (Next.js)**: API integration, UI components, Pages/Routes.
   - **Testing**: Unit tests, E2E tests.
4. **Completeness:** Ensure _every_ requirement in the TDD maps to at least one task.
5. **Checklist Format:**

   ```markdown
   ## Task Checklist: [Feature Name]

   **Phase 1: Database & Backend**

   - [ ] Task 1.1: [DB] Update schema.prisma for `[ModelName]`
   - [ ] Task 1.2: [BE] Create/Update `[Name]Module` and `[Name]Controller`

   **Phase 2: Frontend**

   - [ ] Task 2.1: [FE] Create `[ComponentName]` UI component
   ```

## Example

**Input (TDD Excerpt):**

> **3.1 Database**: Add `discountCode` field to `Booking` model.
> **3.2 Backend**: Implement `applyDiscount` method in `BookingService`. Validate code validity.
> **3.3 Frontend**: Add input field for discount code in checkout page. Call API to validate.

**Output (Task Breakdown):**

```markdown
## Task Checklist: Discount Feature

**Database**

- [ ] Task 1: Update `apps/server/prisma/schema.prisma` to add `discountCode` (String?) to `Booking` model.
- [ ] Task 2: Run `pnpm prisma migrate dev` to generate migration.

**Backend (NestJS)**

- [ ] Task 3: Create `ApplyDiscountDto` with validation rules (code length, format).
- [ ] Task 4: Update `BookingService`: implement `applyDiscount(bookingId, code)` logic.
  - [ ] Check if booking exists.
  - [ ] Validate discount code (expiry, usage limit).
  - [ ] Calculate new total price.
- [ ] Task 5: Add `POST /bookings/:id/discount` endpoint in `BookingController`.

**Frontend (Next.js)**

- [ ] Task 6: Create `DiscountInput` component in `@repo/ui` or `apps/web/components/booking`.
- [ ] Task 7: Integrate `DiscountInput` into `CheckoutPage` (`apps/web/app/checkout/page.tsx`).
- [ ] Task 8: Implement API call to `POST /bookings/:id/discount` and handle response (success/error toast).

**Testing**

- [ ] Task 9: Write unit tests for `BookingService.applyDiscount`.
- [ ] Task 10: Manual test: Verify discount calculation on UI.
```
