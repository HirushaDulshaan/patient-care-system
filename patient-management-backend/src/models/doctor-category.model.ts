import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DoctorCategoryType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
