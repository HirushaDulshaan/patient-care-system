// src/models/appointment.model.ts

import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { PatientType } from './patient.model';
import { MedicalRecordType } from './medical-record.model'; // 👈 මේක import කරන්න

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
  status: string;

  @Field(() => Int)
  priority: number;

  // 👇 මේක නැතිව frontend query fail වෙනවා
  @Field(() => [MedicalRecordType], { nullable: true })
  medicalRecords?: MedicalRecordType[];

  // 👇 මේ relation field එක add කරන්න - මේකම නැතිව error එන්නේ
  @Field(() => PatientType, { nullable: true })
  patient?: PatientType;
}
