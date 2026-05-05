import {
  Resolver,
  Query,
  Mutation,
  Args,
  InputType,
  Field,
} from '@nestjs/graphql';
import { DoctorScheduleService } from './doctor-schedule.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { DoctorScheduleType } from '../../models/doctor-schedule.model';

@InputType()
class ScheduleSlotInput {
  @Field() workingDate: string;
  @Field() startTime: string;
  @Field() endTime: string;
  @Field() status: string;
}

@Resolver()
export class DoctorScheduleResolver {
  constructor(private scheduleService: DoctorScheduleService) {}

  @Query(() => [DoctorScheduleType]) // DoctorScheduleType එක model එකේ හදන්න ඕනේ
  async getDoctorSchedules(@Args('doctorId') doctorId: string) {
    return this.scheduleService.getSchedulesByDoctor(doctorId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateDoctorRoster(
    @Args('doctorId') doctorId: string,
    @Args({ name: 'slots', type: () => [ScheduleSlotInput] })
    slots: ScheduleSlotInput[],
  ) {
    return this.scheduleService.updateDoctorRoster(doctorId, slots);
  }
}
