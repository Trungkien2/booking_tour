# Task Checklist: Tour Detail Screen (SCR-004)

This checklist breaks down the implementation of the Tour Detail Screen feature based on the Technical Design Document.

## Phase 1: Database & Seed Data

- [x] Task 1.1: **[DB] Update Prisma Schema**
  - Add fields to `Tour` model: `coordinates`, `maxGroupSize`, `highlights`, `itinerary`, `included`, `notIncluded`, `meetingPoint`, `cancellationPolicy`.
  - Add `helpful` field to `Review` model.
  - Create `UserFavorite` model with unique constraint on `[userId, tourId]`.
  - Add `favorites` relation to `User` and `Tour` models.
- [x] Task 1.2: **[DB] Generate Migration**
  - Run `pnpm prisma migrate dev --name add_tour_detail_and_favorites`.
- [x] Task 1.3: **[DB] Create Seed Data**
  - Updated seed script with rich tour detail data (itinerary, highlights, meetingPoint, etc.) for Hạ Long Bay and Swiss Alps tours. Added favorites seed data.

## Phase 2: Backend (NestJS)

### Tours Module (Public)

- [x] Task 2.1: **[BE] Create DTOs**
  - Created `ReviewQueryDto` in `apps/server/src/modules/tours/dto/review-query.dto.ts`.
  - Created `CheckAvailabilityDto` in `apps/server/src/modules/tours/dto/check-availability.dto.ts`.
- [x] Task 2.2: **[BE] Update ToursPublicService**
  - Implemented `findBySlug(slug)`: Fetch tour detail with all JSON fields.
  - Implemented `getSchedules(tourId, from, to)`: Fetch available schedules with spots calculation.
  - Implemented `getReviews(tourId, query)`: Fetch paginated reviews with distribution stats.
  - Implemented `checkAvailability(scheduleId, dto)`: Validate spots and calculate price breakdown with taxes.
- [x] Task 2.3: **[BE] Update ToursPublicController**
  - Implemented `GET /tours/:slug`.
  - Implemented `GET /tours/:tourId/schedules`.
  - Implemented `GET /tours/:tourId/reviews`.
  - Implemented `POST /tours/schedules/:scheduleId/check-availability`.

### Favorites Module

- [x] Task 2.4: **[BE] Scaffold Favorites Module**
  - Created module at `apps/server/src/modules/favorites/`.
  - Registered `FavoritesModule` in `AppModule`.
- [x] Task 2.5: **[BE] Implement FavoritesService**
  - Implemented `getUserFavorites(userId)`.
  - Implemented `addFavorite(userId, tourId)` with duplicate check.
  - Implemented `removeFavorite(userId, tourId)`.
  - Implemented `isFavorited(userId, tourId)`.
- [x] Task 2.6: **[BE] Create FavoritesController**
  - Implemented endpoints guarded with `JwtAuthGuard`.
  - `GET /favorites`, `POST /favorites`, `DELETE /favorites/:tourId`, `GET /favorites/:tourId/status`.
  - Added `@ApiBearerAuth('access-token')` and `@ApiTags('favorites')` for Swagger.

## Phase 3: Frontend (Next.js)

### Foundation

- [x] Task 3.1: **[FE] Define Types**
  - Extended `apps/web/lib/types/tour.ts` with `TourDetail`, `TourSchedule`, `Review`, `BookingSelection`, `AvailabilityResponse`, etc.
- [x] Task 3.2: **[FE] Create API Clients**
  - Extended `apps/web/lib/api/tours.ts` (getTourBySlug, getTourSchedules, getTourReviews, checkAvailability).
  - Created `apps/web/lib/api/favorites.ts` (addToFavorites, removeFromFavorites, checkIsFavorited).
- [x] Task 3.3: **[FE] Hooks** (integrated into components)
  - Booking state managed locally in `BookingCard` component.
  - Favorites with optimistic update in `FavoriteButton` component.

### Components

- [x] Task 3.4: **[FE] Implement Content Components**
  - `TourHeader` (Breadcrumbs, Title, meta info, difficulty badge, actions).
  - `TourGallery` (Grid layout + Lightbox modal with prev/next).
  - `TourHighlights` (Material icon grid).
  - `TourDescription` (Expand/Collapse text).
  - `TourItinerary` (Accordion list with day badges).
  - `TourIncluded` (Check/Cross lists with icons).
  - `TourMeetingPoint` (Static map placeholder + address + instructions).
- [x] Task 3.5: **[FE] Implement Booking Components**
  - `SchedulePicker` (Date list with availability status, sold-out indication).
  - `TravelerSelector` (Counters with min/max/availability validation).
  - `PriceBreakdown` (Detailed cost display with taxes).
  - `BookingCard` (Sticky sidebar on desktop, fixed bottom bar on mobile).
- [x] Task 3.6: **[FE] Implement Interaction Components**
  - `TourReviews` (List with pagination/sorting + rating distribution bars).
  - `FavoriteButton` (Heart icon with optimistic update via Zustand auth store).
  - `ShareModal` (Copy link to clipboard).

### Pages

- [x] Task 3.7: **[FE] Implement Tour Detail Page**
  - Created `apps/web/app/(site)/tours/[slug]/page.tsx` (Server Component).
  - Fetch initial data (Tour, Schedules, Reviews) in parallel with error fallbacks.
  - Implemented `generateMetadata` for SEO (title, description, Open Graph).
  - Created `loading.tsx` (Skeleton UI) and `not-found.tsx`.

## Phase 4: Testing & QA

- [x] Task 4.1: **[Test] Backend Unit Tests** (43 tests passing)
  - Tested `ToursPublicService`: findBySlug, getSchedules, getReviews, checkAvailability.
  - Tested `FavoritesService`: getUserFavorites, addFavorite, removeFavorite, isFavorited.
- [x] Task 4.2: **[Test] Backend E2E Tests** (21 tests passing)
  - Verified GET /tours/:slug returns correct structure and 404.
  - Verified POST /tours/schedules/:id/check-availability validates and returns.
  - Verified GET /tours/:tourId/reviews returns paginated reviews.
- [ ] Task 4.3: **[Test] Frontend Manual QA**
  - Verify Responsive Design (Desktop vs Mobile booking bar).
  - Test Booking Flow: Select Date -> Select Travelers -> Check Availability -> Redirect.
  - Test Favorites toggling.
