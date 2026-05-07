import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ApoimentService } from './appointments.service';
import { PatientInput } from '../dto/patient.input';
import { AppointmentType } from '../models/appointment.model';

@Resolver()
export class ApoimnetResolver {
  constructor(private readonly apoimentService: ApoimentService) {}


  @Mutation(() => AppointmentType)
  async createAppointment(
    @Args('patientData') patientData: PatientInput,
    @Args('doctorId') doctorId: string,
    @Args('scheduledAt') scheduledAt: string,
    @Args('paymentStatus', { defaultValue: 'NOT_PAID' }) paymentStatus: string,
  ) {
    return this.apoimentService.createAppointment(
      patientData,
      doctorId,
      scheduledAt,
      paymentStatus,
    );
  }

  @Query(() => [AppointmentType])
  async getAppointmentsByDoctor(@Args('doctorId') doctorId: string) {
    return this.apoimentService.getDoctorAppointments(doctorId);
  }
}
