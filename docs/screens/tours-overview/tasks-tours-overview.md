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

- [ ] **Task 1.1**: [DB] Update `apps/server/prisma/schema.prisma` - Add new fields to Tour model
  - Add `difficulty Difficulty? @default(EASY)` field
  - Add `featured Boolean @default(false)` field
  - Add `reviewCount Int @default(0) @map("review_count")` field
  - Add `createdAt DateTime @default(now()) @map("created_at")` field
  - Add `updatedAt DateTime @updatedAt @map("updated_at")` field
  - **Estimated**: 30 min

- [ ] **Task 1.2**: [DB] Add `Difficulty` enum to schema
  ```prisma
  enum Difficulty {
    EASY
    MODERATE
    CHALLENGING
  }
  ```
  - **Estimated**: 10 min

- [ ] **Task 1.3**: [DB] Add database indexes for performance optimization
  - `@@index([location])`
  - `@@index([priceAdult])`
  - `@@index([ratingAverage])`
  - `@@index([featured])`
  - `@@index([createdAt])`
  - `@@index([difficulty])`
  - **Estimated**: 15 min

### 1.2 Migration & Data Setup

- [ ] **Task 1.4**: [DB] Generate and run Prisma migration
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

- [ ] **Task 1.7**: [DB] (Optional) Create seed data for testing
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

- [ ] **Task 2.1**: [BE] Create `apps/server/src/modules/tours/` folder structure
  ```
  tours/
  ├── tours.module.ts
  ├── tours.controller.ts
  ├── tours.service.ts
  ├── tours.service.spec.ts
  └── dto/
  ```
  - **Estimated**: 10 min

- [ ] **Task 2.2**: [BE] Create `tours.module.ts`
  - Import `PrismaModule`
  - Register `ToursController` and `ToursService`
  - Export `ToursService` for use by other modules
  - **Estimated**: 15 min

- [ ] **Task 2.3**: [BE] Register `ToursModule` in `AppModule`
  - Add import in `apps/server/src/app.module.ts`
  - Verify module loads correctly on server start
  - **Estimated**: 10 min

---

## Phase 3: Backend - DTOs (2-3 hours)

### 3.1 Request DTOs

- [ ] **Task 3.1**: [BE] Create `apps/server/src/modules/tours/dto/get-tours.dto.ts`
  - [ ] Define `SortOption` enum (popular, newest, price_asc, price_desc, rating)
  - [ ] Define `DifficultyFilter` enum (easy, moderate, challenging)
  - [ ] Create `GetToursDto` class with validation:
    - `page` (optional, int, min 1, default 1)
    - `limit` (optional, int, min 1, max 50, default 8)
    - `search` (optional, string)
    - `sort` (optional, SortOption enum, default 'popular')
    - `priceMin` (optional, int, min 0)
    - `priceMax` (optional, int)
    - `difficulty` (optional, DifficultyFilter enum)
    - `location` (optional, string)
    - `duration` (optional, string, e.g., "1-3", "4-7", "8+")
  - [ ] Add `@ApiProperty` decorators for Swagger docs
  - [ ] Add `class-validator` decorators
  - [ ] Add `class-transformer` decorators (@Type)
  - **Estimated**: 1 hour

### 3.2 Response DTOs

- [ ] **Task 3.2**: [BE] Create `apps/server/src/modules/tours/dto/tour-response.dto.ts`
  - [ ] Create `TourItemDto` class with all tour fields:
    - id, name, slug, summary, coverImage
    - durationDays, priceAdult, priceChild
    - location, ratingAverage, reviewCount
    - difficulty, featured, nextAvailableDate
  - [ ] Create `PaginationDto` class:
    - page, limit, total, totalPages
    - hasNext, hasPrev
  - [ ] Create `ToursResponseDto` wrapper class
  - [ ] Add `@Expose()` decorators for class-transformer
  - [ ] Add `@ApiProperty` decorators for Swagger
  - **Estimated**: 45 min

- [ ] **Task 3.3**: [BE] Create `apps/server/src/modules/tours/dto/tour-suggestion.dto.ts`
  - [ ] Create `GetSuggestionsDto` class:
    - `q` (required, string, min 2 chars)
    - `limit` (optional, int, max 10, default 5)
  - [ ] Create `SuggestionItemDto` class:
    - type ('tour' | 'destination')
    - id, name, slug
  - [ ] Create `SuggestionsResponseDto` wrapper
  - [ ] Add validation and API decorators
  - **Estimated**: 30 min

---

## Phase 4: Backend - Service Layer (4-5 hours)

### 4.1 Core Service Methods

- [ ] **Task 4.1**: [BE] Create `tours.service.ts` - Implement `getTours()` method
  - [ ] Inject `PrismaService` in constructor
  - [ ] Parse pagination params (page, limit, skip)
  - [ ] Build `where` clause using `buildWhereClause()` helper
  - [ ] Build `orderBy` clause using `buildOrderBy()` helper
  - [ ] Execute parallel queries (Promise.all):
    - `prisma.tour.findMany()` with filters, pagination, select
    - `prisma.tour.count()` with same filters
  - [ ] Include `schedules` relation for next available date (1 schedule, future, OPEN status)
  - [ ] Calculate pagination metadata (totalPages, hasNext, hasPrev)
  - [ ] Map results using `mapTourToDto()` helper
  - [ ] Add logging for debugging
  - **Estimated**: 2 hours

- [ ] **Task 4.2**: [BE] Implement `getFeaturedTours()` method
  - [ ] Query tours with `featured: true`
  - [ ] Order by `ratingAverage` desc, then `reviewCount` desc
  - [ ] Apply limit parameter
  - [ ] Map to TourItemDto
  - [ ] Add error handling
  - **Estimated**: 30 min

- [ ] **Task 4.3**: [BE] Implement `getSuggestions()` method
  - [ ] Query matching tours (name OR location contains query)
  - [ ] Query distinct locations matching query
  - [ ] Combine results with type indicators
  - [ ] Limit total suggestions
  - [ ] Return formatted suggestions array
  - **Estimated**: 45 min

### 4.2 Helper Methods

- [ ] **Task 4.4**: [BE] Implement `buildWhereClause()` private method
  - [ ] Handle search filter (OR across name, location, summary)
  - [ ] Handle price range filter (gte, lte on priceAdult)
  - [ ] Handle difficulty filter (exact match, case-insensitive)
  - [ ] Handle location filter (contains, case-insensitive)
  - [ ] Handle duration filter using `parseDurationRange()`
  - [ ] Return typed `Prisma.TourWhereInput`
  - **Estimated**: 1 hour

- [ ] **Task 4.5**: [BE] Implement `buildOrderBy()` private method
  - [ ] Switch on `SortOption` enum
  - [ ] Handle 'popular' (reviewCount desc, ratingAverage desc)
  - [ ] Handle 'newest' (createdAt desc)
  - [ ] Handle 'price_asc' (priceAdult asc)
  - [ ] Handle 'price_desc' (priceAdult desc)
  - [ ] Handle 'rating' (ratingAverage desc)
  - [ ] Return typed `Prisma.TourOrderByWithRelationInput`
  - **Estimated**: 30 min

- [ ] **Task 4.6**: [BE] Implement `parseDurationRange()` private method
  - [ ] Parse "1-3" format (gte min, lte max)
  - [ ] Parse "8+" format (gte min)
  - [ ] Handle edge cases (invalid format)
  - [ ] Return `Prisma.IntFilter | undefined`
  - **Estimated**: 20 min

- [ ] **Task 4.7**: [BE] Implement `mapTourToDto()` private method
  - [ ] Map all fields from Prisma Tour to TourItemDto
  - [ ] Convert Decimal to Number (priceAdult, priceChild, ratingAverage)
  - [ ] Lowercase difficulty enum
  - [ ] Handle optional fields (null coalescing)
  - [ ] Format nextAvailableDate (ISO string)
  - **Estimated**: 20 min

---

## Phase 5: Backend - Controller Layer (1 hour)

### 5.1 REST Endpoints

- [ ] **Task 5.1**: [BE] Create `tours.controller.ts`
  - [ ] Add `@Controller('tours')` decorator
  - [ ] Add `@ApiTags('tours')` for Swagger
  - [ ] Inject `ToursService` in constructor
  - **Estimated**: 10 min

- [ ] **Task 5.2**: [BE] Add `GET /tours` endpoint
  - [ ] Add `@Get()` decorator
  - [ ] Use `@Query()` decorator with `GetToursDto`
  - [ ] Call `toursService.getTours(dto)`
  - [ ] Return wrapped response: `{ success: true, data: ... }`
  - [ ] Add `@ApiOperation` and `@ApiResponse` decorators
  - **Estimated**: 20 min

- [ ] **Task 5.3**: [BE] Add `GET /tours/featured` endpoint
  - [ ] Add `@Get('featured')` decorator
  - [ ] Accept optional `limit` query param
  - [ ] Call `toursService.getFeaturedTours(limit)`
  - [ ] Return wrapped response
  - [ ] Add Swagger decorators
  - **Estimated**: 15 min

- [ ] **Task 5.4**: [BE] Add `GET /tours/suggestions` endpoint
  - [ ] Add `@Get('suggestions')` decorator
  - [ ] Use `@Query()` with `GetSuggestionsDto`
  - [ ] Call `toursService.getSuggestions(dto)`
  - [ ] Return wrapped response
  - [ ] Add Swagger decorators
  - **Estimated**: 15 min

---

## Phase 6: Backend - Testing (3-4 hours)

### 6.1 Unit Tests

- [ ] **Task 6.1**: [TEST] Create `tours.service.spec.ts` - Setup test environment
  - [ ] Create TestingModule with `ToursService` and mock `PrismaService`
  - [ ] Setup beforeEach to get service instance
  - [ ] Create mock data (sample tours)
  - **Estimated**: 30 min

- [ ] **Task 6.2**: [TEST] Write unit tests for `getTours()`
  - [ ] Test: returns paginated tours with default params
  - [ ] Test: filters by search query (name, location)
  - [ ] Test: filters by price range (priceMin, priceMax)
  - [ ] Test: filters by difficulty level
  - [ ] Test: filters by duration range
  - [ ] Test: sorts by price ascending/descending
  - [ ] Test: sorts by rating
  - [ ] Test: sorts by newest (createdAt)
  - [ ] Test: returns empty array when no results
  - [ ] Test: calculates correct pagination metadata
  - **Estimated**: 2 hours

- [ ] **Task 6.3**: [TEST] Write unit tests for `getFeaturedTours()`
  - [ ] Test: returns only tours with featured=true
  - [ ] Test: orders by rating and review count
  - [ ] Test: respects limit parameter
  - **Estimated**: 30 min

- [ ] **Task 6.4**: [TEST] Write unit tests for `getSuggestions()`
  - [ ] Test: returns matching tour names
  - [ ] Test: returns matching destination names
  - [ ] Test: limits total suggestions
  - [ ] Test: handles minimum 2 characters
  - **Estimated**: 30 min

### 6.2 E2E Tests

- [ ] **Task 6.5**: [TEST] Create `apps/server/test/tours.e2e-spec.ts`
  - [ ] Setup test app with TestingModule
  - [ ] Seed test database with sample tours
  - **Estimated**: 30 min

- [ ] **Task 6.6**: [TEST] Write E2E tests for `GET /tours`
  - [ ] Test: returns 200 with valid response structure
  - [ ] Test: filters by search query
  - [ ] Test: filters by price range (priceMin, priceMax)
  - [ ] Test: filters by difficulty
  - [ ] Test: returns 400 for invalid params (e.g., page=-1)
  - [ ] Test: handles empty results gracefully
  - **Estimated**: 1 hour

- [ ] **Task 6.7**: [TEST] Write E2E tests for `GET /tours/featured` and `GET /tours/suggestions`
  - [ ] Test: `/tours/featured` returns featured tours
  - [ ] Test: `/tours/suggestions` returns suggestions
  - [ ] Test: `/tours/suggestions` requires min 2 characters (400 error)
  - **Estimated**: 30 min

---

## Phase 7: Frontend - Types & API (2 hours)

### 7.1 Type Definitions

- [ ] **Task 7.1**: [FE] Create `apps/web/lib/types/tour.ts`
  - [ ] Define `Tour` interface (matching backend TourItemDto)
  - [ ] Define `TourFilters` interface (query params)
  - [ ] Define `Pagination` interface
  - [ ] Define `ToursResponse` interface
  - [ ] Define `TourCardProps` interface
  - [ ] Define `Suggestion` interface
  - **Estimated**: 30 min

### 7.2 API Client Functions

- [ ] **Task 7.2**: [FE] Create `apps/web/lib/api/tours.ts`
  - [ ] Implement `getTours(filters)` function
    - [ ] Build URLSearchParams from filters
    - [ ] Call API with `fetch()`
    - [ ] Add ISR caching: `next: { revalidate: 300 }`
    - [ ] Parse and return `ToursResponse`
    - [ ] Add error handling with try-catch
  - **Estimated**: 45 min

- [ ] **Task 7.3**: [FE] Implement `getFeaturedTours()` function
  - [ ] Call `/tours/featured` endpoint
  - [ ] Add ISR caching: `next: { revalidate: 600 }`
  - [ ] Return Tour array
  - **Estimated**: 15 min

- [ ] **Task 7.4**: [FE] Implement `getSearchSuggestions()` function
  - [ ] Call `/tours/suggestions` endpoint
  - [ ] Use `cache: 'no-store'` (always fresh)
  - [ ] Handle minimum 2 characters
  - [ ] Return Suggestion array
  - **Estimated**: 15 min

### 7.3 Utility Functions

- [ ] **Task 7.5**: [FE] Create `apps/web/lib/utils/format.ts`
  - [ ] Implement `formatCurrency(amount)` - USD formatting
  - [ ] Implement `formatRating(rating)` - 1 decimal place
  - [ ] Implement `formatDuration(days)` - "X Days" format
  - [ ] Implement `getDifficultyColor(difficulty)` - Tailwind classes
  - **Estimated**: 30 min

---

## Phase 8: Frontend - UI Components (8-10 hours)

### 8.1 Tour Card Components

- [ ] **Task 8.1**: [FE] Create `apps/web/components/tours/tour-card.tsx`
  - [ ] Create TourCard component with TourCardProps
  - [ ] Image section:
    - [ ] Use Next.js Image component
    - [ ] Add aspect ratio 4:3
    - [ ] Add hover scale effect
    - [ ] Add priority prop support
    - [ ] Set responsive sizes
  - [ ] Overlay elements:
    - [ ] Favorite button (Heart icon, top-right)
    - [ ] Featured badge (conditional, top-left)
  - [ ] Content section:
    - [ ] Title with link to `/tours/{slug}`
    - [ ] Rating with Star icon
    - [ ] Metadata row: duration, location (MapPin, Clock icons)
    - [ ] Summary text (line-clamp-2)
    - [ ] Difficulty badge with color coding
  - [ ] Footer section:
    - [ ] Price display with formatting
    - [ ] "Book Now" CTA button
  - [ ] Add hover states and transitions
  - [ ] Add dark mode support
  - **Estimated**: 2 hours

- [ ] **Task 8.2**: [FE] Create `apps/web/components/tours/tour-card-skeleton.tsx`
  - [ ] Create TourCardSkeleton component
  - [ ] Match TourCard structure with shimmer effect
  - [ ] Create TourGridSkeleton component (renders multiple)
  - [ ] Add count prop (default 8)
  - **Estimated**: 45 min

- [ ] **Task 8.3**: [FE] Create `apps/web/components/tours/tour-grid.tsx`
  - [ ] Create TourGrid component accepting tours array
  - [ ] Implement responsive grid:
    - Mobile: 1 column
    - Tablet: 2 columns
    - Desktop: 3-4 columns
  - [ ] Pass priority=true to first 4 cards (above fold)
  - [ ] Add gap and padding
  - **Estimated**: 30 min

### 8.2 Filter Components

- [ ] **Task 8.4**: [FE] Create `apps/web/components/tours/tour-filters.tsx` (Client Component)
  - [ ] Add `'use client'` directive
  - [ ] Use `useRouter` and `useSearchParams` hooks
  - [ ] Use `useTransition` for pending state
  - [ ] Create filter options arrays:
    - sortOptions (Popular, Newest, Price asc/desc, Rating)
    - priceOptions (ranges)
    - difficultyOptions (Easy, Moderate, Challenging)
    - durationOptions (1-3, 4-7, 8+ days)
  - [ ] Implement `updateFilter(key, value)` function
    - Update URL params
    - Reset page to 1
    - Use startTransition
  - [ ] Implement `handlePriceChange(value)` function
    - Parse range (e.g., "500-1000")
    - Set priceMin and priceMax separately
  - [ ] Render filter dropdowns:
    - Sort select
    - Price select
    - Duration select
    - Difficulty select
  - [ ] Add "Clear Filters" button (conditional)
  - [ ] Style with Tailwind (rounded-full, responsive)
  - [ ] Handle disabled state during transition
  - **Estimated**: 2 hours

- [ ] **Task 8.5**: [FE] Create `apps/web/components/tours/tour-search.tsx` (Client Component)
  - [ ] Add `'use client'` directive
  - [ ] Use `useDebouncedValue` from 'use-debounce' (300ms)
  - [ ] Use `useState` for input value and suggestions
  - [ ] Use `useEffect` to fetch suggestions on debounced value
  - [ ] Render search input with Search icon
  - [ ] Render suggestions dropdown (conditional)
  - [ ] Handle suggestion click:
    - Tour: navigate to `/tours/{slug}`
    - Destination: add to location filter
  - [ ] Handle Enter key (submit search)
  - [ ] Style dropdown with absolute positioning
  - [ ] Add loading state
  - **Estimated**: 1.5 hours

### 8.3 Pagination Component

- [ ] **Task 8.6**: [FE] Create `apps/web/components/tours/tour-pagination.tsx` (Client Component)
  - [ ] Add `'use client'` directive
  - [ ] Accept pagination prop
  - [ ] Use `useRouter` and `useSearchParams`
  - [ ] Render pagination info: "Page X of Y"
  - [ ] Render Previous button:
    - Disabled on first page (hasPrev=false)
    - Updates URL param ?page=X-1
  - [ ] Render page number buttons:
    - Show max 5 page numbers
    - Highlight current page
    - Add ellipsis for large page counts
  - [ ] Render Next button:
    - Disabled on last page (hasNext=false)
    - Updates URL param ?page=X+1
  - [ ] Scroll to top on page change
  - [ ] Add responsive design (hide page numbers on mobile)
  - **Estimated**: 1.5 hours

### 8.4 State Components

- [ ] **Task 8.7**: [FE] Create `apps/web/components/tours/empty-state.tsx`
  - [ ] Display "No tours found" heading
  - [ ] Display descriptive message
  - [ ] Add suggestions list:
    - "Try adjusting your filters"
    - "Search for a different destination"
    - "Clear all filters to see all tours"
  - [ ] Add "Clear Filters" button (navigates to `/`)
  - [ ] Style with centered layout
  - [ ] Add illustration or icon
  - **Estimated**: 30 min

- [ ] **Task 8.8**: [FE] Create `apps/web/components/tours/error-state.tsx`
  - [ ] Accept error and onRetry props
  - [ ] Display error icon (AlertCircle)
  - [ ] Display error heading
  - [ ] Display error message (fallback to generic)
  - [ ] Add "Try Again" button
  - [ ] Style with centered layout
  - **Estimated**: 30 min

### 8.5 Hero Section

- [ ] **Task 8.9**: [FE] Create `apps/web/components/tours/hero-section.tsx`
  - [ ] Create HeroSection component
  - [ ] Background image with overlay
  - [ ] Hero content:
    - [ ] Main heading: "Discover Your Next Adventure"
    - [ ] Subtitle text
  - [ ] Search bar (integrate TourSearch component or create simple version):
    - [ ] Destination input (Search icon)
    - [ ] Date picker input (Calendar icon)
    - [ ] Guests input (User/Group icon)
    - [ ] Search button
  - [ ] Responsive design:
    - Stack vertically on mobile
    - Horizontal on desktop
  - [ ] Add initialSearch prop to pre-fill search input
  - **Estimated**: 1.5 hours

---

## Phase 9: Frontend - Pages (2-3 hours)

### 9.1 Home Page

- [ ] **Task 9.1**: [FE] Update `apps/web/app/page.tsx`
  - [ ] Add metadata export:
    - [ ] title
    - [ ] description
    - [ ] keywords
    - [ ] openGraph (title, description, images)
    - [ ] twitter (card, title, images)
  - [ ] Define HomePageProps interface (searchParams)
  - [ ] Parse searchParams into TourFilters
  - [ ] Render main layout:
    - [ ] HeroSection component
    - [ ] Tours section container
    - [ ] Section header ("Popular Tours This Season")
    - [ ] TourFiltersBar component
    - [ ] Suspense boundary with TourGridSkeleton
    - [ ] ToursContent async component
  - **Estimated**: 1 hour

- [ ] **Task 9.2**: [FE] Implement ToursContent async component
  - [ ] Accept filters prop
  - [ ] Call `await getTours(filters)`
  - [ ] Handle empty state → render EmptyState
  - [ ] Handle error state → render error message
  - [ ] Render results:
    - [ ] Results count text
    - [ ] TourGrid component
    - [ ] TourPagination component (conditional, if totalPages > 1)
  - [ ] Wrap in try-catch for error handling
  - **Estimated**: 45 min

- [ ] **Task 9.3**: [FE] (Optional) Create `apps/web/app/tours/page.tsx`
  - [ ] Option A: Redirect to home page
  - [ ] Option B: Duplicate home page logic
  - [ ] Add same metadata
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

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| **Phase 1: Database** | 7 tasks | 2-3 hours |
| **Phase 2: Backend Module Setup** | 3 tasks | 1-2 hours |
| **Phase 3: Backend DTOs** | 3 tasks | 2-3 hours |
| **Phase 4: Backend Service** | 7 tasks | 4-5 hours |
| **Phase 5: Backend Controller** | 4 tasks | 1 hour |
| **Phase 6: Backend Testing** | 7 tasks | 3-4 hours |
| **Phase 7: Frontend Types & API** | 5 tasks | 2 hours |
| **Phase 8: Frontend Components** | 9 tasks | 8-10 hours |
| **Phase 9: Frontend Pages** | 5 tasks | 2-3 hours |
| **Phase 10: Integration & QA** | 7 tasks | 4-5 hours |
| **Phase 11: Deployment** | 4 tasks | 1-2 hours |
| **TOTAL** | **61 tasks** | **30-40 hours** |

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
**Next Step**: Begin Phase 1 - Database Migration  
**Questions?**: Refer to TDD document or contact tech lead
