import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for protecting refresh token endpoint.
 * Uses the 'jwt-refresh' strategy to validate refresh tokens.
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
