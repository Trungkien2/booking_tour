# Tasks: Admin User Management

Breakdown from design and specs (SCR-013, `docs/screens/admin-users/README.md`).

## Backend (NestJS)

- [x] Add User model fields if needed: status/active, lastLoginAt (migration + Prisma)
- [x] Create admin users module: `apps/server/src/modules/users/` or dedicated `admin-users` module
- [x] Implement GET /admin/users (list with search, role, status, page, limit, sort)
- [x] Implement GET /admin/users/:id (user detail)
- [x] Implement POST /admin/users (create/invite: fullName, email, role, sendInvite)
- [x] Implement PATCH /admin/users/:id (update user)
- [x] Implement PATCH /admin/users/:id/role (body: { role })
- [x] Implement PATCH /admin/users/:id/status (body: { active })
- [x] Implement DELETE /admin/users/:id (soft delete)
- [x] Guard all admin user routes with JwtAuthGuard + RolesGuard(ADMIN)
- [x] Add DTOs and validation for each endpoint
- [x] Unit tests for admin user service; E2E for admin user endpoints

## Frontend (Next.js)

- [x] Add route `apps/web/app/admin/users/page.tsx` (list page)
- [x] Add route `apps/web/app/admin/users/[id]/page.tsx` (view profile, optional)
- [x] Page header: title, subtitle, "Add New User" button
- [x] Search input and filters: Role, Status, Sort (per design)
- [x] Users table: columns User, Role, Status, Last Login, Actions
- [x] Role badges (ADMIN/GUIDE/USER) and status indicators (active/inactive/pending)
- [x] Row actions: View Profile, Change Role, Deactivate/Activate, Delete
- [x] Add User modal: fullName, email, role, sendInvite
- [x] Change Role modal: radio options with descriptions
- [x] Pagination (e.g. 10 per page)
- [x] API client functions for all admin user endpoints
- [x] Wire admin users link in AdminSidebar

## Integration & QA

- [x] Verify only ADMIN can access /admin/users and APIs
- [x] Verify list filters, search, sort, pagination
- [x] Verify create, update role, activate/deactivate, soft delete flows
