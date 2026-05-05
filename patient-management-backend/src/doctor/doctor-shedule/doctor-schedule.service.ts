// src/doctor/doctor-shedule/doctor-schedule.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DoctorScheduleService {
  constructor(private prisma: PrismaService) {}

  async getSchedulesByDoctor(doctorId: string) {
    return this.prisma.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: { workingDate: 'asc' },
    });
  }

  async updateDoctorRoster(doctorId: string, schedules: any[]) {
    console.log(`🔄 Updating Roster for Doctor: ${doctorId}`);
    console.log(`📅 New Slots Count: ${schedules.length}`);

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. අදාළ දොස්තරගේ දැනට තියෙන ඔක්කොම මකන්න (අනිවාර්යයෙන්ම!)
        const deleted = await tx.doctorSchedule.deleteMany({
          where: { doctorId: doctorId },
        });
        console.log(`🗑️ Deleted ${deleted.count} old slots.`);

        // 2. අලුත් දත්ත ටික ඇතුළත් කරන්න
        if (schedules.length > 0) {
          const created = await tx.doctorSchedule.createMany({
            data: schedules.map((s) => ({
              doctorId,
              // Date එක ISO Format එකට හරවන්න (අනිවාර්යයි)
              workingDate: new Date(s.workingDate),
              startTime: s.startTime,
              endTime: s.endTime,
              status: s.status || 'Available',
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
}
