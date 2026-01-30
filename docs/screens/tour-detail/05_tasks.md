# Task Checklist: Tour Detail Screen (SCR-004)

This checklist breaks down the implementation of the Tour Detail Screen feature based on the Technical Design Document.

## Phase 1: Database & Seed Data

- [ ] Task 1.1: **[DB] Update Prisma Schema**
  - Add fields to `Tour` model: `coordinates`, `difficulty`, `maxGroupSize`, `highlights`, `itinerary`, `included`, `notIncluded`, `meetingPoint`, `cancellationPolicy`, `reviewCount`.
  - Add `helpful` field to `Review` model.
  - Create `UserFavorite` model with unique constraint on `[userId, tourId]`.
  - Add `favorites` relation to `User` model.
- [ ] Task 1.2: **[DB] Generate Migration**
  - Run `pnpm prisma migrate dev --name add_tour_detail_and_favorites`.
- [ ] Task 1.3: **[DB] Create Seed Data**
  - Create a seed script to populate tours with rich data (JSON fields for itinerary, highlights, etc.) for testing.

## Phase 2: Backend (NestJS)

### Tours Module (Public)

- [ ] Task 2.1: **[BE] Create DTOs**
  - Create `TourDetailResponseDto`, `ScheduleResponseDto` in `apps/server/src/modules/tours/dto`.
  - Create `ReviewQueryDto`, `ReviewResponseDto` in `apps/server/src/modules/tours/dto`.
  - Create `CheckAvailabilityDto`, `AvailabilityResponseDto` in `apps/server/src/modules/tours/dto`.
- [ ] Task 2.2: **[BE] Update ToursService**
  - Implement `findBySlug(slug)`: Fetch tour detail with relations.
  - Implement `getSchedules(tourId, from, to)`: Fetch available schedules.
  - Implement `getReviews(tourId, query)`: Fetch paginated reviews with distribution stats.
  - Implement `checkAvailability(scheduleId, dto)`: Validate spots and calculate price breakdown.
- [ ] Task 2.3: **[BE] Create ToursPublicController**
  - Implement `GET /api/tours/:slug`.
  - Implement `GET /api/tours/:tourId/schedules`.
  - Implement `GET /api/tours/:tourId/reviews`.
  - Implement `POST /api/tours/schedules/:scheduleId/check-availability`.
  - Register controller in `ToursModule`.

### Favorites Module

- [ ] Task 2.4: **[BE] Scaffold Favorites Module**
  - Create module `apps/server/src/modules/favorites`.
  - Register `FavoritesModule` in `AppModule`.
- [ ] Task 2.5: **[BE] Implement FavoritesService**
  - Implement `getUserFavorites(userId)`.
  - Implement `addFavorite(userId, tourId)` with duplicate check.
  - Implement `removeFavorite(userId, tourId)`.
  - Implement `isFavorited(userId, tourId)`.
- [ ] Task 2.6: **[BE] Create FavoritesController**
  - Implement endpoints guarded with `JwtAuthGuard`.
  - `GET /api/favorites`, `POST /api/favorites`, `DELETE /api/favorites/:tourId`, `GET /api/favorites/:tourId/status`.

## Phase 3: Frontend (Next.js)

### Foundation

- [ ] Task 3.1: **[FE] Define Types**
  - Create `apps/web/lib/types/tour.ts` with interfaces (`TourDetail`, `TourSchedule`, `Review`, `BookingSelection`, etc.).
- [ ] Task 3.2: **[FE] Create API Clients**
  - Create `apps/web/lib/api/tours.ts` (fetch tour, schedules, reviews, check availability).
  - Create `apps/web/lib/api/favorites.ts` (add, remove, list favorites).
- [ ] Task 3.3: **[FE] Create Custom Hooks**
  - `useTour`, `useTourSchedules`, `useTourReviews`.
  - `useBookingSelection`: Manage local booking state (dates, travelers).
  - `useFavorites`: Handle optimistic UI updates for save button.

### Components

- [ ] Task 3.4: **[FE] Implement Content Components**
  - `TourHeader` (Breadcrumbs, Title).
  - `TourGallery` (Grid layout + Lightbox modal).
  - `TourHighlights` (Icon grid).
  - `TourDescription` (Expand/Collapse text).
  - `TourItinerary` (Accordion list).
  - `TourIncluded` (Check/Cross lists).
  - `TourMeetingPoint` (Static map image + address).
- [ ] Task 3.5: **[FE] Implement Booking Components**
  - `SchedulePicker` (Calendar view with availability status).
  - `TravelerSelector` (Counters with min/max/availability validation).
  - `PriceBreakdown` (Detailed cost display).
  - `BookingCard` (Sticky sidebar container).
- [ ] Task 3.6: **[FE] Implement Interaction Components**
  - `TourReviews` (List with pagination/sorting + summary bars).
  - `FavoriteButton` (Heart icon with optimistic update).
  - `ShareModal` (Copy link, social share).

### Pages

- [ ] Task 3.7: **[FE] Implement Tour Detail Page**
  - Create `apps/web/app/tours/[slug]/page.tsx` (Server Component).
  - Fetch initial data (Tour, Schedules, Reviews) in parallel.
  - Implement `generateMetadata` for SEO.
  - Create `loading.tsx` (Skeleton UI) and `not-found.tsx`.

## Phase 4: Testing & QA

- [ ] Task 4.1: **[Test] Backend Unit Tests**
  - Test `ToursService` public methods (availability logic is critical).
  - Test `FavoritesService`.
- [ ] Task 4.2: **[Test] Backend E2E Tests**
  - Verify public endpoints return correct structure.
  - Verify favorites endpoints enforce authentication.
- [ ] Task 4.3: **[Test] Frontend Manual QA**
  - Verify Responsive Design (Desktop vs Mobile booking bar).
  - Test Booking Flow: Select Date -> Select Travelers -> Check Availability -> Redirect.
  - Test Favorites toggling.
