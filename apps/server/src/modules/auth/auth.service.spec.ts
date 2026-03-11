import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
    loginHistory: { create: jest.Mock };
  };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      loginHistory: {
        create: jest.fn(),
      },
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
        fullName: 'User',
        active: true,
        deletedAt: null,
      });

      const user = await authService.validateUser(
        'user@example.com',
        'password123',
      );

      expect(user).toMatchObject({
        id: 1,
        email: 'user@example.com',
        role: 'USER',
        fullName: 'User',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.validateUser('missing@example.com', 'password'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('correct', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
        fullName: null,
        active: true,
        deletedAt: null,
      });

      await expect(
        authService.validateUser('user@example.com', 'wrong'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is disabled', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
        fullName: 'User',
        active: false,
        deletedAt: null,
      });

      await expect(
        authService.validateUser('user@example.com', 'password123'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return tokens and user info when login succeeds', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
        fullName: null,
        active: true,
        deletedAt: null,
      });

      jwtService.sign.mockImplementation((payload: any, opts?: any) => {
        if (opts?.expiresIn === '7d') return `refresh.${payload.sub}`;
        return `access.${payload.sub}`;
      });

      const result = await authService.login({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        accessToken: 'access.1',
        refreshToken: 'refresh.1',
        user: {
          id: 1,
          email: 'user@example.com',
          role: 'USER',
        },
      });
    });
  });
});
