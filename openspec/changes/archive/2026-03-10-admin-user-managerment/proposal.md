# Proposal: Admin User Management

## Why

Admins need a dedicated area to manage platform users (list, search, view details, change roles, deactivate). Currently there is no admin UI for user management.

## What Changes

- Add **Admin User Management** under `/admin/users` (or chosen route).
- List users with filters (role, status, search).
- View user detail and edit role (USER / ADMIN / GUIDE).
- Optional: deactivate/activate accounts.
- Reuse existing admin layout (AdminHeader, AdminSidebar); integrate with existing auth and roles.

## Capabilities

### New Capabilities

- `admin-user-management`: Admin-only UI to list, filter, view, and manage users (roles, status). Backend may need endpoints for listing users and updating role/status.

### Modified Capabilities

- None (or reference existing admin layout / auth if needed).

## Impact

- **Frontend**: New route under `apps/web/app/admin/users/`, components for user list, filters, detail/edit.
- **Backend**: Possibly new or extended endpoints in `apps/server` for admin user list and update (if not already present).
- **Dependencies**: Existing admin layout, JWT + RolesGuard (ADMIN), Prisma User model.
