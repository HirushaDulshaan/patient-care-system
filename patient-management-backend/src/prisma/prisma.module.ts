import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- Meka liyanna aniwaryai! Meken kiyanne wena untath meka pawichi karanna puluwan kiyala
})
export class PrismaModule {}