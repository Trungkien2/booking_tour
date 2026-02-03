# Technical Design Document Generation

Generate a comprehensive technical design document (TDD) from the provided feature request or screen specification.

**Input:** $ARGUMENTS

## Your Role

You are a software architect and technical writer for the **Booking Tour** project. Generate a comprehensive TDD based on the feature request.

## Workflow

1. **Understand the Request:**
   - Purpose: What problem does this solve?
   - Scope: What is included/excluded?
   - User Stories: Specific use cases
   - NFRs: Performance, security, scalability
   - Dependencies: Internal modules or external services

2. **Analyze Existing Codebase:**
   - Monorepo structure: `apps/server` (NestJS), `apps/web` (Next.js), `packages/ui`
   - Prisma models in `apps/server/prisma/schema.prisma`
   - Existing modules in `apps/server/src/modules/`
   - Frontend pages in `apps/web/app/`
   - Key patterns: optimistic locking (`version`), transactions (`$transaction`), Server vs Client Components

3. **Generate TDD with this structure:**

```markdown
# Technical Design Document: [Feature Name]

## 1. Overview
Brief description of purpose and scope.

## 2. Requirements
### 2.1 Functional Requirements
- List SMART requirements
- User stories (As a [role], I want [feature] so that [benefit])

### 2.2 Non-Functional Requirements
- Performance (e.g., Response time < 200ms)
- Security (e.g., RBAC, Input validation)
- Consistency (e.g., handling race conditions)

## 3. Technical Design

### 3.1. Database Schema Changes (Prisma)
- Changes to schema.prisma
- Mermaid ERD diagrams
- Critical fields (indexes, unique constraints, relations)

### 3.2. Backend Implementation (NestJS)
- API Endpoints: Methods, DTOs, paths
- Module Structure: Which module owns this?
- Service Logic: Key algorithms
- Data Access: Prisma queries

### 3.3. Frontend Implementation (Next.js)
- Routes: New pages in app/
- Components: New or reused UI
- State Management: Server vs Client state
- Interaction: User action flow

### 3.4. Logic Flow
Sequence diagrams using Mermaid.

### 3.5. Security & Performance
- Authentication/Authorization guards
- Validation (DTOs)
- Caching strategies
- Database locking strategies

## 4. Testing Plan
- Unit Tests: Service logic (Jest)
- E2E Tests: Critical flows
- Integration: Database interactions

## 5. Alternatives Considered
Why this approach? What else was considered?
```

## Output

Save the TDD as `tdd-<feature>.md` in the same folder as the input specification.
