# Code Style & Conventions - Booking Tour

## General Principles

- **TypeScript Strict Mode**: Always enabled
- **Type Safety**: Prefer explicit types over `any`
- **Consistency**: Follow existing patterns in the codebase
- **DRY**: Don't repeat yourself - extract reusable logic

## File Naming Conventions

### Backend (NestJS)

- **Modules**: `kebab-case.module.ts` (e.g., `tour-schedule.module.ts`)
- **Controllers**: `kebab-case.controller.ts` (e.g., `tour-schedule.controller.ts`)
- **Services**: `kebab-case.service.ts` (e.g., `tour-schedule.service.ts`)
- **DTOs**: `kebab-case.dto.ts` (e.g., `create-booking.dto.ts`)
- **Entities**: `kebab-case.entity.ts` (e.g., `tour.entity.ts`)
- **Guards**: `kebab-case.guard.ts` (e.g., `jwt-auth.guard.ts`)
- **Decorators**: `kebab-case.decorator.ts` (e.g., `current-user.decorator.ts`)
- **Tests**: `*.spec.ts` for unit tests, `*.e2e-spec.ts` for E2E tests

### Frontend (Next.js)

- **Pages**: `kebab-case/page.tsx` (e.g., `tour-details/page.tsx`)
- **Components**: `kebab-case.tsx` (e.g., `tour-card.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-booking-form.ts`)
- **Utils**: `camelCase.ts` (e.g., `formatPrice.ts`)
- **Types**: `kebab-case.types.ts` (e.g., `tour.types.ts`)
- **Styles**: `kebab-case.module.css` (e.g., `tour-card.module.css`)

### Shared Packages

- **Components**: `kebab-case.tsx` (e.g., `button.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `cn.ts` for class name utility)

## Code Naming Conventions

### Variables & Functions

- **camelCase**: For variables, functions, methods
  ```typescript
  const tourPrice = 100;
  function calculateTotal() {}
  const handleSubmit = () => {};
  ```

### Classes & Interfaces

- **PascalCase**: For classes, interfaces, types, enums
  ```typescript
  class TourService {}
  interface BookingDto {}
  type PaymentStatus = "PENDING" | "SUCCESS";
  enum UserRole {
    USER,
    ADMIN,
    GUIDE,
  }
  ```

### Constants

- **UPPER_SNAKE_CASE**: For true constants
  ```typescript
  const MAX_BOOKING_TRAVELERS = 10;
  const DEFAULT_PAGE_SIZE = 20;
  ```

### Private Members

- **Prefix with #** (modern) or **\_prefix** (legacy)
  ```typescript
  class TourService {
    #prisma: PrismaService; // Modern private field
    private _cache: Map; // Legacy private (if needed for decorators)
  }
  ```

## Import Organization

### Backend

```typescript
// 1. External dependencies
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@prisma/client";

// 2. Internal modules (absolute paths for cross-module)
import { AuthService } from "@/modules/auth/auth.service";

// 3. Relative imports (within same module)
import { CreateTourDto } from "./dto/create-tour.dto";
import { TourEntity } from "./entities/tour.entity";
```

### Frontend

```typescript
// 1. React & Next.js
import { useState, useEffect } from "react";
import Link from "next/link";

// 2. External dependencies
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 3. Shared packages
import { Button } from "@repo/ui/button";

// 4. Local imports
import { TourCard } from "@/components/tour-card";
import { formatPrice } from "@/lib/utils";
```

**Rules**:

- No `../../` more than 2 levels - use absolute imports or refactor
- Group imports by category with blank lines
- Sort alphabetically within each group

## TypeScript Style

### Type Annotations

```typescript
// ✅ Good: Explicit return types for public APIs
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: Inferred types for simple cases
const count = 5; // inferred as number
const items = ["a", "b"]; // inferred as string[]

// ❌ Bad: Unnecessary type annotation
const count: number = 5;
```

### Interfaces vs Types

- **Prefer `interface`** for object shapes (can be extended)
- **Use `type`** for unions, intersections, primitives

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

type UserRole = "USER" | "ADMIN" | "GUIDE";
type WithTimestamps = { createdAt: Date; updatedAt: Date };
```

### Avoid `any`

```typescript
// ❌ Bad
function process(data: any) {}

// ✅ Good
function process(data: unknown) {
  if (typeof data === "string") {
    // Type narrowing
  }
}

// ✅ Better: Use generics
function process<T>(data: T): T {
  return data;
}
```

## ESLint & Prettier

### Configuration

- Shared ESLint config: `@repo/eslint-config`
- Shared Prettier config: Root `prettier` in package.json
- Auto-fix on save (recommended in IDE)

### Key Rules

- **No unused variables**: Remove or prefix with `_`
- **Consistent quotes**: Single quotes for strings
- **Semicolons**: Required
- **Trailing commas**: Always (multiline)
- **Max line length**: 100 characters (soft limit)

## Git Commit Convention

Format: `type(scope): message`

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, config)

### Examples

```bash
feat(tours): add tour filtering by price range
fix(booking): prevent double booking on same schedule
docs(readme): update setup instructions
refactor(auth): extract JWT validation to guard
test(payments): add unit tests for refund service
chore(deps): upgrade prisma to 6.0.1
```

## Comments & Documentation

### JSDoc for Public APIs

```typescript
/**
 * Creates a new booking for the specified tour schedule.
 *
 * @param scheduleId - The ID of the tour schedule
 * @param travelers - List of travelers for the booking
 * @returns The created booking with payment details
 * @throws {NotFoundException} If schedule not found
 * @throws {BadRequestException} If schedule is full
 */
async createBooking(scheduleId: string, travelers: TravelerDto[]): Promise<Booking> {
  // Implementation
}
```

### Inline Comments

- Use sparingly - code should be self-explanatory
- Explain **why**, not **what**

```typescript
// ✅ Good: Explains reasoning
// Use optimistic locking to prevent race conditions on capacity
await this.prisma.tourSchedule.update({
  where: { id, version },
  data: { availableSlots: { decrement: 1 }, version: { increment: 1 } },
});

// ❌ Bad: States the obvious
// Increment version
version++;
```

## Testing Conventions

### Test File Structure

```typescript
describe("TourService", () => {
  describe("createTour", () => {
    it("should create a tour with valid data", async () => {
      // Arrange
      const dto = { name: "Test Tour", price: 100 };

      // Act
      const result = await service.createTour(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe("Test Tour");
    });

    it("should throw error if tour name already exists", async () => {
      // Test implementation
    });
  });
});
```

### Naming

- Test files: `*.spec.ts` (unit), `*.e2e-spec.ts` (E2E)
- Test descriptions: Use "should" statements
- Group related tests with `describe` blocks

## Next.js Specific

### Server vs Client Components

- **Default to Server Components** (no 'use client')
- **Use 'use client'** only when needed:
  - Event handlers (onClick, onChange, etc.)
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document, etc.)
- See `.cursor/rules/troubleshoot-next.md` for detailed guidance

### Tailwind v4 (Critical)

- All base resets (margin, padding, color) **must** be in `@layer base`
- Unlayered CSS has higher precedence than Tailwind utilities
- See `.cursor/rules/troubleshoot-next.md` section 5 for details
