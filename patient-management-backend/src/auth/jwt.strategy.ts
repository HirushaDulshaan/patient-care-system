import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'MY_SECRET_KEY_123',
    });
  }

  // 3. Claims tika extract karaganna kalla (Verification)
  async validate(payload: any) {
    // Meka run wenakota NestJS request ekata me details tika add karanawa
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}