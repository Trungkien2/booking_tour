# Backend Rules - NestJS Server

## Cấu trúc Module

```
src/
├── modules/          # Feature modules
│   ├── tours/
│   ├── bookings/
│   └── payments/
├── common/           # Shared utilities, guards, decorators
├── config/           # Configuration files
└── prisma/           # Prisma service
```

## Quy tắc NestJS

1. **Module Pattern**:
   - Mỗi feature = 1 module (tours, bookings, payments)
   - Module exports: Controllers, Services, DTOs
   - Shared logic → Common module

2. **Dependency Injection**:
   - Luôn inject dependencies qua constructor
   - Sử dụng `@Injectable()` cho services
   - Tránh circular dependencies

3. **Error Handling**:
   - Sử dụng NestJS Exception Filters
   - Custom exceptions trong `common/exceptions/`
   - Format: `throw new NotFoundException('Tour not found')`

4. **Validation**:
   - DTOs với `class-validator` decorators
   - Global validation pipe trong `main.ts`

## Prisma Best Practices

1. **Service Pattern**:
   ```typescript
   @Injectable()
   export class TourService {
     constructor(private prisma: PrismaService) {}
     
     async findOne(id: number) {
       return this.prisma.tour.findUnique({ where: { id } });
     }
   }
   ```

2. **Transactions**:
   - Sử dụng `prisma.$transaction()` cho multi-step operations
   - Đặc biệt quan trọng cho booking flow

3. **Optimistic Locking**:
   - TourSchedule có `version` field để prevent race conditions
   - Luôn check version khi update capacity

4. **Migrations**:
   - Chạy `pnpm prisma migrate dev` để tạo migration
   - Không edit migration files trực tiếp sau khi đã chạy

## API Design

- RESTful conventions
- Versioning: `/api/v1/...`
- Response format: Consistent structure với error handling
- Pagination: Sử dụng cursor-based hoặc offset-based
