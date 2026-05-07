// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AdminService, AdminResolver, PrismaService],
})
export class AdminModule {}
