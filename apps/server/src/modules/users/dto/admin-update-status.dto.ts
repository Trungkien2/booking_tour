import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

/**
 * DTO for admin activating/deactivating a user.
 */
export class AdminUpdateStatusDto {
  @ApiProperty({ description: 'Whether the user is active' })
  @IsBoolean()
  active: boolean;
}
