import { Injectable, BadRequestException } from '@nestjs/common';
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

  // 1. සාමාන්‍ය Register (Admin/Super Admin සඳහා)
  async register(email: string, password: string, role: Role) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
  }

  // 2. Staff Member කෙනෙක් Profile එකත් එක්කම Register කිරීම
  async registerStaff(data: any) {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      designation,
    } = data;

    // Email එක කලින් තියෙනවද බලමු
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Transaction එකක් ඇතුළේ දෙකම කරමු
    return this.prisma.$transaction(async (tx) => {
      // Step A: User Account එක හදනවා
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role, // STAFF හෝ RECEPTIONIST
        },
      });

      // Step B: Staff Profile එක හදනවා (User ID එක පාවිච්චි කරලා)
      const profile = await tx.staffProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone,
          address1,
          address2,
          city,
          designation,
        },
      });

      return { user, profile };
    });
  }

  // 3. Login Validation
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { staffProfile: true, doctorProfile: true }, // Profile එකත් එක්කම ගන්නවා
    });

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 4. JWT Token එක Generate කිරීම
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

  // auth.service.ts ඇතුළත මේක දාන්න
  async getAllStaff() {
    return this.prisma.staffProfile.findMany({
      include: {
        user: true,
      },
    });
  }

  async updateStaff(id: string, data: any) {
    return this.prisma.staffProfile.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        city: data.city,
        address1: data.address1,
        address2: data.address2,
        designation: data.designation,
      },
    });
  }
}
