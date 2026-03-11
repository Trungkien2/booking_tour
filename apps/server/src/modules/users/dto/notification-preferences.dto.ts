import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationPreferencesDto {
  @ApiPropertyOptional({ description: 'Booking confirmation emails' })
  @IsOptional()
  @IsBoolean()
  bookingConfirmations?: boolean;

  @ApiPropertyOptional({ description: 'Tour update emails' })
  @IsOptional()
  @IsBoolean()
  tourUpdates?: boolean;

  @ApiPropertyOptional({ description: 'Promotional emails' })
  @IsOptional()
  @IsBoolean()
  promotions?: boolean;

  @ApiPropertyOptional({ description: 'Trip reminder emails' })
  @IsOptional()
  @IsBoolean()
  tripReminders?: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferencesDto = {
  bookingConfirmations: true,
  tourUpdates: true,
  promotions: true,
  tripReminders: true,
};
