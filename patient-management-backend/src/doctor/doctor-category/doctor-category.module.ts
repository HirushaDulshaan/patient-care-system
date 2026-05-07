import { Module } from '@nestjs/common';
import { DoctorCategoryService } from './doctor-category.service';
import { DoctorCategoryResolver } from './doctor-category.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DoctorCategoryService, DoctorCategoryResolver],
  exports: [DoctorCategoryService],
})
export class DoctorCategoryModule {}
