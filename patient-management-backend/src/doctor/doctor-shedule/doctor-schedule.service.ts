
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DoctorScheduleService {
  constructor(private prisma: PrismaService) {}

  async getSchedulesByDoctor(userId: string) {
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctor: {
          userId: userId,
        },
      },
      orderBy: { workingDate: 'asc' },
    });


    return schedules.map((s) => ({
      ...s,
      remainingSeats: s.maxPatients - s.bookedCount,
    }));
  }

  async updateDoctorRoster(doctorId: string, schedules: any[]) {
    console.log(`🔄 Updating Roster for Doctor: ${doctorId}`);
    console.log(`📅 New Slots Count: ${schedules.length}`);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const deleted = await tx.doctorSchedule.deleteMany({
          where: { doctorId: doctorId },
        });
        console.log(`🗑️ Deleted ${deleted.count} old slots.`);

        if (schedules.length > 0) {
          const created = await tx.doctorSchedule.createMany({
            data: schedules.map((s) => ({
              doctorId,
              workingDate: new Date(s.workingDate),
              startTime: s.startTime,
              endTime: s.endTime,
              status: s.status || 'Available',
              maxPatients: s.maxPatients || 20,
            })),
          });
          console.log(`✅ Created ${created.count} new slots.`);
        }

        return true;
      });
    } catch (error) {
      console.error('❌ Roster Update Error:', error);
      throw new BadRequestException('Roster update failed: ' + error.message);
    }
  }

  async getSchedulesByDoctorId(doctorId: string) {
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctorId: doctorId,
      },
      orderBy: { workingDate: 'asc' },
    });

    return schedules.map((s) => ({
      ...s,
      remainingSeats: (s.maxPatients || 20) - (s.bookedCount || 0),
    }));
  }
}
