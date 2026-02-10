import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { REFUND_TIERS } from './constants/booking.constants';

export interface CancellationPreview {
  bookingId: number;
  daysUntilDeparture: number;
  tier: 'free' | 'early' | 'standard' | 'late';
  refundPercentage: number;
  penaltyPercentage: number;
  refundAmount: number;
  penaltyAmount: number;
  totalPaid: number;
  requiresConfirmation: boolean;
  description: string;
}

@Injectable()
export class CancellationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate refund based on cancellation policy.
   * Rules: C1 (refund tiers), C2 (PENDING free), C3 (calculation)
   */
  calculateRefund(
    booking: { id: number; status: string; totalPrice: number | { toNumber?: () => number } },
    schedule: { startDate: Date },
  ): CancellationPreview {
    const totalPaid = this.toNumber(booking.totalPrice);

    // Rule C2: PENDING bookings cancel for free (no payment yet)
    if (booking.status === 'PENDING') {
      return {
        bookingId: booking.id,
        daysUntilDeparture: this.daysBetween(new Date(), schedule.startDate),
        tier: 'free',
        refundPercentage: 100,
        penaltyPercentage: 0,
        refundAmount: 0,
        penaltyAmount: 0,
        totalPaid: 0,
        requiresConfirmation: false,
        description: 'Free cancellation (booking not yet paid)',
      };
    }

    const daysUntil = this.daysBetween(new Date(), schedule.startDate);

    // Rule C1: Find matching tier
    let refundPercentage = 0;
    let tier: 'early' | 'standard' | 'late' = 'late';

    for (const refundTier of REFUND_TIERS) {
      if (daysUntil >= refundTier.minDays) {
        refundPercentage = refundTier.percent;
        if (refundTier.minDays >= 15) tier = 'early';
        else if (refundTier.minDays >= 2) tier = 'standard';
        else tier = 'late';
        break;
      }
    }

    // Rule C3: Calculate amounts
    const refundAmount = Math.round(totalPaid * refundPercentage) / 100;
    const penaltyAmount = Math.round((totalPaid - refundAmount) * 100) / 100;

    return {
      bookingId: booking.id,
      daysUntilDeparture: daysUntil,
      tier,
      refundPercentage,
      penaltyPercentage: 100 - refundPercentage,
      refundAmount,
      penaltyAmount,
      totalPaid,
      requiresConfirmation: refundPercentage === 0,
      description: this.getDescription(tier, refundPercentage),
    };
  }

  /**
   * Get cancellation preview for a booking (with ownership check).
   */
  async getCancellationPreview(
    bookingId: number,
    userId: number,
  ): Promise<CancellationPreview> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { schedule: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (!['PENDING', 'PAID'].includes(booking.status)) {
      throw new BadRequestException('This booking cannot be cancelled');
    }

    return this.calculateRefund(booking, booking.schedule);
  }

  private daysBetween(from: Date, to: Date): number {
    const diff = to.getTime() - from.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getDescription(tier: string, percent: number): string {
    switch (tier) {
      case 'free':
        return 'Free cancellation (booking not yet paid)';
      case 'early':
        return `Early cancellation: ${percent}% refund`;
      case 'standard':
        return `Standard cancellation: ${percent}% refund`;
      case 'late':
        return 'Late cancellation: no refund';
      default:
        return '';
    }
  }

  private toNumber(value: number | { toNumber?: () => number }): number {
    if (typeof value === 'number') return value;
    if (value && typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }
}
