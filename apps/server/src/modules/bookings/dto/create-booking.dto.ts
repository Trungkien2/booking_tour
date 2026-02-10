import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TravelerDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the traveler' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: 'male', description: 'Gender of the traveler' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ enum: ['ADULT', 'CHILD', 'BABY'], example: 'ADULT' })
  @IsEnum(['ADULT', 'CHILD', 'BABY'])
  ageGroup: 'ADULT' | 'CHILD' | 'BABY';
}

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'Tour schedule ID to book' })
  @IsInt()
  scheduleId: number;

  @ApiProperty({ type: [TravelerDto], description: 'List of travelers (min 1 adult required)' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TravelerDto)
  travelers: TravelerDto[];

  @ApiPropertyOptional({ example: 'Window seat preferred', description: 'Optional booking note' })
  @IsOptional()
  @IsString()
  note?: string;
}
