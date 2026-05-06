import { Resolver, Query } from '@nestjs/graphql';
import { AuditService } from './audit.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { AuditLogType } from '../models/audit-log.model';

@Resolver()
export class AuditResolver {
  constructor(private readonly auditService: AuditService) {}

  @Query(() => [AuditLogType])
  @UseGuards(GqlAuthGuard)
  async getSecurityLogs() {
    return this.auditService.getLogs();
  }
}
