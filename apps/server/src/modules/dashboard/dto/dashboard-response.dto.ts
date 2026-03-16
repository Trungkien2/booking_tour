import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ example: 12450 })
  totalRevenue: number;

  @ApiProperty({ example: 1240 })
  totalBookings: number;

  @ApiProperty({ example: 42 })
  activeTours: number;

  @ApiProperty({ example: 85 })
  totalUsers: number;
}

export class DashboardRecentBookingDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'] })
  status: string;

  @ApiProperty()
  bookingDate: Date;

  @ApiProperty({ example: 150.0 })
  totalPrice: number;

  @ApiProperty()
  user: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };

  @ApiProperty()
  schedule: {
    startDate: Date;
    tour: {
      id: number;
      name: string;
    };
  };
}

export class DashboardResponseDto {
  @ApiProperty({ type: DashboardStatsDto })
  stats: DashboardStatsDto;

  @ApiProperty({ type: [DashboardRecentBookingDto] })
  recentBookings: DashboardRecentBookingDto[];
}
