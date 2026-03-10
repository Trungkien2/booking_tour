import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for admin user list query (search, filters, pagination, sort).
 */
export class AdminUserQueryDto {
  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Search by name or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ['USER', 'ADMIN', 'GUIDE'],
    description: 'Filter by role',
  })
  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'GUIDE'])
  role?: 'USER' | 'ADMIN' | 'GUIDE';

  @ApiPropertyOptional({
    enum: ['active', 'inactive', 'pending'],
    description: 'Filter by status (active = active true, inactive = active false, pending = emailVerified false)',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'pending'])
  status?: 'active' | 'inactive' | 'pending';

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'created_desc',
    enum: ['created_desc', 'created_asc', 'name_asc'],
    description: 'Sort order',
  })
  @IsOptional()
  @IsEnum(['created_desc', 'created_asc', 'name_asc'])
  sort?: 'created_desc' | 'created_asc' | 'name_asc' = 'created_desc';
}
