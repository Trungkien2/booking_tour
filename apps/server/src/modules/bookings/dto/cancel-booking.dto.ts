import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiPropertyOptional({ example: 'Change of plans', description: 'Reason for cancellation' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: true, description: 'Required for late cancellations with 0% refund' })
  @IsOptional()
  @IsBoolean()
  confirmNoRefund?: boolean;
}
