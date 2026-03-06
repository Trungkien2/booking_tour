import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      this.logger.warn(
        'STRIPE_SECRET_KEY not set — Stripe operations will fail at runtime',
      );
    }
    this.stripe = new Stripe(secretKey || 'sk_test_placeholder', {
      apiVersion: '2026-01-28.clover',
    });
  }

  async createCheckoutSession(
    booking: { id: number; totalPrice: number | { toNumber?: () => number } },
    returnUrl: string,
  ): Promise<{ sessionId: string; checkoutUrl: string }> {
    const amount = this.toNumber(booking.totalPrice);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Booking #${booking.id}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${returnUrl}?cancelled=true&booking_id=${booking.id}`,
      metadata: { bookingId: String(booking.id) },
    });

    this.logger.log(
      `Created Stripe checkout session ${session.id} for booking #${booking.id}`,
    );

    return {
      sessionId: session.id,
      checkoutUrl: session.url!,
    };
  }

  verifyWebhookSignature(payload: Buffer, signature: string): Stripe.Event {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  async createRefund(
    paymentIntentId: string,
    amount: number,
  ): Promise<Stripe.Refund> {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
    });

    this.logger.log(
      `Created Stripe refund ${refund.id} for payment intent ${paymentIntentId}`,
    );

    return refund;
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  private toNumber(value: number | { toNumber?: () => number }): number {
    if (typeof value === 'number') return value;
    if (value && typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }
}
