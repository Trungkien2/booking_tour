## Context

Tour form (`tour-form.tsx`) hiện chỉ xử lý thông tin cơ bản của tour (name, price, duration, etc.). Model `TourSchedule` đã tồn tại trong Prisma schema với các fields: `startDate`, `maxCapacity`, `currentCapacity`, `status`, `version`. Tuy nhiên chưa có cách nào cho admin tạo schedules — cả UI lẫn API đều thiếu.

Backend `ToursService.create()` và `update()` hiện không xử lý schedules. `CreateTourDto` và `UpdateTourDto` không có field `schedules`.

## Goals / Non-Goals

**Goals:**
- Admin có thể thêm/xóa tour schedules inline trong form tạo/sửa tour
- Backend xử lý schedules trong cùng request tạo/sửa tour (atomic)
- Backward-compatible: field `schedules` là optional, API cũ vẫn hoạt động

**Non-Goals:**
- Quản lý schedules riêng biệt (CRUD endpoint riêng cho schedules) — ngoài scope
- Edit `currentCapacity` hoặc `status` của schedule từ form — đây là fields tự động
- Inline editing schedules đã có booking — quá phức tạp, sẽ làm sau

## Decisions

### 1. Schedule DTO structure

```typescript
class ScheduleItemDto {
  startDate: string;     // ISO date string
  maxCapacity: number;   // >= 1
}
```

Thêm optional `schedules?: ScheduleItemDto[]` vào `CreateTourDto`. `UpdateTourDto` kế thừa qua `PartialType` nên tự động có.

**Rationale**: Giữ đơn giản — admin chỉ cần nhập 2 fields quan trọng nhất. `currentCapacity` default 0, `status` default OPEN từ Prisma schema.

### 2. Create flow: Nested create trong Prisma

Khi tạo tour, dùng Prisma nested create:
```typescript
prisma.tour.create({
  data: {
    ...tourData,
    schedules: {
      create: schedules.map(s => ({
        startDate: new Date(s.startDate),
        maxCapacity: s.maxCapacity,
      }))
    }
  }
})
```

**Rationale**: Prisma nested create là atomic — không cần `$transaction()` thủ công. Đơn giản và đáng tin cậy.

### 3. Update flow: Delete-and-recreate cho schedules mới

Khi update tour với schedules:
- Chỉ xử lý schedules **chưa có booking** (currentCapacity === 0)
- Xóa tất cả schedules cũ chưa có booking
- Tạo lại từ payload mới
- Schedules đã có booking → giữ nguyên, không động vào

```typescript
prisma.$transaction([
  prisma.tourSchedule.deleteMany({
    where: { tourId: id, currentCapacity: 0 }
  }),
  prisma.tour.update({
    where: { id },
    data: {
      ...updateData,
      schedules: { create: newSchedules }
    }
  })
])
```

**Rationale**: Delete-and-recreate đơn giản hơn diff/merge. An toàn vì chỉ xóa schedules chưa có booking. Dùng `$transaction` để đảm bảo atomicity.

**Alternative considered**: Diff-based update (match by startDate, update existing, create new, delete removed) — phức tạp hơn nhiều, dễ bug, không cần thiết ở giai đoạn này.

### 4. Frontend: useFieldArray cho dynamic schedule rows

Dùng `useFieldArray` từ react-hook-form để quản lý dynamic list schedules trong form. Mỗi row gồm:
- Date input cho `startDate`
- Number input cho `maxCapacity`
- Nút xóa row
- Nút "Add Schedule" ở cuối

**Rationale**: `useFieldArray` là cách chuẩn của react-hook-form cho dynamic fields — tự xử lý add/remove, validation per-item, và form state.

### 5. Validation

**Backend** (class-validator):
- `schedules`: optional array
- `startDate`: phải là valid ISO date, phải >= ngày hiện tại
- `maxCapacity`: integer >= 1

**Frontend** (Zod):
- Tương tự backend, thêm vào `tourSchema`

## Risks / Trade-offs

- **[Risk] Schedule bị xóa khi update tour mà không gửi schedules** → Mitigation: Chỉ xử lý schedules nếu field `schedules` explicitly có trong payload. Nếu undefined → không động vào schedules.
- **[Risk] Admin xóa schedule đã có booking** → Mitigation: Backend chỉ delete schedules có `currentCapacity === 0`. Schedules có booking được bảo vệ. Frontend sẽ load và hiển thị schedules có booking ở trạng thái read-only.
- **[Trade-off] Delete-and-recreate thay vì diff update** → Schedule IDs sẽ thay đổi sau mỗi update. Chấp nhận được vì schedules chưa có booking chưa được reference ở đâu.
