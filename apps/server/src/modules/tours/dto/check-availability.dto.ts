import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckAvailabilityDto {
  @ApiProperty({ minimum: 1, maximum: 20 })
  @IsInt()
  @Min(1)
  @Max(20)
  adults: number;

  @ApiProperty({ minimum: 0, maximum: 20 })
  @IsInt()
  @Min(0)
  @Max(20)
  children: number;
}
