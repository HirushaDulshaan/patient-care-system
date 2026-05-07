
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { PatientType } from './patient.model';
import { MedicalRecordType } from './medical-record.model';
import { DoctorType } from './doctor.model';

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

  @Field()
  paymentStatus: string; // NOT_PAID, PAID

  @Field(() => Int)
  priority: number;

  @Field(() => [MedicalRecordType], { nullable: true })
  medicalRecords?: MedicalRecordType[];

  @Field(() => PatientType, { nullable: true })
  patient?: PatientType;

  @Field(() => DoctorType, { nullable: true })
  doctor?: DoctorType;
}
