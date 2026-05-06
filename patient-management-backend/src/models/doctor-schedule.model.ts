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

  // 🔥 remainingSeats අගය auto-calculate වෙන විදිහට හදමු
  @Field(() => Int, { nullable: true }) // 👈 null වෙන්න පුළුවන් බව කියන්න
  remainingSeats: number;
}
