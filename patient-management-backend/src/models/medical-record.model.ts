import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AppointmentType } from './appointment.model'; // Appointment එක import කරන්න

@ObjectType()
export class PrescriptionType {
  @Field(() => ID)
  id: string;

  @Field()
  drugName: string;

  @Field()
  dosage: string;

  @Field()
  frequency: string;
}

@ObjectType()
export class MedicalRecordType {
  @Field(() => ID)
  id: string;

  @Field()
  appointmentId: string;

  @Field(() => AppointmentType, { nullable: true })
  appointment?: AppointmentType;

  @Field()
  patientName: string;

  @Field({ nullable: true })
  guardianName?: string;

  @Field()
  age: string;

  @Field({ nullable: true })
  weight?: string;

  @Field()
  complaint: string;

  @Field()
  diagnosis: string;

  @Field({ nullable: true })
  specialAdvice?: string;

  @Field({ nullable: true })
  nextVisitDate?: Date;

  @Field(() => [PrescriptionType], { nullable: true })
  prescriptions?: PrescriptionType[];

  @Field()
  createdAt: Date;
}
