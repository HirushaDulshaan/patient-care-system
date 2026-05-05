import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffResolver } from './staff.resolver';
import { PrismaModule } from '../prisma/prisma.module'; // Prisma සම්බන්ධ නිසා මේක ඕනේ

@Module({
  imports: [PrismaModule], // Database එක පාවිච්චි කරන්න PrismaModule එක මෙතනට ඕනේ
  providers: [StaffService, StaffResolver],
  exports: [StaffService], // පස්සේ වෙන මොඩියුලයකට StaffService එක ඕන වුණොත් පාවිච්චි කරන්න පුළුවන්
})
export class StaffModule {}
