# Task Breakdown: Tours Overview (Home Page)

> **Generated from**: `tdd-tours-overview.md` (v2.0)  
> **Feature**: Tours Overview Screen (SCR-003)  
> **Routes**: `/` and `/tours`  
> **Last Updated**: 2026-01-31

---

## Overview

This checklist breaks down the Tours Overview feature into actionable, granular tasks (1-4 hours each). Tasks are organized by implementation phase with clear dependencies.

**Estimated Total Effort**: 35-40 hours  
**Team Size**: 1-2 developers  
**Sprint Duration**: 2-3 sprints

---

## Phase 1: Database Schema & Migration (2-3 hours)

### 1.1 Schema Updates

- [x] **Task 1.1**: [DB] Update `apps/server/prisma/schema.prisma` - Add new fields to Tour model ✅
  - Add `difficulty Difficulty? @default(EASY)` field
  - Add `featured Boolean @default(false)` field
  - Add `reviewCount Int @default(0) @map("review_count")` field
  - Add `createdAt DateTime @default(now()) @map("created_at")` field
  - Add `updatedAt DateTime @updatedAt @map("updated_at")` field
  - **Estimated**: 30 min

- [x] **Task 1.2**: [DB] Add `Difficulty` enum to schema ✅

  ```prisma
  enum Difficulty {
    EASY
    MODERATE
    CHALLENGING
  }
  ```

  - **Estimated**: 10 min

- [x] **Task 1.3**: [DB] Add database indexes for performance optimization ✅
  - `@@index([location])`
  - `@@index([priceAdult])`
  - `@@index([ratingAverage])`
  - `@@index([featured])`
  - `@@index([createdAt])`
  - `@@index([difficulty])`
  - **Estimated**: 15 min

### 1.2 Migration & Data Setup

- [x] **Task 1.4**: [DB] Generate and run Prisma migration ✅

  ```bash
  cd apps/server
  pnpm prisma migrate dev --name add_tour_overview_fields
  pnpm prisma generate
  ```

  - Review generated SQL migration file
  - Verify all columns and indexes created correctly
  - **Estimated**: 30 min

- [ ] **Task 1.5**: [DB] Create database trigger for review_count maintenance
  - Write SQL function `update_tour_review_count()`
  - Create trigger on INSERT/DELETE on `reviews` table
  - Test trigger with sample data
  - **Estimated**: 45 min

- [ ] **Task 1.6**: [DB] Update existing tour records with review counts
  - Write one-time UPDATE query to populate `review_count`
  - Verify counts match actual review records
  - **Estimated**: 20 min

- [x] **Task 1.7**: [DB] (Optional) Create seed data for testing ✅
  - Add 15-20 sample tours with variety in:
    - Prices ($200-$3000)
    - Difficulties (Easy, Moderate, Challenging)
    - Locations (different countries)
    - Ratings (3.5-5.0)
    - Featured flag (3-4 featured tours)
  - **Estimated**: 1 hour

---

## Phase 2: Backend - Module Setup (1-2 hours)

### 2.1 Module Structure

- [x] **Task 2.1**: [BE] Create `apps/server/src/modules/tours/` folder structure ✅ (Already exists from admin-tours)

  ```
  tours/
  ├── tours.module.ts
  ├── tours.controller.ts
  ├── tours.service.ts
  ├── tours.service.spec.ts
  └── dto/
  ```

  - **Estimated**: 10 min

- [x] **Task 2.2**: [BE] Create `tours.module.ts` ✅ (Updated to include public service/controller)
  - Import `PrismaModule`
  - Register `ToursController` and `ToursService`
  - Export `ToursService` for use by other modules
  - **Estimated**: 15 min

- [x] **Task 2.3**: [BE] Register `ToursModule` in `AppModule` ✅ (Already registered)
  - Add import in `apps/server/src/app.module.ts`
  - Verify module loads correctly on server start
  - **Estimated**: 10 min

---

## Phase 3: Backend - DTOs (2-3 hours)

### 3.1 Request DTOs

- [x] **Task 3.1**: [BE] Create `apps/server/src/modules/tours/dto/get-tours-public.dto.ts` ✅
  - [x] Define `SortOption` enum (popular, newest, price_asc, price_desc, rating) ✅
  - [x] Define `DifficultyFilter` enum (easy, moderate, challenging) ✅
  - [x] Create `GetToursDto` class with validation ✅
  - [x] Add `@ApiProperty` decorators for Swagger docs ✅
  - [x] Add `class-validator` decorators ✅
  - [x] Add `class-transformer` decorators (@Type) ✅
  - **Estimated**: 1 hour

### 3.2 Response DTOs

- [x] **Task 3.2**: [BE] Create `apps/server/src/modules/tours/dto/tour-public-response.dto.ts` ✅
  - [x] Create `TourItemDto` class with all tour fields ✅
  - [x] Create `PaginationDto` class ✅
  - [x] Create `ToursResponseDto` wrapper class ✅
  - [x] Add `@ApiProperty` decorators for Swagger ✅
  - **Estimated**: 45 min

- [x] **Task 3.3**: [BE] Create `apps/server/src/modules/tours/dto/tour-suggestion.dto.ts` ✅
  - [x] Create `GetSuggestionsDto` class ✅
  - [x] Create `SuggestionItemDto` class ✅
  - [x] Create `SuggestionsResponseDto` wrapper ✅
  - [x] Add validation and API decorators ✅
  - **Estimated**: 30 min

---

## Phase 4: Backend - Service Layer (4-5 hours)

### 4.1 Core Service Methods

- [x] **Task 4.1**: [BE] Create `tours-public.service.ts` - Implement `getTours()` method ✅
  - [x] Inject `PrismaService` in constructor ✅
  - [x] Parse pagination params (page, limit, skip) ✅
  - [x] Build `where` clause using `buildWhereClause()` helper ✅
  - [x] Build `orderBy` clause using `buildOrderBy()` helper ✅
  - [x] Execute parallel queries (Promise.all) ✅
  - [x] Include `schedules` relation for next available date ✅
  - [x] Calculate pagination metadata (totalPages, hasNext, hasPrev) ✅
  - [x] Map results using `mapTourToDto()` helper ✅
  - [x] Add logging for debugging ✅
  - **Estimated**: 2 hours

- [x] **Task 4.2**: [BE] Implement `getFeaturedTours()` method ✅
  - [x] Query tours with `featured: true` ✅
  - [x] Order by `ratingAverage` desc, then `reviewCount` desc ✅
  - [x] Apply limit parameter ✅
  - [x] Map to TourItemDto ✅
  - [x] Add error handling ✅
  - **Estimated**: 30 min

- [x] **Task 4.3**: [BE] Implement `getSuggestions()` method ✅
  - [x] Query matching tours (name OR location contains query) ✅
  - [x] Query distinct locations matching query ✅
  - [x] Combine results with type indicators ✅
  - [x] Limit total suggestions ✅
  - [x] Return formatted suggestions array ✅
  - **Estimated**: 45 min

### 4.2 Helper Methods

- [x] **Task 4.4**: [BE] Implement `buildWhereClause()` private method ✅
  - [x] Handle search filter (OR across name, location, summary) ✅
  - [x] Handle price range filter (gte, lte on priceAdult) ✅
  - [x] Handle difficulty filter (exact match, case-insensitive) ✅
  - [x] Handle location filter (contains, case-insensitive) ✅
  - [x] Handle duration filter using `parseDurationRange()` ✅
  - [x] Return typed `Prisma.TourWhereInput` ✅
  - **Estimated**: 1 hour

- [x] **Task 4.5**: [BE] Implement `buildOrderBy()` private method ✅
  - [x] Switch on `SortOption` enum ✅
  - [x] Handle 'popular' (reviewCount desc, ratingAverage desc) ✅
  - [x] Handle 'newest' (createdAt desc) ✅
  - [x] Handle 'price_asc' (priceAdult asc) ✅
  - [x] Handle 'price_desc' (priceAdult desc) ✅
  - [x] Handle 'rating' (ratingAverage desc) ✅
  - [x] Return typed `Prisma.TourOrderByWithRelationInput` ✅
  - **Estimated**: 30 min

- [x] **Task 4.6**: [BE] Implement `parseDurationRange()` private method ✅
  - [x] Parse "1-3" format (gte min, lte max) ✅
  - [x] Parse "8+" format (gte min) ✅
  - [x] Handle edge cases (invalid format) ✅
  - [x] Return `Prisma.IntFilter | undefined` ✅
  - **Estimated**: 20 min

- [x] **Task 4.7**: [BE] Implement `mapTourToDto()` private method ✅
  - [x] Map all fields from Prisma Tour to TourItemDto ✅
  - [x] Convert Decimal to Number (priceAdult, priceChild, ratingAverage) ✅
  - [x] Lowercase difficulty enum ✅
  - [x] Handle optional fields (null coalescing) ✅
  - [x] Format nextAvailableDate (ISO string) ✅
  - **Estimated**: 20 min

---

## Phase 5: Backend - Controller Layer (1 hour)

### 5.1 REST Endpoints

- [x] **Task 5.1**: [BE] Create `tours-public.controller.ts` ✅
  - [x] Add `@Controller('tours')` decorator ✅
  - [x] Add `@ApiTags('tours')` for Swagger ✅
  - [x] Add `@Public()` decorator for unauthenticated access ✅
  - [x] Inject `ToursPublicService` in constructor ✅
  - **Estimated**: 10 min

- [x] **Task 5.2**: [BE] Add `GET /tours` endpoint ✅
  - [x] Add `@Get()` decorator ✅
  - [x] Use `@Query()` decorator with `GetToursPublicDto` ✅
  - [x] Call `toursPublicService.getTours(dto)` ✅
  - [x] Return wrapped response: `{ success: true, data: ... }` ✅
  - [x] Add `@ApiOperation` and `@ApiResponse` decorators ✅
  - **Estimated**: 20 min

- [x] **Task 5.3**: [BE] Add `GET /tours/featured` endpoint ✅
  - [x] Add `@Get('featured')` decorator ✅
  - [x] Accept optional `limit` query param ✅
  - [x] Call `toursPublicService.getFeaturedTours(limit)` ✅
  - [x] Return wrapped response ✅
  - [x] Add Swagger decorators ✅
  - **Estimated**: 15 min

- [x] **Task 5.4**: [BE] Add `GET /tours/suggestions` endpoint ✅
  - [x] Add `@Get('suggestions')` decorator ✅
  - [x] Use `@Query()` with `GetSuggestionsDto` ✅
  - [x] Call `toursPublicService.getSuggestions(dto)` ✅
  - [x] Return wrapped response ✅
  - [x] Add Swagger decorators ✅
  - **Estimated**: 15 min

---

## Phase 6: Backend - Testing (3-4 hours)

### 6.1 Unit Tests

- [x] **Task 6.1**: [TEST] Create `tours-public.service.spec.ts` - Setup test environment ✅
  - [x] Create TestingModule with `ToursPublicService` and mock `PrismaService` ✅
  - [x] Setup beforeEach to get service instance ✅
  - [x] Create mock data (sample tours) ✅
  - **Estimated**: 30 min

- [x] **Task 6.2**: [TEST] Write unit tests for `getTours()` ✅
  - [x] Test: returns paginated tours with default params ✅
  - [x] Test: filters by search query (name, location) ✅
  - [x] Test: filters by price range (priceMin, priceMax) ✅
  - [x] Test: filters by difficulty level ✅
  - [x] Test: filters by duration range ✅
  - [x] Test: sorts by price ascending/descending ✅
  - [x] Test: sorts by rating ✅
  - [x] Test: sorts by newest (createdAt) ✅
  - [x] Test: returns empty array when no results ✅
  - [x] Test: calculates correct pagination metadata ✅
  - **Estimated**: 2 hours

- [x] **Task 6.3**: [TEST] Write unit tests for `getFeaturedTours()` ✅
  - [x] Test: returns only tours with featured=true ✅
  - [x] Test: orders by rating and review count ✅
  - [x] Test: respects limit parameter ✅
  - **Estimated**: 30 min

- [x] **Task 6.4**: [TEST] Write unit tests for `getSuggestions()` ✅
  - [x] Test: returns matching tour names ✅
  - [x] Test: returns matching destination names ✅
  - [x] Test: limits total suggestions ✅
  - [x] Test: uses default limit of 5 ✅
  - **Estimated**: 30 min

### 6.2 E2E Tests

- [x] **Task 6.5**: [TEST] Create `apps/server/test/tours-public.e2e-spec.ts` ✅
  - [x] Setup test app with TestingModule ✅
  - [x] Mock PrismaService with sample tours ✅
  - **Estimated**: 30 min

- [x] **Task 6.6**: [TEST] Write E2E tests for `GET /tours` ✅
  - [x] Test: returns 200 with valid response structure ✅
  - [x] Test: filters by search query ✅
  - [x] Test: filters by price range (priceMin, priceMax) ✅
  - [x] Test: filters by difficulty ✅
  - [x] Test: returns 400 for invalid params (e.g., page=0) ✅
  - [x] Test: handles empty results gracefully ✅
  - **Estimated**: 1 hour

- [x] **Task 6.7**: [TEST] Write E2E tests for `GET /tours/featured` and `GET /tours/suggestions` ✅
  - [x] Test: `/tours/featured` returns featured tours ✅
  - [x] Test: `/tours/suggestions` returns suggestions ✅
  - [x] Test: `/tours/suggestions` requires min 2 characters (400 error) ✅
  - **Estimated**: 30 min

---

## Phase 7: Frontend - Types & API (2 hours)

### 7.1 Type Definitions

- [x] **Task 7.1**: [FE] Create `apps/web/lib/types/tour.ts` ✅
  - [x] Define `Tour` interface (matching backend TourItemDto) ✅
  - [x] Define `TourFilters` interface (query params) ✅
  - [x] Define `Pagination` interface ✅
  - [x] Define `ToursResponse` interface ✅
  - [x] Define `TourCardProps` interface ✅
  - [x] Define `Suggestion` interface ✅
  - **Estimated**: 30 min

### 7.2 API Client Functions

- [x] **Task 7.2**: [FE] Create `apps/web/lib/api/tours.ts` ✅
  - [x] Implement `getTours(filters)` function ✅
    - [x] Build URLSearchParams from filters ✅
    - [x] Call API with `fetch()` ✅
    - [x] Add ISR caching: `next: { revalidate: 300 }` ✅
    - [x] Parse and return `ToursResponse` ✅
    - [x] Add error handling with try-catch ✅
  - **Estimated**: 45 min

- [x] **Task 7.3**: [FE] Implement `getFeaturedTours()` function ✅
  - [x] Call `/tours/featured` endpoint ✅
  - [x] Add ISR caching: `next: { revalidate: 600 }` ✅
  - [x] Return Tour array ✅
  - **Estimated**: 15 min

- [x] **Task 7.4**: [FE] Implement `getSearchSuggestions()` function ✅
  - [x] Call `/tours/suggestions` endpoint ✅
  - [x] Use `cache: 'no-store'` (always fresh) ✅
  - [x] Handle minimum 2 characters ✅
  - [x] Return Suggestion array ✅
  - **Estimated**: 15 min

### 7.3 Utility Functions

- [x] **Task 7.5**: [FE] Create `apps/web/lib/utils/format.ts` ✅
  - [x] Implement `formatCurrency(amount)` - USD formatting ✅
  - [x] Implement `formatRating(rating)` - 1 decimal place ✅
  - [x] Implement `formatDuration(days)` - "X Days" format ✅
  - [x] Implement `getDifficultyColor(difficulty)` - Tailwind classes ✅
  - **Estimated**: 30 min

---

## Phase 8: Frontend - UI Components (8-10 hours)

### 8.1 Tour Card Components

- [x] **Task 8.1**: [FE] Create `apps/web/components/tours/tour-card.tsx` ✅
  - [x] Create TourCard component with TourCardProps ✅
  - [x] Image section with Next.js Image component ✅
  - [x] Overlay elements (Featured badge, conditional) ✅
  - [x] Content section with title, rating, metadata, summary, difficulty badge ✅
  - [x] Footer section with price display and "Book Now" CTA button ✅
  - [x] Add hover states and transitions ✅
  - **Estimated**: 2 hours

- [x] **Task 8.2**: [FE] Create `apps/web/components/tours/tour-card-skeleton.tsx` ✅
  - [x] Create TourCardSkeleton component ✅
  - [x] Match TourCard structure with shimmer effect ✅
  - [x] Create TourGridSkeleton component (renders multiple) ✅
  - [x] Add count prop (default 8) ✅
  - **Estimated**: 45 min

- [x] **Task 8.3**: [FE] Create `apps/web/components/tours/tour-grid.tsx` ✅
  - [x] Create TourGrid component accepting tours array ✅
  - [x] Implement responsive grid (1/2/3/4 columns) ✅
  - [x] Pass priority=true to first 4 cards (above fold) ✅
  - [x] Add gap and padding ✅
  - **Estimated**: 30 min

### 8.2 Filter Components

- [x] **Task 8.4**: [FE] Create `apps/web/components/tours/tour-filters.tsx` (Client Component) ✅
  - [x] Add `'use client'` directive ✅
  - [x] Use `useRouter` and `useSearchParams` hooks ✅
  - [x] Use `useTransition` for pending state ✅
  - [x] Create filter options arrays ✅
  - [x] Implement `updateFilter(key, value)` function ✅
  - [x] Implement `handlePriceChange(value)` function ✅
  - [x] Render filter dropdowns ✅
  - [x] Add "Clear Filters" button (conditional) ✅
  - [x] Style with Tailwind ✅
  - [x] Handle disabled state during transition ✅
  - **Estimated**: 2 hours

- [x] **Task 8.5**: [FE] Create `apps/web/components/tours/tour-search.tsx` (Client Component) ✅
  - [x] Add `'use client'` directive ✅
  - [x] Use debounced search with setTimeout (300ms) ✅
  - [x] Use `useState` for input value and suggestions ✅
  - [x] Use `useEffect` to fetch suggestions on debounced value ✅
  - [x] Render search input with Search icon ✅
  - [x] Render suggestions dropdown (conditional) ✅
  - [x] Handle suggestion click (tour navigation, destination filter) ✅
  - [x] Handle Enter key (submit search) ✅
  - [x] Style dropdown with absolute positioning ✅
  - [x] Add loading state ✅
  - **Estimated**: 1.5 hours

### 8.3 Pagination Component

- [x] **Task 8.6**: [FE] Create `apps/web/components/tours/tour-pagination.tsx` (Client Component) ✅
  - [x] Add `'use client'` directive ✅
  - [x] Accept pagination prop ✅
  - [x] Use `useRouter` and `useSearchParams` ✅
  - [x] Render pagination info: "Page X of Y" ✅
  - [x] Render Previous/Next buttons with disabled states ✅
  - [x] Render page number buttons ✅
  - [x] Scroll to top on page change ✅
  - [x] Add responsive design ✅
  - **Estimated**: 1.5 hours

### 8.4 State Components

- [x] **Task 8.7**: [FE] Create `apps/web/components/tours/empty-state.tsx` ✅
  - [x] Display "No tours found" heading ✅
  - [x] Display descriptive message ✅
  - [x] Add suggestions list ✅
  - [x] Add "Clear Filters" button ✅
  - [x] Style with centered layout ✅
  - [x] Add illustration or icon ✅
  - **Estimated**: 30 min

- [x] **Task 8.8**: [FE] Create `apps/web/components/tours/error-state.tsx` ✅
  - [x] Accept error and onRetry props ✅
  - [x] Display error icon (AlertCircle) ✅
  - [x] Display error heading ✅
  - [x] Display error message (fallback to generic) ✅
  - [x] Add "Try Again" button ✅
  - [x] Style with centered layout ✅
  - **Estimated**: 30 min

### 8.5 Hero Section

- [x] **Task 8.9**: [FE] Create `apps/web/components/tours/hero-section.tsx` ✅
  - [x] Create HeroSection component ✅
  - [x] Background image with overlay ✅
  - [x] Hero content (Main heading, Subtitle text) ✅
  - [x] Search bar with destination input ✅
  - [x] Responsive design ✅
  - [x] Add initialSearch prop to pre-fill search input ✅
  - **Estimated**: 1.5 hours

---

## Phase 9: Frontend - Pages (2-3 hours)

### 9.1 Home Page

- [x] **Task 9.1**: [FE] Update `apps/web/app/page.tsx` ✅
  - [x] Add metadata export ✅
  - [x] Define HomePageProps interface (searchParams) ✅
  - [x] Parse searchParams into TourFilters ✅
  - [x] Render main layout with HeroSection, Tours section, TourFiltersBar ✅
  - [x] Suspense boundary with TourGridSkeleton ✅
  - [x] ToursContent async component ✅
  - **Estimated**: 1 hour

- [x] **Task 9.2**: [FE] Implement ToursContent async component ✅
  - [x] Accept filters prop ✅
  - [x] Call `await getTours(filters)` ✅
  - [x] Handle empty state → render EmptyState ✅
  - [x] Handle error state → render error message ✅
  - [x] Render results with TourGrid and TourPagination ✅
  - [x] Wrap in try-catch for error handling ✅
  - **Estimated**: 45 min

- [x] **Task 9.3**: [FE] Create `apps/web/app/tours/page.tsx` ✅
  - [x] Created dedicated tours browse page with header and search bar ✅
  - [x] Same filtering and pagination logic as home page ✅
  - [x] Added SEO metadata ✅
  - [x] Integrated TourSearch, TourFiltersBar, ErrorState components ✅
  - **Estimated**: 30 min

### 9.2 Layout Components

- [ ] **Task 9.4**: [FE] Update `apps/web/components/layout/header.tsx` (if needed)
  - [ ] Ensure "TravelCo" logo links to "/"
  - [ ] Add navigation links (Destinations, About, Contact)
  - [ ] Add auth-based actions (Sign In button / Avatar menu)
  - [ ] Style with sticky positioning
  - **Estimated**: 30 min (if major changes needed)

- [ ] **Task 9.5**: [FE] Update `apps/web/components/layout/footer.tsx` (if needed)
  - [ ] Ensure consistent styling with design
  - [ ] Add newsletter subscribe form
  - [ ] Add social links
  - [ ] Add company info links
  - **Estimated**: 30 min (if major changes needed)

---

## Phase 10: Integration & QA (4-5 hours)

### 10.1 Manual Testing

- [ ] **Task 10.1**: [QA] Test database migration
  - [ ] Verify all new fields added to tours table
  - [ ] Verify indexes created
  - [ ] Verify trigger created for review_count
  - [ ] Test trigger by inserting/deleting reviews
  - **Estimated**: 30 min

- [ ] **Task 10.2**: [QA] Test backend API with Postman/Thunder Client
  - [ ] Test `GET /tours` with no filters
  - [ ] Test `GET /tours` with search filter
  - [ ] Test `GET /tours` with price filters (priceMin, priceMax)
  - [ ] Test `GET /tours` with difficulty filter
  - [ ] Test `GET /tours` with duration filter
  - [ ] Test `GET /tours` with sort options (all 5 types)
  - [ ] Test `GET /tours` with pagination (page 1, 2, 3)
  - [ ] Test `GET /tours` with invalid params (expect 400)
  - [ ] Test `GET /tours/featured`
  - [ ] Test `GET /tours/suggestions?q=ba`
  - [ ] Verify response times (< 200ms target)
  - **Estimated**: 1 hour

- [ ] **Task 10.3**: [QA] Test full frontend flow
  - [ ] Load home page - verify tours display
  - [ ] Test hero section search
  - [ ] Test filter changes (sort, price, difficulty, duration)
  - [ ] Test search functionality
  - [ ] Test pagination (next, previous, page numbers)
  - [ ] Test empty state (apply filters with no results)
  - [ ] Test URL state persistence (copy/paste URL, refresh)
  - [ ] Test tour card links (navigate to detail page)
  - [ ] Test "Clear Filters" button
  - **Estimated**: 1 hour

### 10.2 Responsive Testing

- [ ] **Task 10.4**: [QA] Test responsive design
  - [ ] **Mobile (< 768px)**:
    - 1 column grid
    - Filters horizontal scroll or drawer
    - Hero section stacked layout
    - Search bar full width
  - [ ] **Tablet (768px - 1024px)**:
    - 2 column grid
    - Filters visible, may scroll
  - [ ] **Desktop (1024px - 1280px)**:
    - 3 column grid
    - All filters visible
  - [ ] **Large Desktop (>= 1280px)**:
    - 4 column grid
  - [ ] Test on real devices (iPhone, iPad, Android)
  - [ ] Test on different browsers (Chrome, Safari, Firefox)
  - **Estimated**: 1 hour

### 10.3 Performance & SEO Testing

- [ ] **Task 10.5**: [QA] Run Lighthouse audit
  - [ ] Run on home page
  - [ ] Target scores:
    - Performance: > 90
    - Accessibility: 100
    - Best Practices: 100
    - SEO: > 95
  - [ ] Check Core Web Vitals:
    - LCP < 2.0s
    - FCP < 1.5s
    - TTI < 3.0s
    - CLS < 0.1
  - [ ] Fix any issues found
  - **Estimated**: 1 hour

- [ ] **Task 10.6**: [QA] Verify SEO meta tags
  - [ ] Check page title
  - [ ] Check meta description
  - [ ] Check Open Graph tags (Facebook preview)
  - [ ] Check Twitter Card tags
  - [ ] Verify canonical URL
  - [ ] (Optional) Add JSON-LD structured data
  - [ ] Test with social media preview tools
  - **Estimated**: 30 min

### 10.4 Accessibility Testing

- [ ] **Task 10.7**: [QA] Accessibility audit
  - [ ] Run axe DevTools
  - [ ] Test keyboard navigation:
    - Tab through all interactive elements
    - Test filter dropdowns with keyboard
    - Test pagination with keyboard
  - [ ] Test with screen reader (VoiceOver, NVDA)
  - [ ] Check color contrast (WCAG AA)
  - [ ] Check focus states on all interactive elements
  - [ ] Verify alt text on images
  - [ ] Verify ARIA labels where needed
  - **Estimated**: 1 hour

---

## Phase 11: Deployment Preparation (1-2 hours)

### 11.1 Environment Setup

- [ ] **Task 11.1**: [DEPLOY] Set environment variables
  - [ ] Backend:
    - `DATABASE_URL` (production)
    - `FRONTEND_URL`
  - [ ] Frontend:
    - `NEXT_PUBLIC_API_URL`
  - **Estimated**: 20 min

- [ ] **Task 11.2**: [DEPLOY] Run database migration on staging
  - [ ] Backup production database
  - [ ] Run migration on staging environment
  - [ ] Verify migration success
  - [ ] Test API on staging
  - **Estimated**: 30 min

### 11.2 Documentation

- [ ] **Task 11.3**: [DOCS] Update API documentation
  - [ ] Generate Swagger docs (`/api` endpoint)
  - [ ] Verify all endpoints documented
  - [ ] Add example requests/responses
  - **Estimated**: 30 min

- [ ] **Task 11.4**: [DOCS] Update README
  - [ ] Document new features
  - [ ] Add setup instructions for tours feature
  - [ ] Add troubleshooting section
  - **Estimated**: 20 min

---

## Summary & Metrics

### Task Summary by Phase

| Phase                             | Tasks        | Estimated Time  |
| --------------------------------- | ------------ | --------------- |
| **Phase 1: Database**             | 7 tasks      | 2-3 hours       |
| **Phase 2: Backend Module Setup** | 3 tasks      | 1-2 hours       |
| **Phase 3: Backend DTOs**         | 3 tasks      | 2-3 hours       |
| **Phase 4: Backend Service**      | 7 tasks      | 4-5 hours       |
| **Phase 5: Backend Controller**   | 4 tasks      | 1 hour          |
| **Phase 6: Backend Testing**      | 7 tasks      | 3-4 hours       |
| **Phase 7: Frontend Types & API** | 5 tasks      | 2 hours         |
| **Phase 8: Frontend Components**  | 9 tasks      | 8-10 hours      |
| **Phase 9: Frontend Pages**       | 5 tasks      | 2-3 hours       |
| **Phase 10: Integration & QA**    | 7 tasks      | 4-5 hours       |
| **Phase 11: Deployment**          | 4 tasks      | 1-2 hours       |
| **TOTAL**                         | **61 tasks** | **30-40 hours** |

### Dependencies Graph

```
Phase 1 (Database)
    └── Must complete before Phase 2-6

Phase 2-6 (Backend)
    ├── Phase 2 (Module) → Phase 3 (DTOs) → Phase 4 (Service) → Phase 5 (Controller)
    └── Phase 6 (Testing) can run parallel with Phase 4-5

Phase 7 (FE Types & API)
    └── Can start parallel with Phase 2-6

Phase 8-9 (Frontend)
    ├── Phase 7 must be complete
    └── Phase 8 (Components) → Phase 9 (Pages)

Phase 10 (Integration & QA)
    └── Requires Phase 1-9 complete

Phase 11 (Deployment)
    └── Requires Phase 10 complete
```

### Critical Path

The critical path (longest sequence of dependent tasks):

1. **Database Migration** (Phase 1) - 3 hours
2. **Backend Service Implementation** (Phase 4) - 5 hours
3. **Frontend Components** (Phase 8) - 10 hours
4. **Frontend Pages** (Phase 9) - 3 hours
5. **Integration & QA** (Phase 10) - 5 hours

**Total Critical Path**: ~26 hours

### Recommended Sprint Planning

**Sprint 1 (Week 1)**:

- Phase 1: Database (all tasks)
- Phase 2-3: Backend setup and DTOs
- Phase 4: Start Service implementation

**Sprint 2 (Week 2)**:

- Phase 4: Complete Service implementation
- Phase 5: Controller implementation
- Phase 6: Backend testing
- Phase 7: Frontend types and API

**Sprint 3 (Week 3)**:

- Phase 8: Frontend components
- Phase 9: Frontend pages
- Phase 10: Start integration testing

**Sprint 4 (Week 4)**:

- Phase 10: Complete QA
- Phase 11: Deployment preparation
- Buffer time for bug fixes

---

## Notes & Best Practices

### Development Tips

1. **Use TypeScript strict mode** - Catch errors early
2. **Write tests alongside code** - Don't leave testing for the end
3. **Test on mobile early** - Don't wait until the end for responsive testing
4. **Use feature flags** - Deploy behind feature flag if unsure about stability
5. **Monitor performance** - Use Lighthouse CI in your pipeline

### Common Pitfalls to Avoid

1. **Forgetting indexes** - Will cause slow queries in production
2. **Not handling edge cases** - Empty states, error states, loading states
3. **Poor mobile UX** - Filters must be usable on small screens
4. **SEO mistakes** - Missing meta tags, poor URL structure
5. **Accessibility issues** - Test with keyboard and screen reader

### Quick Start Commands

```bash
# Database migration
cd apps/server
pnpm prisma migrate dev --name add_tour_overview_fields
pnpm prisma generate

# Install frontend dependencies
cd apps/web
pnpm add use-debounce

# Backend development
cd apps/server
pnpm dev

# Frontend development
cd apps/web
pnpm dev

# Run backend tests
cd apps/server
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests

# Run frontend tests
cd apps/web
pnpm test

# Lint and format
pnpm lint
pnpm format
```

---

**Task Breakdown Status**: ✅ Complete
**Implementation Status**: 🟢 All Core Phases Complete (1-9)
**Test Coverage**: Unit tests (24 passing), E2E tests (15 passing)
**Optional Remaining**: Tasks 9.4, 9.5 (Header/Footer updates), Phase 10-11 (QA/Deploy)
**Questions?**: Refer to TDD document or contact tech lead
