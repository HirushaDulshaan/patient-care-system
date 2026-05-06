import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { DoctorType } from '../models/doctor.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard'; // ඔයා කලින් හදපු Guard එක

@Resolver()
export class DoctorResolver {
  constructor(private doctorService: DoctorService) {}

  @Mutation(() => DoctorType)
  @UseGuards(GqlAuthGuard)
  async registerDoctor(
    @Args('email') email: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('categoryId') categoryId: string,
    @Args('licenseNumber') licenseNumber: string,
    @Args('phone', { nullable: true }) phone: string,
    @Args('address1', { nullable: true }) address1: string,
    @Args('address2', { nullable: true }) address2: string,
    @Args('city', { nullable: true }) city: string,
    @Args('education') education: string,
    @Args('university', { nullable: true }) university: string,
    @Args('workingHospital', { nullable: true }) workingHospital: string,
  ) {
    return this.doctorService.registerDoctor({
      email,
      firstName,
      lastName,
      categoryId,
      licenseNumber,
      phone,
      address1,
      address2,
      city,
      education,
      university,
      workingHospital,
    });
  }

  // ✅ Super Admin හට Password එක සෙට් කිරීමට ඇති Mutation එක
  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async approveDoctorAccess(
    @Args('userId') userId: string,
    @Args('password') password: string,
  ) {
    await this.doctorService.approveDoctorAccess(userId, password);
    return 'Doctor access granted successfully! ✅';
  }

  @Query(() => [DoctorType])
  async getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateDoctor(
    @Args('id') id: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('categoryId') categoryId: string,
    @Args('phone', { nullable: true }) phone: string,
    @Args('address1', { nullable: true }) address1: string,
    @Args('address2', { nullable: true }) address2: string,
    @Args('city', { nullable: true }) city: string,
    @Args('education') education: string,
    @Args('university', { nullable: true }) university: string,
    @Args('workingHospital', { nullable: true }) workingHospital: string,
  ) {
    return this.doctorService.updateDoctor(id, {
      firstName,
      lastName,
      categoryId,
      phone,
      address1,
      address2,
      city,
      education,
      university,
      workingHospital,
    });
  }
}