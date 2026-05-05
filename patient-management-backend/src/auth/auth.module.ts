import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver'; // Meka provider ekak widihata thiyenna ona
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // Meka import karanna

@Module({
  imports: [
    PrismaModule,
    // src/auth/auth.module.ts
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'MY_SECRET_KEY_123', // .env එකේ නැති වුණොත් විතරයි අනිත් එක ගන්නේ
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  // controllers: [AuthController] // (Oyalage controller ekak thiyenawa nam meka athi)
})
export class AuthModule {}
