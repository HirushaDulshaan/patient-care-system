// src/finance/finance.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql';
import { FinanceService } from './finance.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { FinancialStats } from '../models/financial-stats.model';

@Resolver()
export class FinanceResolver {
  constructor(private readonly financeService: FinanceService) {}

  @Query(() => FinancialStats)
  @UseGuards(GqlAuthGuard)
  async getFinancialReports(@Args('type') type: string) {
    return this.financeService.getFinancialReports(type);
  }
}
