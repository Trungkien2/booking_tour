# Design: Admin User Management

Design đã có sẵn tại **`docs/screens/admin-users/README.md`**. Tài liệu tham chiếu: `docs/Fe/design/admin_user_management/screen.png`, `docs/design/admin_user_management/code.html`.

## Reference

| Item       | Value           |
| ---------- | --------------- |
| Screen ID  | SCR-013         |
| Route      | `/admin/users`  |
| Access     | ADMIN only      |
| Layout     | Admin Layout    |

## UI Structure

### Page
- **Header**: Title "User Management", subtitle, primary action "Add New User".
- **Search**: Placeholder "Search users by name or email...".
- **Filters**: Role (All / Admin / Guide / Customer), Status (All / Active / Inactive / Pending), Sort (Newest / Oldest / Name A-Z).
- **Table**: Checkbox, User (avatar + name + email), Role (badge), Status (indicator), Last Login (relative), Actions (more menu).
- **Pagination**: Numbered, 10 per page.

### Modals
- **Add New User**: fullName, email, role (Customer/Guide/Admin), sendInvite checkbox.
- **Change Role**: Radio options Customer / Guide / Admin with descriptions; warning text.

### Row actions
- View Profile → `/admin/users/{id}`
- Change Role (modal)
- Deactivate / Activate (theo status)
- Delete (confirm)

### Role badges & status
- Role: ADMIN (red), GUIDE (blue), USER (gray "Customer").
- Status: active (green), inactive (red), pending (yellow).

## API (from docs)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/users` | List with query: search, role, status, page, limit, sort |
| GET | `/admin/users/:id` | User details |
| POST | `/admin/users` | Create (invite): fullName, email, role, sendInvite |
| PATCH | `/admin/users/:id` | Update user |
| PATCH | `/admin/users/:id/role` | Body: `{ role: "USER" \| "ADMIN" \| "GUIDE" }` |
| PATCH | `/admin/users/:id/status` | Body: `{ active: boolean }` |
| DELETE | `/admin/users/:id` | Soft delete |

## Data model implications

- **User** (Prisma): Đã có `role`. Cần thêm field trạng thái (e.g. `status: ACTIVE | INACTIVE | PENDING` hoặc `active: boolean`) và có thể `lastLoginAt` cho cột "Last Login". Thêm migration nếu cần.
- **Backend**: Module admin users (controller + service) bảo vệ bởi JWT + RolesGuard(ADMIN), gọi Prisma User.

## Frontend

- Route: `apps/web/app/admin/users/page.tsx` (và optional `[id]` cho view profile).
- Components: table, filters, Add User modal, Change Role modal, role badges, status indicators.
- Reuse: Admin layout (sidebar + header), pattern tương tự admin tours (filters, table, modals).
