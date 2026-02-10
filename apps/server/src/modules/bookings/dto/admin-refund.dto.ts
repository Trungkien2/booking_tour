import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminRefundDto {
  @ApiProperty({ example: 150.00, minimum: 0.01, description: 'Refund amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ example: 'Goodwill refund', description: 'Reason for refund' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 're_xxx', description: 'Payment gateway refund ID' })
  @IsOptional()
  @IsString()
  gatewayRefundId?: string;
}
