import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BookingQueryDto {
  @ApiPropertyOptional({ enum: ['upcoming', 'completed', 'cancelled'], description: 'Filter by tab' })
  @IsOptional()
  @IsEnum(['upcoming', 'completed', 'cancelled'])
  tab?: 'upcoming' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ example: 'Ha Long', description: 'Search by tour name' })
  @IsOptional()
  @IsString()
  search?: string;

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
