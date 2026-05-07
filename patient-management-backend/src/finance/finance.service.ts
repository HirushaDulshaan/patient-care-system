import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getFinancialReports(reportType: string) {
    const now = new Date();
    let startDate = new Date();

    if (reportType === 'Monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (reportType === 'Weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setHours(0, 0, 0, 0); // Daily
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: 'COMPLETED',
        scheduledAt: { gte: startDate },
      },
      include: { patient: true, doctor: true },
    });

    const totalCompleted = appointments.length;

    const totalRevenue = totalCompleted * 2500;
    const totalExpenses = totalCompleted * 2000;
    const netProfit = totalRevenue - totalExpenses;

    const recentTransactions = appointments.slice(-5).map((app) => ({
      id: `INV-${app.id.slice(0, 5).toUpperCase()}`,
      patientName: app.patient.fullName,
      source: `Consultation - Dr. ${app.doctor.lastName}`,
      amount: 2500,
      status: 'Paid',
    }));

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalCompleted,
      recentTransactions,
    };
  }
}
