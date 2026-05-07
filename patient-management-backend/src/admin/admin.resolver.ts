import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { AdminSystemStats } from '../models/admin-stats.model';
import { PatientType } from '../models/patient.model';

@ObjectType()
class PatientListResponse {
  @Field(() => [PatientType]) patients: any[];
  @Field() totalCount: number;
  @Field() hasMore: boolean;
}
@ObjectType()
class BillingRecord {
  @Field() id: string;
  @Field() patientName: string;
  @Field() nic: string;
  @Field() doctorName: string;
  @Field() category: string;
  @Field() consultationFee: number;
  @Field() hospitalFee: number;
  @Field() total: number;
  @Field() status: string;
  @Field() paymentStatus: string;
}

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => AdminSystemStats)
  @UseGuards(GqlAuthGuard)
  async getAdminSystemStats() {
    return this.adminService.getAdminSystemStats();
  }

  @Query(() => PatientListResponse)
  async getRecentPatients(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ) {
    return this.adminService.getRecentPatients(page, limit);
  }
  @Query(() => BillingRecord)
  @UseGuards(GqlAuthGuard)
  async getAppointmentForBilling(@Args('searchValue') searchValue: string) {

    return this.adminService.getAppointmentForBilling(searchValue);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async settlePayment(@Args('id') id: string) {
    await this.adminService.settlePayment(id);
    return true;
  }
}
