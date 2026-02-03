# Scaffold Backend

Scaffold backend code structure for NestJS - create file structure and boilerplate only, NO business logic implementation.

**Input:** $ARGUMENTS

Expected format:
```
Task document: <task_file>.md
Technical Design Document: <tdd_file>.md
Phase: [Phase number, e.g., "Phase 1"]
```

## Tech Stack

- **Framework:** NestJS 10
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma 6
- **Validation:** class-validator
- **Architecture:** Controller – Service – Module

## Scaffold Rules

### 1. File Structure

```
apps/server/src/modules/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── dto/
│   ├── <action>.dto.ts
│   └── <action>-response.dto.ts
└── interfaces/ (if needed)
    └── <feature>.interface.ts
```

### 2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| File names | kebab-case | `register-response.dto.ts` |
| Classes | PascalCase | `RegisterDto`, `AuthService` |
| Methods | camelCase | `checkEmailAvailability()` |

### 3. What to Include

**DTOs:** All fields with class-validator decorators and validation messages

**Service:** Method signatures with proper return types, JSDoc comments, `// TODO: Implement business logic` for complex logic

**Controller:** Routes with decorators (`@Get`, `@Post`), `@HttpCode`, `@Throttle` as specified in TDD

**Module:** Register controllers and providers, import required modules

### 4. What NOT to Include

- Complex business logic (use TODO comments)
- Unit tests (separate task)
- Extra fields/methods not in TDD

## Workflow

1. Read TDD - Extract backend design section
2. Create DTOs - All request/response DTOs first
3. Create/Update Service - Add method signatures
4. Create/Update Controller - Add endpoints
5. Create/Update Module - Register everything
6. Register in AppModule - If new module
7. Check Lints - `pnpm lint`
8. Update Task Checklist - Mark tasks as `✅ (Scaffolded)`

## Output

After scaffolding, provide:
1. **Files Created/Updated** - Table with file paths and descriptions
2. **API Endpoints** - Table with Method, Path, Description
3. **Task Status** - Updated checklist items
4. **Commit Message** - Conventional commit format: `feat(module): scaffold [feature] backend structure`
