import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { PrismaService } from '../prisma/prisma.service';
import { MedicalRecordResolver } from './medical-record.resolver';

@Module({
  providers: [MedicalRecordService, MedicalRecordResolver, PrismaService],
})
export class MedicalRecordModule {}
