import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({ description: 'OAuth ID token from provider', example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  idToken: string;

  @ApiProperty({ description: 'OAuth provider', enum: ['google', 'apple'], example: 'google' })
  @IsString()
  @IsIn(['google', 'apple'])
  provider: 'google' | 'apple';
}
