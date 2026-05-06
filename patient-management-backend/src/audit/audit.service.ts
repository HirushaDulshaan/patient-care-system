// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  // ලොග් එකක් සේව් කරන විදිහ
  async createLog(data: any) {
    return this.prisma.auditLog.create({ data });
  }

  // සියලුම ලොග්ස් ලබා ගැනීම (Super Admin ට පෙන්වීමට)
  async getLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // අවසන් ලොග් 50 පමණක් පෙන්වමු
    });
  }
}
