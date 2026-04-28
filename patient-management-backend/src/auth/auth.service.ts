import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // Meka import karanna

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,

  ) {}

  // 1. User Register Function
  async register(
    email: string,
    password: string,
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT',
  ) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
  }

  // 2. Login Logic
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Wenas kala: 'user.password' kiyala check ekak damma bcrypt ekata yanna kalin
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }
}
