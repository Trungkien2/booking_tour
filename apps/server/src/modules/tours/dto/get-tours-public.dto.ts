import { IsOptional, IsInt, IsString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SortOption {
  POPULAR = 'popular',
  NEWEST = 'newest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING = 'rating',
}

export enum DifficultyFilter {
  EASY = 'easy',
  MODERATE = 'moderate',
  CHALLENGING = 'challenging',
}

export class GetToursPublicDto {
  @ApiProperty({ required: false, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, minimum: 1, maximum: 50, default: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 8;

  @ApiProperty({
    required: false,
    description: 'Search by name, location, or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    enum: SortOption,
    default: SortOption.POPULAR,
  })
  @IsOptional()
  @IsEnum(SortOption)
  sort?: SortOption = SortOption.POPULAR;

  @ApiProperty({ required: false, minimum: 0, description: 'Minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceMin?: number;

  @ApiProperty({ required: false, description: 'Maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceMax?: number;

  @ApiProperty({ required: false, enum: DifficultyFilter })
  @IsOptional()
  @IsEnum(DifficultyFilter)
  difficulty?: DifficultyFilter;

  @ApiProperty({ required: false, description: 'Filter by location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by duration range (e.g., "1-3", "4-7", "8+")',
  })
  @IsOptional()
  @IsString()
  duration?: string;
}
