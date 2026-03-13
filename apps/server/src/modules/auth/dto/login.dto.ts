import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@bookingtour.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    minLength: 6,
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
