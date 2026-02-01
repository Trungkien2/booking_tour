import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { RegisterDto } from './dto/register.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import {
  ApiLogin,
  ApiRegister,
  ApiSocialLogin,
  ApiRefreshToken,
  THROTTLE_AUTH,
  THROTTLE_CHECK_EMAIL,
} from './auth.decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle(THROTTLE_AUTH)
  @ApiLogin()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiSocialLogin('google')
  async googleLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.validateOAuthLogin(socialLoginDto);
  }

  @Post('apple')
  @HttpCode(HttpStatus.OK)
  @ApiSocialLogin('apple')
  async appleLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.validateOAuthLogin(socialLoginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle(THROTTLE_AUTH)
  @ApiRegister()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('check-email')
  @HttpCode(HttpStatus.OK)
  @Throttle(THROTTLE_CHECK_EMAIL)
  @ApiOperation({ summary: 'Check if email is available for registration' })
  @ApiResponse({ status: 200, description: 'Email availability result' })
  async checkEmail(@Query() checkEmailDto: CheckEmailDto) {
    return this.authService.checkEmailAvailability(checkEmailDto.email);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Throttle(THROTTLE_AUTH)
  @ApiRefreshToken()
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.authService.refreshToken(req.user.userId);
  }
}
