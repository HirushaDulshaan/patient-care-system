import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ApoimentService } from './appointments.service';
import { ApoimnetResolver } from './appointments.resolver';

@Module({
  providers: [ApoimentService, ApoimnetResolver, PrismaService],
  exports: [ApoimentService],
})
export class AppointmentModule {}
