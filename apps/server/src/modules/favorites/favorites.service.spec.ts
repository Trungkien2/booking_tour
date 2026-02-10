import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const mockPrismaService = {
    userFavorite: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    tour: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserFavorites', () => {
    it('should return user favorites with tour details', async () => {
      mockPrismaService.userFavorite.findMany.mockResolvedValue([
        {
          id: 1,
          tourId: 1,
          createdAt: new Date(),
          tour: {
            id: 1,
            name: 'Test Tour',
            slug: 'test-tour',
            coverImage: 'img.jpg',
            priceAdult: new Prisma.Decimal(299),
            location: 'Bali',
            ratingAverage: new Prisma.Decimal(4.5),
            durationDays: 3,
          },
        },
      ]);

      const result = await service.getUserFavorites(1);

      expect(result).toHaveLength(1);
      expect(result[0].tour.priceAdult).toBe(299);
      expect(result[0].tour.ratingAverage).toBe(4.5);
    });
  });

  describe('addFavorite', () => {
    it('should add tour to favorites', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue({
        id: 1,
        deletedAt: null,
      });
      mockPrismaService.userFavorite.findUnique.mockResolvedValue(null);
      mockPrismaService.userFavorite.create.mockResolvedValue({
        id: 1,
        userId: 1,
        tourId: 1,
        createdAt: new Date(),
      });

      const result = await service.addFavorite(1, 1);

      expect(result.userId).toBe(1);
      expect(result.tourId).toBe(1);
    });

    it('should throw ConflictException if already favorited', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue({
        id: 1,
        deletedAt: null,
      });
      mockPrismaService.userFavorite.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.addFavorite(1, 1)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if tour not found', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(null);

      await expect(service.addFavorite(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeFavorite', () => {
    it('should remove tour from favorites', async () => {
      mockPrismaService.userFavorite.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.userFavorite.delete.mockResolvedValue({ id: 1 });

      const result = await service.removeFavorite(1, 1);

      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if not favorited', async () => {
      mockPrismaService.userFavorite.findUnique.mockResolvedValue(null);

      await expect(service.removeFavorite(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('isFavorited', () => {
    it('should return true if favorited', async () => {
      mockPrismaService.userFavorite.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.isFavorited(1, 1);

      expect(result).toBe(true);
    });

    it('should return false if not favorited', async () => {
      mockPrismaService.userFavorite.findUnique.mockResolvedValue(null);

      const result = await service.isFavorited(1, 1);

      expect(result).toBe(false);
    });
  });
});
