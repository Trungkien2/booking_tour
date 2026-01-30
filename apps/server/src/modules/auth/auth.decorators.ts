import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { RegisterDto } from './dto/register.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/** Throttle: 5 requests / 60s (login, register) */
export const THROTTLE_AUTH = { default: { limit: 5, ttl: 60 } };

/** Throttle: 10 requests / 60s (check-email) */
export const THROTTLE_CHECK_EMAIL = { default: { limit: 10, ttl: 60 } };

/** Swagger: 200 OK với LoginResponseDto */
const ApiLoginSuccessResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  });

/** Decorators chung cho POST /auth/login */
export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login with email and password' }),
    ApiBody({
      type: LoginDto,
      examples: {
        default: {
          summary: 'Đăng nhập với email và mật khẩu',
          value: { email: 'user@example.com', password: 'Password123' },
        },
      },
    }),
    ApiLoginSuccessResponse(),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
    ApiResponse({
      status: 429,
      description: 'Too many requests (rate limited)',
    }),
  );
}

/** Decorators chung cho POST /auth/google hoặc /auth/apple */
export function ApiSocialLogin(provider: 'google' | 'apple') {
  const summaries = {
    google: 'Đăng nhập với Google',
    apple: 'Đăng nhập với Apple',
  };
  const idTokenExamples = {
    google: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    apple: 'eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ...',
  };
  return applyDecorators(
    ApiOperation({
      summary: `Login with ${provider === 'google' ? 'Google' : 'Apple'} OAuth`,
    }),
    ApiBody({
      type: SocialLoginDto,
      examples: {
        default: {
          summary: summaries[provider],
          value: { idToken: idTokenExamples[provider], provider },
        },
      },
    }),
    ApiLoginSuccessResponse(),
  );
}

/** Decorators chung cho POST /auth/register */
export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user account' }),
    ApiBody({
      type: RegisterDto,
      examples: {
        minimal: {
          summary: 'Chỉ bắt buộc (fullName, email, password)',
          value: {
            fullName: 'Nguyễn Văn A',
            email: 'user@example.com',
            password: 'Password123',
          },
        },
        full: {
          summary: 'Đầy đủ (có phone, country)',
          value: {
            fullName: 'Nguyễn Văn A',
            email: 'user@example.com',
            password: 'Password123',
            phone: '+84123456789',
            country: 'Vietnam',
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'User registered successfully' }),
    ApiResponse({
      status: 429,
      description: 'Too many requests (rate limited)',
    }),
  );
}
