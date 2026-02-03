import { Test, TestingModule } from '@nestjs/testing';
import { ToursPublicService } from './tours-public.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SortOption, DifficultyFilter } from './dto/get-tours-public.dto';
import { Prisma } from '@prisma/client';

describe('ToursPublicService', () => {
  let service: ToursPublicService;

  const mockPrismaService = {
    tour: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockTour = {
    id: 1,
    name: 'Test Tour',
    slug: 'test-tour',
    summary: 'A test tour',
    coverImage: 'https://example.com/image.jpg',
    durationDays: 3,
    priceAdult: new Prisma.Decimal(299.99),
    priceChild: new Prisma.Decimal(149.99),
    location: 'Bali, Indonesia',
    ratingAverage: new Prisma.Decimal(4.5),
    reviewCount: 10,
    difficulty: 'EASY',
    featured: true,
    schedules: [{ startDate: new Date('2026-03-01') }],
  };

  const mockTour2 = {
    id: 2,
    name: 'Adventure Tour',
    slug: 'adventure-tour',
    summary: 'An adventure tour',
    coverImage: 'https://example.com/image2.jpg',
    durationDays: 5,
    priceAdult: new Prisma.Decimal(599.99),
    priceChild: new Prisma.Decimal(299.99),
    location: 'Swiss Alps',
    ratingAverage: new Prisma.Decimal(4.8),
    reviewCount: 25,
    difficulty: 'CHALLENGING',
    featured: false,
    schedules: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursPublicService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ToursPublicService>(ToursPublicService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTours', () => {
    it('should return paginated tours with default params', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour, mockTour2]);
      mockPrismaService.tour.count.mockResolvedValue(2);

      const result = await service.getTours({});

      expect(result.tours).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(8);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrev).toBe(false);
    });

    it('should handle pagination correctly', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(20);

      const result = await service.getTours({ page: 2, limit: 8 });

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(true);

      // Verify skip calculation
      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 8,
          take: 8,
        }),
      );
    });

    it('should filter by search query', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ search: 'bali' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: 'bali', mode: 'insensitive' } },
              { location: { contains: 'bali', mode: 'insensitive' } },
              { summary: { contains: 'bali', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });

    it('should filter by price range', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ priceMin: 200, priceMax: 500 });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            priceAdult: { gte: 200, lte: 500 },
          }),
        }),
      );
    });

    it('should filter by difficulty', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour2]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ difficulty: DifficultyFilter.CHALLENGING });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            difficulty: 'CHALLENGING',
          }),
        }),
      );
    });

    it('should filter by location', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ location: 'Indonesia' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            location: { contains: 'Indonesia', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should filter by duration range (1-3)', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ duration: '1-3' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            durationDays: { gte: 1, lte: 3 },
          }),
        }),
      );
    });

    it('should filter by duration range (8+)', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([]);
      mockPrismaService.tour.count.mockResolvedValue(0);

      await service.getTours({ duration: '8+' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            durationDays: { gte: 8 },
          }),
        }),
      );
    });

    it('should sort by newest', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ sort: SortOption.NEWEST });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        }),
      );
    });

    it('should sort by price ascending', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ sort: SortOption.PRICE_ASC });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { priceAdult: 'asc' },
        }),
      );
    });

    it('should sort by price descending', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ sort: SortOption.PRICE_DESC });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { priceAdult: 'desc' },
        }),
      );
    });

    it('should sort by rating', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ sort: SortOption.RATING });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { ratingAverage: 'desc' },
        }),
      );
    });

    it('should sort by popular (default)', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.getTours({ sort: SortOption.POPULAR });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ reviewCount: 'desc' }, { ratingAverage: 'desc' }],
        }),
      );
    });

    it('should return empty array when no tours found', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([]);
      mockPrismaService.tour.count.mockResolvedValue(0);

      const result = await service.getTours({ search: 'nonexistent' });

      expect(result.tours).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should map tour data to DTO correctly', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      const result = await service.getTours({});

      const tour = result.tours[0];
      expect(tour.id).toBe(1);
      expect(tour.name).toBe('Test Tour');
      expect(tour.slug).toBe('test-tour');
      expect(tour.priceAdult).toBe(299.99);
      expect(tour.priceChild).toBe(149.99);
      expect(tour.ratingAverage).toBe(4.5);
      expect(tour.difficulty).toBe('easy');
      expect(tour.featured).toBe(true);
      expect(tour.nextAvailableDate).toBeDefined();
    });
  });

  describe('getFeaturedTours', () => {
    it('should return only featured tours', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);

      const result = await service.getFeaturedTours(4);

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            featured: true,
            status: 'PUBLISHED',
            deletedAt: null,
          }),
        }),
      );
      expect(result).toHaveLength(1);
    });

    it('should order by rating and review count', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);

      await service.getFeaturedTours(4);

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ ratingAverage: 'desc' }, { reviewCount: 'desc' }],
        }),
      );
    });

    it('should respect limit parameter', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);

      await service.getFeaturedTours(2);

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 2,
        }),
      );
    });

    it('should use default limit of 4', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);

      await service.getFeaturedTours();

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 4,
        }),
      );
    });
  });

  describe('getSuggestions', () => {
    it('should return tour suggestions matching query', async () => {
      mockPrismaService.tour.findMany
        .mockResolvedValueOnce([
          { id: 1, name: 'Bali Tour', slug: 'bali-tour', location: 'Bali' },
        ])
        .mockResolvedValueOnce([{ location: 'Bali, Indonesia' }]);

      const result = await service.getSuggestions({ q: 'bali', limit: 5 });

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should return destination suggestions', async () => {
      mockPrismaService.tour.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { location: 'Bali, Indonesia' },
          { location: 'Bangkok, Thailand' },
        ]);

      const result = await service.getSuggestions({ q: 'ba', limit: 5 });

      const destinations = result.suggestions.filter(
        (s) => s.type === 'destination',
      );
      expect(destinations.length).toBeGreaterThan(0);
    });

    it('should limit total suggestions', async () => {
      const manyTours = Array(10)
        .fill(null)
        .map((_, i) => ({
          id: i,
          name: `Tour ${i}`,
          slug: `tour-${i}`,
          location: 'Test',
        }));

      mockPrismaService.tour.findMany
        .mockResolvedValueOnce(manyTours)
        .mockResolvedValueOnce([]);

      const result = await service.getSuggestions({ q: 'tour', limit: 5 });

      expect(result.suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should use default limit of 5', async () => {
      mockPrismaService.tour.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await service.getSuggestions({ q: 'test' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });
  });
});
