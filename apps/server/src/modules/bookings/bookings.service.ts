import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { PriceCalculatorService } from './price-calculator.service';
import { CancellationService } from './cancellation.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { AdminBookingQueryDto } from './dto/admin-booking-query.dto';
import { AdminUpdateStatusDto } from './dto/admin-update-status.dto';
import { AdminRefundDto } from './dto/admin-refund.dto';
import { RESERVATION_TTL_MINUTES } from './constants/booking.constants';
import { BOOKING_CUTOFF_HOURS } from '../inventory/inventory.constants';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
    private readonly priceCalc: PriceCalculatorService,
    private readonly cancellation: CancellationService,
  ) {}

  /**
   * Create a new booking with stock reservation.
   * Rules: B1 (min 1 adult), S1 (cutoff), S3 (schedule OPEN), I1/I2/I4 (inventory), P1/P2/P3 (pricing)
   */
  async createBooking(userId: number, dto: CreateBookingDto) {
    // Rule B1: At least 1 adult
    const adultCount = dto.travelers.filter(
      (t) => t.ageGroup === 'ADULT',
    ).length;
    if (adultCount < 1) {
      throw new BadRequestException('At least 1 adult traveler is required');
    }

    // Load schedule + tour
    const schedule = await this.prisma.tourSchedule.findUnique({
      where: { id: dto.scheduleId },
      include: { tour: true },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Rule S3: Schedule must be OPEN
    if (schedule.status !== 'OPEN') {
      throw new BadRequestException('This schedule is not available');
    }

    // Rule S1: Cutoff 24h before departure
    const hoursUntil =
      (schedule.startDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < BOOKING_CUTOFF_HOURS) {
      throw new BadRequestException(
        'Booking is closed (less than 24 hours before departure)',
      );
    }

    // Calculate price (P1, P3)
    const priceBreakdown = this.priceCalc.calculatePrice(
      schedule.tour,
      dto.travelers,
    );

    // Reserve stock (I1, I2, I4) — throws if conflict or full
    await this.inventory.reserveStock(dto.scheduleId, dto.travelers.length);

    try {
      // Create booking + travelers in transaction
      const expiresAt = new Date(
        Date.now() + RESERVATION_TTL_MINUTES * 60 * 1000,
      );

      const booking = await this.prisma.booking.create({
        data: {
          userId,
          scheduleId: dto.scheduleId,
          totalPrice: priceBreakdown.total,
          status: 'PENDING',
          note: dto.note,
          expiresAt,
          travelers: {
            create: priceBreakdown.travelerPrices.map((t) => ({
              fullName: t.fullName,
              gender: t.gender,
              ageGroup: t.ageGroup,
              price: t.price,
            })),
          },
        },
        include: {
          travelers: true,
          schedule: { include: { tour: true } },
        },
      });

      this.logger.log(
        `Booking #${booking.id} created (PENDING, expires ${expiresAt.toISOString()})`,
      );

      return {
        booking,
        priceBreakdown: {
          adults: priceBreakdown.adults,
          children: priceBreakdown.children,
          babies: priceBreakdown.babies,
          subtotal: priceBreakdown.subtotal,
          taxes: priceBreakdown.taxes,
          total: priceBreakdown.total,
        },
      };
    } catch (error) {
      // If booking creation fails, release stock
      await this.inventory.releaseStock(
        dto.scheduleId,
        dto.travelers.length,
      );
      throw error;
    }
  }

  /**
   * Get user bookings with tab counts and pagination.
   */
  async getUserBookings(userId: number, query: BookingQueryDto) {
    const { tab, search, sort, page = 1, limit = 10 } = query;

    // Map tab to status filter
    const statusFilter = this.getStatusFilter(tab);

    // Build where clause
    const where: Record<string, unknown> = {
      userId,
      ...statusFilter,
    };

    if (search) {
      where.OR = [
        { schedule: { tour: { name: { contains: search, mode: 'insensitive' } } } },
        { note: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Sort
    const orderBy = this.getOrderBy(sort);

    // Get bookings + counts in parallel
    const [bookings, total, upcoming, completed, cancelled] = await Promise.all(
      [
        this.prisma.booking.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            travelers: true,
            schedule: { include: { tour: true } },
          },
        }),
        this.prisma.booking.count({ where }),
        this.prisma.booking.count({
          where: { userId, status: { in: ['PENDING', 'PAID'] } },
        }),
        this.prisma.booking.count({
          where: {
            userId,
            status: 'PAID',
            schedule: { startDate: { lt: new Date() } },
          },
        }),
        this.prisma.booking.count({
          where: { userId, status: { in: ['CANCELLED', 'REFUNDED'] } },
        }),
      ],
    );

    const totalPages = Math.ceil(total / limit);

    return {
      bookings: bookings.map((b) => this.formatBookingListItem(b)),
      tabs: { upcoming, completed, cancelled },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get booking detail with ownership check.
   */
  async getBookingDetail(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelers: true,
        schedule: { include: { tour: true } },
        payments: { orderBy: { createdAt: 'desc' } },
        refunds: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Not authorized to view this booking');
    }

    // Include cancellation info if eligible
    let cancellationPreview = null;
    if (['PENDING', 'PAID'].includes(booking.status)) {
      cancellationPreview = this.cancellation.calculateRefund(
        booking,
        booking.schedule,
      );
    }

    return { ...booking, cancellationPreview };
  }

  /**
   * Get booking status for polling (processing page).
   */
  async getBookingStatus(bookingId: number, userId: number) {
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
    const steps = this.buildProcessingSteps(booking, latestPayment);

    return {
      bookingId: booking.id,
      status: booking.status,
      steps,
      redirectUrl:
        booking.status === 'PAID'
          ? `/bookings/${booking.id}/confirmation`
          : null,
    };
  }

  /**
   * Cancel booking with refund creation.
   * Rules: B3 (status guard), C1-C5 (cancellation policy), I3/I4 (release stock)
   */
  async cancelBooking(
    bookingId: number,
    userId: number,
    dto: CancelBookingDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelers: true,
        schedule: true,
        payments: { where: { status: 'SUCCESS' }, take: 1 },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    // Rule B3: Only PENDING or PAID can be cancelled
    if (!['PENDING', 'PAID'].includes(booking.status)) {
      throw new BadRequestException('This booking cannot be cancelled');
    }

    // Calculate refund
    const preview = this.cancellation.calculateRefund(
      booking,
      booking.schedule,
    );

    // Rule C4: Late cancel requires explicit confirmation
    if (preview.requiresConfirmation && !dto.confirmNoRefund) {
      throw new BadRequestException(
        'Late cancellation requires confirmation. Set confirmNoRefund to true.',
      );
    }

    // Execute cancellation
    const now = new Date();

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelledAt: now,
        cancelReason: dto.reason || 'User cancelled',
      },
    });

    // Create refund record if there was a payment and refund > 0
    let refund = null;
    if (
      booking.status === 'PAID' &&
      preview.refundAmount > 0 &&
      booking.payments[0]
    ) {
      refund = await this.prisma.refund.create({
        data: {
          bookingId,
          paymentId: booking.payments[0].id,
          amount: preview.refundAmount,
          reason: dto.reason || `${preview.tier} cancellation`,
          status: 'PENDING',
        },
      });
    }

    // Release stock (I3, I4)
    await this.inventory.releaseStock(
      booking.scheduleId,
      booking.travelers.length,
    );

    this.logger.log(
      `Booking #${bookingId} cancelled (tier: ${preview.tier}, refund: ${preview.refundAmount})`,
    );

    return {
      bookingId,
      status: 'CANCELLED',
      cancellationPreview: preview,
      refund,
    };
  }

  // --- Admin methods ---

  /**
   * Get all bookings for admin with filters and stats.
   */
  async getAdminBookings(query: AdminBookingQueryDto) {
    const { search, status, tourId, dateFrom, dateTo, sort, page = 1, limit = 10 } = query;

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (tourId) where.schedule = { tourId };
    if (dateFrom || dateTo) {
      where.bookingDate = {};
      if (dateFrom) (where.bookingDate as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.bookingDate as Record<string, unknown>).lte = new Date(dateTo);
    }

    if (search) {
      where.OR = [
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { schedule: { tour: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const orderBy = this.getOrderBy(sort);

    const [bookings, total, stats] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
          travelers: true,
          schedule: { include: { tour: true } },
          payments: true,
        },
      }),
      this.prisma.booking.count({ where }),
      this.getAdminStats(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      bookings,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get admin booking detail (no ownership check).
   */
  async getAdminBookingDetail(bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: { select: { id: true, fullName: true, email: true, avatarUrl: true, phone: true } },
        travelers: true,
        schedule: { include: { tour: true } },
        payments: { orderBy: { createdAt: 'desc' } },
        refunds: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Admin update booking status (Rule C5: admin override).
   */
  async adminUpdateStatus(bookingId: number, dto: AdminUpdateStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelers: true,
        schedule: true,
        payments: { where: { status: 'SUCCESS' }, take: 1 },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updateData: Record<string, unknown> = { status: dto.status };

    if (dto.status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = dto.reason || 'Admin cancelled';

      // Release stock
      await this.inventory.releaseStock(
        booking.scheduleId,
        booking.travelers.length,
      );

      // Rule C5: Admin can force full refund
      if (dto.forceFullRefund && booking.payments[0]) {
        await this.prisma.refund.create({
          data: {
            bookingId,
            paymentId: booking.payments[0].id,
            amount: Number(booking.totalPrice),
            reason: dto.reason || 'Admin force full refund',
            status: 'PENDING',
          },
        });
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        travelers: true,
        schedule: { include: { tour: true } },
      },
    });

    this.logger.log(
      `Admin updated booking #${bookingId} status to ${dto.status}`,
    );

    return updated;
  }

  /**
   * Admin manual refund.
   */
  async adminCreateRefund(bookingId: number, dto: AdminRefundDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: { where: { status: 'SUCCESS' }, take: 1 } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!booking.payments[0]) {
      throw new BadRequestException('No successful payment found for this booking');
    }

    const refund = await this.prisma.refund.create({
      data: {
        bookingId,
        paymentId: booking.payments[0].id,
        amount: dto.amount,
        reason: dto.reason || 'Admin manual refund',
        status: dto.gatewayRefundId ? 'COMPLETED' : 'PENDING',
        gatewayRefundId: dto.gatewayRefundId,
        processedAt: dto.gatewayRefundId ? new Date() : undefined,
      },
    });

    this.logger.log(
      `Admin created refund #${refund.id} for booking #${bookingId} (amount: ${dto.amount})`,
    );

    return refund;
  }

  // --- Private helpers ---

  private getStatusFilter(tab?: string) {
    switch (tab) {
      case 'upcoming':
        return { status: { in: ['PENDING', 'PAID'] } };
      case 'completed':
        return {
          status: 'PAID',
          schedule: { startDate: { lt: new Date() } },
        };
      case 'cancelled':
        return { status: { in: ['CANCELLED', 'REFUNDED'] } };
      default:
        return {};
    }
  }

  private getOrderBy(sort?: string) {
    switch (sort) {
      case 'oldest':
        return { bookingDate: 'asc' as const };
      case 'price_high':
        return { totalPrice: 'desc' as const };
      case 'price_low':
        return { totalPrice: 'asc' as const };
      default:
        return { bookingDate: 'desc' as const };
    }
  }

  private formatBookingListItem(booking: {
    id: number;
    status: string;
    bookingDate: Date;
    totalPrice: unknown;
    travelers: unknown[];
    schedule: { id: number; startDate: Date; tour: { id: number; name: string; slug: string; coverImage: string | null; location: string | null; durationDays: number } };
  }) {
    const now = new Date();
    const canCancel = ['PENDING', 'PAID'].includes(booking.status);
    return {
      id: booking.id,
      status: booking.status,
      bookingDate: booking.bookingDate,
      totalPrice: Number(booking.totalPrice),
      travelerCount: booking.travelers.length,
      tour: {
        id: booking.schedule.tour.id,
        name: booking.schedule.tour.name,
        slug: booking.schedule.tour.slug,
        coverImage: booking.schedule.tour.coverImage,
        location: booking.schedule.tour.location,
        durationDays: booking.schedule.tour.durationDays,
      },
      schedule: {
        id: booking.schedule.id,
        startDate: booking.schedule.startDate,
      },
      canCancel,
      canModify: false, // v1 does not support modification
    };
  }

  private buildProcessingSteps(
    booking: { status: string },
    payment?: { status: string } | null,
  ) {
    const paymentDone = payment?.status === 'SUCCESS';
    const bookingPaid = booking.status === 'PAID';
    const failed = booking.status === 'CANCELLED' || payment?.status === 'FAILED';

    return [
      {
        id: 'payment',
        label: 'Payment Verified',
        status: failed
          ? 'failed'
          : paymentDone
            ? 'completed'
            : ('in_progress' as const),
      },
      {
        id: 'reservation',
        label: 'Spots Reserved',
        status: failed
          ? 'failed'
          : paymentDone
            ? 'completed'
            : ('pending' as const),
      },
      {
        id: 'confirmation',
        label: 'Booking Confirmed',
        status: failed
          ? 'failed'
          : bookingPaid
            ? 'completed'
            : ('pending' as const),
      },
    ];
  }

  private async getAdminStats() {
    const [totalBookings, activeBookings, totalRevenue] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: { in: ['PENDING', 'PAID'] } } }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalBookings,
      activeBookings,
      totalRevenue: Number(totalRevenue._sum.amount || 0),
    };
  }
}
