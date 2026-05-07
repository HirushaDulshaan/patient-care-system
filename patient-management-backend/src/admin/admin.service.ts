import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAdminSystemStats() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const totalDoctors = await this.prisma.doctor.count();

    const totalStaff = await this.prisma.user.count({
      where: {
        role: { in: ['ADMIN', 'RECEPTIONIST', 'STAFF'] },
      },
    });

    const todayAppointments = await this.prisma.appointment.count({
      where: {
        scheduledAt: { gte: start, lte: end },
      },
    });

    const activeNow = await this.prisma.doctorSchedule.count({
      where: {
        workingDate: {
          gte: start,
          lte: end,
        },
        status: 'Available',
      },
    });

    return {
      totalDoctors,
      totalStaff,
      todayAppointments,
      activeNow,
    };
  }

  async getRecentPatients(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const patients = await this.prisma.patient.findMany({
      skip,
      take: limit,
      orderBy: {
        id: 'desc',
      },
      include: {
        appointments: {
          orderBy: { scheduledAt: 'desc' },
          take: 1,
        },
      },
    });

    const totalCount = await this.prisma.patient.count();

    return {
      patients,
      totalCount,
      hasMore: skip + limit < totalCount,
    };
  }


  async getAppointmentForBilling(searchValue: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        OR: [
          { id: searchValue },
          { patient: { nic: searchValue } },
          { patient: { phone: searchValue } },
        ],
      },
      include: {
        patient: true,
        doctor: {
          include: { category: true },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    if (!appointment)
      throw new Error('No appointment found for the given criteria!');

    const consultationFee = 2000;
    const hospitalFee = 500;

    return {
      id: appointment.id,
      patientName: appointment.patient.fullName,
      nic: appointment.patient.nic,
      doctorName: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      category: appointment.doctor.category.name,
      total: consultationFee + hospitalFee,
      consultationFee,
      hospitalFee,
      status: appointment.status,
      paymentStatus: appointment.paymentStatus,
    };
  }

  async settlePayment(appointmentId: string) {
    return await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    });
  }
}
