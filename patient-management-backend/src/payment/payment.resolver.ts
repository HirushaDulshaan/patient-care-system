import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => String)
  async getStripeSessionUrl(
    @Args('doctorId') doctorId: string,
    @Args('doctorName') doctorName: string,
    @Args('patientName') patientName: string,
    @Args('nic') nic: string,
    @Args('phone') phone: string,
    @Args('scheduledAt') scheduledAt: string,
  ) {
    return this.paymentService.createCheckoutSession({
      doctorId,
      doctorName,
      patientName,
      nic,
      phone,
      scheduledAt,
    });
  }
}
