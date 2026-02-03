# Troubleshoot – Next.js App Router (Không tái phạm)

Rule này ghi lại các lỗi thường gặp khi làm việc với Next.js 16 App Router và cách xử lý để tránh lặp lại.

---

## 1. Event handlers không được truyền từ Server Component

### Lỗi

```
Error: Event handlers cannot be passed to Client Component props.
  <form className=... onSubmit={function onSubmit} ...>
  If you need interactivity, consider converting part of this to a Client Component.
```

### Nguyên nhân

- **Server Component** (mặc định) không thể chứa hoặc truyền **function** (onClick, onSubmit, onChange...) vì không serialize được qua RSC payload.
- Bất kỳ component nào dùng **event handler** hoặc **client-only hooks** phải là **Client Component**.

### Cách xử lý

- Thêm **`'use client';`** ở **dòng đầu tiên** của file component (trước mọi import).
- Đảm bảo **không có ký tự thừa** (BOM, space) trước `'use client'`.

### Component cần `'use client'` khi có ít nhất một trong các thứ sau

| Dấu hiệu | Ví dụ |
|----------|--------|
| Event handlers | `onClick`, `onSubmit`, `onChange`, `onBlur`, `onFocus` |
| React hooks client-only | `useState`, `useReducer`, `useEffect`, `useTransition` |
| Next client APIs | `useRouter`, `useSearchParams`, `usePathname` |
| Browser APIs | `window`, `document`, `localStorage` |
| Form có `onSubmit` | `<form onSubmit={handleSubmit}>` |

### Ví dụ đúng

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function HeroSection({ initialSearch }: { initialSearch?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch ?? '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Component thường dễ quên thêm `'use client'`

- **Layout components** được render từ `layout.tsx` (Server): Header/Footer có **form** (ví dụ subscribe) hoặc **button có onClick** → phải `'use client'`.
- **Card/Item** có nút favorite, like, **onClick** (kể cả `e.preventDefault()`) → phải `'use client'`.
- **Form** (login, search, filter, subscribe) → luôn đặt trong Client Component.

---

## 2. Barrel export (index.ts) và Client boundary

### Triệu chứng

- Component đã có `'use client'` nhưng vẫn báo lỗi "Event handlers cannot be passed to Client Component props".
- Lỗi có thể trỏ vào component **khác** trong cây (ví dụ `<SiteFooter />`) do serialization fail ở boundary.

### Nguyên nhân

- Import qua barrel: `import { HeroSection } from '@/components/tours'`.
- Một số trường hợp bundler/Next không nhận đúng **client boundary** từ re-export.

### Cách xử lý

- **Ưu tiên**: Import trực tiếp từ file component khi component đó là Client:
  ```ts
  import { HeroSection } from '@/components/tours/hero-section';
  ```
- Giữ barrel cho component **không** có event/hooks (Server-safe).
- Nếu vẫn lỗi: xóa cache và chạy lại: `rm -rf apps/web/.next && pnpm dev`.

---

## 3. Checklist trước khi tạo/sửa component (Next App Router)

Trước khi tạo hoặc sửa component, tự hỏi:

1. **Component có dùng bất kỳ thứ nào sau đây không?**
   - [ ] `onClick`, `onSubmit`, `onChange`, `onBlur`, `onFocus`, …
   - [ ] `useState`, `useEffect`, `useTransition`, `useReducer`
   - [ ] `useRouter`, `useSearchParams`, `usePathname`
   - [ ] `<form onSubmit={...}>` hoặc `<button onClick={...}>` (kể cả chỉ `preventDefault`)

2. **Nếu có bất kỳ ô nào trên → thêm `'use client'` ngay từ đầu.**

3. **Component được render từ đâu?**
   - Từ `layout.tsx` (root hoặc nested) → nếu có interactivity, **bắt buộc** Client Component.
   - Từ `page.tsx` async (Server) → component có event/hooks phải là Client.

4. **Có đang truyền function xuống con không?**
   - Server Component **không được** truyền prop là function (callback) xuống component. Component nhận callback phải là Client Component và callback được định nghĩa **bên trong** Client Component đó.

---

## 4. Tóm tắt nhanh

| Tình huống | Hành động |
|------------|-----------|
| Component có form với `onSubmit` | Thêm `'use client'` |
| Component có `useState` / `useRouter` / `useSearchParams` | Thêm `'use client'` |
| Component có `<button onClick={...}>` (kể cả preventDefault) | Thêm `'use client'` |
| Layout (Header/Footer) có form hoặc nút có onClick | Thêm `'use client'` vào Header/Footer |
| Lỗi "Event handlers cannot be passed..." nhưng component đã có 'use client' | Thử import trực tiếp từ file thay vì barrel; xóa `.next` và chạy lại |
| Chỉ hiển thị dữ liệu, không event, không hooks | Giữ Server Component (không cần `'use client'`) |

---

## 5. Tham chiếu

- [Next.js: Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js: Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- Project: `apps/web` – Next.js 16 App Router.
