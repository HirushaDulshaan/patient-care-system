import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PatientInput {
  @Field()
  fullName: string;

  @Field()
  nic: string;

  @Field()
  phone: string;
}
