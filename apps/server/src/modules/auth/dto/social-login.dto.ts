import { IsString, IsIn } from 'class-validator';

export class SocialLoginDto {
  @IsString()
  idToken: string;

  @IsString()
  @IsIn(['google', 'apple'])
  provider: 'google' | 'apple';
}
