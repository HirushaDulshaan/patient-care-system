import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 1. මූලික ලියාපදිංචිය (Admin/Super Admin සඳහා)
   * අනෙකුත් profiles (Doctor/Staff) රෙජිස්ටර් වෙන්නේ ඒවාට අදාළ වෙනමම services හරහාය.
   */
  async register(email: string, password: string, role: Role) {
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

  /**
   * 2. Login විස්තර පරීක්ෂා කිරීම
   * මෙහිදී User ගේ Role එකට අදාළ Profile එකත් (Staff/Doctor) එකවර ලබා ගනී.
   */
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        staffProfile: true,
        doctorProfile: true,
      },
    });

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * 3. JWT Token එකක් නිකුත් කිරීම
   * සාර්ථක Login එකකින් පසු access_token එක සාදයි.
   */
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
