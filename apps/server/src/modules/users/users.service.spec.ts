import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

const mockUser = {
  id: 1,
  email: 'test@example.com',
  fullName: 'Test User',
  phone: '+84123456789',
  avatarUrl: null,
  address: '123 Test St',
  bio: 'Hello world',
  preferences: { vegetarianMeals: true, windowSeat: false },
  emailVerified: true,
  role: 'USER',
  createdAt: new Date('2024-01-01'),
  lastPasswordChangeAt: null,
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('getMe', () => {
    it('should return user profile without password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe(1);

      expect(result).toEqual(mockUser);
      expect(result).not.toHaveProperty('password');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.objectContaining({
          id: true,
          email: true,
          fullName: true,
          phone: true,
        }),
      });
      // Ensure password is NOT selected
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.not.objectContaining({ password: true }),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMe', () => {
    it('should update only provided fields', async () => {
      const updatedUser = { ...mockUser, bio: 'Updated bio' };
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateMe(1, { bio: 'Updated bio' });

      expect(result.bio).toBe('Updated bio');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { bio: 'Updated bio' },
        select: expect.any(Object),
      });
    });

    it('should update multiple fields', async () => {
      const dto = {
        fullName: 'New Name',
        phone: '+84999888777',
        address: 'New Address',
      };
      const updatedUser = { ...mockUser, ...dto };
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateMe(1, dto);

      expect(result.fullName).toBe('New Name');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          fullName: 'New Name',
          phone: '+84999888777',
          address: 'New Address',
        },
        select: expect.any(Object),
      });
    });

    it('should trim string values', async () => {
      mockPrisma.user.update.mockResolvedValue(mockUser);

      await service.updateMe(1, { fullName: '  Trimmed Name  ' });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { fullName: 'Trimmed Name' },
        }),
      );
    });
  });

  describe('updateAvatar', () => {
    const validFile = {
      mimetype: 'image/jpeg',
      size: 1024 * 1024,
      originalname: 'photo.jpg',
      buffer: Buffer.from('fake-image-data'),
    } as Express.Multer.File;

    it('should throw BadRequestException if no file provided', async () => {
      await expect(service.updateAvatar(1, null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid MIME type', async () => {
      const invalidFile = {
        ...validFile,
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      await expect(service.updateAvatar(1, invalidFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file exceeds 5MB', async () => {
      const largeFile = {
        ...validFile,
        size: 10 * 1024 * 1024,
      } as Express.Multer.File;

      await expect(service.updateAvatar(1, largeFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update avatarUrl on success', async () => {
      mockPrisma.user.update.mockResolvedValue({
        avatarUrl: '/uploads/avatars/avatar-1-123.jpg',
      });

      const result = await service.updateAvatar(1, validFile);

      expect(result).toHaveProperty('avatarUrl');
      expect(result.avatarUrl).toContain('/uploads/avatars/avatar-1-');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { avatarUrl: expect.stringContaining('/uploads/avatars/') },
      });
    });
  });

  describe('changePassword', () => {
    const dto = {
      currentPassword: 'OldPass123',
      newPassword: 'NewPass456',
    };

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword(999, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if current password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(1, dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if new password equals current', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.changePassword(1, {
          currentPassword: 'SamePass123',
          newPassword: 'SamePass123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should hash new password and update lastPasswordChangeAt', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        password: 'hashedOldPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.changePassword(1, dto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass456', 10);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          password: 'hashedNewPassword',
          lastPasswordChangeAt: expect.any(Date),
        },
      });
    });
  });

  describe('admin: findAllForAdmin', () => {
    it('should return paginated users with meta', async () => {
      const users = [
        {
          id: 1,
          email: 'a@example.com',
          fullName: 'User A',
          avatarUrl: null,
          role: 'USER',
          active: true,
          emailVerified: true,
          lastLoginAt: new Date(),
          createdAt: new Date(),
        },
      ];
      mockPrisma.user.findMany.mockResolvedValue(users);
      mockPrisma.user.count.mockResolvedValue(1);

      const result = await service.findAllForAdmin({
        page: 1,
        limit: 10,
        sort: 'created_desc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null }),
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  describe('admin: findOneForAdmin', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(service.findOneForAdmin(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
