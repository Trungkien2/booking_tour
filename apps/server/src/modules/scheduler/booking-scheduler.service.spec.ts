import { Test, TestingModule } from '@nestjs/testing';
import { BookingSchedulerService } from './booking-scheduler.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';

describe('BookingSchedulerService', () => {
  let service: BookingSchedulerService;
  let prisma: PrismaService;
  let inventory: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingSchedulerService,
        {
          provide: PrismaService,
          useValue: {
            booking: {
              findMany: jest.fn(),
              update: jest.fn(),
            },
            tourSchedule: {
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: InventoryService,
          useValue: {
            releaseStock: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingSchedulerService>(BookingSchedulerService);
    prisma = module.get<PrismaService>(PrismaService);
    inventory = module.get<InventoryService>(InventoryService);
  });

  describe('expirePendingBookings', () => {
    it('should cancel expired bookings and release stock', async () => {
      const expiredBookings = [
        {
          id: 1,
          scheduleId: 1,
          travelers: [{ id: 1 }, { id: 2 }],
        },
        {
          id: 2,
          scheduleId: 2,
          travelers: [{ id: 3 }],
        },
      ];

      prisma.booking.findMany = jest.fn().mockResolvedValue(expiredBookings);
      prisma.booking.update = jest.fn().mockResolvedValue({});

      await service.expirePendingBookings();

      expect(prisma.booking.update).toHaveBeenCalledTimes(2);
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          status: 'CANCELLED',
          cancelledAt: expect.any(Date),
          cancelReason: 'expired',
        },
      });
      expect(inventory.releaseStock).toHaveBeenCalledWith(1, 2);
      expect(inventory.releaseStock).toHaveBeenCalledWith(2, 1);
    });

    it('should do nothing when no expired bookings', async () => {
      prisma.booking.findMany = jest.fn().mockResolvedValue([]);

      await service.expirePendingBookings();

      expect(prisma.booking.update).not.toHaveBeenCalled();
      expect(inventory.releaseStock).not.toHaveBeenCalled();
    });

    it('should continue processing other bookings if one fails', async () => {
      const bookings = [
        { id: 1, scheduleId: 1, travelers: [{ id: 1 }] },
        { id: 2, scheduleId: 2, travelers: [{ id: 2 }] },
      ];

      prisma.booking.findMany = jest.fn().mockResolvedValue(bookings);
      prisma.booking.update = jest
        .fn()
        .mockRejectedValueOnce(new Error('DB error'))
        .mockResolvedValueOnce({});

      await service.expirePendingBookings();

      // Should still try to process booking #2
      expect(prisma.booking.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('closePastSchedules', () => {
    it('should close past schedules', async () => {
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 3 });

      await service.closePastSchedules();

      expect(prisma.tourSchedule.updateMany).toHaveBeenCalledWith({
        where: {
          startDate: { lt: expect.any(Date) },
          status: { in: ['OPEN', 'SOLD_OUT'] },
        },
        data: { status: 'COMPLETED' },
      });
    });

    it('should handle no schedules to close', async () => {
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 0 });

      await service.closePastSchedules();

      expect(prisma.tourSchedule.updateMany).toHaveBeenCalled();
    });
  });
});
