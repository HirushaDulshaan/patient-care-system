// src/medical-record/medical-record.resolver.ts

import {
  Resolver,
  Mutation,
  Args,
  InputType,
  Field,
  Query,
  ObjectType,
} from '@nestjs/graphql';
import { MedicalRecordService } from './medical-record.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { AppointmentType } from '../models/appointment.model';
import { MedicalRecordType } from '../models/medical-record.model';
import { PatientType } from '../models/patient.model'; // මේ වගේ එකක් තියෙන්න ඕනේ

// බෙහෙත් විස්තර සඳහා Input Type එකක් හදමු
@InputType()
class MedicineInput {
  @Field() name: string;
  @Field() dosage: string;
  @Field() frequency: string;
}

@ObjectType()
class DoctorDashboardStats {
  @Field() monthlyCount: number;
  @Field() totalPatients: number;
  @Field() monthlyIncome: number;
  @Field() firstName: string; // 👈 අලුතින් එක් කළා
  @Field() lastName: string;
}
@ObjectType()
class DoctorInsightType {
  @Field() id: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field({ nullable: true }) specialization: string; // 👈 මේක තියෙන්නම ඕනේ
  @Field(() => [AppointmentType]) appointments: AppointmentType[];
}



@Resolver()
export class MedicalRecordResolver {
  constructor(private medicalRecordService: MedicalRecordService) {}

  @Query(() => [AppointmentType])
  async getPendingConsultations(@Args('userId') userId: string) {
    // 👈 මෙතන userId කියන නමම තියෙන්න ඕනේ
    return this.medicalRecordService.getPendingAppointmentsForDoctor(userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard) // දොස්තරට පමණක් අවසර දීමට
  async saveMedicalRecord(
    @Args('appointmentId') appointmentId: string,
    @Args('patientName') patientName: string,
    @Args('age') age: string,
    @Args('complaint') complaint: string,
    @Args('diagnosis') diagnosis: string,
    @Args({ name: 'medicines', type: () => [MedicineInput] })
    medicines: MedicineInput[],
    @Args('weight', { nullable: true }) weight: string,
    @Args('guardianName', { nullable: true }) guardianName: string,
    @Args('specialAdvice', { nullable: true }) specialAdvice: string,
    @Args('nextVisitDate', { nullable: true }) nextVisitDate: string,
  ) {
    await this.medicalRecordService.saveConsultation({
      appointmentId,
      patientName,
      age,
      complaint,
      diagnosis,
      medicines,
      weight,
      guardianName,
      specialAdvice,
      nextVisitDate,
    });
    return true;
  }

  @Query(() => [MedicalRecordType])
  @UseGuards(GqlAuthGuard)
  async getPatientHistory(@Args('patientId') patientId: string) {
    return this.medicalRecordService.getPatientHistory(patientId);
  }

  // Resolver class ඇතුළේ add කරන්න
  @Query(() => PatientType, { nullable: true })
  async getPatientByNIC(@Args('nic') nic: string) {
    return this.medicalRecordService.getPatientByNIC(nic);
  }

  @Query(() => DoctorDashboardStats)
  @UseGuards(GqlAuthGuard)
  async getDoctorDashboardStats(@Args('userId') userId: string) {
    return this.medicalRecordService.getDoctorStats(userId);
  }
  @Query(() => [DoctorInsightType])
  // @UseGuards(GqlAuthGuard) // අවසර තියෙන අයට පමණයි
  async getAllDoctorInsights(@Args('date') date: string) {
    return this.medicalRecordService.getSuperAdminInsights(date);
  }
}