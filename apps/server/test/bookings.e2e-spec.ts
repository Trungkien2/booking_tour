import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prismaMock: Record<string, any>;

  const mockUser = {
    id: 1,
    email: 'jane@example.com',
    fullName: 'Jane Doe',
    role: 'USER',
  };

  const mockAdmin = {
    id: 2,
    email: 'admin@bookingtour.com',
    fullName: 'Admin User',
    role: 'ADMIN',
  };

  const mockSchedule = {
    id: 1,
    tourId: 1,
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    maxCapacity: 20,
    currentCapacity: 5,
    status: 'OPEN',
    version: 1,
    tour: {
      id: 1,
      name: 'Ha Long Bay',
      slug: 'ha-long-bay',
      coverImage: 'img.jpg',
      location: 'Vietnam',
      durationDays: 2,
      priceAdult: new Prisma.Decimal(200),
      priceChild: new Prisma.Decimal(100),
    },
  };

  const mockBooking = {
    id: 1,
    userId: 1,
    scheduleId: 1,
    bookingDate: new Date(),
    totalPrice: new Prisma.Decimal(440),
    status: 'PAID',
    note: null,
    expiresAt: new Date(),
    cancelledAt: null,
    cancelReason: null,
    travelers: [
      { id: 1, bookingId: 1, fullName: 'Jane Doe', ageGroup: 'ADULT', price: new Prisma.Decimal(200), gender: null },
      { id: 2, bookingId: 1, fullName: 'John Doe', ageGroup: 'ADULT', price: new Prisma.Decimal(200), gender: null },
    ],
    schedule: mockSchedule,
    payments: [{ id: 1, status: 'SUCCESS', amount: new Prisma.Decimal(440), createdAt: new Date(), provider: 'stripe' }],
    refunds: [],
  };

  function generateToken(userId: number, email: string, role: string) {
    return jwtService.sign({ sub: userId, email, role }, { expiresIn: '1h' });
  }

  beforeEach(async () => {
    prismaMock = {
      user: { findUnique: jest.fn() },
      tourSchedule: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      booking: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      refund: { create: jest.fn() },
      payment: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { amount: new Prisma.Decimal(1000) } }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  // --- POST /bookings ---
  describe('POST /bookings', () => {
    it('should return 201 for valid booking', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.tourSchedule.findUnique.mockResolvedValue(mockSchedule);
      prismaMock.tourSchedule.updateMany.mockResolvedValue({ count: 1 });
      prismaMock.booking.create.mockResolvedValue({
        ...mockBooking,
        status: 'PENDING',
      });

      const res = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          scheduleId: 1,
          travelers: [
            { fullName: 'Jane Doe', ageGroup: 'ADULT' },
            { fullName: 'John Doe', ageGroup: 'ADULT' },
          ],
        })
        .expect(201);

      expect(res.body).toHaveProperty('booking');
      expect(res.body).toHaveProperty('priceBreakdown');
    });

    it('should return 400 with no adult traveler', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          scheduleId: 1,
          travelers: [{ fullName: 'Kid', ageGroup: 'CHILD' }],
        })
        .expect(400);
    });

    it('should return 401 without JWT', async () => {
      await request(app.getHttpServer())
        .post('/bookings')
        .send({ scheduleId: 1, travelers: [{ fullName: 'A', ageGroup: 'ADULT' }] })
        .expect(401);
    });

    it('should return 400 for invalid payload', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({ travelers: [] }) // missing scheduleId, empty travelers
        .expect(400);
    });
  });

  // --- GET /bookings/me ---
  describe('GET /bookings/me', () => {
    it('should return 200 with bookings list', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.booking.findMany.mockResolvedValue([mockBooking]);
      prismaMock.booking.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const res = await request(app.getHttpServer())
        .get('/bookings/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('bookings');
      expect(res.body).toHaveProperty('tabs');
      expect(res.body).toHaveProperty('pagination');
    });

    it('should return 401 without JWT', async () => {
      await request(app.getHttpServer()).get('/bookings/me').expect(401);
    });
  });

  // --- GET /bookings/:id ---
  describe('GET /bookings/:id', () => {
    it('should return 200 for owner', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.booking.findUnique.mockResolvedValue(mockBooking);

      const res = await request(app.getHttpServer())
        .get('/bookings/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', 1);
    });

    it('should return 403 for non-owner', async () => {
      const token = generateToken(999, 'other@example.com', 'USER');
      prismaMock.user.findUnique.mockResolvedValue({ id: 999, role: 'USER' });
      prismaMock.booking.findUnique.mockResolvedValue(mockBooking);

      await request(app.getHttpServer())
        .get('/bookings/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 404 for non-existent booking', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.booking.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/bookings/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  // --- PATCH /bookings/:id/cancel ---
  describe('PATCH /bookings/:id/cancel', () => {
    it('should return 200 on successful cancel', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.booking.findUnique.mockResolvedValue(mockBooking);
      prismaMock.booking.update.mockResolvedValue({ ...mockBooking, status: 'CANCELLED' });
      prismaMock.refund.create.mockResolvedValue({ id: 1, amount: 220 });
      // For releaseStock
      prismaMock.tourSchedule.findUnique.mockResolvedValue({
        id: 1, maxCapacity: 20, currentCapacity: 7, status: 'OPEN', version: 1,
      });
      prismaMock.tourSchedule.updateMany.mockResolvedValue({ count: 1 });

      const res = await request(app.getHttpServer())
        .patch('/bookings/1/cancel')
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Plans changed' })
        .expect(200);

      expect(res.body).toHaveProperty('status', 'CANCELLED');
    });

    it('should return 400 for already cancelled booking', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.booking.findUnique.mockResolvedValue({
        ...mockBooking,
        status: 'CANCELLED',
      });

      await request(app.getHttpServer())
        .patch('/bookings/1/cancel')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });

  // --- Admin endpoints ---
  describe('GET /admin/bookings', () => {
    it('should return 200 for admin', async () => {
      const token = generateToken(2, mockAdmin.email, mockAdmin.role);
      prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
      prismaMock.booking.findMany.mockResolvedValue([mockBooking]);
      prismaMock.booking.count
        .mockResolvedValueOnce(1) // total
        .mockResolvedValueOnce(10) // totalBookings
        .mockResolvedValueOnce(5); // activeBookings

      const res = await request(app.getHttpServer())
        .get('/admin/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('bookings');
      expect(res.body).toHaveProperty('stats');
      expect(res.body).toHaveProperty('pagination');
    });

    it('should return 403 for regular user', async () => {
      const token = generateToken(1, mockUser.email, mockUser.role);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await request(app.getHttpServer())
        .get('/admin/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 401 without JWT', async () => {
      await request(app.getHttpServer()).get('/admin/bookings').expect(401);
    });
  });
});
