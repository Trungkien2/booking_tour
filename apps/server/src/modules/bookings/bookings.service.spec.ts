import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { PriceCalculatorService } from './price-calculator.service';
import { CancellationService } from './cancellation.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;
  let inventory: InventoryService;
  let priceCalc: PriceCalculatorService;
  let cancellation: CancellationService;

  const mockTour = {
    id: 1,
    name: 'Test Tour',
    slug: 'test-tour',
    coverImage: 'img.jpg',
    location: 'Vietnam',
    durationDays: 3,
    priceAdult: 200,
    priceChild: 100,
  };

  const mockSchedule = {
    id: 1,
    tourId: 1,
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days out
    maxCapacity: 20,
    currentCapacity: 5,
    status: 'OPEN',
    version: 1,
    tour: mockTour,
  };

  const mockBooking = {
    id: 1,
    userId: 1,
    scheduleId: 1,
    bookingDate: new Date(),
    totalPrice: 440,
    status: 'PAID',
    note: null,
    expiresAt: new Date(),
    cancelledAt: null,
    cancelReason: null,
    travelers: [
      { id: 1, bookingId: 1, fullName: 'John', ageGroup: 'ADULT', price: 200, gender: null },
      { id: 2, bookingId: 1, fullName: 'Jane', ageGroup: 'ADULT', price: 200, gender: null },
    ],
    schedule: mockSchedule,
    payments: [{ id: 1, status: 'SUCCESS', amount: 440 }],
    refunds: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: {
            booking: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
            },
            tourSchedule: {
              findUnique: jest.fn(),
              updateMany: jest.fn(),
            },
            refund: {
              create: jest.fn(),
            },
            payment: {
              aggregate: jest.fn(),
            },
          },
        },
        {
          provide: InventoryService,
          useValue: {
            reserveStock: jest.fn(),
            releaseStock: jest.fn(),
          },
        },
        {
          provide: PriceCalculatorService,
          useValue: {
            calculatePrice: jest.fn().mockReturnValue({
              travelerPrices: [
                { fullName: 'John', ageGroup: 'ADULT', price: 200 },
                { fullName: 'Jane', ageGroup: 'ADULT', price: 200 },
              ],
              adults: { count: 2, unitPrice: 200, total: 400 },
              children: { count: 0, unitPrice: 100, total: 0 },
              babies: { count: 0 },
              subtotal: 400,
              taxes: 40,
              total: 440,
            }),
          },
        },
        {
          provide: CancellationService,
          useValue: {
            calculateRefund: jest.fn().mockReturnValue({
              bookingId: 1,
              tier: 'standard',
              refundPercentage: 50,
              refundAmount: 220,
              penaltyAmount: 220,
              requiresConfirmation: false,
              description: 'Standard cancellation: 50% refund',
              daysUntilDeparture: 10,
              penaltyPercentage: 50,
              totalPaid: 440,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
    inventory = module.get<InventoryService>(InventoryService);
    priceCalc = module.get<PriceCalculatorService>(PriceCalculatorService);
    cancellation = module.get<CancellationService>(CancellationService);

    // Support interactive transaction: run callback with prisma as tx
    prisma.$transaction = jest.fn().mockImplementation((fn: (tx: typeof prisma) => Promise<unknown>) => fn(prisma));
  });

  describe('createBooking', () => {
    const createDto = {
      scheduleId: 1,
      travelers: [
        { fullName: 'John', ageGroup: 'ADULT' as const },
        { fullName: 'Jane', ageGroup: 'ADULT' as const },
      ],
      note: 'Test booking',
    };

    it('should create a booking successfully', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(mockSchedule);
      prisma.booking.create = jest.fn().mockResolvedValue({
        ...mockBooking,
        status: 'PENDING',
      });

      const result = await service.createBooking(1, createDto);

      expect(inventory.reserveStock).toHaveBeenCalledWith(1, 2);
      expect(prisma.booking.create).toHaveBeenCalled();
      expect(result.booking.status).toBe('PENDING');
      expect(result.priceBreakdown.total).toBe(440);
    });

    it('should reject if no adult traveler (Rule B1)', async () => {
      const noAdultDto = {
        scheduleId: 1,
        travelers: [{ fullName: 'Kid', ageGroup: 'CHILD' as const }],
      };

      await expect(service.createBooking(1, noAdultDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject if schedule not found', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.createBooking(1, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should reject if schedule not OPEN', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue({ ...mockSchedule, status: 'SOLD_OUT' });

      await expect(service.createBooking(1, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject if within cutoff period', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue({
        ...mockSchedule,
        startDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12h
      });

      await expect(service.createBooking(1, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should release stock if booking creation fails', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(mockSchedule);
      prisma.booking.create = jest
        .fn()
        .mockRejectedValue(new Error('DB error'));

      await expect(service.createBooking(1, createDto)).rejects.toThrow();
      expect(inventory.releaseStock).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('getUserBookings', () => {
    it('should return bookings with tab counts', async () => {
      prisma.booking.findMany = jest.fn().mockResolvedValue([mockBooking]);
      prisma.booking.count = jest.fn().mockResolvedValue(1);
      prisma.booking.count = jest
        .fn()
        .mockResolvedValueOnce(1) // total
        .mockResolvedValueOnce(1) // upcoming
        .mockResolvedValueOnce(0) // completed
        .mockResolvedValueOnce(0); // cancelled

      const result = await service.getUserBookings(1, { page: 1, limit: 10 });

      expect(result.bookings).toHaveLength(1);
      expect(result.tabs).toBeDefined();
      expect(result.pagination.page).toBe(1);
    });

    it('should apply tab filter', async () => {
      prisma.booking.findMany = jest.fn().mockResolvedValue([]);
      prisma.booking.count = jest.fn().mockResolvedValue(0);

      await service.getUserBookings(1, { tab: 'cancelled', page: 1, limit: 10 });

      expect(prisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { in: ['CANCELLED', 'REFUNDED'] },
          }),
        }),
      );
    });
  });

  describe('getBookingDetail', () => {
    it('should return booking for owner', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);

      const result = await service.getBookingDetail(1, 1);
      expect(result.id).toBe(1);
    });

    it('should throw 403 for non-owner', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);

      await expect(service.getBookingDetail(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw 404 if not found', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.getBookingDetail(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel PAID booking with refund', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);
      prisma.booking.update = jest.fn().mockResolvedValue({ ...mockBooking, status: 'CANCELLED' });
      prisma.refund.create = jest.fn().mockResolvedValue({ id: 1, amount: 220 });

      const result = await service.cancelBooking(1, 1, { reason: 'Plans changed' });

      expect(result.status).toBe('CANCELLED');
      expect(prisma.refund.create).toHaveBeenCalled();
      expect(inventory.releaseStock).toHaveBeenCalled();
    });

    it('should cancel PENDING booking without refund', async () => {
      const pendingBooking = {
        ...mockBooking,
        status: 'PENDING',
        payments: [],
      };
      prisma.booking.findUnique = jest.fn().mockResolvedValue(pendingBooking);
      prisma.booking.update = jest.fn().mockResolvedValue({ ...pendingBooking, status: 'CANCELLED' });
      cancellation.calculateRefund = jest.fn().mockReturnValue({
        tier: 'free',
        refundPercentage: 100,
        refundAmount: 0,
        requiresConfirmation: false,
      });

      const result = await service.cancelBooking(1, 1, {});

      expect(result.status).toBe('CANCELLED');
      expect(result.refund).toBeNull();
      expect(inventory.releaseStock).toHaveBeenCalled();
    });

    it('should reject late cancel without confirmation (Rule C4)', async () => {
      cancellation.calculateRefund = jest.fn().mockReturnValue({
        tier: 'late',
        refundPercentage: 0,
        refundAmount: 0,
        requiresConfirmation: true,
      });
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);

      await expect(
        service.cancelBooking(1, 1, {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow late cancel with confirmNoRefund', async () => {
      cancellation.calculateRefund = jest.fn().mockReturnValue({
        tier: 'late',
        refundPercentage: 0,
        refundAmount: 0,
        requiresConfirmation: true,
      });
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);
      prisma.booking.update = jest.fn().mockResolvedValue({ ...mockBooking, status: 'CANCELLED' });

      const result = await service.cancelBooking(1, 1, {
        confirmNoRefund: true,
        reason: 'I understand',
      });

      expect(result.status).toBe('CANCELLED');
    });

    it('should reject cancelling already cancelled booking (Rule B3)', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue({
        ...mockBooking,
        status: 'CANCELLED',
      });

      await expect(service.cancelBooking(1, 1, {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject non-owner cancellation', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);

      await expect(service.cancelBooking(1, 999, {})).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
