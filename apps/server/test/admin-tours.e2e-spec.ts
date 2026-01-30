import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtAuthGuard } from './../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/modules/auth/guards/roles.guard';

describe('Admin Tours (e2e)', () => {
  let app: INestApplication;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      tour: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      booking: {
        count: jest.fn(),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      // Note: We are mocking guards to bypass actual auth in this basic E2E setup
      // In a real scenario, we might want to test with actual tokens
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('GET /api/admin/tours', () => {
    it('should return paginated tours', async () => {
      prismaMock.tour.findMany.mockResolvedValue([]);
      prismaMock.tour.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/admin/tours')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.meta.total).toBe(0);
        });
    });
  });

  describe('POST /api/admin/tours', () => {
    it('should create tour', async () => {
      const dto = {
        name: 'Test Tour',
        durationDays: 3,
        priceAdult: 100,
        priceChild: 50,
      };

      prismaMock.tour.findUnique.mockResolvedValue(null); // slug check
      prismaMock.tour.create.mockResolvedValue({
        id: 1,
        ...dto,
        slug: 'test-tour',
        schedules: [],
      });
      prismaMock.tour.findUnique.mockResolvedValue({
        id: 1,
        ...dto,
        slug: 'test-tour',
        schedules: [],
      }); // findOne

      await request(app.getHttpServer())
        .post('/api/admin/tours')
        .send(dto)
        .expect(HttpStatus.CREATED);
    });
  });
});
