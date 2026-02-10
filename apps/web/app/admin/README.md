# Admin Panel

## Overview

Admin panel for TravelCo booking tour platform. Provides interface for managing tours, bookings, users, and other administrative tasks.

## Access

**URL**: `/admin/login`

**Requirements**:

- Valid user account with `ADMIN` role
- Email and password credentials

## Features

### Authentication

- Secure login with email/password
- Role-based access control (ADMIN only)
- Session persistence with Zustand + localStorage
- Auto-redirect to login if not authenticated
- Auto-redirect to homepage if not admin

### Layout

- **Sidebar Navigation**: Quick access to all admin sections
- **Header**: User info and logout button
- **Responsive**: Mobile-friendly design

### Pages

#### Dashboard (`/admin`)

- Overview statistics (tours, bookings, revenue, users)
- Quick actions
- Recent activity (coming soon)

#### Tours (`/admin/tours`)

- List all tours
- Create new tour
- Edit existing tour
- Delete tour (soft delete)
- View statistics

#### Other Sections (Coming Soon)

- Bookings management
- User management
- Reviews moderation
- Payment tracking
- Settings

## Components

### Auth Components

- `AdminLoginForm`: Login form with admin-specific validation
- `AdminRouteGuard`: HOC to protect admin routes

### Layout Components

- `AdminHeader`: Top navigation with user info and logout
- `AdminSidebar`: Side navigation with menu items

## Security

### Route Protection

All admin routes (except `/admin/login`) are protected by `AdminRouteGuard`:

1. Checks if user is authenticated
2. Checks if user has ADMIN role
3. Redirects to login if not authenticated
4. Redirects to homepage if not admin

### Login Flow

```
1. User visits /admin/login
2. Enters email and password
3. API validates credentials
4. Check if user.role === 'ADMIN'
5. If admin: Store auth state → Redirect to /admin/tours
6. If not admin: Show error "Access denied"
```

### Logout Flow

```
1. User clicks logout button
2. Clear auth state (Zustand + localStorage)
3. Redirect to /admin/login
```

## Development

### Testing Login

1. Create admin user in database:

   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
   ```

2. Visit `/admin/login`

3. Enter credentials

4. Should redirect to `/admin/tours` on success

### Adding New Admin Pages

1. Create page in `apps/web/app/admin/[page-name]/page.tsx`
2. Add route to sidebar navigation in `components/admin/admin-sidebar.tsx`
3. Page is automatically protected by `AdminRouteGuard`

### Styling

- Uses Tailwind CSS
- Design tokens from `globals.css`
- Primary color: `#1392ec`
- Dark mode supported

## API Integration

### Endpoints Used

- `POST /auth/login` - Authenticate user
- `POST /auth/refresh` - Refresh access token
- Admin-specific endpoints under `/api/admin/*`

### Auth State

Managed by Zustand store (`lib/hooks/use-auth.ts`):

```typescript
{
  user: { id, email, role },
  accessToken: string,
  refreshToken: string
}
```

## Troubleshooting

### "Access denied" error

- Ensure user has ADMIN role in database
- Check `user.role` in auth state

### Redirect loop

- Clear browser localStorage
- Check if `AdminRouteGuard` is properly configured

### Session expired

- Refresh token mechanism should auto-refresh
- If fails, user is redirected to login

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Activity logs
- [ ] Role permissions (SUPER_ADMIN, ADMIN, MODERATOR)
- [ ] Bulk operations
- [ ] Export data (CSV, PDF)
- [ ] Real-time notifications
- [ ] Dark mode toggle in settings
