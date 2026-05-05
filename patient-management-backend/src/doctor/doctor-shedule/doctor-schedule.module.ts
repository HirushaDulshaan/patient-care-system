import { Module } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { DoctorScheduleResolver } from './doctor-schedule.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
@Module({
  imports: [PrismaModule], // Database එකත් එක්ක වැඩ කරන්න PrismaModule එක මෙතනට දාන්න
  providers: [DoctorScheduleService, DoctorScheduleResolver],
  exports: [DoctorScheduleService], // සමහරවිට වෙනත් Module එකකට අවශ්‍ය වුණොත් පාවිච්චි කරන්න පුළුවන්
})
export class DoctorScheduleModule {}
