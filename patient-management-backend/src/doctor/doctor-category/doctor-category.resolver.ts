import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DoctorCategoryService } from './doctor-category.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { DoctorCategoryType } from '../../models/doctor-category.model';

@Resolver()
export class DoctorCategoryResolver {
  constructor(private categoryService: DoctorCategoryService) {}

  @Mutation(() => DoctorCategoryType)
  @UseGuards(GqlAuthGuard)
  async createDoctorCategory(@Args('name') name: string) {
    return this.categoryService.createCategory(name);
  }

  @Query(() => [DoctorCategoryType])
  async getAllDoctorCategories() {
    return this.categoryService.getAllCategories();
  }
}
