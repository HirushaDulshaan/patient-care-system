import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StaffService } from './staff.service';
import { StaffProfileType } from '../models/staff.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Role } from '@prisma/client';

@Resolver(() => StaffProfileType)
@UseGuards(GqlAuthGuard)
export class StaffResolver {
  constructor(private staffService: StaffService) {}

  // 1. Staff Register කිරීම (Admin සඳහා)
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
      role,
      firstName,
      lastName,
      phone,
      designation,
      city,
      address1,
      address2,
    });
    return `Staff Member ${result.profile.firstName} registered successfully! Pending approval.`;
  }

  // 2. සියලුම Staff ලබා ගැනීම
  @Query(() => [StaffProfileType])
  async getAllStaff() {
    return this.staffService.getAllStaff();
  }

  // 3. Staff Access Approve කිරීම (Super Admin සඳහා)
  @Mutation(() => String)
  async approveStaffAccess(
    @Args('userId') userId: string,
    @Args('password') password: string,
  ) {
    await this.staffService.approveStaffAccess(userId, password);
    return 'Access granted successfully!';
  }

  // 4. Staff Status Toggle කිරීම (Active/Block)
  @Mutation(() => StaffProfileType) // මෙතන Profile එකම return කරන්න පුළුවන් UI එක update වෙන්න
  async toggleStaffStatus(
    @Args('userId') userId: string,
    @Args('status') status: boolean,
  ) {
    const updatedUser = await this.staffService.toggleStaffStatus(
      userId,
      status,
    );
    // මෙතනදී සාමාන්‍යයෙන් profile එක return කිරීමට service එකෙන් profile එකත් ගෙන්වා ගත යුතුයි
    return this.staffService
      .getAllStaff()
      .then((list) => list.find((s) => s.userId === userId));
  }

  // 5. Staff Update කිරීම
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
