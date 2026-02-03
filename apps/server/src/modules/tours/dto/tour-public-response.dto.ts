import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TourItemDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty({ required: false })
  @Expose()
  summary?: string;

  @ApiProperty({ required: false })
  @Expose()
  coverImage?: string;

  @ApiProperty()
  @Expose()
  durationDays: number;

  @ApiProperty()
  @Expose()
  priceAdult: number;

  @ApiProperty()
  @Expose()
  priceChild: number;

  @ApiProperty({ required: false })
  @Expose()
  location?: string;

  @ApiProperty()
  @Expose()
  ratingAverage: number;

  @ApiProperty()
  @Expose()
  reviewCount: number;

  @ApiProperty({ required: false, enum: ['easy', 'moderate', 'challenging'] })
  @Expose()
  difficulty?: string;

  @ApiProperty()
  @Expose()
  featured: boolean;

  @ApiProperty({ required: false, description: 'Next available tour date' })
  @Expose()
  nextAvailableDate?: string;
}

export class PaginationDto {
  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  limit: number;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  totalPages: number;

  @ApiProperty()
  @Expose()
  hasNext: boolean;

  @ApiProperty()
  @Expose()
  hasPrev: boolean;
}

export class ToursPublicResponseDto {
  @ApiProperty({ type: [TourItemDto] })
  @Expose()
  tours: TourItemDto[];

  @ApiProperty({ type: PaginationDto })
  @Expose()
  pagination: PaginationDto;
}
