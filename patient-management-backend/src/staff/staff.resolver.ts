import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StaffService } from './staff.service';
import { StaffProfileType } from '../models/staff.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Role } from '@prisma/client';

@Resolver()
@UseGuards(GqlAuthGuard) // මුළු Resolver එකටම Guard එක දැම්මම ලේසියි
export class StaffResolver {
  constructor(private staffService: StaffService) {}

  @Mutation(() => String)
  async registerStaff(
    @Args('email') email: string,
    @Args({ name: 'role', type: () => Role }) role: Role,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('phone') phone: string,
    @Args('designation') designation: string,
    @Args('city') city: string,
    @Args({ name: 'address1', nullable: true }) address1?: string,
    @Args({ name: 'address2', nullable: true }) address2?: string,
  ) {
    const result = await this.staffService.registerStaff({
      email,
      password: 'Staff@123',
      role,
      firstName,
      lastName,
      phone,
      designation,
      city,
      address1,
      address2,
    });
    return `Staff Member ${result.profile.firstName} created successfully!`;
  }

  @Query(() => [StaffProfileType])
  async getAllStaff() {
    return this.staffService.getAllStaff();
  }

  @Mutation(() => String)
  async updateStaff(
    @Args('id') id: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('phone') phone: string,
    @Args('designation') designation: string,
    @Args('city') city: string,
    @Args({ name: 'address1', nullable: true }) address1?: string,
    @Args({ name: 'address2', nullable: true }) address2?: string,
  ) {
    await this.staffService.updateStaff(id, {
      firstName,
      lastName,
      phone,
      designation,
      city,
      address1,
      address2,
    });
    return 'Staff updated successfully!';
  }
}
