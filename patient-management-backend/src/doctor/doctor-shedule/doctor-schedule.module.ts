import { Module } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { DoctorScheduleResolver } from './doctor-schedule.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [DoctorScheduleService, DoctorScheduleResolver],
  exports: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
