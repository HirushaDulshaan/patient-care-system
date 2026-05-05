import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ApoimentService } from './appointments.service';
import { PatientInput } from '../dto/patient.input';
import { AppointmentType } from '../models/appointment.model'; // DTO එකක් හදාගෙන තිබේ නම්

@Resolver()
export class ApoimnetResolver {
  constructor(private readonly apoimentService: ApoimentService) {}

  // ✅ Appointment එකක් සෑදීම (Payment Success වූ පසු)
  @Mutation(() => AppointmentType)
  async createAppointment(
    @Args('patientData') patientData: PatientInput, // InputType එකක් ලෙස
    @Args('doctorId') doctorId: string,
    @Args('scheduledAt') scheduledAt: string,
  ) {
    return this.apoimentService.createAppointment(
      patientData,
      doctorId,
      scheduledAt,
    );
  }

  // ✅ දොස්තර කෙනෙක්ට තමන්ගේ ඇපොයින්මන්ට්ස් බැලීමට
  @Query(() => [AppointmentType])
  async getAppointmentsByDoctor(@Args('doctorId') doctorId: string) {
    return this.apoimentService.getDoctorAppointments(doctorId);
  }
}
