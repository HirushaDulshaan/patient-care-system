import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DoctorType } from './doctor.model'; // දොස්තරගේ model එක පවතින තැන

@ObjectType()
export class AppointmentType {
  @Field(() => ID)
  id: string;

  @Field()
  patientId: string;

  @Field()
  doctorId: string;

  @Field()
  scheduledAt: Date;

  @Field()
  status: string; // PENDING, CONFIRMED, etc.

  @Field(() => DoctorType, { nullable: true })
  doctor?: DoctorType;
}
