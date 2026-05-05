import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { DoctorType } from '../models/doctor.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard'; // ඔයා කලින් හදපු Guard එක

@Resolver()
export class DoctorResolver {
  constructor(private doctorService: DoctorService) {}

  // දොස්තර කෙනෙක්ව Register කිරීම
  @Mutation(() => DoctorType)
  @UseGuards(GqlAuthGuard)
  async registerDoctor(
    @Args('email') email: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('categoryId') categoryId: string, // specialization වෙනුවට categoryId
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

  // සියලුම දොස්තරලාගේ ලැයිස්තුව ගැනීම
  @Query(() => [DoctorType])
  async getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }

  // doctor.resolver.ts

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard) // Update එක සාර්ථක නම් true එවන නිසා
  async updateDoctor(
    @Args('id') id: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('categoryId') categoryId: string, // specialization වෙනුවට categoryId

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
