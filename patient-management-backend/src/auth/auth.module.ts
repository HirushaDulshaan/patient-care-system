import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver'; // Meka provider ekak widihata thiyenna ona
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // Meka import karanna

@Module({
  imports: [PrismaModule,
  JwtModule.register({
    secret: 'MY_SECREAT_123', // Meka environment variable ekak widihata thiyenna ona123
    signOptions: { expiresIn: '1h' },
  }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  // controllers: [AuthController] // (Oyalage controller ekak thiyenawa nam meka athi)
})
export class AuthModule {}
