# Architecture & Design Patterns - Booking Tour

## Monorepo Architecture

### Turborepo Structure
- **apps/**: Application code (server, web)
- **packages/**: Shared libraries (ui, eslint-config, typescript-config)
- **Workspace protocol**: Use `workspace:*` for internal dependencies
- **Build pipeline**: Turborepo handles caching and parallel execution

### Dependency Management
- **pnpm workspaces**: Efficient package management with hard links
- **Shared configs**: ESLint and TypeScript configs in `packages/`
- **Shared components**: UI components in `packages/ui` exported as `@repo/ui`

## Backend Architecture (NestJS)

### Module Structure
```
apps/server/src/modules/
├── auth/              # Authentication & authorization
├── users/             # User management
├── tours/             # Tour CRUD operations
├── bookings/          # Booking management
├── payments/          # Payment processing
└── reviews/           # Review system
```

### Layered Architecture
1. **Controllers**: HTTP request handling, validation, response formatting
2. **Services**: Business logic, orchestration
3. **Repositories**: Data access (via Prisma)
4. **DTOs**: Data transfer objects for validation (class-validator)
5. **Entities**: Domain models (optional, can use Prisma types)

### Key Patterns

#### Dependency Injection
```typescript
@Injectable()
export class TourService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}
}
```

#### Guards for Authorization
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'GUIDE')
@Controller('tours')
export class TourController {}
```

#### DTOs with Validation
```typescript
export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

#### Exception Handling
```typescript
if (!tour) {
  throw new NotFoundException(`Tour with ID ${id} not found`);
}
```

## Frontend Architecture (Next.js 16)

### App Router Structure
```
apps/web/app/
├── (auth)/            # Auth routes (login, register)
├── tours/             # Tour listing and details
├── bookings/          # User bookings
├── layout.tsx         # Root layout
└── page.tsx           # Home page
```

### Component Organization
```
apps/web/components/
├── layout/            # Layout components (header, footer)
├── tours/             # Tour-specific components
├── bookings/          # Booking-specific components
└── ui/                # Generic UI components (or use @repo/ui)
```

### Key Patterns

#### Server Components (Default)
```typescript
// No 'use client' - runs on server
export default async function ToursPage() {
  const tours = await fetchTours();
  return <TourList tours={tours} />;
}
```

#### Client Components (When Needed)
```typescript
'use client';

export function TourFilters() {
  const [filters, setFilters] = useState({});
  return <form onChange={handleChange}>...</form>;
}
```

#### Form Handling
```typescript
'use client';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

#### State Management (Zustand)
```typescript
// stores/booking-store.ts
export const useBookingStore = create<BookingState>((set) => ({
  travelers: [],
  addTraveler: (traveler) => set((state) => ({
    travelers: [...state.travelers, traveler]
  })),
}));
```

## Database Patterns (Prisma)

### Schema Organization
- **Models**: Define in `apps/server/prisma/schema.prisma`
- **Relations**: Use `@relation` for foreign keys
- **Indexes**: Add `@@index` for frequently queried fields
- **Constraints**: Use `@@unique` for unique combinations

### Critical Patterns

#### 1. Optimistic Locking
```typescript
// Prevent race conditions on TourSchedule capacity
await prisma.tourSchedule.update({
  where: { 
    id: scheduleId,
    version: currentVersion  // Must match current version
  },
  data: {
    availableSlots: { decrement: travelers.length },
    version: { increment: 1 }  // Increment version
  }
});
```

#### 2. Price Snapshots
```typescript
// Store price at booking time in BookingTraveler
const bookingTravelers = travelers.map(t => ({
  ...t,
  price: currentTourPrice,  // Snapshot current price
  type: t.type,
}));
```

#### 3. Transactions
```typescript
// Use transactions for multi-step operations
await prisma.$transaction(async (tx) => {
  // 1. Update schedule capacity
  await tx.tourSchedule.update({...});
  
  // 2. Create booking
  const booking = await tx.booking.create({...});
  
  // 3. Create payment
  await tx.payment.create({...});
  
  return booking;
});
```

#### 4. Soft Deletes (if needed)
```typescript
// Add deletedAt field instead of hard delete
model Tour {
  id        String    @id @default(cuid())
  deletedAt DateTime?
}

// Filter out soft-deleted records
const tours = await prisma.tour.findMany({
  where: { deletedAt: null }
});
```

## Status Flow Patterns

### Booking Status Flow
```
PENDING → PAID → COMPLETED
   ↓
CANCELLED → REFUNDED
```

### Payment Status Flow
```
PENDING → SUCCESS
   ↓
FAILED
```

### Tour Schedule Status Flow
```
OPEN → SOLD_OUT
  ↓       ↓
CLOSED ← COMPLETED
```

## Security Patterns

### Authentication
- JWT tokens with refresh token rotation
- Passport.js strategies (local, JWT)
- HttpOnly cookies for refresh tokens

### Authorization
- Role-based access control (RBAC)
- Guards at controller level
- Custom decorators for current user

### Validation
- DTOs with class-validator (backend)
- Zod schemas (frontend)
- Sanitize user input

### Rate Limiting
```typescript
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
```

## Performance Patterns

### Caching Strategy
- Redis for session storage
- Query result caching for frequently accessed data
- Static page generation for public pages (Next.js)

### Database Optimization
- Indexes on frequently queried fields
- Select only needed fields
- Pagination for large datasets
- Eager loading with `include` to avoid N+1 queries

### Frontend Optimization
- Server-side rendering for initial load
- Client-side navigation for subsequent pages
- Image optimization with Next.js Image component
- Code splitting with dynamic imports

## Error Handling

### Backend
```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('Resource already exists');
    }
  }
  throw new InternalServerErrorException('Unexpected error');
}
```

### Frontend
```typescript
try {
  const data = await fetchTours();
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

## Testing Strategy

### Backend Testing
- **Unit tests**: Service methods with mocked dependencies
- **Integration tests**: Controller endpoints with test database
- **E2E tests**: Critical flows (booking, payment)

### Frontend Testing (when implemented)
- **Component tests**: React Testing Library
- **Integration tests**: User flows
- **E2E tests**: Playwright/Cypress for critical paths

## Documentation Patterns

### Code Documentation
- JSDoc for public APIs
- README in each package
- Inline comments for complex logic

### API Documentation
- Swagger/OpenAPI via `@nestjs/swagger`
- DTO decorators for API schema
- Example requests/responses

### Project Documentation
- `.cursor/rules/` for development guidelines
- `.cursor/skills/` for AI-assisted workflows
- `CLAUDE.md` for AI context
