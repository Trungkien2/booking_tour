import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TourResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Hạ Long Bay 2D1N' })
  name: string;

  @ApiProperty({ example: 'ha-long-bay-2d1n' })
  slug: string;

  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  coverImage?: string;

  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @ApiProperty({ example: 2 })
  durationDays: number;

  @ApiProperty({ example: 199.99 })
  priceAdult: number;

  @ApiProperty({ example: 99.99 })
  priceChild: number;

  @ApiPropertyOptional({ example: 'Quảng Ninh, Vietnam' })
  location?: string;

  @ApiProperty({ enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] })
  status: string;

  @ApiProperty({ example: 4.5 })
  ratingAverage: number;

  @ApiProperty({ example: 35, description: 'Tổng slots từ tất cả lịch' })
  totalSlots: number;

  @ApiProperty({ example: 8, description: 'Slots đã đặt' })
  bookedSlots: number;

  @ApiProperty({ example: 27, description: 'Slots còn trống' })
  availableSlots: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TourListMetaDto {
  @ApiProperty({ example: 45 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class TourListResponseDto {
  @ApiProperty({ type: [TourResponseDto] })
  data: TourResponseDto[];

  @ApiProperty({ type: TourListMetaDto })
  meta: TourListMetaDto;
}

export class TourStatisticsDto {
  @ApiProperty({ example: 45, description: 'Tổng số tour' })
  total: number;

  @ApiProperty({ example: 32, description: 'Tour đang published' })
  active: number;

  @ApiProperty({ example: 8, description: 'Tour nháp' })
  drafts: number;

  @ApiProperty({ example: 5, description: 'Tour đã hết chỗ' })
  fullyBooked: number;
}
