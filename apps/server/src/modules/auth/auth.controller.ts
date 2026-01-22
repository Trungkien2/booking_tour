import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() socialLoginDto: SocialLoginDto) {
    // TODO: Implement Google login logic
    return this.authService.validateOAuthLogin(socialLoginDto);
  }

  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async appleLogin(@Body() socialLoginDto: SocialLoginDto) {
    // TODO: Implement Apple login logic
    return this.authService.validateOAuthLogin(socialLoginDto);
  }

  /**
   * Register a new user account.
   * Rate limited to 5 requests per minute.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Check if an email address is available for registration.
   * Rate limited to 10 requests per minute.
   */
  @Get('check-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60 } })
  async checkEmail(@Query() checkEmailDto: CheckEmailDto) {
    return this.authService.checkEmailAvailability(checkEmailDto.email);
  }
}
