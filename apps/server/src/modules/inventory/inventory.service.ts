import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BOOKING_CUTOFF_HOURS } from './inventory.constants';

/** Minimal Prisma-like client for running releaseStock inside a transaction. */
export type PrismaTransactionLike = Pick<PrismaService, 'tourSchedule'>;

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Reserve stock with optimistic locking.
   * Rules: I1 (capacity check), I2 (pre-validate), I4 (optimistic lock), S2 (auto SOLD_OUT)
   */
  async reserveStock(scheduleId: number, travelers: number): Promise<void> {
    const schedule = await this.prisma.tourSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }

    if (schedule.status !== 'OPEN') {
      throw new BadRequestException('Schedule is not available for booking');
    }

    // Rule S1: Check cutoff (24h before departure)
    const hoursUntil =
      (schedule.startDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < BOOKING_CUTOFF_HOURS) {
      throw new BadRequestException(
        'Booking is closed (less than 24 hours before departure)',
      );
    }

    // Rule I2: Pre-validate capacity
    const availableSpots = schedule.maxCapacity - schedule.currentCapacity;
    if (travelers > availableSpots) {
      throw new BadRequestException(
        `Not enough spots. Available: ${availableSpots}, Requested: ${travelers}`,
      );
    }

    // Rule I4: Optimistic lock update
    const newCapacity = schedule.currentCapacity + travelers;
    const newStatus =
      newCapacity >= schedule.maxCapacity ? 'SOLD_OUT' : 'OPEN';

    const result = await this.prisma.tourSchedule.updateMany({
      where: { id: scheduleId, version: schedule.version },
      data: {
        currentCapacity: { increment: travelers },
        version: { increment: 1 },
        ...(newStatus === 'SOLD_OUT' ? { status: 'SOLD_OUT' } : {}),
      },
    });

    if (result.count === 0) {
      throw new ConflictException(
        'Schedule was modified by another request. Please try again.',
      );
    }

    this.logger.log(
      `Reserved ${travelers} spots on schedule #${scheduleId} (${newCapacity}/${schedule.maxCapacity})`,
    );
  }

  /**
   * Release stock (cancel/timeout) with optimistic locking.
   * Rules: I3 (release on cancel), I4 (optimistic lock), S2 (auto revert SOLD_OUT → OPEN)
   * @param tx When provided, runs inside the given transaction (e.g. from prisma.$transaction).
   */
  async releaseStock(
    scheduleId: number,
    travelers: number,
    tx?: PrismaTransactionLike,
  ): Promise<void> {
    const prisma = tx ?? this.prisma;

    const schedule = await prisma.tourSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      this.logger.warn(
        `Cannot release stock: schedule #${scheduleId} not found`,
      );
      return;
    }

    const newCapacity = Math.max(0, schedule.currentCapacity - travelers);
    const shouldReopen =
      schedule.status === 'SOLD_OUT' && newCapacity < schedule.maxCapacity;

    const result = await prisma.tourSchedule.updateMany({
      where: { id: scheduleId, version: schedule.version },
      data: {
        currentCapacity: newCapacity,
        version: { increment: 1 },
        ...(shouldReopen ? { status: 'OPEN' } : {}),
      },
    });

    if (result.count === 0) {
      throw new ConflictException(
        'Schedule was modified by another request. Please try again.',
      );
    }

    this.logger.log(
      `Released ${travelers} spots on schedule #${scheduleId} (${newCapacity}/${schedule.maxCapacity})${shouldReopen ? ' → reopened' : ''}`,
    );
  }

  /**
   * Check availability for a schedule.
   */
  async checkAvailability(
    scheduleId: number,
  ): Promise<{ available: boolean; spots: number }> {
    const schedule = await this.prisma.tourSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule || schedule.status !== 'OPEN') {
      return { available: false, spots: 0 };
    }

    const spots = schedule.maxCapacity - schedule.currentCapacity;
    return { available: spots > 0, spots };
  }
}
