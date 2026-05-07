import { ObjectType, Field, ID, Int, Parent } from '@nestjs/graphql';

@ObjectType()
export class DoctorScheduleType {
  @Field(() => ID)
  id: string;

  @Field()
  doctorId: string;

  @Field()
  workingDate: Date;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  status: string;

  @Field(() => Int)
  maxPatients: number;

  @Field(() => Int)
  bookedCount: number;

  @Field(() => Int, { nullable: true })
  remainingSeats: number;
}
