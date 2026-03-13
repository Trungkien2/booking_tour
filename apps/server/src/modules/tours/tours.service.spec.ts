import { Test, TestingModule } from '@nestjs/testing';
import { ToursService } from './tours.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('ToursService', () => {
  let service: ToursService;

  const mockPrismaService = {
    tour: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    tourSchedule: {
      deleteMany: jest.fn(),
    },
    booking: {
      count: jest.fn(),
    },
    $transaction: jest.fn((args: unknown[]) => Promise.all(args)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated tours', async () => {
      const mockTours = [
        {
          id: 1,
          name: 'Tour 1',
          schedules: [{ id: 1, startDate: new Date('2026-04-01'), maxCapacity: 10, currentCapacity: 2, status: 'OPEN' }],
        },
      ];
      mockPrismaService.tour.findMany.mockResolvedValue(mockTours);
      mockPrismaService.tour.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.data[0].totalSlots).toBe(10);
      expect(result.data[0].bookedSlots).toBe(2);
      expect(result.data[0].availableSlots).toBe(8);
    });
  });

  describe('create', () => {
    it('should create a new tour', async () => {
      const dto: any = {
        name: 'New Tour',
        priceAdult: 100,
        priceChild: 50,
        durationDays: 1,
      };
      const createdTour = { id: 1, ...dto, slug: 'new-tour', priceAdult: 100, priceChild: 50, ratingAverage: 0, schedules: [] };

      mockPrismaService.tour.findUnique.mockResolvedValueOnce(null); // slug check
      mockPrismaService.tour.create.mockResolvedValue(createdTour);
      mockPrismaService.tour.findUnique.mockResolvedValueOnce(createdTour); // findOne

      const result = await service.create(dto);

      expect(result.slug).toBe('new-tour');
      expect(mockPrismaService.tour.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if slug exists', async () => {
      const dto: any = { name: 'Existing Tour' };
      mockPrismaService.tour.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should create tour with schedules', async () => {
      const dto: any = {
        name: 'Tour With Schedules',
        priceAdult: 100,
        priceChild: 50,
        durationDays: 2,
        schedules: [
          { startDate: '2026-04-01', maxCapacity: 20 },
          { startDate: '2026-05-01', maxCapacity: 30 },
        ],
      };
      const createdTour = {
        id: 1,
        ...dto,
        slug: 'tour-with-schedules',
        schedules: [
          { id: 1, startDate: new Date('2026-04-01'), maxCapacity: 20, currentCapacity: 0, status: 'OPEN' },
          { id: 2, startDate: new Date('2026-05-01'), maxCapacity: 30, currentCapacity: 0, status: 'OPEN' },
        ],
      };

      mockPrismaService.tour.findUnique.mockResolvedValueOnce(null); // slug check
      mockPrismaService.tour.create.mockResolvedValue(createdTour);
      mockPrismaService.tour.findUnique.mockResolvedValueOnce(createdTour); // findOne

      await service.create(dto);

      expect(mockPrismaService.tour.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            schedules: {
              create: [
                { startDate: new Date('2026-04-01'), maxCapacity: 20 },
                { startDate: new Date('2026-05-01'), maxCapacity: 30 },
              ],
            },
          }),
        }),
      );
    });

    it('should create tour without schedules when not provided', async () => {
      const dto: any = {
        name: 'Tour No Schedules',
        priceAdult: 100,
        priceChild: 50,
        durationDays: 1,
      };
      const createdTour = { id: 1, ...dto, slug: 'tour-no-schedules', priceAdult: 100, priceChild: 50, ratingAverage: 0, schedules: [] };

      mockPrismaService.tour.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.tour.create.mockResolvedValue(createdTour);
      mockPrismaService.tour.findUnique.mockResolvedValueOnce(createdTour);

      await service.create(dto);

      const createCall = mockPrismaService.tour.create.mock.calls[0][0];
      expect(createCall.data.schedules).toBeUndefined();
    });

    it('should create tour without schedules when empty array', async () => {
      const dto: any = {
        name: 'Tour Empty Schedules',
        priceAdult: 100,
        priceChild: 50,
        durationDays: 1,
        schedules: [],
      };
      const createdTour = { id: 1, ...dto, slug: 'tour-empty-schedules', priceAdult: 100, priceChild: 50, ratingAverage: 0, schedules: [] };

      mockPrismaService.tour.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.tour.create.mockResolvedValue(createdTour);
      mockPrismaService.tour.findUnique.mockResolvedValueOnce(createdTour);

      await service.create(dto);

      const createCall = mockPrismaService.tour.create.mock.calls[0][0];
      expect(createCall.data.schedules).toBeUndefined();
    });
  });

  describe('remove', () => {
    const tourWithSchedules = {
      id: 1,
      name: 'Test Tour',
      slug: 'test-tour',
      schedules: [{ id: 1, startDate: new Date('2026-04-01'), maxCapacity: 10, currentCapacity: 0, status: 'OPEN' }],
    };

    it('should soft delete tour if no active bookings', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(tourWithSchedules);
      mockPrismaService.booking.count.mockResolvedValue(0);

      await service.remove(1);

      expect(mockPrismaService.tour.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw BadRequestException if active bookings exist', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(tourWithSchedules);
      mockPrismaService.booking.count.mockResolvedValue(1);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update with schedules', () => {
    const existingTour = {
      id: 1,
      name: 'Test Tour',
      slug: 'test-tour',
      schedules: [
        { id: 1, startDate: new Date('2026-04-01'), maxCapacity: 20, currentCapacity: 0, status: 'OPEN' },
      ],
    };

    it('should delete empty schedules and create new ones when schedules provided', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(existingTour);
      mockPrismaService.tourSchedule.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.tour.update.mockResolvedValue(existingTour);
      mockPrismaService.$transaction.mockResolvedValue([{ count: 1 }, existingTour]);

      await service.update(1, {
        schedules: [{ startDate: '2026-06-01', maxCapacity: 25 }],
      } as any);

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        expect.anything(), // deleteMany
        expect.anything(), // update
      ]);
    });

    it('should not touch schedules when schedules field is undefined', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(existingTour);
      mockPrismaService.tour.update.mockResolvedValue(existingTour);

      await service.update(1, { name: 'Updated Name' } as any);

      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
      expect(mockPrismaService.tour.update).toHaveBeenCalled();
    });
  });

  describe('getStatistics', () => {
    it('should calculate statistics', async () => {
      mockPrismaService.tour.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5) // active
        .mockResolvedValueOnce(3); // drafts

      mockPrismaService.tour.findMany.mockResolvedValue([
        { schedules: [{ maxCapacity: 10, currentCapacity: 10 }] }, // fully booked
        { schedules: [{ maxCapacity: 10, currentCapacity: 5 }] },
      ]);

      const stats = await service.getStatistics();

      expect(stats).toEqual({
        total: 10,
        active: 5,
        drafts: 3,
        fullyBooked: 1,
      });
    });
  });
});
