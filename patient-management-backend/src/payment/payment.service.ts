// src/modules/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: InstanceType<typeof Stripe>; // ✅ Fix 1: namespace used as type

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia', // ✅ Fix 2: updated API version
    });
  }

  async createCheckoutSession(bookingData: any) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: `Consultation - Dr. ${bookingData.doctorName}`,
              description: `Appointment on ${new Date(bookingData.scheduledAt).toDateString()}`,
            },
            unit_amount: 250000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&doctorId=${bookingData.doctorId}&patientName=${bookingData.patientName}&nic=${bookingData.nic}&phone=${bookingData.phone}&scheduledAt=${bookingData.scheduledAt}`,
      cancel_url: `http://localhost:5173/book-appointment`,
    });

    return session.url;
  }
}
