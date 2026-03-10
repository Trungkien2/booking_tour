import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

/**
 * DTO for admin changing a user's role.
 */
export class AdminUpdateRoleDto {
  @ApiProperty({ enum: ['USER', 'ADMIN', 'GUIDE'] })
  @IsEnum(['USER', 'ADMIN', 'GUIDE'])
  role: 'USER' | 'ADMIN' | 'GUIDE';
}
