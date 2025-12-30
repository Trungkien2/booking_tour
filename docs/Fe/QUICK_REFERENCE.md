# Quick Reference: Screen Documentation Structure

> Fast guide for creating new screen specifications

---

## Folder Structure

```
docs/screens/{screen-name}/
├── README.md                 # Overview & summary
├── 01_screen_spec.md         # Screen specification (5 states)
├── 02_api_contract.md        # API endpoints & contracts
├── 03_acceptance_criteria.md # Test scenarios (Given-When-Then)
└── 04_resource_mapper.md     # Data transformation rules
```

---

## Quick Start: New Screen

### Step 1: Create Folder

```bash
mkdir -p docs/screens/{screen-name}
```

### Step 2: Create Files

```bash
cd docs/screens/{screen-name}
touch README.md
touch 01_screen_spec.md
touch 02_api_contract.md
touch 03_acceptance_criteria.md
touch 04_resource_mapper.md
```

### Step 3: Fill Content

Use templates from:

- `docs/03_SCREEN_SPEC_TEMPLATE.md`
- `docs/05_API_CONTRACT_TEMPLATE.md`
- `docs/07_ACCEPTANCE_CRITERIA_TEMPLATE.md`
- `docs/08_GLOBAL_TRANSFORMATION_RULE.MD`

---

## Naming Convention

| Type      | Format                         | Example                                 |
| --------- | ------------------------------ | --------------------------------------- |
| Folder    | lowercase-with-hyphens         | `login`, `user-management`, `dashboard` |
| Files     | Numbered with descriptive name | `01_screen_spec.md`                     |
| Screen ID | SCR-{NAME}-{NUM}               | `SCR-LOGIN-001`                         |
| API ID    | API-{NAME}-{NUM}               | `API-LOGIN-001`                         |

---

## Task Context Template

```yaml
# 00. TASK_CONTEXT: {Screen Name} Implementation

# Reference Master Files (Global Rules)
global_configs:
  - architecture: 'docs/02_FRONTEND_ARCHITECTURE.md'
  - design_system: 'docs/04_DESIGN_SYSTEM.md'
  - permission: 'docs/06_PERMISSION_MATRIX.md'
  - global_mapper: 'docs/08_GLOBAL_TRANSFORMATION_RULE.md'
  - feature_flags: 'docs/09_FEATURE_TOGGLE_MATRIX.md'

# Reference Screen-Specific Files (All in one folder)
screen_folder: 'docs/screens/{screen-name}/'
screen_specs:
  - readme: 'docs/screens/{screen-name}/README.md'
  - screen_spec: 'docs/screens/{screen-name}/01_screen_spec.md'
  - api_contract: 'docs/screens/{screen-name}/02_api_contract.md'
  - acceptance_criteria: 'docs/screens/{screen-name}/03_acceptance_criteria.md'
  - resource_mapper: 'docs/screens/{screen-name}/04_resource_mapper.md'

# Design Reference
design_files:
  - html: 'design/{screen-name}/code.html'
  - screenshot: 'design/{screen-name}/screen.png'
```

---

## Examples

### Existing Screens

- ✅ `docs/screens/login/` - Admin login page

### Future Screens (Examples)

- `docs/screens/dashboard/` - Main dashboard
- `docs/screens/user-management/` - User CRUD
- `docs/screens/reports/` - Reports page
- `docs/screens/settings/` - Settings page

---

## Checklist: New Screen

- [ ] Create folder: `docs/screens/{screen-name}/`
- [ ] Create README.md with overview
- [ ] Create 01_screen_spec.md (all 5 states)
- [ ] Create 02_api_contract.md (endpoints + mock data)
- [ ] Create 03_acceptance_criteria.md (test scenarios)
- [ ] Create 04_resource_mapper.md (transformations)
- [ ] Add design files to `design/{screen-name}/`
- [ ] Update this reference if needed

---

**Last Updated**: 2025-12-22  
**Version**: 1.1
