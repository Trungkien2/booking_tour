### Requirement: Admin can add schedules when creating a tour
The tour creation form SHALL include a "Tour Schedules" section where admin can add one or more schedule entries. Each schedule entry SHALL have a `startDate` (date picker) and `maxCapacity` (number input). The schedules field SHALL be optional — a tour can be created without any schedules.

#### Scenario: Create tour with schedules
- **WHEN** admin fills in tour details and adds 2 schedules (startDate: 2026-04-01, maxCapacity: 20) and (startDate: 2026-05-01, maxCapacity: 30), then submits the form
- **THEN** the system creates the tour along with 2 TourSchedule records, each with `currentCapacity: 0` and `status: OPEN`

#### Scenario: Create tour without schedules
- **WHEN** admin fills in tour details without adding any schedules and submits the form
- **THEN** the system creates the tour without any TourSchedule records (backward-compatible behavior)

#### Scenario: Add schedule row
- **WHEN** admin clicks "Add Schedule" button
- **THEN** a new empty schedule row (startDate + maxCapacity inputs) is appended to the schedules list

#### Scenario: Remove schedule row
- **WHEN** admin clicks the remove button on a schedule row
- **THEN** that schedule row is removed from the form

### Requirement: Admin can manage schedules when editing a tour
The tour edit form SHALL load and display existing schedules. Admin SHALL be able to add new schedules and remove schedules that have no bookings. Schedules that have bookings (`currentCapacity > 0`) SHALL be displayed as read-only and MUST NOT be deletable.

#### Scenario: Load existing schedules in edit mode
- **WHEN** admin opens the edit form for a tour that has 3 schedules (1 with bookings, 2 without)
- **THEN** all 3 schedules are displayed; the 1 with bookings is shown as read-only, the 2 without bookings are editable

#### Scenario: Update tour with modified schedules
- **WHEN** admin removes 1 empty schedule, adds 1 new schedule, and submits the form
- **THEN** the system deletes schedules with `currentCapacity === 0`, creates new schedules from the payload, and preserves schedules that have bookings

#### Scenario: Schedules with bookings are protected
- **WHEN** admin submits the edit form
- **THEN** schedules with `currentCapacity > 0` MUST NOT be deleted or modified, regardless of the payload content

### Requirement: Schedule validation
The system SHALL validate each schedule entry on both frontend and backend. `startDate` MUST be a valid date and MUST NOT be in the past. `maxCapacity` MUST be an integer >= 1.

#### Scenario: Invalid startDate in the past
- **WHEN** admin enters a startDate that is before today's date
- **THEN** the system displays a validation error "Start date must be today or later" and prevents form submission

#### Scenario: Invalid maxCapacity
- **WHEN** admin enters maxCapacity of 0 or a negative number
- **THEN** the system displays a validation error "Max capacity must be at least 1" and prevents form submission

#### Scenario: Backend rejects invalid schedule data
- **WHEN** API receives a schedule with startDate in the past or maxCapacity < 1
- **THEN** the API returns 400 Bad Request with validation error details

### Requirement: Atomic schedule creation with tour
The backend SHALL create tour and its schedules atomically. If schedule creation fails, the tour MUST NOT be created.

#### Scenario: Atomic create success
- **WHEN** API receives valid tour data with valid schedules
- **THEN** both tour and all schedules are created in a single database operation

#### Scenario: Atomic create failure
- **WHEN** API receives valid tour data but one schedule has invalid data that passes DTO validation but fails at DB level
- **THEN** neither the tour nor any schedules are created; API returns an error

### Requirement: API backward compatibility
The `schedules` field in `CreateTourDto` and `UpdateTourDto` SHALL be optional. Existing API consumers that do not send `schedules` SHALL continue to work without changes.

#### Scenario: API call without schedules field
- **WHEN** API receives `POST /api/admin/tours` with tour data but no `schedules` field
- **THEN** the tour is created without any schedules, same as current behavior

#### Scenario: API call with empty schedules array
- **WHEN** API receives `POST /api/admin/tours` with `schedules: []`
- **THEN** the tour is created without any schedules
