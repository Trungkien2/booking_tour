import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtAuthGuard } from './../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/modules/auth/guards/roles.guard';

describe('Admin Users (e2e)', () => {
  let app: INestApplication;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      booking: {
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn(),
      },
      tourSchedule: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/admin/users', () => {
    it('should return paginated users', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/admin/users')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.meta.total).toBe(0);
        });
    });
  });

  describe('GET /api/admin/users/:id', () => {
    it('should return 404 when not found', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/admin/users/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /api/admin/users/:id/status', () => {
    it('should update status', async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        fullName: 'User',
        phone: null,
        avatarUrl: null,
        role: 'USER',
        active: true,
        emailVerified: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prismaMock.user.update.mockResolvedValue({});
      // after update, findOneForAdmin is called again
      prismaMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        fullName: 'User',
        phone: null,
        avatarUrl: null,
        role: 'USER',
        active: true,
        emailVerified: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prismaMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        fullName: 'User',
        phone: null,
        avatarUrl: null,
        role: 'USER',
        active: false,
        emailVerified: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await request(app.getHttpServer())
        .patch('/api/admin/users/1/status')
        .send({ active: false })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.active).toBe(false);
        });
    });
  });
});

