import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: Implement user validation logic
    // 1. Find user by email from database
    // 2. Compare password using bcrypt
    // 3. Return user if valid, throw UnauthorizedException if not
    throw new Error('Not implemented');
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // TODO: Implement login logic
    // 1. Validate user credentials
    // 2. Generate JWT access token
    // 3. Generate JWT refresh token
    // 4. Return tokens and user info
    throw new Error('Not implemented');
  }

  async validateOAuthLogin(socialLoginDto: SocialLoginDto): Promise<LoginResponseDto> {
    // TODO: Implement OAuth login logic
    // 1. Verify idToken with provider
    // 2. Extract user profile
    // 3. Find or create user (JIT provisioning)
    // 4. Generate JWT tokens
    // 5. Return tokens and user info
    throw new Error('Not implemented');
  }

  private generateAccessToken(userId: number, email: string, role: string): string {
    // TODO: Implement access token generation
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(userId: number): string {
    // TODO: Implement refresh token generation
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
