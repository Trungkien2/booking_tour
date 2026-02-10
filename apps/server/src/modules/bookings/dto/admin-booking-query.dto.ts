import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdminBookingQueryDto {
  @ApiPropertyOptional({ example: 'john', description: 'Search by customer name or tour name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'], description: 'Filter by booking status' })
  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'])
  status?: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';

  @ApiPropertyOptional({ example: 1, description: 'Filter by tour ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tourId?: number;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Filter from date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Filter to date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiPropertyOptional({ enum: ['newest', 'oldest', 'price_high', 'price_low'], description: 'Sort order' })
  @IsOptional()
  @IsEnum(['newest', 'oldest', 'price_high', 'price_low'])
  sort?: 'newest' | 'oldest' | 'price_high' | 'price_low';

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, description: 'Items per page (max 50)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
