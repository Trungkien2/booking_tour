import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Full booking detail for GET /bookings/:id.
 */
export class BookingDetailDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  scheduleId: number;

  @ApiProperty()
  bookingDate: Date;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ enum: ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'] })
  status: string;

  @ApiPropertyOptional()
  note: string | null;

  @ApiPropertyOptional()
  cancelledAt: Date | null;

  @ApiPropertyOptional()
  cancelReason: string | null;

  @ApiProperty({ type: [Object], description: 'Travelers with price snapshot' })
  travelers: Array<{
    id: number;
    fullName: string;
    gender: string | null;
    ageGroup: string;
    price: number;
  }>;

  @ApiProperty({ description: 'Schedule and tour info' })
  schedule: {
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;
    tour: {
      id: number;
      name: string;
      slug: string;
      coverImage: string | null;
      location: string | null;
      durationDays: number;
    };
  };

  @ApiPropertyOptional({ type: [Object], description: 'Payments (latest first)' })
  payments?: Array<{
    id: number;
    amount: number;
    status: string;
    createdAt: Date;
  }>;

  @ApiPropertyOptional({ type: [Object], description: 'Refunds (latest first)' })
  refunds?: Array<{
    id: number;
    amount: number;
    reason: string | null;
    status: string;
    createdAt: Date;
  }>;

  @ApiPropertyOptional({ description: 'Refund preview when booking is cancellable' })
  cancellationPreview?: {
    tier: string;
    refundAmount: number;
    requiresConfirmation: boolean;
  } | null;
}
