import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('ToursPublicController (e2e)', () => {
  let app: INestApplication;

  const mockTours = [
    {
      id: 1,
      name: 'Bali Island Escape',
      slug: 'bali-island-escape',
      summary: 'Tropical paradise with temples and beaches',
      coverImage: 'https://example.com/bali.jpg',
      durationDays: 7,
      priceAdult: new Prisma.Decimal(899),
      priceChild: new Prisma.Decimal(599),
      location: 'Bali, Indonesia',
      ratingAverage: new Prisma.Decimal(4.9),
      reviewCount: 42,
      difficulty: 'EASY',
      featured: true,
      status: 'PUBLISHED',
      deletedAt: null,
      schedules: [{ startDate: new Date('2026-03-15') }],
    },
    {
      id: 2,
      name: 'Swiss Alps Adventure',
      slug: 'swiss-alps-adventure',
      summary: 'Mountain hiking experience',
      coverImage: 'https://example.com/alps.jpg',
      durationDays: 5,
      priceAdult: new Prisma.Decimal(1299),
      priceChild: new Prisma.Decimal(899),
      location: 'Switzerland',
      ratingAverage: new Prisma.Decimal(4.8),
      reviewCount: 15,
      difficulty: 'CHALLENGING',
      featured: true,
      status: 'PUBLISHED',
      deletedAt: null,
      schedules: [],
    },
    {
      id: 3,
      name: 'Tokyo Cultural Tour',
      slug: 'tokyo-cultural-tour',
      summary: 'Ancient traditions and modern wonders',
      coverImage: 'https://example.com/tokyo.jpg',
      durationDays: 4,
      priceAdult: new Prisma.Decimal(799),
      priceChild: new Prisma.Decimal(549),
      location: 'Tokyo, Japan',
      ratingAverage: new Prisma.Decimal(4.7),
      reviewCount: 28,
      difficulty: 'EASY',
      featured: false,
      status: 'PUBLISHED',
      deletedAt: null,
      schedules: [{ startDate: new Date('2026-04-01') }],
    },
  ];

  const prismaMock = {
    tour: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
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
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('GET /tours', () => {
    it('should return 200 with valid response structure', async () => {
      prismaMock.tour.findMany.mockResolvedValue(mockTours);
      prismaMock.tour.count.mockResolvedValue(3);

      const response = await request(app.getHttpServer())
        .get('/tours')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('tours');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.tours).toHaveLength(3);
      expect(response.body.data.pagination).toEqual({
        page: 1,
        limit: 8,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should filter by search query', async () => {
      const filteredTours = mockTours.filter((t) =>
        t.name.toLowerCase().includes('bali'),
      );
      prismaMock.tour.findMany.mockResolvedValue(filteredTours);
      prismaMock.tour.count.mockResolvedValue(1);

      const response = await request(app.getHttpServer())
        .get('/tours?search=bali')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(1);
      expect(response.body.data.tours[0].name).toContain('Bali');
    });

    it('should filter by price range', async () => {
      const filteredTours = mockTours.filter(
        (t) =>
          Number(t.priceAdult) >= 500 && Number(t.priceAdult) <= 1000,
      );
      prismaMock.tour.findMany.mockResolvedValue(filteredTours);
      prismaMock.tour.count.mockResolvedValue(filteredTours.length);

      const response = await request(app.getHttpServer())
        .get('/tours?priceMin=500&priceMax=1000')
        .expect(200);

      expect(response.body.data.tours.length).toBeGreaterThan(0);
      response.body.data.tours.forEach((tour: any) => {
        expect(tour.priceAdult).toBeGreaterThanOrEqual(500);
        expect(tour.priceAdult).toBeLessThanOrEqual(1000);
      });
    });

    it('should filter by difficulty', async () => {
      const filteredTours = mockTours.filter(
        (t) => t.difficulty === 'CHALLENGING',
      );
      prismaMock.tour.findMany.mockResolvedValue(filteredTours);
      prismaMock.tour.count.mockResolvedValue(1);

      const response = await request(app.getHttpServer())
        .get('/tours?difficulty=challenging')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(1);
      expect(response.body.data.tours[0].difficulty).toBe('challenging');
    });

    it('should handle pagination correctly', async () => {
      prismaMock.tour.findMany.mockResolvedValue([mockTours[0]]);
      prismaMock.tour.count.mockResolvedValue(20);

      const response = await request(app.getHttpServer())
        .get('/tours?page=2&limit=8')
        .expect(200);

      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.hasNext).toBe(true);
      expect(response.body.data.pagination.hasPrev).toBe(true);
    });

    it('should return empty array when no results', async () => {
      prismaMock.tour.findMany.mockResolvedValue([]);
      prismaMock.tour.count.mockResolvedValue(0);

      const response = await request(app.getHttpServer())
        .get('/tours?search=nonexistent')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(0);
      expect(response.body.data.pagination.total).toBe(0);
    });

    it('should validate page parameter (min 1)', async () => {
      const response = await request(app.getHttpServer())
        .get('/tours?page=0')
        .expect(400);

      expect(response.body.message).toContain('page must not be less than 1');
    });

    it('should validate limit parameter (max 50)', async () => {
      const response = await request(app.getHttpServer())
        .get('/tours?limit=100')
        .expect(400);

      expect(response.body.message).toContain('limit must not be greater than 50');
    });
  });

  describe('GET /tours/featured', () => {
    it('should return featured tours', async () => {
      const featuredTours = mockTours.filter((t) => t.featured);
      prismaMock.tour.findMany.mockResolvedValue(featuredTours);

      const response = await request(app.getHttpServer())
        .get('/tours/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tours).toHaveLength(2);
      response.body.data.tours.forEach((tour: any) => {
        expect(tour.featured).toBe(true);
      });
    });

    it('should respect limit parameter', async () => {
      prismaMock.tour.findMany.mockResolvedValue([mockTours[0]]);

      const response = await request(app.getHttpServer())
        .get('/tours/featured?limit=1')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(1);
    });

    it('should return empty array when no featured tours', async () => {
      prismaMock.tour.findMany.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/tours/featured')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(0);
    });
  });

  describe('GET /tours/suggestions', () => {
    it('should return suggestions matching query', async () => {
      prismaMock.tour.findMany
        .mockResolvedValueOnce([
          { id: 1, name: 'Bali Tour', slug: 'bali-tour', location: 'Bali' },
        ])
        .mockResolvedValueOnce([{ location: 'Bali, Indonesia' }]);

      const response = await request(app.getHttpServer())
        .get('/tours/suggestions?q=bali')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.suggestions).toBeDefined();
      expect(Array.isArray(response.body.data.suggestions)).toBe(true);
    });

    it('should return tour and destination types', async () => {
      prismaMock.tour.findMany
        .mockResolvedValueOnce([
          { id: 1, name: 'Tokyo Tour', slug: 'tokyo-tour', location: 'Tokyo' },
        ])
        .mockResolvedValueOnce([{ location: 'Tokyo, Japan' }]);

      const response = await request(app.getHttpServer())
        .get('/tours/suggestions?q=tokyo')
        .expect(200);

      const types = response.body.data.suggestions.map((s: any) => s.type);
      expect(types).toContain('tour');
      expect(types).toContain('destination');
    });

    it('should require minimum 2 characters (query is required)', async () => {
      const response = await request(app.getHttpServer())
        .get('/tours/suggestions?q=a')
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should respect limit parameter', async () => {
      const manyTours = Array(10)
        .fill(null)
        .map((_, i) => ({
          id: i,
          name: `Tour ${i}`,
          slug: `tour-${i}`,
          location: 'Test',
        }));

      prismaMock.tour.findMany
        .mockResolvedValueOnce(manyTours.slice(0, 3))
        .mockResolvedValueOnce([]);

      const response = await request(app.getHttpServer())
        .get('/tours/suggestions?q=tour&limit=3')
        .expect(200);

      expect(response.body.data.suggestions.length).toBeLessThanOrEqual(3);
    });
  });
});
