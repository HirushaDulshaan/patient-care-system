import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from './user.model';
import { DoctorCategoryType } from './doctor-category.model';
import { DoctorScheduleType } from './doctor-schedule.model';

@ObjectType()
export class DoctorType {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  categoryId: string;

  @Field(() => DoctorCategoryType, { nullable: true })
  category: DoctorCategoryType;

  @Field()
  licenseNumber: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  address1: string;

  @Field({ nullable: true })
  address2: string;

  @Field({ nullable: true })
  city: string;

  @Field()
  education: string;

  @Field({ nullable: true })
  university: string;

  @Field({ nullable: true })
  workingHospital: string;

  @Field(() => User)
  user: User;

  @Field(() => [DoctorScheduleType], { nullable: true })
  schedules: DoctorScheduleType[];
}
