import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApoimentService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(
    patientData: any,
    doctorId: string,
    scheduledAt: string,
  ) {
    const appointmentDate = new Date(scheduledAt);

    // 1. Prisma Transaction එකක් පාවිච්චි කරමු (සියල්ල එකවර සාර්ථක විය යුතුයි)
    return this.prisma.$transaction(async (tx) => {
      // A. රෝගියා ඉන්නවාද බලා (Upsert) රෝගියාගේ ID එක ගනිමු
      const patient = await tx.patient.upsert({
        where: { nic: patientData.nic },
        update: {
          fullName: patientData.fullName,
          phone: patientData.phone,
        },
        create: {
          fullName: patientData.fullName,
          nic: patientData.nic,
          phone: patientData.phone,
          user: {
            create: {
              email: `${patientData.nic}@patient.local`,
              password: 'Patient@123',
              role: 'PATIENT',
            },
          },
        },
      });

      // B. අදාළ දොස්තරට ඒ දවසේ Schedule එකක් තිබේදැයි බලමු
      // (වැඩ කරන දිනය පමණක් සැසඳීමට කාලය 00:00:00 ට සෙට් කරමු)
      const startOfDay = new Date(appointmentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(appointmentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const schedule = await tx.doctorSchedule.findFirst({
        where: {
          doctorId: doctorId,
          workingDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (!schedule) {
        throw new Error('දොස්තරට අදාළ දිනට ශෙඩියුල් එකක් සොයාගත නොහැක.');
      }

      if (schedule.bookedCount >= schedule.maxPatients) {
        throw new Error('මෙම දොස්තරගේ අදාළ සෙෂන් එක සම්පූර්ණයෙන්ම පිරී ඇත.');
      }

      // C. දොස්තරගේ ශෙඩියුල් එකේ bookedCount එක 1කින් වැඩි කරමු
      await tx.doctorSchedule.update({
        where: { id: schedule.id },
        data: {
          bookedCount: { increment: 1 },
        },
      });

      // D. අවසානයේ ඇපොයින්ට්මන්ට් එක සේව් කරමු
      return tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctorId,
          scheduledAt: appointmentDate,
          status: 'CONFIRMED', // රිසෙප්ෂන් එකෙන් දාන නිසා කෙලින්ම Confirm කරමු
        },
        include: {
          patient: true,
          doctor: true,
        },
      });
    });
  }

  async getDoctorAppointments(doctorId: string) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      include: { patient: true },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
