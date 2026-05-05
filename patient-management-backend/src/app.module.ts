import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorModule } from './doctor/doctor.module';
import { StaffModule } from './staff/staff.module';
import { DoctorCategoryModule } from './doctor/doctor-category/doctor-category.module';
import { DoctorScheduleModule } from './doctor/doctor-shedule/doctor-schedule.module';
import { PaymentModule } from './payment/payment.module';
import { AppointmentModule } from './appointments/apoiment.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    StaffModule,
    DoctorModule,
    DoctorScheduleModule,
    DoctorCategoryModule,
    PaymentModule,
    AppointmentModule,
    // Menna meka thama oyaata adu wela thiyenne
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Browser playground eka enable karanawa
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
