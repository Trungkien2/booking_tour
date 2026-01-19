# Database Rules - Prisma & PostgreSQL

## Schema Design

1. **Naming Conventions**:
   - Models: PascalCase (User, Booking, TourSchedule)
   - Fields: camelCase trong code, snake_case trong DB (`@map`)
   - Tables: snake_case với `@@map`

2. **Relationships**:
   - One-to-Many: `@relation` với `fields` và `references`
   - Many-to-Many: Explicit join table
   - Optional relations: `?` cho nullable foreign keys

3. **Data Types**:
   - Money: `Decimal` với precision (10, 2) hoặc (12, 2)
   - Dates: `DateTime` với `@default(now())`
   - JSON: `Json` type cho flexible data (images array, metadata)

## Critical Patterns

### 1. Optimistic Locking (TourSchedule)
```prisma
model TourSchedule {
  version Int @default(1)  // Prevent race conditions
}
```
- Luôn increment version khi update capacity
- Check version trong transaction để prevent double booking

### 2. Price Snapshot (BookingTraveler)
```prisma
model BookingTraveler {
  price Decimal @db.Decimal(10, 2)  // Snapshot tại thời điểm đặt
}
```
- Lưu giá tại thời điểm booking, không phải current price
- Đảm bảo tính nhất quán khi giá tour thay đổi

### 3. Status Enums
- BookingStatus: PENDING → PAID → CANCELLED/REFUNDED
- PaymentStatus: PENDING → SUCCESS/FAILED
- ScheduleStatus: OPEN → SOLD_OUT/CLOSED/COMPLETED

## Migration Strategy

1. **Development**:
   ```bash
   pnpm prisma migrate dev --name migration_name
   ```

2. **Production**:
   ```bash
   pnpm prisma migrate deploy
   ```

3. **Never**:
   - Edit migration files sau khi đã chạy
   - Drop columns với data (dùng soft delete)
   - Change enum values trực tiếp (tạo migration mới)

## Query Best Practices

1. **Select only needed fields**:
   ```typescript
   prisma.tour.findMany({
     select: { id: true, name: true, priceAdult: true }
   })
   ```

2. **Use includes wisely**:
   ```typescript
   prisma.booking.findUnique({
     where: { id },
     include: { travelers: true, schedule: { include: { tour: true } } }
   })
   ```

3. **Transactions for critical operations**:
   ```typescript
   await prisma.$transaction([
     prisma.tourSchedule.update({ ... }),
     prisma.booking.create({ ... }),
     prisma.payment.create({ ... })
   ])
   ```

## Indexing

- Foreign keys: Automatic indexes
- Unique fields: `@unique` decorator
- Search fields: Thêm indexes cho name, email, slug
- Composite indexes: Khi query multiple fields thường xuyên
