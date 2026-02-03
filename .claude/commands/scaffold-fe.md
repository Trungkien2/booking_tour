# Scaffold Frontend

Scaffold frontend code structure for Next.js - create file structure and boilerplate only, NO complex logic implementation.

**Input:** $ARGUMENTS

Expected format:
```
Task document: <task_file>.md
Technical Design Document: <tdd_file>.md
Phase: [Phase number, e.g., "Phase 2"]
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** `@repo/ui`, Shadcn UI
- **Form:** react-hook-form + zod
- **State:** React hooks, Context (minimal)

## Scaffold Rules

### 1. File Structure

```
apps/web/
├── app/
│   └── (auth)/
│       └── [route]/
│           └── page.tsx
├── components/
│   └── [feature]/
│       └── [component].tsx
├── lib/
│   ├── api/
│   │   └── [feature].ts
│   └── validations/
│       └── [feature].ts
└── types/
    └── [feature].ts (if needed)
```

### 2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| File names | kebab-case | `register-form.tsx` |
| Components | PascalCase | `RegisterForm` |
| Functions | camelCase | `calculateStrength()` |
| Hooks | camelCase with `use` | `useAuth()` |

### 3. What to Include

**Page (`page.tsx`):** Metadata, Server Component by default, import main component

**Components:** `'use client'` if needed, Props interface, basic JSX, `// TODO: Implement` for complex logic

**Validation Schema (`lib/validations/`):** Zod schemas with all fields, export types

**API Functions (`lib/api/`):** Interface definitions, function signatures, basic fetch

### 4. What NOT to Include

- Complex state management logic (use TODO)
- Unit tests (separate task)
- Extra fields/components not in TDD

## Workflow

1. Read TDD - Extract frontend design section
2. Install Dependencies - If new packages needed
3. Create Validation Schema - Zod schemas first
4. Create API Functions - Types and fetch functions
5. Create Components - From smallest to largest
6. Create Page - Import and compose components
7. Check Lints - `pnpm lint`
8. Update Task Checklist - Mark tasks as `✅ (Scaffolded)`

## Output

After scaffolding, provide:
1. **Files Created/Updated** - Table with file paths
2. **Components** - Table with Component, Type (Server/Client), Description
3. **Task Status** - Updated checklist items
4. **Commit Message** - `feat(fe): scaffold [feature] frontend structure`
