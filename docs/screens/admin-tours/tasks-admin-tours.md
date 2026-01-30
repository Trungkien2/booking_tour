# Task Checklist: Admin Tour Management

> Generated from: `tdd-admin-tours.md`
> Feature: Admin Tour Management (SCR-011)
> Route: `/admin/tours`

---

## Phase 1: Database Schema

### 1.1 Update Prisma Schema

- [x] **Task 1.1**: [DB] Add `TourStatus` enum to `apps/server/prisma/schema.prisma`
  - Add enum with values: DRAFT, PUBLISHED, ARCHIVED
- [x] **Task 1.2**: [DB] Add new fields to `Tour` model in `apps/server/prisma/schema.prisma`
  - Add `status` field (TourStatus, default: DRAFT)
  - Add `createdAt` field (DateTime, default: now())
  - Add `updatedAt` field (DateTime, @updatedAt)
  - Add `deletedAt` field (DateTime?, nullable for soft delete)

- [x] **Task 1.3**: [DB] Create migration

  ```bash
  cd apps/server
  pnpm prisma migrate dev --name add_tour_status_and_timestamps
  ```

- [x] **Task 1.4**: [DB] Add database indexes (in migration file or separate migration)
  - Add index on `tours(status)` WHERE `deleted_at IS NULL`
  - Add index on `tours(deleted_at)`
  - Optional: Add GIN indexes for full-text search on `name` and `location`

- [x] **Task 1.5**: [DB] Verify migration in development database
  - Run migration
  - Check schema in database client (pgAdmin, TablePlus)
  - Verify indexes are created

---

## Phase 2: Backend (NestJS) - Module Setup

### 2.1 Create Tours Module Structure

- [x] **Task 2.1**: [BE] Create tours module directory structure

  ```bash
  mkdir -p apps/server/src/modules/tours/dto
  mkdir -p apps/server/src/modules/tours/entities
  ```

- [x] **Task 2.2**: [BE] Create `apps/server/src/modules/tours/tours.module.ts`
  - Import PrismaModule
  - Declare ToursController
  - Provide ToursService
  - Export ToursService

- [x] **Task 2.3**: [BE] Register ToursModule in `apps/server/src/app.module.ts`
  - Add ToursModule to imports array

---

## Phase 3: Backend - DTOs

### 3.1 Query DTO

- [x] **Task 3.1**: [BE] Create `apps/server/src/modules/tours/dto/tour-query.dto.ts`
  - Add `search` field (optional, string)
  - Add `status` field (optional, enum: DRAFT, PUBLISHED, ARCHIVED)
  - Add `page` field (optional, number, default: 1, min: 1)
  - Add `limit` field (optional, number, default: 10, min: 1)
  - Add `sort` field (optional, string, format: "field:order")
  - Use class-validator decorators

### 3.2 Create DTO

- [x] **Task 3.2**: [BE] Create `apps/server/src/modules/tours/dto/create-tour.dto.ts`
  - Add `name` field (required, string)
  - Add `summary` field (optional, string)
  - Add `description` field (optional, string)
  - Add `coverImage` field (optional, URL string)
  - Add `images` field (optional, array of URL strings)
  - Add `durationDays` field (required, number, min: 1)
  - Add `priceAdult` field (required, decimal number)
  - Add `priceChild` field (required, decimal number)
  - Add `location` field (optional, string)
  - Add `status` field (optional, enum: DRAFT, PUBLISHED, ARCHIVED)
  - Use class-validator decorators

### 3.3 Update DTO

- [x] **Task 3.3**: [BE] Create `apps/server/src/modules/tours/dto/update-tour.dto.ts`
  - Extend from PartialType(CreateTourDto)

### 3.4 Response DTOs

- [x] **Task 3.4**: [BE] Create `apps/server/src/modules/tours/dto/tour-response.dto.ts`
  - Add `TourResponseDto` class with all tour fields plus computed fields:
    - `totalSlots` (number)
    - `bookedSlots` (number)
    - `availableSlots` (number)
  - Add `TourListResponseDto` class with data array and meta object
  - Add `TourStatisticsDto` class with total, active, drafts, fullyBooked

---

## Phase 4: Backend - Service Layer

### 4.1 Core CRUD Methods

- [x] **Task 4.1**: [BE] Create `apps/server/src/modules/tours/tours.service.ts` - Basic setup
  - Inject PrismaService
  - Add JSDoc comments for service class

- [x] **Task 4.2**: [BE] Implement `findAll()` method
  - Parse query parameters (search, status, page, limit, sort)
  - Build Prisma where clause (exclude soft-deleted, filter by status)
  - Add search with OR condition on name and location
  - Include schedules relation with select (maxCapacity, currentCapacity)
  - Calculate totalSlots and bookedSlots for each tour
  - Return TourListResponseDto with pagination meta

- [x] **Task 4.3**: [BE] Implement `findOne(id)` method
  - Find tour by ID with schedules relation
  - Throw NotFoundException if not found or soft-deleted
  - Calculate slots (total, booked, available)
  - Return TourResponseDto

- [x] **Task 4.4**: [BE] Implement `getStatistics()` method
  - Count total tours (exclude soft-deleted)
  - Count active tours (status = PUBLISHED, exclude soft-deleted)
  - Count drafts (status = DRAFT, exclude soft-deleted)
  - Fetch all tours with schedules
  - Calculate fully booked tours (bookedSlots >= totalSlots)
  - Return TourStatisticsDto

- [x] **Task 4.5**: [BE] Implement `create(createTourDto)` method
  - Generate slug from name using `generateSlug()` helper
  - Check if slug already exists
  - Throw ConflictException if slug exists
  - Create tour with default status = DRAFT
  - Return created tour via `findOne()`

- [x] **Task 4.6**: [BE] Implement `update(id, updateTourDto)` method
  - Check if tour exists via `findOne()`
  - If name changed, regenerate slug
  - Check slug conflict with other tours
  - Update tour in database
  - Return updated tour via `findOne()`

- [x] **Task 4.7**: [BE] Implement `remove(id)` method (soft delete)
  - Check if tour exists via `findOne()`
  - Count active bookings (PENDING or PAID status) related to tour schedules
  - Throw BadRequestException if active bookings exist
  - Soft delete: update deletedAt timestamp
  - Return void

### 4.2 Helper Methods

- [x] **Task 4.8**: [BE] Implement `generateSlug(name)` private method
  - Convert to lowercase
  - Trim whitespace
  - Remove special characters
  - Replace spaces with hyphens
  - Limit length to 100 characters
  - Return slug string

---

## Phase 5: Backend - Controller

### 5.1 Controller Setup

- [x] **Task 5.1**: [BE] Create `apps/server/src/modules/tours/tours.controller.ts` - Basic setup
  - Add `@Controller('api/admin/tours')` decorator
  - Add `@UseGuards(JwtAuthGuard)` decorator
  - Add `@Roles('ADMIN')` decorator
  - Add `@ApiTags('admin/tours')` decorator
  - Add `@ApiBearerAuth('access-token')` decorator
  - Inject ToursService

### 5.2 Endpoints

- [x] **Task 5.2**: [BE] Add `GET /api/admin/tours/statistics` endpoint
  - Add `@Get('statistics')` decorator
  - Add `@HttpCode(HttpStatus.OK)` decorator
  - Add `@ApiOperation()` with summary
  - Call `toursService.getStatistics()`

- [x] **Task 5.3**: [BE] Add `GET /api/admin/tours` endpoint
  - Add `@Get()` decorator
  - Add `@HttpCode(HttpStatus.OK)` decorator
  - Add `@ApiOperation()` with summary
  - Use `@Query()` with TourQueryDto
  - Call `toursService.findAll(query)`

- [x] **Task 5.4**: [BE] Add `GET /api/admin/tours/:id` endpoint
  - Add `@Get(':id')` decorator
  - Add `@HttpCode(HttpStatus.OK)` decorator
  - Add `@ApiOperation()` with summary
  - Use `@Param('id', ParseIntPipe)`
  - Call `toursService.findOne(id)`

- [x] **Task 5.5**: [BE] Add `POST /api/admin/tours` endpoint
  - Add `@Post()` decorator
  - Add `@HttpCode(HttpStatus.CREATED)` decorator
  - Add `@ApiOperation()` with summary
  - Use `@Body()` with CreateTourDto
  - Call `toursService.create(createTourDto)`

- [x] **Task 5.6**: [BE] Add `PATCH /api/admin/tours/:id` endpoint
  - Add `@Patch(':id')` decorator
  - Add `@HttpCode(HttpStatus.OK)` decorator
  - Add `@ApiOperation()` with summary
  - Use `@Param('id', ParseIntPipe)` and `@Body()` with UpdateTourDto
  - Call `toursService.update(id, updateTourDto)`

- [x] **Task 5.7**: [BE] Add `DELETE /api/admin/tours/:id` endpoint
  - Add `@Delete(':id')` decorator
  - Add `@HttpCode(HttpStatus.NO_CONTENT)` decorator
  - Add `@ApiOperation()` with summary
  - Use `@Param('id', ParseIntPipe)`
  - Call `toursService.remove(id)`

---

## Phase 6: Backend - Testing

### 6.1 Unit Tests

- [x] **Task 6.1**: [TEST] Create `apps/server/src/modules/tours/tours.service.spec.ts`
  - Setup test module with mock PrismaService

- [x] **Task 6.2**: [TEST] Add tests for `findAll()`
  - Test: should return paginated tours
  - Test: should filter by status
  - Test: should search by name
  - Test: should exclude soft-deleted tours

- [x] **Task 6.3**: [TEST] Add tests for `create()`
  - Test: should create a new tour with generated slug
  - Test: should throw ConflictException if slug exists
  - Test: should default status to DRAFT

- [x] **Task 6.4**: [TEST] Add tests for `update()`
  - Test: should update tour fields
  - Test: should regenerate slug if name changes
  - Test: should throw NotFoundException if tour not found

- [x] **Task 6.5**: [TEST] Add tests for `remove()`
  - Test: should soft delete tour without bookings
  - Test: should throw BadRequestException if active bookings exist

- [x] **Task 6.6**: [TEST] Add tests for `getStatistics()`
  - Test: should calculate correct statistics
  - Test: should identify fully booked tours

### 6.2 E2E Tests

- [x] **Task 6.7**: [TEST] Create `apps/server/test/admin-tours.e2e-spec.ts`
  - Setup test app and database

- [x] **Task 6.8**: [TEST] Add authentication tests
  - Test: GET /api/admin/tours should return 401 without auth token
  - Test: GET /api/admin/tours should return 403 for non-admin users
  - Test: GET /api/admin/tours should return 200 for admin users

- [x] **Task 6.9**: [TEST] Add CRUD tests
  - Test: POST /api/admin/tours should create tour with valid data (201)
  - Test: POST /api/admin/tours should return 400 for invalid data
  - Test: POST /api/admin/tours should return 409 for duplicate slug
  - Test: GET /api/admin/tours/:id should return tour (200)
  - Test: PATCH /api/admin/tours/:id should update tour (200)
  - Test: DELETE /api/admin/tours/:id should soft delete tour (204)
  - Test: DELETE /api/admin/tours/:id should prevent delete if active bookings (400)

---

## Phase 7: Frontend - API Integration

### 7.1 API Functions

- [x] **Task 7.1**: [FE] Create `apps/web/lib/api/admin/` directory

  ```bash
  mkdir -p apps/web/lib/api/admin
  ```

- [x] **Task 7.2**: [FE] Create `apps/web/lib/api/admin/tours.ts` - Type definitions
  - Define `Tour` interface
  - Define `TourListResponse` interface
  - Define `TourStatistics` interface
  - Define `TourQueryParams` interface

- [x] **Task 7.3**: [FE] Implement `getTours(params, token)` function
  - Build query string from params
  - Make GET request to `/api/admin/tours`
  - Add Authorization header with Bearer token
  - Handle response and errors
  - Return TourListResponse

- [x] **Task 7.4**: [FE] Implement `getTourStatistics(token)` function
  - Make GET request to `/api/admin/tours/statistics`
  - Add Authorization header
  - Return TourStatistics

- [x] **Task 7.5**: [FE] Implement `getTourById(id, token)` function
  - Make GET request to `/api/admin/tours/:id`
  - Add Authorization header
  - Return Tour

- [x] **Task 7.6**: [FE] Implement `createTour(data, token)` function
  - Make POST request to `/api/admin/tours`
  - Add Authorization and Content-Type headers
  - Send tour data in body
  - Handle errors with user-friendly messages
  - Return created Tour

- [x] **Task 7.7**: [FE] Implement `updateTour(id, data, token)` function
  - Make PATCH request to `/api/admin/tours/:id`
  - Add Authorization and Content-Type headers
  - Send partial tour data in body
  - Handle errors
  - Return updated Tour

- [x] **Task 7.8**: [FE] Implement `deleteTour(id, token)` function
  - Make DELETE request to `/api/admin/tours/:id`
  - Add Authorization header
  - Handle errors
  - Return void

### 7.2 Validation Schema

- [x] **Task 7.9**: [FE] Create `apps/web/lib/validations/tour.ts`
  - Create `tourSchema` with Zod
  - Validate `name` (required, min 1, max 200)
  - Validate `summary` (optional, max 500)
  - Validate `description` (optional)
  - Validate `coverImage` (optional, URL)
  - Validate `images` (optional, array of URLs)
  - Validate `durationDays` (required, number, min 1)
  - Validate `priceAdult` (required, number, min 0)
  - Validate `priceChild` (required, number, min 0)
  - Validate `location` (optional)
  - Validate `status` (optional, enum)
  - Export `TourFormData` type

---

## Phase 8: Frontend - Admin Layout

### 8.1 Admin Layout

- [x] **Task 8.1**: [FE] Create `apps/web/app/admin/` directory

  ```bash
  mkdir -p apps/web/app/admin
  ```

- [x] **Task 8.2**: [FE] Create `apps/web/app/admin/layout.tsx`
  - Create admin layout component
  - Add sidebar navigation (or top nav)
  - Add protected route check (redirect if not admin)
  - Export layout

---

## Phase 9: Frontend - Components

### 9.1 Statistics Component

- [x] **Task 9.1**: [FE] Create `apps/web/components/admin/tours/` directory

  ```bash
  mkdir -p apps/web/components/admin/tours
  ```

- [x] **Task 9.2**: [FE] Create `apps/web/components/admin/tours/tour-statistics.tsx`
  - Create client component ("use client")
  - Fetch statistics on mount using `getTourStatistics()`
  - Show loading skeleton
  - Render 4 stat cards:
    - Total Tours
    - Active Tours (Published)
    - Drafts
    - Fully Booked
  - Show trend indicators (+X%)
  - Handle errors with error message

### 9.2 Filters Component

- [x] **Task 9.3**: [FE] Create `apps/web/components/admin/tours/tour-filters.tsx`
  - Create client component
  - Add search input with debounce (300ms)
  - Add status tabs: All Status, Published, Draft, Archived
  - Call `onFilterChange` callback with filter values
  - Style with Tailwind

### 9.3 Table Component

- [x] **Task 9.4**: [FE] Create `apps/web/components/admin/tours/tour-table.tsx` - Basic structure
  - Create client component
  - Accept `tours`, `meta`, `onEdit`, `onDelete` as props
  - Create table with columns: Tour Name, Price, Slots, Status, Actions

- [x] **Task 9.5**: [FE] Implement table columns rendering
  - Tour Name column: show cover image, name, location
  - Price column: show adult price
  - Slots column: show booked/total with progress bar
  - Status column: show status badge (color-coded)
  - Actions column: show Edit and Delete icons

- [x] **Task 9.6**: [FE] Add pagination controls
  - Show page numbers
  - Add Previous and Next buttons
  - Call `onPageChange` callback

### 9.4 Edit Panel Component

- [x] **Task 9.7**: [FE] Create `apps/web/components/admin/tours/tour-edit-panel.tsx`
  - Create client component
  - Accept `tour`, `isOpen`, `onClose`, `onSave` as props
  - Create side panel/modal with overlay
  - Use `@radix-ui/react-dialog` or custom modal
  - Render TourForm inside panel
  - Add Cancel and Save buttons

### 9.5 Form Component

- [x] **Task 9.8**: [FE] Create `apps/web/components/admin/tours/tour-form.tsx` - Setup
  - Create client component
  - Accept `initialData`, `onSubmit` as props
  - Setup `useForm` with `zodResolver(tourSchema)`
  - Setup loading state

- [x] **Task 9.9**: [FE] Implement form fields
  - Add Cover Image upload field (URL input for now)
  - Add Tour Name input
  - Add Location input
  - Add Duration (Days) number input
  - Add Price (Adult) number input
  - Add Price (Child) number input
  - Add Summary textarea
  - Add Description textarea
  - Add Status radio buttons (Draft, Published, Archived)
  - Show validation errors

- [x] **Task 9.10**: [FE] Implement form submission
  - Validate form data
  - Call `onSubmit` callback with form data
  - Show loading state on submit button
  - Handle errors

### 9.6 Delete Dialog Component

- [x] **Task 9.11**: [FE] Create `apps/web/components/admin/tours/tour-delete-dialog.tsx`
  - Create client component
  - Accept `tour`, `isOpen`, `onClose`, `onConfirm` as props
  - Show confirmation dialog
  - Display warning message
  - Add Cancel and Delete buttons
  - Call `onConfirm` on delete

---

## Phase 10: Frontend - Pages

### 10.1 Tour List Page

- [x] **Task 10.1**: [FE] Create `apps/web/app/admin/tours/` directory

  ```bash
  mkdir -p apps/web/app/admin/tours
  ```

- [x] **Task 10.2**: [FE] Create `apps/web/app/admin/tours/page.tsx` - Page setup
  - Create client component
  - Add page metadata (title, description)
  - Create page layout with header

- [x] **Task 10.3**: [FE] Implement data fetching and state management
  - Setup state for tours, filters, pagination, loading, errors
  - Fetch tours on mount and filter/page change
  - Fetch statistics on mount
  - Handle loading and error states

- [x] **Task 10.4**: [FE] Implement edit functionality
  - Setup state for edit panel (isOpen, selectedTour)
  - Open panel on Edit button click
  - Call `updateTour()` API on save
  - Refresh tour list on success
  - Show success/error toast

- [x] **Task 10.5**: [FE] Implement delete functionality
  - Setup state for delete dialog (isOpen, selectedTour)
  - Open dialog on Delete button click
  - Call `deleteTour()` API on confirm
  - Refresh tour list on success
  - Show success/error toast with specific message for active bookings

- [x] **Task 10.6**: [FE] Render components
  - Render TourStatistics component
  - Render TourFilters component with filter handlers
  - Render TourTable component with tours and pagination
  - Render TourEditPanel component
  - Render TourDeleteDialog component
  - Add "Add New Tour" button linking to `/admin/tours/new`

### 10.2 Create Tour Page

- [x] **Task 10.7**: [FE] Create `apps/web/app/admin/tours/new/page.tsx`
  - Create client component
  - Add page metadata
  - Create page layout with header
  - Render TourForm component with no initial data
  - Call `createTour()` API on submit
  - Redirect to `/admin/tours` on success
  - Show success/error toast

- [ ] **Task 10.5**: [FE] Implement delete functionality
  - Setup state for delete dialog (isOpen, selectedTour)
  - Open dialog on Delete button click
  - Call `deleteTour()` API on confirm
  - Refresh tour list on success
  - Show success/error toast with specific message for active bookings

- [ ] **Task 10.6**: [FE] Render components
  - Render TourStatistics component
  - Render TourFilters component with filter handlers
  - Render TourTable component with tours and pagination
  - Render TourEditPanel component
  - Render TourDeleteDialog component
  - Add "Add New Tour" button linking to `/admin/tours/new`

### 10.2 Create Tour Page

- [ ] **Task 10.7**: [FE] Create `apps/web/app/admin/tours/new/page.tsx`
  - Create client component
  - Add page metadata
  - Create page layout with header
  - Render TourForm component with no initial data
  - Call `createTour()` API on submit
  - Redirect to `/admin/tours` on success
  - Show success/error toast

---

## Phase 11: Integration & QA

### 11.1 End-to-End Testing

- [ ] **Task 11.1**: [QA] Test admin authentication flow
  - Verify redirect to login if not authenticated
  - Verify redirect to 403 if not admin
  - Verify admin can access tour management

- [ ] **Task 11.2**: [QA] Test tour list functionality
  - Verify tours load correctly
  - Verify statistics display correctly
  - Verify search functionality
  - Verify status filter tabs
  - Verify pagination

- [ ] **Task 11.3**: [QA] Test create tour flow
  - Fill all required fields
  - Submit form
  - Verify tour created in database
  - Verify redirect to tour list
  - Verify new tour appears in list

- [ ] **Task 11.4**: [QA] Test edit tour flow
  - Click Edit button
  - Verify side panel opens with tour data
  - Update fields
  - Save changes
  - Verify tour updated in database
  - Verify changes reflected in list

- [ ] **Task 11.5**: [QA] Test delete tour flow
  - Click Delete on tour without bookings
  - Confirm deletion
  - Verify tour soft-deleted (deletedAt set)
  - Verify tour removed from list

- [ ] **Task 11.6**: [QA] Test delete tour with active bookings
  - Try to delete tour with PENDING or PAID bookings
  - Verify error message displayed
  - Verify tour NOT deleted

### 11.2 Error Scenarios

- [ ] **Task 11.7**: [QA] Test validation errors
  - Try creating tour with empty name → show error
  - Try creating tour with negative price → show error
  - Try creating tour with invalid URL → show error

- [ ] **Task 11.8**: [QA] Test duplicate slug
  - Create tour "Amazing Tour"
  - Try creating another tour "Amazing Tour"
  - Verify 409 error
  - Verify user-friendly error message

- [ ] **Task 11.9**: [QA] Test API error handling
  - Simulate 401 (expired token) → redirect to login
  - Simulate 403 (non-admin) → show error message
  - Simulate 404 (tour not found) → show error message
  - Simulate 500 (server error) → show generic error message

### 11.3 Performance & Responsive Design

- [ ] **Task 11.10**: [QA] Test performance with large dataset
  - Seed database with 100+ tours
  - Verify list loads < 2s
  - Verify statistics calculate < 500ms
  - Verify search responds quickly
  - Verify pagination works smoothly

- [ ] **Task 11.11**: [QA] Test responsive design
  - Desktop (>= 1024px): verify full layout
  - Tablet (768px - 1024px): verify adjusted layout
  - Mobile (< 768px): verify mobile layout (optional)

---

## Summary

| Phase                         | Tasks        | Estimated Time  |
| ----------------------------- | ------------ | --------------- |
| Phase 1: Database             | 5 tasks      | 2-3 hours       |
| Phase 2: Backend Module Setup | 3 tasks      | 1 hour          |
| Phase 3: Backend DTOs         | 4 tasks      | 2-3 hours       |
| Phase 4: Backend Service      | 8 tasks      | 6-8 hours       |
| Phase 5: Backend Controller   | 7 tasks      | 3-4 hours       |
| Phase 6: Backend Testing      | 9 tasks      | 4-6 hours       |
| Phase 7: Frontend API         | 9 tasks      | 3-4 hours       |
| Phase 8: Frontend Layout      | 2 tasks      | 1-2 hours       |
| Phase 9: Frontend Components  | 11 tasks     | 8-10 hours      |
| Phase 10: Frontend Pages      | 7 tasks      | 4-6 hours       |
| Phase 11: Integration & QA    | 11 tasks     | 4-6 hours       |
| **Total**                     | **76 tasks** | **38-55 hours** |

---

## Dependencies Graph

```
Phase 1 (Database)
    ↓
Phase 2 (Backend Module Setup)
    ↓
Phase 3 (Backend DTOs)
    ↓
Phase 4 (Backend Service) ← depends on Phase 3
    ↓
Phase 5 (Backend Controller) ← depends on Phase 4
    ↓
Phase 6 (Backend Testing) ← depends on Phase 4, 5

Phase 7 (Frontend API) ← depends on Phase 5 (API must exist)
    ↓
Phase 8 (Frontend Layout) ← independent
    ↓
Phase 9 (Frontend Components) ← depends on Phase 7
    ↓
Phase 10 (Frontend Pages) ← depends on Phase 9

Phase 11 (Integration & QA) ← depends on all previous phases
```

---

## Quick Start Commands

```bash
# Database migration
cd apps/server
pnpm prisma migrate dev --name add_tour_status_and_timestamps

# Backend development
cd apps/server
pnpm dev

# Backend tests
cd apps/server
pnpm test
pnpm test:e2e

# Frontend development
cd apps/web
pnpm dev

# Frontend component tests (if using testing library)
cd apps/web
pnpm test
```

---

## Priority Order

**Critical Path (Must implement first):**

1. Phase 1: Database Schema
2. Phase 2-5: Backend implementation
3. Phase 7: Frontend API integration
4. Phase 9: Core components (TourTable, TourForm)
5. Phase 10: Main page

**Can implement in parallel:**

- Phase 6: Backend Testing (while working on Frontend)
- Phase 8: Admin Layout (independent)

**Later:**

- Phase 11: QA (after core features work)

---

**End of Task Checklist**
