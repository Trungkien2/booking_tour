import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials by checking email and comparing password with bcrypt.
   * @param email - User email address
   * @param password - Plain text password
   * @returns User object without password if valid, throws UnauthorizedException if invalid
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        fullName: true,
      },
    });

    // If user not found, throw UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Handles user login by validating credentials and generating JWT tokens.
   * @param loginDto - Login credentials (email and password)
   * @returns LoginResponseDto containing access token, refresh token, and user info
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Validate user credentials
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Generate JWT tokens
    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Return tokens and user info
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
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

  /**
   * Generates JWT access token with user information.
   * @param userId - User ID
   * @param email - User email
   * @param role - User role
   * @returns JWT access token string
   */
  private generateAccessToken(userId: number, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  /**
   * Generates JWT refresh token for token renewal.
   * @param userId - User ID
   * @returns JWT refresh token string (expires in 7 days)
   */
  private generateRefreshToken(userId: number): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
