import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async registerDoctor(data: any) {
    const {
      email,
      firstName,
      lastName,
      phone,
      categoryId,
      licenseNumber,
      address1,
      address2,
      city,
      education,
      university,
      workingHospital,
    } = data;

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new BadRequestException('Email already in use');

    return this.prisma.$transaction(async (tx) => {
      // 1. User සාදන්නේ Password නැතිව සහ isActive: false ලෙසයි
      const user = await tx.user.create({
        data: {
          email,
          role: 'DOCTOR',
          isActive: false, // ✅ Super Admin අනුමත කරන තෙක් Log විය නොහැක
        },
      });

      return tx.doctor.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone,
          categoryId,
          licenseNumber,
          address1,
          address2,
          city,
          education,
          university,
          workingHospital,
        },
        include: { user: true, category: true },
      });
    });
  }

  // ✅ Super Admin විසින් Access ලබා දීම සඳහා නව ෆන්ක්ෂන් එක
  async approveDoctorAccess(userId: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isActive: true, // ✅ දැන් දොස්තරට පද්ධතියට ලොග් විය හැක
      },
    });
  }

  async getAllDoctors() {
    const doctors = await this.prisma.doctor.findMany({
      include: {
        user: true,
        category: true,
        schedules: true,
        appointments: { select: { scheduledAt: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      schedules: doctor.schedules.map((schedule) => {
        const bookedCount = doctor.appointments.filter(
          (app) =>
            new Date(app.scheduledAt).toDateString() ===
              new Date(schedule.workingDate).toDateString() &&
            app.status !== 'CANCELLED',
        ).length;

        return {
          ...schedule,
          bookedCount,
          remainingSeats: schedule.maxPatients - bookedCount,
        };
      }),
    }));
  }

  async updateDoctor(id: string, updateData: any) {
    const { email, user, category, ...validData } = updateData;
    await this.prisma.doctor.update({ where: { id }, data: validData });
    return true;
  }
}