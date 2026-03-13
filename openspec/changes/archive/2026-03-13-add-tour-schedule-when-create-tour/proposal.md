## Why

Hiện tại khi admin tạo tour, không có cách nào thêm lịch khởi hành (tour schedules) ngay trong form. Admin phải tạo tour trước rồi mới quản lý schedules riêng — nhưng chưa có UI/API nào cho việc đó ở phía admin. Điều này khiến tour được tạo ra mà không có lịch khởi hành, khách không thể đặt tour.

## What Changes

- Thêm section "Tour Schedules" vào `tour-form.tsx` cho phép admin thêm/xóa nhiều schedule (startDate + maxCapacity) ngay khi tạo/sửa tour
- Cập nhật `CreateTourDto` và `UpdateTourDto` trên backend để nhận optional `schedules` array
- Cập nhật `ToursService.create()` và `ToursService.update()` để tạo/cập nhật schedules cùng tour trong một transaction
- Cập nhật frontend validation schema (`tourSchema`) thêm schedules validation
- Cập nhật admin API client để gửi schedules data

## Capabilities

### New Capabilities
- `tour-schedule-inline-management`: Cho phép admin thêm/xóa tour schedules inline trong tour form khi tạo và chỉnh sửa tour. Mỗi schedule gồm startDate và maxCapacity.

### Modified Capabilities
<!-- Không có existing specs nào cần modify -->

## Impact

- **Backend**: `CreateTourDto`, `UpdateTourDto`, `ToursService.create()`, `ToursService.update()` — thêm xử lý schedules
- **Frontend**: `tour-form.tsx`, `tour.ts` validation schema, admin API client (`apps/web/lib/api/admin/tours.ts`)
- **Database**: Không cần migration — `TourSchedule` model đã tồn tại
- **API**: Endpoint `POST /api/admin/tours` và `PATCH /api/admin/tours/:id` sẽ nhận thêm field `schedules` (backward-compatible, optional)
