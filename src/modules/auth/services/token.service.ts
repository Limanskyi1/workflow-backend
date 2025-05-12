import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH,
    });
  }
}
