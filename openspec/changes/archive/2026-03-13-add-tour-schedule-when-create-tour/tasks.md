## 1. Backend - DTO & Validation

- [x] 1.1 Create `ScheduleItemDto` class with `startDate` (IsDateString, future date) and `maxCapacity` (IsInt, Min(1)) validators in `apps/server/src/modules/tours/dto/`
- [x] 1.2 Add optional `schedules?: ScheduleItemDto[]` field with `@ValidateNested({ each: true })` and `@Type(() => ScheduleItemDto)` to `CreateTourDto`

## 2. Backend - Service Logic

- [x] 2.1 Update `ToursService.create()` to use Prisma nested create for schedules when `schedules` array is provided
- [x] 2.2 Update `ToursService.update()` to handle schedules: delete schedules with `currentCapacity === 0`, create new schedules from payload, preserve booked schedules — wrapped in `$transaction`
- [x] 2.3 Update `ToursService.findOne()` to include schedules in the response (if not already included)

## 3. Backend - Tests

- [x] 3.1 Add unit tests for `create()` with schedules (with schedules, without schedules, empty array)
- [x] 3.2 Add unit tests for `update()` with schedules (add new, remove empty, preserve booked)
- [x] 3.3 Add validation tests for `ScheduleItemDto` (past date rejected, maxCapacity < 1 rejected)

## 4. Frontend - Validation Schema

- [x] 4.1 Add `scheduleSchema` to `apps/web/lib/validations/tour.ts` with `startDate` (string, valid date, not in past) and `maxCapacity` (number, int, >= 1)
- [x] 4.2 Add optional `schedules` array field to `tourSchema` using `scheduleSchema`

## 5. Frontend - Tour Form UI

- [x] 5.1 Add `useFieldArray` for schedules in `tour-form.tsx` with field name `schedules`
- [x] 5.2 Add "Tour Schedules" section to the form with date input and number input per row, plus remove button
- [x] 5.3 Add "Add Schedule" button that appends a new empty schedule row
- [x] 5.4 In edit mode: display schedules with `currentCapacity > 0` as read-only (disabled inputs, no remove button)
- [x] 5.5 Add per-field validation error display for schedule rows

## 6. Frontend - API Integration

- [x] 6.1 Update `TourFormData` type and admin API client to include `schedules` in create/update payloads
- [x] 6.2 Update tour edit panel to pass existing schedules as `initialData` to the form
