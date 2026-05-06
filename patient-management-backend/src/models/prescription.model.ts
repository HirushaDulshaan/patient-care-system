// src/models/prescription.model.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

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
