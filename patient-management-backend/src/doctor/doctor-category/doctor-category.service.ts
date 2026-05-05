import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DoctorCategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(name: string) {
    return this.prisma.doctorCategory.create({
      data: { name },
    });
  }

  async getAllCategories() {
    return this.prisma.doctorCategory.findMany();
  }
}
