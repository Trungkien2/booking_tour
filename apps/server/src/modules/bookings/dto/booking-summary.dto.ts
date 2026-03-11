import { ApiProperty } from '@nestjs/swagger';

/**
 * Summary of a booking for list/card display (GET /bookings/me).
 */
export class BookingSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'] })
  status: string;

  @ApiProperty()
  bookingDate: Date;

  @ApiProperty({ example: 299.99 })
  totalPrice: number;

  @ApiProperty({ example: 2 })
  travelerCount: number;

  @ApiProperty({
    example: {
      id: 1,
      name: 'Ha Long Bay 2D1N',
      slug: 'ha-long-bay-2d1n',
      coverImage: '/uploads/cover.jpg',
      location: 'Quảng Ninh',
      durationDays: 2,
    },
  })
  tour: {
    id: number;
    name: string;
    slug: string;
    coverImage: string | null;
    location: string | null;
    durationDays: number;
  };

  @ApiProperty({
    example: { id: 1, startDate: '2025-06-01T00:00:00.000Z' },
  })
  schedule: {
    id: number;
    startDate: Date;
  };

  @ApiProperty({ example: true })
  canCancel: boolean;

  @ApiProperty({ example: false })
  canModify: boolean;
}
