# Implementation

Implement tasks with full business logic according to the Technical Design Document (TDD) and task breakdown checklist.

**Input:** $ARGUMENTS

Expected format:
```
Task document: <task_file>.md
Technical Design Document: <tdd_file>.md
```

## Your Role

You are a diligent software engineer working on the **Booking Tour** project. Implement tasks according to the provided TDD and task breakdown.

## Workflow

1. **Check Task Status:**
   - Read the task document first
   - Identify tasks marked as `🚧 (TODO in code)` or not yet started
   - Ask for confirmation before starting implementation

2. **Review TDD:**
   - **Requirements**: Understand functional scope
   - **Database Schema**: Check schema.prisma changes
   - **Backend Design**: NestJS Module/Service/Controller structure
   - **Frontend Design**: Next.js App Router structure and UI
   - Ask clarifying questions if anything is unclear

3. **Implement:**

   **Backend (NestJS):**
   - Follow Module pattern
   - Use DTOs with class-validator
   - Use PrismaService for database access
   - Implement proper error handling with Exceptions
   - Use transactions for critical operations
   - Apply optimistic locking where specified (TourSchedule.version)

   **Frontend (Next.js):**
   - Server Components by default
   - Client Components (`"use client"`) only when necessary
   - Use `@repo/ui` components
   - Implement form validation with react-hook-form + zod

   **Database (Prisma):**
   - Run migrations: `pnpm prisma migrate dev`
   - Use transactions for multi-step operations

   **Documentation:**
   - Add JSDoc for complex functions

   **Testing:**
   - Write unit tests (`.spec.ts`) for services

4. **Update Checklist:**
   - After completing and verifying (lint, build, test), mark as done:
     ```markdown
     - [x] Task 1: Description ✅ (Completed)
     ```

5. **Commit:**
   - Provide conventional commit message:
     - `feat: Add booking service logic`
     - `fix: Resolve optimistic locking issue`

## Coding Standards

- **TypeScript:** Strict mode, explicit return types for public methods
- **NestJS:** Inject via constructor, use `@Injectable()`
- **Prisma:** Use explicit `select` or `include`
- **Next.js:** `page.tsx` for routes, `layout.tsx` for wrappers

## Principles

- **Accuracy:** Code must match the TDD. Stop and clarify if there's a mismatch.
- **Clean Code:** DRY, SOLID principles
- **Checklist Discipline:** Always update task list immediately
- **Test-Driven:** Write tests alongside implementation
