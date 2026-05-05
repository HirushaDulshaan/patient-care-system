import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  // Staff Member කෙනෙක් Register කිරීම
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

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password: hashedPassword, role },
      });

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

  // සියලුම Staff Members ලා ලබා ගැනීම
  async getAllStaff() {
    return this.prisma.staffProfile.findMany({
      include: { user: true },
    });
  }

  // Staff විස්තර Update කිරීම
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
