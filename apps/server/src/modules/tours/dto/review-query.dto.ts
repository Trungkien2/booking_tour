import { IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 5;

  @ApiPropertyOptional({
    enum: ['recent', 'rating_desc', 'rating_asc'],
    default: 'recent',
  })
  @IsOptional()
  @IsIn(['recent', 'rating_desc', 'rating_asc'])
  sort?: 'recent' | 'rating_desc' | 'rating_asc' = 'recent';
}
