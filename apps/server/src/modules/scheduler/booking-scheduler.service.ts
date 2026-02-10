import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class BookingSchedulerService {
  private readonly logger = new Logger(BookingSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
  ) {}

  /**
   * Run every minute: find and cancel expired PENDING bookings.
   * Rule: B2 (reservation TTL = 15 min)
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async expirePendingBookings() {
    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: new Date() },
      },
      include: { travelers: true },
    });

    if (expiredBookings.length === 0) return;

    this.logger.log(
      `Found ${expiredBookings.length} expired PENDING booking(s)`,
    );

    for (const booking of expiredBookings) {
      try {
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: 'expired',
          },
        });

        await this.inventory.releaseStock(
          booking.scheduleId,
          booking.travelers.length,
        );

        this.logger.log(
          `Expired booking #${booking.id} cancelled, ${booking.travelers.length} spots released`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to expire booking #${booking.id}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Run daily at midnight: close schedules that have already started.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async closePastSchedules() {
    const result = await this.prisma.tourSchedule.updateMany({
      where: {
        startDate: { lt: new Date() },
        status: { in: ['OPEN', 'SOLD_OUT'] },
      },
      data: { status: 'COMPLETED' },
    });

    if (result.count > 0) {
      this.logger.log(`Closed ${result.count} past schedule(s)`);
    }
  }
}
