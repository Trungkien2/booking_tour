import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { CheckEmailResponseDto } from './dto/check-email.dto';

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
      throw new UnauthorizedException('Password is incorrect');
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
    const accessToken = this.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );
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

  async validateOAuthLogin(
    socialLoginDto: SocialLoginDto,
  ): Promise<LoginResponseDto> {
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
  private generateAccessToken(
    userId: number,
    email: string,
    role: string,
  ): string {
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

  /**
   * Registers a new user account.
   * @param registerDto - Registration data (fullName, email, password, phone?, country?)
   * @returns RegisterResponseDto with user info and success message
   * @throws ConflictException if email already exists
   */
  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { email, password, fullName, phone } = registerDto;

    // Check if email already exists (case-insensitive)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        fullName: fullName.trim(),
        phone: phone?.trim(),
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName ?? '',
        phone: user.phone ?? undefined,
        role: user.role,
        createdAt: user.createdAt,
      },
      message: 'Account created successfully. Please log in.',
    };
  }

  /**
   * Checks if an email address is available for registration.
   * @param email - Email address to check
   * @returns CheckEmailResponseDto with availability status
   */
  async checkEmailAvailability(email: string): Promise<CheckEmailResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      return {
        available: false,
        message: 'This email is already registered',
      };
    }

    return { available: true };
  }
}
