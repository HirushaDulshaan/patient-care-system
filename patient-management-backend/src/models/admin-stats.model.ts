import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AdminSystemStats {
  @Field(() => Int) totalDoctors: number;
  @Field(() => Int) totalStaff: number;
  @Field(() => Int) todayAppointments: number;
  @Field(() => Int) activeNow: number;
}
