
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicalRecordService {
  constructor(private prisma: PrismaService) {}

  async saveConsultation(data: any) {
    const {
      appointmentId,
      patientName,
      guardianName,
      age,
      weight,
      complaint,
      diagnosis,
      specialAdvice,
      nextVisitDate,
      medicines,
    } = data;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. අදාළ Appointment එක ඇත්තටම තියෙනවද බලමු
        const appointment = await tx.appointment.findUnique({
          where: { id: appointmentId },
        });

        if (!appointment) {
          throw new BadRequestException('අදාළ ඇපොයින්ට්මන්ට් එක සොයාගත නොහැක.');
        }

        // 2. Medical Record එක සහ Prescriptions එකවර create කරමු
        const medicalRecord = await tx.medicalRecord.create({
          data: {
            appointmentId,
            patientName,
            guardianName,
            age,
            weight,
            complaint,
            diagnosis,
            specialAdvice,
            nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : null,
            prescriptions: {
              create: medicines.map((med: any) => ({
                drugName: med.name,
                dosage: med.dosage,
                frequency: med.frequency,
              })),
            },
          },
        });

        // 3. Appointment එක 'COMPLETED' ලෙස update කරමු
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: 'COMPLETED' },
        });

        return medicalRecord;
      });
    } catch (error) {
      throw new BadRequestException('සේව් කිරීම අසාර්ථකයි: ' + error.message);
    }
  }

  async getPendingAppointmentsForDoctor(userIdFromFrontend: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return this.prisma.appointment.findMany({
      where: {
        doctor: {
          userId: userIdFromFrontend,
        },
        status: 'PENDING',
        scheduledAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async getPatientHistory(patientId: string) {
    return this.prisma.medicalRecord.findMany({
      where: {
        appointment: {
          patientId: patientId,
        },
      },
      include: {
        prescriptions: true,
        appointment: {
          include: {
            doctor: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPatientByNIC(nic: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { nic },
      include: {
        appointments: {
          include: {
            medicalRecords: {
              include: { prescriptions: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!patient) return null;

    const medicalRecords = patient.appointments.flatMap(
      (app) => app.medicalRecords,
    );

    return { ...patient, medicalRecords };
  }

  async getDoctorStats(userId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: userId },
    });

    if (!doctor) throw new BadRequestException('cant find doctor details');

    const monthlyCount = await this.prisma.appointment.count({
      where: {
        doctor: { userId: userId },
        status: 'COMPLETED',
        scheduledAt: { gte: monthStart, lte: monthEnd },
      },
    });

    const totalPatients = await this.prisma.patient.count();

    return {
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      monthlyCount,
      totalPatients,
      monthlyIncome: monthlyCount * 2000,
    };
  }



  async getSuperAdminInsights(date: string) {
    const selectedDate = new Date(date);
    const start = new Date(selectedDate.setHours(0, 0, 0, 0));
    const end = new Date(selectedDate.setHours(23, 59, 59, 999));

    const doctors = await this.prisma.doctor.findMany({
      include: {
        category: true,
        appointments: {
          where: {
            scheduledAt: { gte: start, lte: end },
            status: 'COMPLETED',
          },
          include: {
            patient: true,
            medicalRecords: true,
          },
        },
      },
    });

    return doctors.map((doc) => ({
      ...doc,
      specialization: doc.category?.name || 'General',
    }));
  }
}
