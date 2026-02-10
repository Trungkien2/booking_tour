# Tour Module - Flow Analysis (Admin to Client)

## Tổng quan kiến trúc

Module Tour được chia thành **2 luồng chính**:

1. **Admin Flow**: Quản lý tour (CRUD) - Chỉ ADMIN
2. **Public Flow**: Hiển thị tour cho khách - Public access

---

## 1. ADMIN FLOW - Quản lý Tour

### 1.1. Backend API (Admin)

#### Controller: `ToursController`

**Path**: `apps/server/src/modules/tours/tours.controller.ts`
**Base URL**: `/api/admin/tours`
**Authentication**: JWT + Role Guard (chỉ ADMIN)

**Endpoints**:

```typescript
// 1. Get Statistics
GET /api/admin/tours/statistics
→ ToursService.getStatistics()
Response: { totalTours, publishedTours, draftTours, archivedTours }

// 2. List All Tours (Admin view - full data)
GET /api/admin/tours?page=1&limit=10&status=PUBLISHED&search=bali
→ ToursService.findAll(query: TourQueryDto)
Response: { tours: Tour[], total, page, limit }

// 3. Get Single Tour (Admin view)
GET /api/admin/tours/:id
→ ToursService.findOne(id)
Response: Tour (full data including draft fields)

// 4. Create Tour
POST /api/admin/tours
Body: CreateTourDto
→ ToursService.create(createTourDto)
Response: Tour (created)

// 5. Update Tour
PATCH /api/admin/tours/:id
Body: UpdateTourDto
→ ToursService.update(id, updateTourDto)
Response: Tour (updated)

// 6. Delete Tour (Soft delete)
DELETE /api/admin/tours/:id
→ ToursService.remove(id)
Response: 204 No Content
```

#### Service: `ToursService`

**Path**: `apps/server/src/modules/tours/tours.service.ts`

**Key Methods**:

1. **`getStatistics()`**
   - Đếm số lượng tour theo status (DRAFT, PUBLISHED, ARCHIVED)
   - Trả về tổng số tour và phân loại

2. **`findAll(query: TourQueryDto)`**
   - Pagination: page, limit
   - Filtering: status, search (name, location)
   - Sorting: createdAt, priceAdult, ratingAverage
   - Bao gồm cả tour DRAFT và ARCHIVED (admin view)

3. **`findOne(id: number)`**
   - Lấy tour theo ID
   - Throw NotFoundException nếu không tìm thấy
   - Bao gồm full data (kể cả draft fields)

4. **`create(createTourDto: CreateTourDto)`**
   - Validate dữ liệu qua DTO (class-validator)
   - Generate slug từ name (unique)
   - Tạo tour mới với status = DRAFT (default)
   - Lưu vào database qua Prisma

5. **`update(id: number, updateTourDto: UpdateTourDto)`**
   - Kiểm tra tour tồn tại
   - Update các field được cung cấp
   - Nếu update name → regenerate slug
   - Trả về tour đã update

6. **`remove(id: number)`**
   - **Soft delete**: Set deletedAt = now()
   - Không xóa vật lý khỏi database
   - Tour vẫn giữ trong DB để tham chiếu (bookings, reviews)

7. **`generateSlug(name: string)`**
   - Convert name → slug (kebab-case, no special chars)
   - Đảm bảo unique bằng cách thêm số suffix nếu trùng

#### DTOs (Data Transfer Objects)

**CreateTourDto**:

```typescript
{
  name: string;           // Required
  summary?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  durationDays: number;   // Required
  priceAdult: number;     // Required
  priceChild: number;     // Required
  location?: string;
  difficulty?: 'EASY' | 'MODERATE' | 'CHALLENGING';
  featured?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
```

**UpdateTourDto**: Partial<CreateTourDto> (tất cả fields optional)

**TourQueryDto**:

```typescript
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 10
  status?: TourStatus;
  search?: string;        // Search in name, location
  sort?: 'createdAt' | 'priceAdult' | 'ratingAverage';
  order?: 'asc' | 'desc'; // Default: desc
}
```

### 1.2. Frontend (Admin Panel)

#### API Client: `apps/web/lib/api/admin/tours.ts`

**Functions**:

```typescript
// 1. Get Statistics
getTourStatistics(): Promise<TourStatistics>
→ GET /api/admin/tours/statistics

// 2. List Tours
getTours(params: TourQueryParams): Promise<TourListResponse>
→ GET /api/admin/tours?page=1&limit=10&status=PUBLISHED

// 3. Get Single Tour
getTourById(id: number): Promise<Tour>
→ GET /api/admin/tours/:id

// 4. Create Tour
createTour(data: CreateTourDto): Promise<Tour>
→ POST /api/admin/tours

// 5. Update Tour
updateTour(id: number, data: UpdateTourDto): Promise<Tour>
→ PATCH /api/admin/tours/:id

// 6. Delete Tour
deleteTour(id: number): Promise<void>
→ DELETE /api/admin/tours/:id
```

#### Components (Admin UI)

**Path**: `apps/web/components/admin/tours/`

1. **`tour-statistics.tsx`**
   - Hiển thị thống kê: total, published, draft, archived
   - Gọi `getTourStatistics()` khi mount

2. **`tour-table.tsx`**
   - Bảng danh sách tour (DataTable)
   - Columns: Name, Location, Price, Status, Rating, Actions
   - Actions: Edit, Delete
   - Pagination controls

3. **`tour-filters.tsx`**
   - Filter theo status (DRAFT, PUBLISHED, ARCHIVED)
   - Search box (name, location)
   - Sort dropdown (price, rating, date)

4. **`tour-form.tsx`**
   - Form tạo/sửa tour
   - React Hook Form + Zod validation
   - Fields: name, summary, description, images, duration, prices, location, difficulty, featured, status
   - Submit → `createTour()` hoặc `updateTour()`

5. **`tour-edit-panel.tsx`**
   - Side panel/modal chứa TourForm
   - Mode: create hoặc edit
   - Load tour data nếu edit mode

6. **`tour-delete-dialog.tsx`**
   - Confirm dialog trước khi xóa
   - Gọi `deleteTour(id)` khi confirm

#### Validation Schema: `apps/web/lib/validations/tour.ts`

```typescript
const tourSchema = z.object({
  name: z.string().min(3).max(200),
  summary: z.string().max(500).optional(),
  description: z.string().optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  durationDays: z.number().int().min(1),
  priceAdult: z.number().min(0),
  priceChild: z.number().min(0),
  location: z.string().optional(),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING"]).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});
```

---

## 2. PUBLIC FLOW - Hiển thị Tour cho Khách

### 2.1. Backend API (Public)

#### Controller: `ToursPublicController`

**Path**: `apps/server/src/modules/tours/tours-public.controller.ts`
**Base URL**: `/tours`
**Authentication**: Public (no auth required)

**Endpoints**:

```typescript
// 1. Get Tours (Public view - filtered)
GET /tours?page=1&limit=8&search=bali&sort=popular&priceMin=500&priceMax=1000&difficulty=EASY&duration=3-7
→ ToursPublicService.getTours(dto: GetToursPublicDto)
Response: {
  success: true,
  data: {
    tours: TourItemDto[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}

// 2. Get Featured Tours (Homepage)
GET /tours/featured?limit=4
→ ToursPublicService.getFeaturedTours(limit)
Response: {
  success: true,
  data: { tours: TourItemDto[] }
}

// 3. Get Search Suggestions (Autocomplete)
GET /tours/suggestions?q=ba&limit=5
→ ToursPublicService.getSuggestions(dto)
Response: {
  success: true,
  data: {
    tours: Array<{ id, name, slug, location }>,
    destinations: string[]
  }
}
```

#### Service: `ToursPublicService`

**Path**: `apps/server/src/modules/tours/tours-public.service.ts`

**Key Methods**:

1. **`getTours(dto: GetToursPublicDto)`**
   - **Filtering**:
     - Chỉ lấy tour có `status = PUBLISHED` và `deletedAt = null`
     - Search: name, location (case-insensitive, partial match)
     - Price range: priceMin, priceMax
     - Difficulty: EASY, MODERATE, CHALLENGING
     - Duration range: "3-7" → 3 <= durationDays <= 7
   - **Sorting**:
     - `popular`: ratingAverage DESC, reviewCount DESC
     - `price-low`: priceAdult ASC
     - `price-high`: priceAdult DESC
     - `newest`: createdAt DESC
   - **Pagination**: page, limit (default: 1, 8)
   - **Response**: Map to TourItemDto (public fields only)

2. **`getFeaturedTours(limit: number)`**
   - Lấy tour có `featured = true`, `status = PUBLISHED`
   - Sort by ratingAverage DESC
   - Limit: default 4 (homepage highlight)

3. **`getSuggestions(dto: GetSuggestionsDto)`**
   - Search query: `q` (minimum 2 chars)
   - Tìm tours matching query trong name/location
   - Trả về:
     - `tours`: Array<{ id, name, slug, location }>
     - `destinations`: Unique locations matching query
   - Limit: default 5

4. **`buildWhereClause(dto)`**
   - Helper method tạo Prisma where clause
   - Combine tất cả filters (status, search, price, difficulty, duration)

5. **`buildOrderBy(sort)`**
   - Helper method tạo Prisma orderBy
   - Map sort string → Prisma orderBy object

6. **`parseDurationRange(duration: string)`**
   - Parse "3-7" → { min: 3, max: 7 }
   - Validate format

7. **`mapTourToDto(tour)`**
   - Map Prisma Tour model → TourItemDto
   - Chỉ expose public fields (không có draft/internal fields)

#### DTOs (Public)

**GetToursPublicDto**:

```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'popular' | 'price-low' | 'price-high' | 'newest';
  priceMin?: number;
  priceMax?: number;
  difficulty?: Difficulty;
  duration?: string;  // "3-7", "7-14", etc.
}
```

**TourItemDto** (Public response):

```typescript
{
  id: number;
  name: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  durationDays: number;
  priceAdult: number;
  priceChild: number;
  location?: string;
  ratingAverage: number;
  reviewCount: number;
  difficulty?: Difficulty;
  featured: boolean;
}
```

### 2.2. Frontend (Public Pages)

#### API Client: `apps/web/lib/api/tours.ts`

**Functions**:

```typescript
// 1. Get Tours (Public)
getTours(params: GetToursPublicDto): Promise<ToursPublicResponse>
→ GET /tours?page=1&limit=8&search=bali

// 2. Get Featured Tours
getFeaturedTours(limit?: number): Promise<TourItemDto[]>
→ GET /tours/featured?limit=4

// 3. Get Search Suggestions
getSearchSuggestions(q: string, limit?: number): Promise<SuggestionsResponse>
→ GET /tours/suggestions?q=ba&limit=5
```

#### Pages

**Homepage**: `apps/web/app/page.tsx`

- Server Component (fetch data server-side)
- Gọi `getFeaturedTours(4)` để hiển thị featured tours
- Gọi `getTours({ page: 1, limit: 8 })` để hiển thị tour list

**Tours Page**: `apps/web/app/tours/page.tsx` (nếu có)

- Server Component với searchParams
- Parse filters từ URL query
- Gọi `getTours(filters)` với full filters

#### Components (Public UI)

**Path**: `apps/web/components/tours/`

1. **`tour-card.tsx`**
   - Hiển thị 1 tour item
   - Props: tour (TourItemDto)
   - Show: image, name, location, duration, price, rating
   - Click → Navigate to tour details page

2. **`tour-grid.tsx`**
   - Grid layout cho danh sách tours
   - Map tours → TourCard components
   - Responsive: 1 col (mobile), 2 cols (tablet), 4 cols (desktop)

3. **`tour-filters.tsx`**
   - Client Component ('use client')
   - Filter controls: Price range, Difficulty, Duration
   - Update URL query params khi filter change
   - Trigger re-fetch tours

4. **`tour-search.tsx`**
   - Client Component
   - Search input với autocomplete
   - Debounce input (300ms)
   - Gọi `getSearchSuggestions(q)` khi user type
   - Show suggestions dropdown
   - Click suggestion → Navigate hoặc apply filter

5. **`tour-pagination.tsx`**
   - Pagination controls
   - Props: currentPage, totalPages, onPageChange
   - Update URL query param `page`

6. **`show-more-tours.tsx`**
   - Button "Show More" / "Load More"
   - Increment page và append tours (infinite scroll style)
   - Hoặc navigate to next page

7. **`tour-card-skeleton.tsx`**
   - Loading skeleton cho TourCard
   - Show khi đang fetch data

---

## 3. Database Schema (Tour Model)

**Path**: `apps/server/prisma/schema.prisma`

```prisma
model Tour {
  id            Int      @id @default(autoincrement())
  name          String
  slug          String   @unique
  summary       String?
  description   String?  @db.Text
  coverImage    String?
  images        Json?    // Array of image URLs
  durationDays  Int
  priceAdult    Decimal  @db.Decimal(10, 2)
  priceChild    Decimal  @db.Decimal(10, 2)
  location      String?
  ratingAverage Decimal  @default(0) @db.Decimal(2, 1)

  // Tour overview
  difficulty    Difficulty? @default(EASY)
  featured      Boolean     @default(false)
  reviewCount   Int         @default(0)

  // Status and timestamps
  status        TourStatus @default(DRAFT)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  deletedAt     DateTime?  // Soft delete

  // Relations
  schedules     TourSchedule[]
  reviews       Review[]

  // Indexes
  @@index([status])
  @@index([deletedAt])
  @@index([location])
  @@index([priceAdult])
  @@index([ratingAverage])
  @@index([featured])
  @@index([createdAt])
  @@index([difficulty])
}

enum TourStatus {
  DRAFT       // Admin đang soạn, chưa public
  PUBLISHED   // Đã public, hiển thị cho khách
  ARCHIVED    // Đã ẩn, không hiển thị
}

enum Difficulty {
  EASY
  MODERATE
  CHALLENGING
}
```

**Indexes**: Tối ưu query cho filtering và sorting

---

## 4. Luồng xử lý chi tiết

### 4.1. Admin tạo Tour mới

```
1. Admin mở form tạo tour (tour-form.tsx)
2. Nhập thông tin: name, description, images, prices, etc.
3. Submit form
   → Validate với Zod schema (frontend)
   → Gọi createTour(data) → POST /api/admin/tours
4. Backend (ToursController.create):
   → Validate với class-validator (CreateTourDto)
   → ToursService.create(createTourDto)
5. ToursService.create:
   → Generate slug từ name (unique)
   → Tạo tour với status = DRAFT (default)
   → Lưu vào database (Prisma)
   → Return tour created
6. Frontend nhận response
   → Show success message
   → Redirect to tour list hoặc edit page
   → Refresh tour list
```

### 4.2. Admin publish Tour

```
1. Admin edit tour (tour-edit-panel.tsx)
2. Change status từ DRAFT → PUBLISHED
3. Submit form
   → Gọi updateTour(id, { status: 'PUBLISHED' })
   → PATCH /api/admin/tours/:id
4. Backend update tour.status = PUBLISHED
5. Tour bây giờ hiển thị trong public API
```

### 4.3. Khách xem danh sách Tour

```
1. User vào homepage hoặc /tours
2. Server Component fetch data:
   → getTours({ page: 1, limit: 8, sort: 'popular' })
   → GET /tours?page=1&limit=8&sort=popular
3. Backend (ToursPublicController.getTours):
   → ToursPublicService.getTours(dto)
4. ToursPublicService.getTours:
   → Build where clause: status = PUBLISHED, deletedAt = null
   → Build orderBy: ratingAverage DESC, reviewCount DESC
   → Query database với Prisma
   → Map tours → TourItemDto (public fields only)
   → Return paginated response
5. Frontend render:
   → TourGrid component
   → Map tours → TourCard components
   → Show pagination controls
```

### 4.4. Khách filter Tours

```
1. User chọn filters (tour-filters.tsx):
   - Price range: 500-1000
   - Difficulty: EASY
   - Duration: 3-7 days
2. Update URL query params:
   → /tours?priceMin=500&priceMax=1000&difficulty=EASY&duration=3-7
3. Next.js detect searchParams change
   → Re-render Server Component
   → Fetch với filters mới
4. Backend apply filters trong where clause
5. Return filtered tours
6. Frontend re-render với tours mới
```

### 4.5. Khách search Tours

```
1. User type vào search box (tour-search.tsx)
   → Debounce 300ms
2. Gọi getSearchSuggestions(q)
   → GET /tours/suggestions?q=ba
3. Backend (ToursPublicService.getSuggestions):
   → Search trong name, location
   → Return matching tours và destinations
4. Frontend show suggestions dropdown
5. User click suggestion:
   → Navigate to tour details
   → Hoặc apply search filter và reload list
```

---

## 5. Security & Performance

### Security

1. **Admin endpoints**:
   - Protected by JwtAuthGuard + RolesGuard
   - Chỉ user có role = ADMIN mới access được
   - JWT token trong Authorization header

2. **Public endpoints**:
   - No authentication required
   - Chỉ expose PUBLISHED tours
   - Không expose draft/internal fields

3. **Soft delete**:
   - Tour không bị xóa vật lý
   - Giữ data integrity cho bookings, reviews
   - Admin có thể restore nếu cần

### Performance

1. **Database indexes**:
   - Index trên các field thường query: status, location, priceAdult, ratingAverage, featured, difficulty
   - Tăng tốc filtering và sorting

2. **Pagination**:
   - Không load toàn bộ tours
   - Default limit = 8 (public), 10 (admin)

3. **Server-side rendering (Next.js)**:
   - Fetch data trên server
   - Faster initial page load
   - Better SEO

4. **Debounce search**:
   - Giảm số lượng API calls khi user type
   - 300ms debounce

5. **Select only needed fields**:
   - Public API chỉ select public fields
   - Không load toàn bộ relations nếu không cần

---

## 6. Điểm cần lưu ý

### Backend

1. **Slug generation**:
   - Phải unique
   - Handle trùng lặp bằng suffix số
   - SEO-friendly URL

2. **Soft delete**:
   - Luôn filter `deletedAt = null` trong public queries
   - Admin queries có thể bao gồm deleted tours

3. **Status flow**:
   - DRAFT → PUBLISHED → ARCHIVED
   - Không cho phép ARCHIVED → PUBLISHED trực tiếp (cần review)

4. **Price validation**:
   - priceChild thường < priceAdult
   - Không cho phép giá âm

### Frontend

1. **Server vs Client Components**:
   - Data fetching: Server Component
   - Filters, search, interactions: Client Component

2. **URL state management**:
   - Filters, pagination trong URL query params
   - Shareable URLs
   - Browser back/forward hoạt động đúng

3. **Loading states**:
   - Show skeleton khi loading
   - Disable buttons khi submitting

4. **Error handling**:
   - Show user-friendly error messages
   - Retry logic cho network errors

---

## 7. Future Enhancements

1. **Tour details page**: `/tours/[slug]`
2. **Tour schedules**: Quản lý lịch khởi hành
3. **Booking integration**: Link tour → booking flow
4. **Reviews**: User reviews và ratings
5. **Image upload**: Upload ảnh trực tiếp (hiện tại dùng URL)
6. **Bulk operations**: Bulk publish/archive tours
7. **Tour categories/tags**: Phân loại tour theo category
8. **Advanced search**: Full-text search, geo search
9. **Tour comparison**: So sánh nhiều tours
10. **Wishlist**: User save favorite tours
