import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Header eken "Bearer <token>" widihata ena kalla ganna
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. AuthModule eke dapu key ekama wenna ona
      secretOrKey: 'MY_SECRET_KEY_123',
    });
  }

  // 3. Claims tika extract karaganna kalla (Verification)
  async validate(payload: any) {
    // Meka run wenakota NestJS request ekata me details tika add karanawa
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}