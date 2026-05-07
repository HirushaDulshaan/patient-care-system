import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [DoctorService, DoctorResolver, PrismaService],
  exports: [DoctorService],
})
export class DoctorModule {}
