import {
  IsDateString,
  IsInt,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Start date must be today or later';
  }
}

export class ScheduleItemDto {
  @ApiProperty({
    example: '2026-04-01',
    description: 'Ngày khởi hành (ISO date string, phải >= hôm nay)',
  })
  @IsDateString()
  @Validate(IsFutureDateConstraint)
  startDate: string;

  @ApiProperty({
    example: 20,
    minimum: 1,
    description: 'Số chỗ tối đa',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Max capacity must be at least 1' })
  maxCapacity: number;
}
