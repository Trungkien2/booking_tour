import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('UsersMeController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaMock: Record<string, any>;

  const hashedPasswordPromise = bcrypt.hash('Password123!', 10);

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    fullName: 'Test User',
    phone: '+84123456789',
    avatarUrl: null,
    address: '123 Test St',
    bio: 'Hello',
    preferences: { vegetarianMeals: true, windowSeat: false },
    emailVerified: true,
    role: 'USER',
    createdAt: new Date('2024-01-01'),
    lastPasswordChangeAt: null,
  };

  function generateAccessToken(
    userId: number,
    email: string,
    role: string,
  ): string {
    return jwtService.sign({ sub: userId, email, role }, { expiresIn: '1h' });
  }

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
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
      }),
    );
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users/me', () => {
    it('should return 401 without JWT', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('should return 200 with user profile when authenticated', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      const token = generateAccessToken(1, 'test@example.com', 'USER');

      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: 1,
          email: 'test@example.com',
          fullName: 'Test User',
          emailVerified: true,
          role: 'USER',
        }),
      );
      expect(res.body).not.toHaveProperty('password');
    });
  });

  describe('PATCH /users/me', () => {
    it('should update profile fields', async () => {
      const updatedUser = {
        ...mockUser,
        bio: 'New bio',
        phone: '+84999888777',
      };
      prismaMock.user.update.mockResolvedValue(updatedUser);
      const token = generateAccessToken(1, 'test@example.com', 'USER');

      const res = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ bio: 'New bio', phone: '+84999888777' })
        .expect(200);

      expect(res.body.bio).toBe('New bio');
      expect(res.body.phone).toBe('+84999888777');
    });

    it('should reject invalid fields (forbidNonWhitelisted)', async () => {
      const token = generateAccessToken(1, 'test@example.com', 'USER');

      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'hacked@example.com' })
        .expect(400);
    });
  });

  describe('PATCH /users/me/password', () => {
    it('should change password successfully', async () => {
      const hashedPassword = await hashedPasswordPromise;
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        password: hashedPassword,
      });
      prismaMock.user.update.mockResolvedValue({});
      const token = generateAccessToken(1, 'test@example.com', 'USER');

      const res = await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'Password123!',
          newPassword: 'NewPass456!',
        })
        .expect(200);

      expect(res.body.message).toBe('Password changed successfully');
    });

    it('should reject wrong current password', async () => {
      const hashedPassword = await hashedPasswordPromise;
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        password: hashedPassword,
      });
      const token = generateAccessToken(1, 'test@example.com', 'USER');

      await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPassword123',
          newPassword: 'NewPass456!',
        })
        .expect(401);
    });

    it('should reject weak new password', async () => {
      const token = generateAccessToken(1, 'test@example.com', 'USER');

      await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'Password123!',
          newPassword: 'weak',
        })
        .expect(400);
    });
  });

  describe('POST /users/me/avatar', () => {
    it('should return 401 without JWT', async () => {
      await request(app.getHttpServer()).post('/users/me/avatar').expect(401);
    });

    it('should upload avatar successfully', async () => {
      prismaMock.user.update.mockResolvedValue({
        avatarUrl: '/uploads/avatars/avatar-1-test.jpg',
      });
      const token = generateAccessToken(1, 'test@example.com', 'USER');

      const res = await request(app.getHttpServer())
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('fake-image'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        })
        .expect(201);

      expect(res.body).toHaveProperty('avatarUrl');
      expect(res.body.avatarUrl).toContain('/uploads/avatars/');
    });
  });
});
