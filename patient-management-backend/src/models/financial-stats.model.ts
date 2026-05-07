import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class RecentTransaction {
  @Field() id: string;
  @Field() patientName: string;
  @Field() source: string;
  @Field(() => Float) amount: number;
  @Field() status: string;
}

@ObjectType()
export class FinancialStats {
  @Field(() => Float) totalRevenue: number;
  @Field(() => Float) totalExpenses: number;
  @Field(() => Float) netProfit: number;
  @Field(() => Int) totalCompleted: number;
  @Field(() => [RecentTransaction]) recentTransactions: RecentTransaction[];
}
