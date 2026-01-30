import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for querying tours list (pagination, filter, search).
 */
export class TourQueryDto {
  @ApiPropertyOptional({
    example: 'Hạ Long',
    description: 'Tìm theo tên tour hoặc địa điểm',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    description: 'Lọc theo trạng thái',
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    default: 1,
    description: 'Trang hiện tại',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    default: 10,
    description: 'Số bản ghi mỗi trang',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt:desc',
    description: 'Sắp xếp (field:asc hoặc field:desc), ví dụ name:asc, createdAt:desc',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
