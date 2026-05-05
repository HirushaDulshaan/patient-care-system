import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async registerDoctor(data: any) {
    const {
      email,
      password,
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

    // 1. Email එක දැනටමත් තියෙනවද බලමු
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new BadRequestException('Email already in use');

    // 2. Password Hash කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Doctor@123', salt);

    return this.prisma.$transaction(async (tx) => {
      // 3. User හදමු
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'DOCTOR',
        },
      });

      // 4. Doctor Profile හදමු (specialization එක schema එකේ නැති නිසා අයින් කළා)
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
        include: {
          user: true,
          category: true,
        },
      });
    });
  }

  // doctor.service.ts

  async getAllDoctors() {
    const doctors = await this.prisma.doctor.findMany({
      include: {
        user: true,
        category: true,
        schedules: true,
        // මෙතනදී අපි appointments ගන්නවා හැබැයි ඒක efficient මදි වෙන්න පුළුවන්
        // ඒ නිසා අපි loop එකකදී count එක ගමු
        appointments: {
          select: {
            scheduledAt: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // දැන් අපි එක් එක් schedule එකට අදාළව 'remainingSeats' ගණනය කරලා එවමු
    return doctors.map((doctor) => ({
      ...doctor,
      schedules: doctor.schedules.map((schedule) => {
        // මේ schedule එකේ දවසේ තියෙන 'PENDING' හෝ 'CONFIRMED' appointments ගණන් කරන්න
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
    try {
      // updateData එකෙන් database එකේ නැති fields අයින් කරමු
      const { email, user, category, ...validData } = updateData;

      await this.prisma.doctor.update({
        where: { id },
        data: validData,
      });
      return true;
    } catch (error) {
      throw new BadRequestException('Update failed: ' + error.message);
    }
  }
}
