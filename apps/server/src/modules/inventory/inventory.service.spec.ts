import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockSchedule = {
    id: 1,
    tourId: 1,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    maxCapacity: 20,
    currentCapacity: 5,
    status: 'OPEN',
    version: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: PrismaService,
          useValue: {
            tourSchedule: {
              findUnique: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('reserveStock', () => {
    it('should reserve spots successfully', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(mockSchedule);
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 1 });

      await expect(service.reserveStock(1, 3)).resolves.toBeUndefined();

      expect(prisma.tourSchedule.updateMany).toHaveBeenCalledWith({
        where: { id: 1, version: 1 },
        data: {
          currentCapacity: { increment: 3 },
          version: { increment: 1 },
        },
      });
    });

    it('should set SOLD_OUT when reaching max capacity', async () => {
      const almostFull = {
        ...mockSchedule,
        currentCapacity: 18,
      };
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue(almostFull);
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 1 });

      await service.reserveStock(1, 2);

      expect(prisma.tourSchedule.updateMany).toHaveBeenCalledWith({
        where: { id: 1, version: 1 },
        data: {
          currentCapacity: { increment: 2 },
          version: { increment: 1 },
          status: 'SOLD_OUT',
        },
      });
    });

    it('should reject when not enough spots', async () => {
      const almostFull = {
        ...mockSchedule,
        currentCapacity: 19,
      };
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue(almostFull);

      await expect(service.reserveStock(1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject when schedule is not OPEN', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue({
        ...mockSchedule,
        status: 'SOLD_OUT',
      });

      await expect(service.reserveStock(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject when schedule not found', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.reserveStock(999, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException on version mismatch (optimistic lock)', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(mockSchedule);
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 0 });

      await expect(service.reserveStock(1, 2)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should reject when within cutoff period (< 24h before departure)', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue({
        ...mockSchedule,
        startDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      });

      await expect(service.reserveStock(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('releaseStock', () => {
    it('should release spots successfully', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(mockSchedule);
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 1 });

      await expect(service.releaseStock(1, 2)).resolves.toBeUndefined();

      expect(prisma.tourSchedule.updateMany).toHaveBeenCalledWith({
        where: { id: 1, version: 1 },
        data: {
          currentCapacity: 3,
          version: { increment: 1 },
        },
      });
    });

    it('should reopen SOLD_OUT schedule when spots freed', async () => {
      const soldOut = {
        ...mockSchedule,
        currentCapacity: 20,
        status: 'SOLD_OUT',
      };
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue(soldOut);
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 1 });

      await service.releaseStock(1, 3);

      expect(prisma.tourSchedule.updateMany).toHaveBeenCalledWith({
        where: { id: 1, version: 1 },
        data: {
          currentCapacity: 17,
          version: { increment: 1 },
          status: 'OPEN',
        },
      });
    });

    it('should not go below 0 capacity', async () => {
      const lowCapacity = {
        ...mockSchedule,
        currentCapacity: 1,
      };
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(lowCapacity);
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 1 });

      await service.releaseStock(1, 5);

      expect(prisma.tourSchedule.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            currentCapacity: 0,
          }),
        }),
      );
    });

    it('should handle schedule not found gracefully', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.releaseStock(999, 1)).resolves.toBeUndefined();
    });

    it('should throw ConflictException on version mismatch', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(mockSchedule);
      prisma.tourSchedule.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 0 });

      await expect(service.releaseStock(1, 2)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('checkAvailability', () => {
    it('should return available spots for OPEN schedule', async () => {
      prisma.tourSchedule.findUnique = jest
        .fn()
        .mockResolvedValue(mockSchedule);

      const result = await service.checkAvailability(1);

      expect(result).toEqual({ available: true, spots: 15 });
    });

    it('should return not available for SOLD_OUT schedule', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue({
        ...mockSchedule,
        status: 'SOLD_OUT',
      });

      const result = await service.checkAvailability(1);

      expect(result).toEqual({ available: false, spots: 0 });
    });

    it('should return not available for non-existent schedule', async () => {
      prisma.tourSchedule.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.checkAvailability(999);

      expect(result).toEqual({ available: false, spots: 0 });
    });
  });
});
