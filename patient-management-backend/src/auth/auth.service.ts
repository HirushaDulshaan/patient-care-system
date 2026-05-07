
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async register(email: string, password: string, role: Role) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        isActive: true,
      },
    });
  }

  async validateUser(email: string, pass: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        staffProfile: true,
        doctorProfile: true,
      },
    });

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(pass, user.password))
    ) {
      await this.auditService.createLog({
        userEmail: email,
        action: 'LOGIN_ATTEMPT',
        type: 'CRITICAL',
        target: 'Auth System',
        status: 'Failed',
        ipAddress: ipAddress ?? 'Unknown',
      });
      return null;
    }

    if (!user.isActive) {
      await this.auditService.createLog({
        userEmail: email,
        action: 'LOGIN_BLOCKED',
        type: 'CRITICAL',
        target: 'Auth System',
        status: 'Failed',
        ipAddress: ipAddress ?? 'Unknown',
      });
      throw new UnauthorizedException(
        'Not Approved by administrator',
      );
    }

    // Success
    await this.auditService.createLog({
      userEmail: email,
      action: 'LOGIN',
      type: 'INFO',
      target: 'Auth System',
      status: 'Success',
      ipAddress: ipAddress ?? 'Unknown',
    });

    const { password, ...result } = user;
    return result;
  }

  async login(user: any, ipAddress?: string) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    await this.auditService.createLog({
      userEmail: user.email,
      action: 'SESSION_CREATED',
      type: 'INFO',
      target: `Role: ${user.role}`,
      status: 'Success',
      ipAddress: ipAddress ?? 'Unknown',
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async logout(userEmail: string, ipAddress?: string) {
    await this.auditService.createLog({
      userEmail,
      action: 'LOGOUT',
      type: 'INFO',
      target: 'Auth System',
      status: 'Success',
      ipAddress: ipAddress ?? 'Unknown',
    });
    return true;
  }
}
