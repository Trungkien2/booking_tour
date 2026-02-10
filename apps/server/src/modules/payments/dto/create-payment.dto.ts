import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiPropertyOptional({ enum: ['stripe', 'paypal'], default: 'stripe', description: 'Payment provider' })
  @IsOptional()
  @IsEnum(['stripe', 'paypal'])
  provider?: string = 'stripe';

  @ApiProperty({ example: 'http://localhost:3000/bookings/processing?booking_id=1', description: 'URL to redirect after payment' })
  @IsString()
  returnUrl: string;
}
