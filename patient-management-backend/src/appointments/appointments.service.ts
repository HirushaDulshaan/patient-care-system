import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApoimentService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(
    patientData: any,
    doctorId: string,
    scheduledAt: string,
    paymentStatus: string = 'NOT_PAID',
  ) {
    const appointmentDate = new Date(scheduledAt);

    return this.prisma.$transaction(async (tx) => {
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
        },
      });

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
        throw new BadRequestException(
          'cant fine shedule',
        );
      }

      if (schedule.bookedCount >= schedule.maxPatients) {
        throw new BadRequestException(
          'this session is already booked.',
        );
      }

      await tx.doctorSchedule.update({
        where: { id: schedule.id },
        data: {
          bookedCount: { increment: 1 },
        },
      });

      return tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctorId,
          scheduledAt: appointmentDate,
          status: 'PENDING',
          paymentStatus: 'PAID',
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
