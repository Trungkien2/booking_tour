import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * DTO for admin creating (inviting) a new user.
 */
export class AdminCreateUserDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    enum: ['USER', 'ADMIN', 'GUIDE'],
    default: 'USER',
    description: 'Role to assign',
  })
  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'GUIDE'])
  role?: 'USER' | 'ADMIN' | 'GUIDE' = 'USER';

  @ApiPropertyOptional({
    default: true,
    description: 'Whether to send invitation email',
  })
  @IsOptional()
  sendInvite?: boolean = true;
}
