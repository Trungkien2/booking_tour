# FRONTEND AUTO-DEV PROJECT IMPLEMENTATION GUIDE v1.0

**Objective:** Standardize the workflow between Humans and AI to automate Frontend code writing with absolute precision, no ambiguity.

---

## I. Phase 1: Foundation Setup

This is a one-time step when starting the project. These documents serve as the "Ground Rules" for all features.

### 1. Required Documents:

**01. PRD:** Define project scope, Roles, and general feature list (MoSCoW).

**02. Architecture:** Define Tech Stack, folder structure, and Naming Conventions.

**04. Design System:** Establish color palette, Typography, and shared UI Components.

**06. Permission Matrix:** Permission matrix between Roles (Who can do what?).

**08. Global Mapper:** Common data transformation rules (e.g., snake_case → camelCase).

**09. Feature Toggle:** How to manage features in development or hidden.

---

## II. Phase 2: Feature Instantiation

When starting a new screen (e.g., User Management), don't use generic templates but must **Instantiate** them based on design (HTML/Images).

### 1. Implementation Process:

**Provide UI:** Give AI the HTML file or design images.

**Request AI to write specific Spec:** Command AI to create the following files for that specific screen:

**03. Screen Spec:** Define all 5 states (Loading, Success, Empty, Error, 403) and data field mapping.

**05. API Contract:** Endpoint, Request Body, Response JSON, and Error Codes.

**07. Acceptance Criteria:** Test scenarios in Given-When-Then format.

**08. Resource Mapper:** Detailed mapping of API data fields to UI for that screen.

---

## II.2 Folder Structure

All screen-related documents are organized in a single folder for easy access:

```
docs/
├── screens/                          # All screen specifications
│   ├── login/                        # Login screen (example)
│   │   ├── README.md                 # Overview & summary
│   │   ├── 01_screen_spec.md         # Screen specification
│   │   ├── 02_api_contract.md        # API contract
│   │   ├── 03_acceptance_criteria.md # Test scenarios
│   │   └── 04_resource_mapper.md     # Data mapper
│   │
│   ├── dashboard/                    # Dashboard screen
│   │   ├── README.md
│   │   ├── 01_screen_spec.md
│   │   ├── 02_api_contract.md
│   │   ├── 03_acceptance_criteria.md
│   │   └── 04_resource_mapper.md
│   │
│   └── user-management/              # User management screen
│       └── ... (same structure)
│
├── 01_PRD.md                         # Foundation documents
├── 02_FRONTEND_ARCHITECTURE.md
├── 04_DESIGN_SYSTEM.md
├── 06_PERMISSION_MATRIX.md
├── 08_GLOBAL_TRANSFORMATION_RULE.md
└── 09_FEATURE_TOGGLE_MATRIX.md
```

**Benefits:**

- ✅ All documents for one screen in one place
- ✅ Easy to find and navigate
- ✅ Scalable when adding new screens
- ✅ Clear numbering shows reading order (01 → 02 → 03 → 04)

---

## III. Phase 3: Execution and Code Writing

This is the most critical step to narrow the Scope and guide AI. We use Task Context Map to connect files together.

### 1. Create Task Context (Example for Login screen):

Send AI the configuration below before requesting code:

```yaml
# 00. TASK_CONTEXT: Login Screen Implementation

# Reference Master Files (Global Rules)
global_configs:
  - architecture: 'docs/02_FRONTEND_ARCHITECTURE.md'
  - design_system: 'docs/04_DESIGN_SYSTEM.md'
  - permission: 'docs/06_PERMISSION_MATRIX.md'
  - global_mapper: 'docs/08_GLOBAL_TRANSFORMATION_RULE.md'
  - feature_flags: 'docs/09_FEATURE_TOGGLE_MATRIX.md'

# Reference Screen-Specific Files (All in one folder)
screen_folder: 'docs/screens/login/'
screen_specs:
  - readme: 'docs/screens/login/README.md'
  - screen_spec: 'docs/screens/login/01_screen_spec.md'
  - api_contract: 'docs/screens/login/02_api_contract.md'
  - acceptance_criteria: 'docs/screens/login/03_acceptance_criteria.md'
  - resource_mapper: 'docs/screens/login/04_resource_mapper.md'

# Design Reference
design_files:
  - html: 'design/đăng_nhập_quản_trị_viên_1/code.html'
  - screenshot: 'design/đăng_nhập_quản_trị_viên_1/screen.png'
```

### 2. Sample Execution Prompt:

```
"Act as a Senior Frontend Developer. Based on the TASK_CONTEXT I just sent,
please implement the complete source code for this screen.

All screen documentation is in: docs/screens/login/
- Read README.md for overview
- Follow 01_screen_spec.md for all 5 states
- Use 02_api_contract.md for API integration
- Implement 03_acceptance_criteria.md test scenarios
- Apply 04_resource_mapper.md for data transformation

Design reference: design/đăng_nhập_quản_trị_viên_1/

Ensure:
- Compliance with folder structure in Architecture
- Apply Resource Mapper correctly (snake_case → camelCase)
- Handle all 5 screen states thoroughly
- Use mock data from resource mapper until API is ready"
```

---

## IV. Quality Checklist (Red Flags)

Before confirming code, check if AI has complied with the following:

- [ ] Is data hardcoded? (Must use Mapper to convert from API)
- [ ] Are Loading (Skeleton) and Empty states present?
- [ ] Do buttons show/hide correctly according to Permission Matrix?
- [ ] Do search/pagination scenarios match Acceptance Criteria?
- [ ] Are all API fields properly transformed using the mapper rules?
- [ ] Are error states handled with proper UX feedback?
- [ ] Are feature flags checked before rendering conditional features?
- [ ] Are null/undefined values displayed according to empty_display rules?

---

## V. Document Summary Table

| #   | Document Name       | Phase       | Purpose                        | AI Usage   |
| --- | ------------------- | ----------- | ------------------------------ | ---------- |
| 01  | PRD                 | Foundation  | Project scope and features     | ⭐⭐⭐     |
| 02  | Architecture        | Foundation  | Tech stack and structure       | ⭐⭐⭐⭐   |
| 04  | Design System       | Foundation  | UI styles and components       | ⭐⭐⭐⭐   |
| 06  | Permission Matrix   | Foundation  | Role-based access control      | ⭐⭐⭐⭐   |
| 08  | Global Mapper       | Foundation  | Data transformation rules      | ⭐⭐⭐⭐   |
| 09  | Feature Toggle      | Foundation  | Feature flag management        | ⭐⭐⭐     |
| 03  | Screen Spec         | Instantiate | Screen-specific specifications | ⭐⭐⭐⭐⭐ |
| 05  | API Contract        | Instantiate | API endpoints and contracts    | ⭐⭐⭐⭐⭐ |
| 07  | Acceptance Criteria | Instantiate | Test scenarios                 | ⭐⭐⭐     |
| 08  | Resource Mapper     | Instantiate | Screen-specific field mapping  | ⭐⭐⭐⭐   |

---

## VI. Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: FOUNDATION (One-time setup)                        │
│ ┌─────────┐  ┌──────────────┐  ┌──────────────┐            │
│ │   PRD   │→ │ Architecture │→ │Design System │            │
│ └─────────┘  └──────────────┘  └──────────────┘            │
│ ┌─────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│ │Permission Matrix│  │Global Mapper │  │Feature Toggle   │ │
│ └─────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: INSTANTIATE (Per screen)                           │
│ ┌────────────┐  ┌─────────────┐  ┌──────────────────────┐  │
│ │Screen Spec │→ │API Contract │→ │Acceptance Criteria   │  │
│ └────────────┘  └─────────────┘  └──────────────────────┘  │
│ ┌────────────────┐                                          │
│ │Resource Mapper │                                          │
│ └────────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: EXECUTE (Code generation)                          │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│ │Task Context  │→ │AI Generation │→ │Quality Check     │   │
│ └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## VII. Best Practices

### 1. Foundation Phase

- ✅ Complete all foundation documents before starting any screen
- ✅ Review and approve foundation docs with the team
- ✅ Keep foundation docs updated as project evolves

### 2. Instantiation Phase

- ✅ Always start with design (HTML/images)
- ✅ Create screen folder in `docs/screens/{screen-name}/`
- ✅ Create all 4 files: 01_screen_spec, 02_api_contract, 03_acceptance_criteria, 04_resource_mapper
- ✅ Add README.md for overview
- ✅ Use consistent naming for screen folders (lowercase with hyphens)

### 3. Execution Phase

- ✅ Always provide Task Context before asking AI to code
- ✅ Reference the screen folder path (e.g., `docs/screens/login/`)
- ✅ Review generated code against the checklist

---

## Version Control

| Version | Date       | Changes                                           |
| ------- | ---------- | ------------------------------------------------- |
| 1.0     | 2025-12-22 | Initial 3-phase workflow implementation           |
| 1.1     | 2025-12-22 | Updated folder structure: per-screen organization |

---

_This guide is designed for maximum AI code generation accuracy with minimal human intervention._
