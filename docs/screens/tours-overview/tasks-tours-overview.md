# Task Checklist: Tours Overview (Home Page)

> Generated from: `tdd-tours-overview.md`
> Feature: Tours Overview Screen (SCR-003)
> Routes: `/` and `/tours`

---

## Phase 1: Database

### 1.1 Schema Changes
- [ ] **Task 1.1**: [DB] Update `apps/server/prisma/schema.prisma` - Add new fields to Tour model
  - Add `difficulty Difficulty? @default(EASY)`
  - Add `featured Boolean @default(false)`
  - Add `reviewCount Int @default(0) @map("review_count")`
  - Add `createdAt DateTime @default(now()) @map("created_at")`
  - Add `updatedAt DateTime @updatedAt @map("updated_at")`

- [ ] **Task 1.2**: [DB] Add `Difficulty` enum to schema
  ```prisma
  enum Difficulty {
    EASY
    MODERATE
    CHALLENGING
  }
  ```

- [ ] **Task 1.3**: [DB] Add database indexes for performance
  - `@@index([location])`
  - `@@index([priceAdult])`
  - `@@index([ratingAverage])`
  - `@@index([featured])`
  - `@@index([createdAt])`

- [ ] **Task 1.4**: [DB] Run migration
  ```bash
  cd apps/server && pnpm prisma migrate dev --name add_tour_fields
  ```

- [ ] **Task 1.5**: [DB] (Optional) Add seed data for testing
  - Create sample tours with various difficulties and featured flags

---

## Phase 2: Backend (NestJS)

### 2.1 Module Setup
- [ ] **Task 2.1**: [BE] Create `apps/server/src/modules/tours/` folder structure
  ```
  tours/
  ├── tours.module.ts
  ├── tours.controller.ts
  ├── tours.service.ts
  └── dto/
  ```

- [ ] **Task 2.2**: [BE] Create `tours.module.ts`
  - Import PrismaModule
  - Register ToursController and ToursService
  - Export ToursService

- [ ] **Task 2.3**: [BE] Register `ToursModule` in `AppModule`

### 2.2 DTOs
- [ ] **Task 2.4**: [BE] Create `apps/server/src/modules/tours/dto/get-tours.dto.ts`
  - Define `SortOption` enum (popular, newest, price_asc, price_desc, rating)
  - Define `DifficultyFilter` enum (easy, moderate, challenging)
  - Create `GetToursDto` with validation:
    - `page` (optional, int, min 1)
    - `limit` (optional, int, min 1, max 50)
    - `search` (optional, string)
    - `sort` (optional, SortOption enum)
    - `priceMin` (optional, int)
    - `priceMax` (optional, int)
    - `difficulty` (optional, DifficultyFilter enum)
    - `location` (optional, string)

- [ ] **Task 2.5**: [BE] Create `apps/server/src/modules/tours/dto/tour-response.dto.ts`
  - Define `TourItemDto` class
  - Define `PaginationDto` class
  - Define `ToursResponseDto` class

- [ ] **Task 2.6**: [BE] Create `apps/server/src/modules/tours/dto/tour-suggestion.dto.ts`
  - Define `GetSuggestionsDto` with validation (q: min 2 chars, limit)
  - Define `SuggestionItemDto` class
  - Define `SuggestionsResponseDto` class

### 2.3 Service Layer
- [ ] **Task 2.7**: [BE] Create `tours.service.ts` - Implement `getTours()` method
  - [ ] Build dynamic where clause based on filters
  - [ ] Implement search (name, location, summary)
  - [ ] Implement price range filter
  - [ ] Implement difficulty filter
  - [ ] Implement location filter
  - [ ] Build orderBy based on sort option
  - [ ] Execute parallel queries (findMany + count)
  - [ ] Calculate pagination metadata
  - [ ] Map results to DTOs

- [ ] **Task 2.8**: [BE] Implement `getFeaturedTours()` method
  - Query tours where featured = true
  - Order by ratingAverage desc
  - Limit results
  - Map to DTOs

- [ ] **Task 2.9**: [BE] Implement `getSuggestions()` method
  - [ ] Query matching tours by name/location
  - [ ] Query distinct locations as destinations
  - [ ] Combine and limit suggestions
  - [ ] Return typed response

- [ ] **Task 2.10**: [BE] Implement private helper methods
  - `buildOrderBy(sort: SortOption)`
  - `mapTourToDto(tour: any)`

### 2.4 Controller Layer
- [ ] **Task 2.11**: [BE] Create `tours.controller.ts`
  - Inject ToursService

- [ ] **Task 2.12**: [BE] Add `GET /tours` endpoint
  - Use `@Query()` decorator with `GetToursDto`
  - Return wrapped response `{ success: true, data: ... }`

- [ ] **Task 2.13**: [BE] Add `GET /tours/featured` endpoint
  - Accept optional `limit` query param
  - Return featured tours

- [ ] **Task 2.14**: [BE] Add `GET /tours/suggestions` endpoint
  - Use `@Query()` decorator with `GetSuggestionsDto`
  - Return suggestions array

---

## Phase 3: Frontend - Types & API

### 3.1 Type Definitions
- [ ] **Task 3.1**: [FE] Create `apps/web/lib/types/tour.ts`
  - Define `Tour` interface
  - Define `TourFilters` interface
  - Define `Pagination` interface
  - Define `ToursResponse` interface
  - Define `TourCardProps` interface

### 3.2 API Functions
- [ ] **Task 3.2**: [FE] Create `apps/web/lib/api/tours.ts`
  - Implement `getTours(filters)` function with caching
  - Implement `getFeaturedTours(limit)` function
  - Implement `getSearchSuggestions(query, limit)` function

### 3.3 Utility Functions
- [ ] **Task 3.3**: [FE] Add `formatCurrency()` to `apps/web/lib/utils.ts` (if not exists)

---

## Phase 4: Frontend - Components

### 4.1 Tour Card Components
- [ ] **Task 4.1**: [FE] Create `apps/web/components/tours/tour-card.tsx`
  - [ ] Image with Next.js Image component
  - [ ] Featured badge (conditional)
  - [ ] Title with link to detail
  - [ ] Rating with star icon
  - [ ] Location with MapPin icon
  - [ ] Duration with Clock icon
  - [ ] Price display
  - [ ] "Book Now" button

- [ ] **Task 4.2**: [FE] Create `apps/web/components/tours/tour-card-skeleton.tsx`
  - Skeleton loading state for tour card
  - Export `TourGridSkeleton` component (renders multiple skeletons)

- [ ] **Task 4.3**: [FE] Create `apps/web/components/tours/tour-grid.tsx`
  - Responsive grid layout (1/2/3/4 columns)
  - Map tours to TourCard components
  - Pass priority=true to first 4 cards (above fold)

### 4.2 Filter Components
- [ ] **Task 4.4**: [FE] Create `apps/web/components/tours/tour-filters.tsx` (Client Component)
  - [ ] Add `'use client'` directive
  - [ ] Use `useRouter` and `useSearchParams` hooks
  - [ ] Create sort dropdown (Popular, Newest, Price asc/desc, Rating)
  - [ ] Create price filter dropdown
  - [ ] Create difficulty filter dropdown
  - [ ] Implement `updateFilter()` function
  - [ ] Implement `handlePriceChange()` function
  - [ ] Reset page to 1 on filter change

- [ ] **Task 4.5**: [FE] Create `apps/web/components/tours/tour-search.tsx` (Client Component)
  - [ ] Search input with debounce (300ms)
  - [ ] Suggestions dropdown
  - [ ] Handle suggestion click (navigate to tour or filter by destination)
  - [ ] Submit on Enter key

### 4.3 Pagination Component
- [ ] **Task 4.6**: [FE] Create `apps/web/components/tours/tour-pagination.tsx` (Client Component)
  - [ ] Display current page / total pages
  - [ ] Previous button (disabled on first page)
  - [ ] Next button (disabled on last page)
  - [ ] Page number buttons
  - [ ] Update URL on page change
  - [ ] Scroll to top on page change

### 4.4 State Components
- [ ] **Task 4.7**: [FE] Create `apps/web/components/tours/empty-state.tsx`
  - "No tours found" message
  - Suggestions list
  - "Clear Filters" button

- [ ] **Task 4.8**: [FE] Create `apps/web/components/tours/error-state.tsx`
  - Error message
  - "Retry" button

### 4.5 Hero Section
- [ ] **Task 4.9**: [FE] Create `apps/web/components/tours/hero-section.tsx`
  - Background image with overlay
  - Title and subtitle
  - Search bar (integrate TourSearch component)

---

## Phase 5: Frontend - Pages

### 5.1 Home Page
- [ ] **Task 5.1**: [FE] Update `apps/web/app/page.tsx`
  - [ ] Add metadata (title, description, openGraph)
  - [ ] Parse searchParams for filters
  - [ ] Import and render HeroSection
  - [ ] Add section header ("Popular Tours This Season")
  - [ ] Render TourFiltersBar
  - [ ] Use Suspense with TourGridSkeleton fallback
  - [ ] Create async ToursContent component
  - [ ] Handle empty state
  - [ ] Render TourGrid and TourPagination

### 5.2 Tours Page (Optional Alias)
- [ ] **Task 5.2**: [FE] Create `apps/web/app/tours/page.tsx`
  - Redirect to home page OR duplicate home page logic
  - Same filters and pagination

---

## Phase 6: Testing

### 6.1 Backend Unit Tests
- [ ] **Task 6.1**: [TEST] Create `apps/server/src/modules/tours/tours.service.spec.ts`
  - [ ] Test: `getTours()` returns paginated tours
  - [ ] Test: `getTours()` filters by search query
  - [ ] Test: `getTours()` filters by price range
  - [ ] Test: `getTours()` filters by difficulty
  - [ ] Test: `getTours()` sorts by price ascending
  - [ ] Test: `getTours()` sorts by rating
  - [ ] Test: `getTours()` returns empty array when no results
  - [ ] Test: `getFeaturedTours()` returns featured tours
  - [ ] Test: `getSuggestions()` returns matching suggestions

### 6.2 Backend E2E Tests
- [ ] **Task 6.2**: [TEST] Create `apps/server/test/tours.e2e-spec.ts`
  - [ ] Test: `GET /tours` returns paginated response (200)
  - [ ] Test: `GET /tours?search=bali` filters correctly
  - [ ] Test: `GET /tours?priceMin=100&priceMax=500` filters by price
  - [ ] Test: `GET /tours?difficulty=moderate` filters by difficulty
  - [ ] Test: `GET /tours?sort=price_asc` sorts correctly
  - [ ] Test: `GET /tours` with invalid params returns 400
  - [ ] Test: `GET /tours/featured` returns featured tours
  - [ ] Test: `GET /tours/suggestions?q=ba` returns suggestions
  - [ ] Test: `GET /tours/suggestions?q=a` returns 400 (min 2 chars)

### 6.3 Frontend Component Tests
- [ ] **Task 6.3**: [TEST] Create `apps/web/components/tours/__tests__/tour-card.test.tsx`
  - Test: renders tour information correctly
  - Test: shows featured badge when tour.featured = true
  - Test: links to correct tour detail page

- [ ] **Task 6.4**: [TEST] Create `apps/web/components/tours/__tests__/tour-filters.test.tsx`
  - Test: renders all filter dropdowns
  - Test: updates URL on filter change
  - Test: resets page to 1 on filter change

- [ ] **Task 6.5**: [TEST] Create `apps/web/components/tours/__tests__/tour-pagination.test.tsx`
  - Test: shows current page
  - Test: disables prev button on first page
  - Test: disables next button on last page

---

## Phase 7: Integration & QA

### 7.1 Integration Testing
- [ ] **Task 7.1**: [QA] Test full flow with real API
  - Load home page
  - Verify tours display correctly
  - Apply filters and verify results
  - Navigate pages
  - Refresh and verify URL state persists

### 7.2 Responsive Testing
- [ ] **Task 7.2**: [QA] Test responsive design
  - [ ] Desktop (>= 1280px): 4 column grid
  - [ ] Laptop (1024px - 1280px): 3 column grid
  - [ ] Tablet (768px - 1024px): 2 column grid
  - [ ] Mobile (< 768px): 1 column grid, filter drawer

### 7.3 SEO Testing
- [ ] **Task 7.3**: [QA] Verify SEO meta tags
  - Check page title
  - Check meta description
  - Check Open Graph tags
  - Test with social share preview tool

### 7.4 Performance Testing
- [ ] **Task 7.4**: [QA] Performance audit
  - Check API response time (< 200ms)
  - Check page load time (< 2s LCP)
  - Verify image lazy loading
  - Check skeleton loading states

### 7.5 Accessibility Testing
- [ ] **Task 7.5**: [QA] Accessibility audit
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast
  - Focus states

---

## Summary

| Phase | Tasks | Estimated |
|-------|-------|-----------|
| Phase 1: Database | 5 tasks | 1-2 hours |
| Phase 2: Backend | 14 tasks | 6-8 hours |
| Phase 3: FE Types & API | 3 tasks | 1-2 hours |
| Phase 4: FE Components | 9 tasks | 8-10 hours |
| Phase 5: FE Pages | 2 tasks | 2-3 hours |
| Phase 6: Testing | 5 tasks | 4-6 hours |
| Phase 7: Integration & QA | 5 tasks | 3-4 hours |
| **Total** | **43 tasks** | **25-35 hours** |

---

## Dependencies Graph

```
Phase 1 (Database)
    └── Task 1.1-1.4 (Schema changes & migration)
            ↓
Phase 2 (Backend) - depends on Phase 1
    ├── Task 2.1-2.3 (Module setup)
    ├── Task 2.4-2.6 (DTOs)
    │       ↓
    ├── Task 2.7-2.10 (Service methods)
    │       ↓
    └── Task 2.11-2.14 (Controller endpoints)

Phase 3 (FE Types & API) - can start parallel with Phase 2
    ├── Task 3.1 (Types)
    └── Task 3.2-3.3 (API functions)

Phase 4 (FE Components) - depends on Phase 3
    ├── Task 4.1-4.3 (Tour Card components)
    ├── Task 4.4-4.5 (Filter components)
    ├── Task 4.6 (Pagination)
    ├── Task 4.7-4.8 (State components)
    └── Task 4.9 (Hero section)

Phase 5 (FE Pages) - depends on Phase 4
    └── Task 5.1-5.2 (Pages)

Phase 6 (Testing) - parallel with Phase 4-5
    ├── Task 6.1-6.2 (Backend tests) - after Phase 2
    └── Task 6.3-6.5 (Frontend tests) - after Phase 4

Phase 7 (QA) - after all phases
    └── Task 7.1-7.5 (Integration & QA)
```

---

## Quick Start Commands

```bash
# Database migration
cd apps/server
pnpm prisma migrate dev --name add_tour_fields
pnpm prisma generate

# Backend development
cd apps/server
pnpm dev

# Frontend development
cd apps/web
pnpm dev

# Run backend tests
cd apps/server
pnpm test
pnpm test:e2e

# Run frontend tests
cd apps/web
pnpm test
```

---

## Notes

- Phase 2 Backend có thể scaffold trước với `/scaffold-be` command
- Phase 3-4 Frontend có thể scaffold với `/scaffold-fe` command
- Database migration cần chạy trước khi test BE service
- FE có thể develop song song với mock data trước khi BE hoàn thành
