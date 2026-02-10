import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminUpdateStatusDto {
  @ApiProperty({ enum: ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'], example: 'CANCELLED', description: 'New booking status' })
  @IsEnum(['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'])
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';

  @ApiPropertyOptional({ example: 'Customer requested', description: 'Reason for status change' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: true, description: 'Force 100% refund regardless of cancellation policy' })
  @IsOptional()
  @IsBoolean()
  forceFullRefund?: boolean;
}
