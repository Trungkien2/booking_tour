# Booking Tour

Nền tảng đặt tour du lịch full-stack với kiến trúc monorepo hiện đại.

## Tổng quan

Booking Tour là ứng dụng đặt tour du lịch trực tuyến bao gồm:
- **Backend API**: NestJS với Prisma ORM
- **Frontend Web**: Next.js với React
- **Database**: PostgreSQL
- **Cache**: Redis

## Tech Stack

### Backend (Server)
- **NestJS** - Framework Node.js cho ứng dụng server-side
- **Prisma** - ORM type-safe cho database
- **PostgreSQL** - Cơ sở dữ liệu quan hệ
- **TypeScript** - Ngôn ngữ lập trình

### Frontend (Web)
- **Next.js 16** - React framework với App Router
- **React 19** - UI library
- **TypeScript** - Ngôn ngữ lập trình

### DevOps
- **Docker** - Containerization
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager

## Cấu trúc dự án

```
booking-tour/
├── apps/
│   ├── server/              # NestJS backend API
│   │   ├── src/             # Source code
│   │   ├── prisma/          # Database schema & migrations
│   │   └── test/            # E2E tests
│   └── web/                 # Next.js frontend
│       ├── app/             # App router pages
│       └── public/          # Static assets
├── packages/
│   ├── ui/                  # Shared React components
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
├── docker-compose.yml       # Database & Redis services
└── turbo.json               # Turborepo configuration
```

## Tính năng chính

### Quản lý Tour
- Danh sách tour với thông tin chi tiết (giá, thời gian, địa điểm)
- Hỗ trợ nhiều hình ảnh cho mỗi tour
- Hệ thống đánh giá và rating

### Đặt tour
- Quản lý lịch tour với số lượng chỗ
- Optimistic locking để tránh race condition
- Hỗ trợ nhiều loại khách (người lớn, trẻ em, em bé)

### Thanh toán
- Tích hợp đa cổng thanh toán (Stripe, PayPal)
- Quản lý hoàn tiền

### Người dùng
- Phân quyền (User, Admin, Guide)
- Lịch sử đặt tour và thanh toán

## Yêu cầu hệ thống

- Node.js >= 18
- pnpm >= 9.0.0
- Docker & Docker Compose

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd booking-tour
```

### 2. Cài đặt dependencies

```bash
pnpm install
```

### 3. Khởi động database và Redis

```bash
docker-compose up -d
```

Dịch vụ sẽ chạy tại:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6380`

### 4. Cấu hình environment

Tạo file `.env` trong `apps/server/`:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/booking_tour?schema=public"
```

### 5. Chạy database migration

```bash
cd apps/server
pnpm prisma migrate dev
```

### 6. Chạy ứng dụng

```bash
# Chạy tất cả apps (từ root)
pnpm dev

# Hoặc chạy riêng từng app
pnpm turbo dev --filter=server  # Backend tại http://localhost:4000
pnpm turbo dev --filter=web     # Frontend tại http://localhost:3000
```

## Scripts

### Root level

| Script | Mô tả |
|--------|-------|
| `pnpm dev` | Chạy tất cả apps ở chế độ development |
| `pnpm build` | Build tất cả apps |
| `pnpm lint` | Kiểm tra code với ESLint |
| `pnpm format` | Format code với Prettier |
| `pnpm check-types` | Kiểm tra TypeScript types |

### Server

| Script | Mô tả |
|--------|-------|
| `pnpm start:dev` | Chạy server với hot reload |
| `pnpm start:prod` | Chạy server production |
| `pnpm test` | Chạy unit tests |
| `pnpm test:e2e` | Chạy E2E tests |
| `pnpm test:cov` | Chạy tests với coverage |

### Prisma

```bash
# Tạo migration mới
pnpm prisma migrate dev --name <tên-migration>

# Reset database
pnpm prisma migrate reset

# Mở Prisma Studio
pnpm prisma studio

# Generate Prisma Client
pnpm prisma generate
```

## Database Schema

### Các model chính

- **User** - Người dùng (roles: USER, ADMIN, GUIDE)
- **Tour** - Thông tin tour du lịch
- **TourSchedule** - Lịch khởi hành với quản lý số lượng chỗ
- **Booking** - Đơn đặt tour
- **BookingTraveler** - Chi tiết khách trong đơn đặt
- **Payment** - Giao dịch thanh toán
- **Refund** - Hoàn tiền
- **Review** - Đánh giá tour

## API Endpoints

Server chạy tại `http://localhost:4000`

(Các endpoints sẽ được bổ sung khi phát triển)

## Cấu hình Docker

### docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: booking_tour

  redis:
    image: redis:alpine
    ports:
      - "6380:6379"
```

## Phát triển

### Thêm shared component

1. Tạo component trong `packages/ui/src/`
2. Export trong `packages/ui/package.json`
3. Import trong app: `import { Component } from '@repo/ui/component'`

### Thêm API module (Server)

```bash
cd apps/server
nest generate module <tên-module>
nest generate controller <tên-controller>
nest generate service <tên-service>
```

## Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## License

MIT
