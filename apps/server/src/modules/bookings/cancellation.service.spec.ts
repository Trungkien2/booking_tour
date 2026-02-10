import { CancellationService } from './cancellation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('CancellationService', () => {
  let service: CancellationService;

  const mockSchedule30Days = {
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days out
  };

  const mockSchedule10Days = {
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days out
  };

  const mockSchedule1Day = {
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day out
  };

  const paidBooking = {
    id: 1,
    status: 'PAID',
    totalPrice: 1000,
  };

  const pendingBooking = {
    id: 2,
    status: 'PENDING',
    totalPrice: 500,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancellationService,
        {
          provide: PrismaService,
          useValue: {
            booking: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CancellationService>(CancellationService);
  });

  describe('calculateRefund', () => {
    it('should return free cancellation for PENDING booking', () => {
      const result = service.calculateRefund(pendingBooking, mockSchedule30Days);

      expect(result.tier).toBe('free');
      expect(result.refundPercentage).toBe(100);
      expect(result.refundAmount).toBe(0);
      expect(result.requiresConfirmation).toBe(false);
    });

    it('should return 70% refund for early cancellation (>= 15 days)', () => {
      const result = service.calculateRefund(paidBooking, mockSchedule30Days);

      expect(result.tier).toBe('early');
      expect(result.refundPercentage).toBe(70);
      expect(result.refundAmount).toBe(700);
      expect(result.penaltyAmount).toBe(300);
      expect(result.requiresConfirmation).toBe(false);
    });

    it('should return 50% refund for standard cancellation (2-14 days)', () => {
      const result = service.calculateRefund(paidBooking, mockSchedule10Days);

      expect(result.tier).toBe('standard');
      expect(result.refundPercentage).toBe(50);
      expect(result.refundAmount).toBe(500);
      expect(result.penaltyAmount).toBe(500);
      expect(result.requiresConfirmation).toBe(false);
    });

    it('should return 0% refund for late cancellation (< 2 days)', () => {
      const result = service.calculateRefund(paidBooking, mockSchedule1Day);

      expect(result.tier).toBe('late');
      expect(result.refundPercentage).toBe(0);
      expect(result.refundAmount).toBe(0);
      expect(result.penaltyAmount).toBe(1000);
      expect(result.requiresConfirmation).toBe(true);
    });

    it('should require confirmation for 0% refund', () => {
      const result = service.calculateRefund(paidBooking, mockSchedule1Day);
      expect(result.requiresConfirmation).toBe(true);
    });

    it('should handle boundary: exactly 15 days → early (70%)', () => {
      const schedule15Days = {
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      };
      const result = service.calculateRefund(paidBooking, schedule15Days);
      expect(result.tier).toBe('early');
      expect(result.refundPercentage).toBe(70);
    });

    it('should handle boundary: exactly 2 days → standard (50%)', () => {
      const schedule2Days = {
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      };
      const result = service.calculateRefund(paidBooking, schedule2Days);
      expect(result.tier).toBe('standard');
      expect(result.refundPercentage).toBe(50);
    });

    it('should handle Decimal-like totalPrice (Prisma)', () => {
      const prismaBooking = {
        id: 3,
        status: 'PAID',
        totalPrice: { toNumber: () => 500 },
      };
      const result = service.calculateRefund(prismaBooking, mockSchedule30Days);
      expect(result.refundAmount).toBe(350); // 70% of 500
    });
  });
});
