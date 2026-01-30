---
name: scaffold-backend
description: Scaffold backend code structure for the Booking Tour project using NestJS 10. Creates file structure and boilerplate only (modules, controllers, services, DTOs) without complex business logic.
compatibility: opencode
metadata:
  audience: developers
  workflow: scaffolding
---

# Scaffold Backend

You are scaffolding backend code for the **Booking Tour** project using NestJS. Your goal is to create the **file structure and boilerplate only** - NO business logic implementation.

## Input Required

```
Task document: <task_file>.md
Technical Design Document: <tdd_file>.md
Phase: [Phase number, e.g., "Phase 1"]
```

## Tech Stack

- **Platform:** Backend
- **Framework:** NestJS 10
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma 7
- **Validation:** class-validator
- **Architecture:** Controller – Service – Module

## Scaffold Rules

### 1. File Structure

Create files following this pattern:

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

| Type       | Convention | Example                      |
| ---------- | ---------- | ---------------------------- |
| File names | kebab-case | `register-response.dto.ts`   |
| Classes    | PascalCase | `RegisterDto`, `AuthService` |
| Methods    | camelCase  | `checkEmailAvailability()`   |
| Variables  | camelCase  | `hashedPassword`             |

### 3. What to Include

**DTOs:**

- Define all fields with proper decorators from `class-validator`
- Add validation messages
- Use JSDoc for complex DTOs

**Service:**

- Define method signatures with proper return types
- Import necessary dependencies
- Add JSDoc comments describing what the method should do
- Use `// TODO: Implement business logic` for complex logic OR implement if straightforward

**Controller:**

- Define routes with proper decorators (`@Get`, `@Post`, etc.)
- Add `@HttpCode`, `@Throttle` as specified in TDD
- Inject DTOs via `@Body()`, `@Query()`, `@Param()`
- Add JSDoc for each endpoint

**Module:**

- Register controllers and providers
- Import required modules (PrismaModule, etc.)

### 4. What NOT to Include

- Complex business logic (use TODO comments)
- Unit tests (separate task)
- E2E tests (separate task)
- Extra fields/methods not in TDD

### 5. Code Templates

**DTO Template:**

```typescript
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

/**
 * DTO for [action] request.
 */
export class [Name]Dto {
  @IsNotEmpty({ message: '[Field] is required' })
  @IsString()
  fieldName: string;
}
```

**Service Template:**

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class [Feature]Service {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * [Description of what this method does]
   * @param dto - [Description]
   * @returns [Return description]
   */
  async methodName(dto: SomeDto): Promise<ResponseDto> {
    // TODO: Implement business logic
    throw new Error('Not implemented');
  }
}
```

**Controller Template:**

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('[route]')
export class [Feature]Controller {
  constructor(private readonly service: [Feature]Service) {}

  /**
   * [Endpoint description]
   */
  @Post('[path]')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async methodName(@Body() dto: SomeDto) {
    return this.service.methodName(dto);
  }
}
```

## Workflow

1. **Read TDD** - Extract backend design section
2. **Create DTOs** - All request/response DTOs first
3. **Create/Update Service** - Add method signatures
4. **Create/Update Controller** - Add endpoints
5. **Create/Update Module** - Register everything
6. **Register in AppModule** - If new module
7. **Check Lints** - Ensure no errors
8. **Update Task Checklist** - Mark tasks as `(Scaffolded)`

## Output Format

After scaffolding, provide:

1. **Files Created/Updated** - Table with file paths and descriptions
2. **API Endpoints** - Table with Method, Path, Description
3. **Task Status** - Updated checklist items
4. **Commit Message** - Conventional commit format

```
feat(module): scaffold [feature] backend structure

- Add [Dto] with validation
- Add [Service] method signatures
- Add [Controller] endpoints
- Register in AppModule
```
