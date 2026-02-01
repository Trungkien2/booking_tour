import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

/**
 * JWT Refresh Token Strategy
 *
 * This strategy validates refresh tokens using a separate secret key
 * for enhanced security (different from access token secret).
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_REFRESH_SECRET ||
        process.env.JWT_SECRET ||
        'your-refresh-secret-key',
      passReqToCallback: true,
    });
  }

  /**
   * Validate refresh token payload
   * @param req - Express request object (contains the refresh token in body)
   * @param payload - Decoded JWT payload
   * @returns User data to attach to request
   */
  async validate(req: Request, payload: { sub: number }) {
    const refreshToken = req.body?.refreshToken;
    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
