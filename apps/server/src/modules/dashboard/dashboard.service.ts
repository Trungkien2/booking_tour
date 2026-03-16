import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const [revenueResult, totalBookings, activeTours, totalUsers, recentBookings] =
      await Promise.all([
        this.prisma.payment.aggregate({
          where: { status: 'SUCCESS' },
          _sum: { amount: true },
        }),
        this.prisma.booking.count(),
        this.prisma.tour.count({
          where: { status: 'PUBLISHED', deletedAt: null },
        }),
        this.prisma.user.count({
          where: { deletedAt: null },
        }),
        this.prisma.booking.findMany({
          take: 5,
          orderBy: { bookingDate: 'desc' },
          select: {
            id: true,
            status: true,
            bookingDate: true,
            totalPrice: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
            schedule: {
              select: {
                startDate: true,
                tour: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
      ]);

    return {
      stats: {
        totalRevenue: Number(revenueResult._sum.amount || 0),
        totalBookings,
        activeTours,
        totalUsers,
      },
      recentBookings: recentBookings.map((b) => ({
        id: b.id,
        status: b.status,
        bookingDate: b.bookingDate,
        totalPrice: Number(b.totalPrice),
        user: b.user,
        schedule: b.schedule,
      })),
    };
  }
}
