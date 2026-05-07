import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}


  async registerStaff(data: any) {
    const {
      email,
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

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          role,
          isActive: false,
        },
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


  async approveStaffAccess(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isActive: true,
      },
    });
  }


  async getAllStaff() {
    return this.prisma.staffProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
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
      include: { user: true },
    });
  }


  async toggleStaffStatus(userId: string, status: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: status },
    });
  }
}
