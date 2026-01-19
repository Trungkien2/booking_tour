# Frontend Rules - Next.js

## Cấu trúc thư mục

```
app/
├── (auth)/          # Route groups
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── my-bookings/
│   └── profile/
├── api/             # API routes (nếu cần)
├── components/      # Page-specific components
└── lib/             # Utilities, hooks
```

## Quy tắc Next.js 16

1. **App Router**:
   - Sử dụng `app/` directory (không phải `pages/`)
   - Server Components mặc định
   - Client Components khi cần: `"use client"`

2. **Data Fetching**:
   - Server Components: Direct fetch hoặc async components
   - Client Components: React Query hoặc SWR
   - API Routes: Chỉ khi cần proxy hoặc server-side logic

3. **Styling**:
   - CSS Modules cho component styles
   - Global styles trong `app/globals.css`
   - Shared UI từ `@repo/ui` package

4. **State Management**:
   - Server state: React Query
   - Client state: useState, useReducer, hoặc Zustand nếu phức tạp
   - Form state: React Hook Form

## Component Patterns

1. **Server Components** (default):
   ```tsx
   // app/tours/page.tsx
   export default async function ToursPage() {
     const tours = await fetchTours();
     return <ToursList tours={tours} />;
   }
   ```

2. **Client Components**:
   ```tsx
   "use client";
   export function BookingForm() {
     const [loading, setLoading] = useState(false);
     // ...
   }
   ```

3. **Shared Components**:
   - Từ `@repo/ui`: `<Button>`, `<Card>`, etc.
   - Import: `import { Button } from "@repo/ui/button"`

## API Integration

- API base URL: `process.env.NEXT_PUBLIC_API_URL`
- Error handling: Try-catch với user-friendly messages
- Loading states: Skeleton screens hoặc spinners
- Optimistic updates: Khi có thể

## Performance

- Image optimization: Next.js `<Image>` component
- Code splitting: Automatic với App Router
- Lazy loading: Dynamic imports cho heavy components
