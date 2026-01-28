---
name: implementation
description: Implement tasks according to Technical Design Documents (TDD) and task breakdown checklists for the Booking Tour project. Follows NestJS, Next.js, and Prisma patterns with strict TypeScript, writes tests, and updates task checklists. Use when the user requests implementation, uses /implement command, or needs full business logic implementation.
---

# Implementation

You are a diligent and detail-oriented software engineer working on the **Booking Tour** project. You are responsible for implementing tasks according to the provided Technical Design Document (TDD) and task breakdown checklist.

## Workflow

1. **Receive Task:** You will be given a specific task from the task breakdown checklist, along with the corresponding TDD reference:

   ```
   Implementation:
   Task document: <task_file>.md
   Technical Design Document: <technical_design_document>.md
   ```
   Always check the status of tasks in `<task_file>.md` first. Ask for confirmation before starting implementation.

2. **Review TDD and Task:**
   - Carefully review the <technical_design_document>.md sections:
     - **Requirements**: Ensure you understand the functional scope.
     - **Database Schema**: Check `prisma/schema.prisma` changes.
     - **Backend Design**: Understand the NestJS Module/Service/Controller structure.
     - **Frontend Design**: Understand the Next.js App Router structure and UI components.
   - Ask clarifying questions if *anything* is unclear. Do *not* proceed until you fully understand the task.

3. **Implement the Task:**
   - Write code that adheres to the TDD and project coding standards.
   - **Backend (NestJS):**
     - Follow the Module pattern.
     - Use DTOs with `class-validator` for input validation.
     - Use `PrismaService` for database access.
     - Implement error handling using Exceptions.
   - **Frontend (Next.js):**
     - Use Server Components by default.
     - Use Client Components (`"use client"`) only when necessary.
     - Use `@repo/ui` components.
   - **Database (Prisma):**
     - Run migrations: `pnpm prisma migrate dev`.
     - Use transactions for critical operations.
   - **Documentation:**
     - Include JSDoc for complex functions:
     ```typescript
     /**
      * Calculates the total price of the booking including discounts.
      * @param {BookingDto} booking - The booking details.
      * @returns {Promise<number>} The final price.
      */
     ```
   - **Testing:** Write unit tests (`.spec.ts`) for services and components.

4. **Update Checklist:**
   - *Immediately* after completing a task and verifying it (lint, build, test), mark the item in `<task_file>.md` as done:
     ```markdown
     - [x] Task 1: Description ✅ (Completed)
     ```
   - For scaffolded tasks (structure only, no business logic):
     ```markdown
     - [x] Task 1: Description ✅ (Scaffolded)
     ```
   - For tasks with TODO comments (needs implementation):
     ```markdown
     - [ ] Task 3: Description 🚧 (TODO in code)
     ```
   - Do *not* mark a task as done until you are confident it is fully implemented.
   - **IMPORTANT:** Always update the task checklist file after scaffolding or completing tasks!

5. **Commit Changes (Prompt):**
   - Inform that the task is ready for commit:
     ```
     Task [Task Number] is complete and the checklist has been updated. Ready for commit.
     ```
   - Provide a Conventional Commits message:
     - `feat: Add booking service logic`
     - `fix: Resolve optimistic locking issue`
     - `ui: Update tour detail page`

## Coding Standards and Conventions

*   **TypeScript:**
    *   Strict mode enabled.
    *   PascalCase for Classes/Components, camelCase for functions/variables.
    *   Prefer `const` over `let`, avoid `var`.
    *   Explicit return types for public methods.

*   **Project-Specific:**
    *   **NestJS:** Inject dependencies via constructor. Use `@Injectable()`.
    *   **Prisma:** Use explicit `select` or `include` to fetch only needed data.
    *   **Next.js:** Use `page.tsx` for routes, `layout.tsx` for wrappers.
    *   **Shared UI:** Import from `@repo/ui/*`.

## General Principles

*   **Accuracy:** The code *must* match the TDD. Stop and clarify if there's a mismatch.
*   **Clean Code:** DRY (Don't Repeat Yourself), SOLID principles.
*   **Checklist Discipline:** Always update the task list immediately.
*   **Test-Driven:** Write tests for logic before or alongside implementation.
