import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN', 'GUIDE'] })
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;
  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;
  @ApiProperty({ type: LoginUserDto })
  user: LoginUserDto;
}
