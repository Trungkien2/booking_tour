import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDecimal,
  IsOptional,
  IsEnum,
  Min,
  IsArray,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new tour.
 */
export class CreateTourDto {
  @ApiProperty({
    example: 'Hạ Long Bay 2D1N',
    description: 'Tên tour',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Cruise on emerald waters, visit caves.',
    description: 'Tóm tắt ngắn',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    example: 'Explore the UNESCO World Heritage Site...',
    description: 'Mô tả chi tiết (HTML/text)',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/cover.jpg',
    description: 'URL ảnh bìa',
  })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
    description: 'Mảng URL ảnh gallery',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({
    example: 2,
    minimum: 1,
    description: 'Số ngày tour',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays: number;

  @ApiProperty({
    example: 199.99,
    description: 'Giá người lớn',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsDecimal()
  priceAdult: number;

  @ApiProperty({
    example: 99.99,
    description: 'Giá trẻ em',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsDecimal()
  priceChild: number;

  @ApiPropertyOptional({
    example: 'Quảng Ninh, Vietnam',
    description: 'Địa điểm',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT',
    description: 'Trạng thái tour',
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
