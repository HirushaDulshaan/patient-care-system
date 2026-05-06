import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceResolver } from './finance.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [FinanceService, FinanceResolver, PrismaService],
})
@Module({})
export class FinanceModule {}
