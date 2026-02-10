import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from './stripe.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;
  let stripeService: StripeService;

  const mockBooking = {
    id: 1,
    userId: 1,
    scheduleId: 1,
    totalPrice: 440,
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    payments: [{ id: 1, status: 'PENDING', transactionId: 'cs_test_123' }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            booking: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            payment: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
            refund: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: StripeService,
          useValue: {
            createCheckoutSession: jest.fn().mockResolvedValue({
              sessionId: 'cs_test_123',
              checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_123',
            }),
            retrieveSession: jest.fn(),
            createRefund: jest.fn(),
            verifyWebhookSignature: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
    stripeService = module.get<StripeService>(StripeService);
  });

  describe('createPayment', () => {
    it('should create payment and return checkout URL', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);
      prisma.payment.create = jest.fn().mockResolvedValue({
        id: 1,
        bookingId: 1,
        transactionId: 'cs_test_123',
        status: 'PENDING',
      });

      const result = await service.createPayment(
        1,
        1,
        'stripe',
        'http://localhost:3000/bookings/processing',
      );

      expect(result.checkoutUrl).toBeDefined();
      expect(stripeService.createCheckoutSession).toHaveBeenCalled();
    });

    it('should reject if booking not found', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.createPayment(999, 1, 'stripe', 'http://localhost'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject if not owner', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue(mockBooking);

      await expect(
        service.createPayment(1, 999, 'stripe', 'http://localhost'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject if booking not PENDING', async () => {
      prisma.booking.findUnique = jest
        .fn()
        .mockResolvedValue({ ...mockBooking, status: 'PAID' });

      await expect(
        service.createPayment(1, 1, 'stripe', 'http://localhost'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject if booking expired', async () => {
      prisma.booking.findUnique = jest.fn().mockResolvedValue({
        ...mockBooking,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        service.createPayment(1, 1, 'stripe', 'http://localhost'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleWebhook', () => {
    it('should finalize payment on checkout.session.completed', async () => {
      prisma.payment.findFirst = jest.fn().mockResolvedValue({
        id: 1,
        status: 'PENDING',
      });
      prisma.payment.update = jest.fn().mockResolvedValue({});
      prisma.booking.update = jest.fn().mockResolvedValue({});

      await service.handleWebhook({
        type: 'checkout.session.completed',
        data: {
          object: { id: 'cs_test_123', metadata: { bookingId: '1' } },
        },
      });

      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'SUCCESS' },
        }),
      );
      expect(prisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'PAID' },
        }),
      );
    });

    it('should be idempotent (skip already SUCCESS payment)', async () => {
      prisma.payment.findFirst = jest.fn().mockResolvedValue({
        id: 1,
        status: 'SUCCESS',
      });

      await service.handleWebhook({
        type: 'checkout.session.completed',
        data: {
          object: { id: 'cs_test_123', metadata: { bookingId: '1' } },
        },
      });

      expect(prisma.payment.update).not.toHaveBeenCalled();
    });

    it('should handle expired checkout session', async () => {
      prisma.payment.updateMany = jest.fn().mockResolvedValue({ count: 1 });

      await service.handleWebhook({
        type: 'checkout.session.expired',
        data: {
          object: { id: 'cs_test_expired', metadata: { bookingId: '1' } },
        },
      });

      expect(prisma.payment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'FAILED' },
        }),
      );
    });
  });

  describe('processRefund', () => {
    it('should process refund successfully', async () => {
      prisma.refund.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        bookingId: 1,
        amount: 220,
        status: 'PENDING',
        payment: { transactionId: 'pi_test_123' },
      });
      prisma.refund.update = jest.fn().mockResolvedValue({});
      prisma.booking.update = jest.fn().mockResolvedValue({});
      stripeService.createRefund = jest
        .fn()
        .mockResolvedValue({ id: 're_test_123' });

      await service.processRefund(1);

      expect(stripeService.createRefund).toHaveBeenCalledWith(
        'pi_test_123',
        220,
      );
      expect(prisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'REFUNDED' },
        }),
      );
    });

    it('should reject if refund not found', async () => {
      prisma.refund.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.processRefund(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should reject if refund not PENDING', async () => {
      prisma.refund.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        status: 'COMPLETED',
      });

      await expect(service.processRefund(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
