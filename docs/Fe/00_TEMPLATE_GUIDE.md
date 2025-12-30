# AI Frontend Auto-Development Documentation Standard v1.0

> This guide defines documentation standards that enable AI to automatically develop
> frontends "from start to finish."

---

## Core Principles

### 1. Zero Ambiguity

- Prohibit expressions like "as needed", "when necessary", "later", "similar to", "automatically"
- All values must be defined with specific numbers, enums, or explicit rules

### 2. Machine Readable

- Actively use YAML/JSON formats
- Use consistent key naming conventions
- Include example data as required

### 3. Completeness

- Define 5 states for all screens (loading/empty/error/permission/success)
- Define results for all user actions (success/error/validation)
- Define permission matrix for all roles

---

## Summary of 7 Required Documents

| #   | Document Name         | Core Purpose                        | AI Usage Level |
| --- | --------------------- | ----------------------------------- | -------------- |
| 01  | PRD                   | What to build (scope/goals)         | ⭐⭐⭐         |
| 02  | FRONTEND_ARCHITECTURE | How to build (tech stack/structure) | ⭐⭐⭐⭐       |
| 03  | SCREEN_SPEC           | How each screen works               | ⭐⭐⭐⭐⭐     |
| 04  | DESIGN_SYSTEM         | How it looks (styles/components)    | ⭐⭐⭐⭐       |
| 05  | API_CONTRACT          | How data is exchanged               | ⭐⭐⭐⭐⭐     |
| 06  | PERMISSION_MATRIX     | Who can do what                     | ⭐⭐⭐⭐       |
| 07  | ACCEPTANCE_CRITERIA   | How to verify                       | ⭐⭐⭐         |

---

## Document Writing Order (Recommended)

```
1. PRD (Confirm scope)
   ↓
2. PERMISSION_MATRIX (Confirm roles/permissions)
   ↓
3. API_CONTRACT (Confirm data structure)
   ↓
4. DESIGN_SYSTEM (Confirm UI specifications)
   ↓
5. SCREEN_SPEC (Detailed specs per screen)
   ↓
6. FRONTEND_ARCHITECTURE (Technical implementation design)
   ↓
7. ACCEPTANCE_CRITERIA (Verification criteria)
```

---

## Recommended Prompt When Providing Documents to AI

```
Please implement the [Page Name] page based on the following 7 documents:

1. PRD: docs/01_PRD.md
2. Architecture: docs/02_FRONTEND_ARCHITECTURE.md
3. Screen Spec: docs/03_SCREEN_SPEC.md (relevant screen section)
4. Design System: docs/04_DESIGN_SYSTEM.md
5. API Contract: docs/05_API_CONTRACT.md (relevant endpoints)
6. Permission: docs/06_PERMISSION_MATRIX.md
7. AC: docs/07_ACCEPTANCE_CRITERIA.md (relevant AC)

When implementing, please follow:
- Implement all 5 states (loading/empty/error/permission/success) from Screen Spec
- Handle events according to user action → result mapping
- Apply role-based button visibility rules from Permission Matrix
- Write tests based on Given/When/Then scenarios from AC
```

---

## Red Flags (Document Quality Checklist)

If any of the following items exist, the probability of AI auto-coding failure is high:

- [ ] Expressions like "as needed", "when necessary", "later", "similar to", "automatically" exist
- [ ] Screen states (loading/empty/error) not defined
- [ ] Actions after button click (toast/redirect/refresh) not defined
- [ ] API response fields don't match screens 1:1
- [ ] No role-based button visibility rules (just "handled by backend")
- [ ] No table sorting/filtering/pagination rules
- [ ] Nullable fields not indicated
- [ ] No UX definition for error cases

---

## Version Control

| Version | Date       | Changes                   |
| ------- | ---------- | ------------------------- |
| 1.0     | 2025-12-15 | Initial template creation |

---

_This guide is based on analysis of the ESG SaaS Platform project._
