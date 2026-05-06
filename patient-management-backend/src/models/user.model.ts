import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  isActive: boolean; // 👈 මේක තියෙනවාද බලන්න. නැත්නම් UI එකට දත්ත එන්නේ නැහැ.
}