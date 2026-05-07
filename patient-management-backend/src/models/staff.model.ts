import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class StaffProfileType {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  designation: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  address1: string;

  @Field({ nullable: true })
  address2: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;
}
