// src/doctor/doctor-shedule/doctor-schedule.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DoctorScheduleService {
  constructor(private prisma: PrismaService) {}

  async getSchedulesByDoctor(userId: string) {
    // 1. මුලින්ම දත්ත ටික 'schedules' කියන variable එකට අරගන්න
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctor: {
          userId: userId,
        },
      },
      orderBy: { workingDate: 'asc' },
    });

    // 2. දැන් ඒ දත්ත ටික map කරලා remainingSeats අගය සෙට් කරලා return කරන්න
    // ✅ මෙතනදී error එක විසඳෙනවා
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
        // 1. අදාළ දොස්තරගේ දැනට තියෙන ඔක්කොම මකන්න
        const deleted = await tx.doctorSchedule.deleteMany({
          where: { doctorId: doctorId },
        });
        console.log(`🗑️ Deleted ${deleted.count} old slots.`);

        // 2. අලුත් දත්ත ටික ඇතුළත් කරන්න
        if (schedules.length > 0) {
          const created = await tx.doctorSchedule.createMany({
            data: schedules.map((s) => ({
              doctorId,
              workingDate: new Date(s.workingDate),
              startTime: s.startTime,
              endTime: s.endTime,
              status: s.status || 'Available',
              // 💡 මෙතන maxPatients වගේ අගයන් schema එකේ තියෙන විදිහට pass කරන්න
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

  // ✅ 2. අලුත් එක (Doctor ID එකෙන් දත්ත ගන්නේ - Admin Roster Management සඳහා)
  async getSchedulesByDoctorId(doctorId: string) {
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctorId: doctorId, // 👈 මෙතනදී කෙලින්ම Doctor Table එකේ ID එක පාවිච්චි කරයි
      },
      orderBy: { workingDate: 'asc' },
    });

    return schedules.map((s) => ({
      ...s,
      remainingSeats: (s.maxPatients || 20) - (s.bookedCount || 0),
    }));
  }
}
