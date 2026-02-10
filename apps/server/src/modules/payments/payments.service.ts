import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * Create a payment for a booking (initiate Stripe checkout).
   */
  async createPayment(
    bookingId: number,
    userId: number,
    provider: string,
    returnUrl: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Booking is not in PENDING status');
    }

    // Check expiry
    if (booking.expiresAt && new Date() > booking.expiresAt) {
      throw new BadRequestException('Booking has expired');
    }

    // Create Stripe checkout session
    const { sessionId, checkoutUrl } =
      await this.stripeService.createCheckoutSession(booking, returnUrl);

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount: booking.totalPrice,
        provider,
        transactionId: sessionId,
        status: 'PENDING',
        checkoutUrl,
        expiresAt: booking.expiresAt,
      },
    });

    this.logger.log(
      `Payment #${payment.id} created for booking #${bookingId} (session: ${sessionId})`,
    );

    return { payment, checkoutUrl };
  }

  /**
   * Verify payment status (fallback polling mechanism).
   */
  async verifyPayment(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    const latestPayment = booking.payments[0];
    if (!latestPayment) {
      throw new BadRequestException('No payment found');
    }

    // If already processed, return current state
    if (latestPayment.status !== 'PENDING') {
      return {
        paymentStatus: latestPayment.status,
        bookingStatus: booking.status,
      };
    }

    // Check with Stripe
    try {
      const session = await this.stripeService.retrieveSession(
        latestPayment.transactionId,
      );

      if (session.payment_status === 'paid') {
        await this.finalizePayment(bookingId, latestPayment.id);
        return { paymentStatus: 'SUCCESS', bookingStatus: 'PAID' };
      }
    } catch (error) {
      this.logger.warn(
        `Failed to verify payment for booking #${bookingId}: ${error.message}`,
      );
    }

    return {
      paymentStatus: latestPayment.status,
      bookingStatus: booking.status,
    };
  }

  /**
   * Handle Stripe webhook events.
   */
  async handleWebhook(event: { type: string; data: { object: Record<string, unknown> } }) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = Number(session.metadata?.['bookingId']);

        if (!bookingId) {
          this.logger.warn('Webhook: missing bookingId in metadata');
          return;
        }

        // Find payment by session id
        const payment = await this.prisma.payment.findFirst({
          where: { transactionId: session.id as string },
        });

        if (!payment) {
          this.logger.warn(
            `Webhook: no payment found for session ${session.id}`,
          );
          return;
        }

        // Idempotent: skip if already processed
        if (payment.status === 'SUCCESS') {
          this.logger.log(
            `Webhook: payment #${payment.id} already processed, skipping`,
          );
          return;
        }

        await this.finalizePayment(bookingId, payment.id);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const bookingId = Number(session.metadata?.['bookingId']);
        if (bookingId) {
          await this.prisma.payment.updateMany({
            where: { transactionId: session.id as string },
            data: { status: 'FAILED' },
          });
          this.logger.log(
            `Webhook: checkout expired for booking #${bookingId}`,
          );
        }
        break;
      }

      default:
        this.logger.log(`Webhook: unhandled event type ${event.type}`);
    }
  }

  /**
   * Process a refund via Stripe.
   */
  async processRefund(refundId: number) {
    const refund = await this.prisma.refund.findUnique({
      where: { id: refundId },
      include: { payment: true },
    });

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== 'PENDING') {
      throw new BadRequestException('Refund is not in PENDING status');
    }

    try {
      await this.prisma.refund.update({
        where: { id: refundId },
        data: { status: 'PROCESSING' },
      });

      const stripeRefund = await this.stripeService.createRefund(
        refund.payment.transactionId,
        Number(refund.amount),
      );

      await this.prisma.refund.update({
        where: { id: refundId },
        data: {
          status: 'COMPLETED',
          gatewayRefundId: stripeRefund.id,
          processedAt: new Date(),
        },
      });

      // Update booking to REFUNDED
      await this.prisma.booking.update({
        where: { id: refund.bookingId },
        data: { status: 'REFUNDED' },
      });

      this.logger.log(
        `Refund #${refundId} completed (Stripe refund: ${stripeRefund.id})`,
      );
    } catch (error) {
      await this.prisma.refund.update({
        where: { id: refundId },
        data: { status: 'FAILED' },
      });
      this.logger.error(
        `Refund #${refundId} failed: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Finalize a successful payment: update payment + booking status.
   */
  private async finalizePayment(bookingId: number, paymentId: number) {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'SUCCESS' },
    });

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'PAID' },
    });

    this.logger.log(
      `Payment #${paymentId} → SUCCESS, Booking #${bookingId} → PAID`,
    );
  }
}
