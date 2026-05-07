
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MedicalRecordType } from './medical-record.model';

@ObjectType()
export class PatientType {
  @Field(() => ID)
  id: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  nic: string;
  @Field(() => [MedicalRecordType], { nullable: true })
  medicalRecords?: MedicalRecordType[];
}
