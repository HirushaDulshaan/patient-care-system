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

  /**
   * 1. Staff Member කෙනෙක් Register කිරීම (Admin විසින් සිදු කරයි)
   * මෙහිදී password එකක් ලබා නොගන්නා අතර isActive: false ලෙස සකසයි.
   */
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

    // Email එක දැනටමත් පද්ධතියේ තිබේදැයි පරීක්ෂාව
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('Email already registered');
    }

    return this.prisma.$transaction(async (tx) => {
      // User record එක සෑදීම (Password රහිතව සහ isActive: false ලෙස)
      const user = await tx.user.create({
        data: {
          email,
          role,
          isActive: false, // ✅ Super Admin approve කරන තෙක් login විය නොහැක
        },
      });

      // Staff Profile එක සෑදීම
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

  /**
   * 2. Staff Access Approve කිරීම (Super Admin විසින් සිදු කරයි)
   * මෙහිදී තාවකාලික Password එකක් ලබා දී isActive: true කරනු ලැබේ.
   */
  async approveStaffAccess(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Password එක Hash කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isActive: true, // ✅ දැන් පද්ධතියට ලොග් විය හැක
      },
    });
  }

  /**
   * 3. සියලුම Staff Members ලා ලබා ගැනීම
   */
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

  /**
   * 4. Staff විස්තර Update කිරීම
   */
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

  /**
   * 5. Staff කෙනෙකුගේ Access තාවකාලිකව නැවැත්වීම (Block Access)
   */
  async toggleStaffStatus(userId: string, status: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: status },
    });
  }
}
