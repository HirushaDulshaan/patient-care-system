import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DoctorCategoryService } from './doctor-category.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { DoctorCategoryType } from '../../models/doctor-category.model';

@Resolver()
export class DoctorCategoryResolver {
  constructor(private categoryService: DoctorCategoryService) {}

  // Category එකක් හදන්න පුළුවන් Log වුණු අයට විතරයි (Admin/Staff)
  @Mutation(() => DoctorCategoryType)
  @UseGuards(GqlAuthGuard) // මෙතනට විතරක් Guard එක දාන්න
  async createDoctorCategory(@Args('name') name: string) {
    return this.categoryService.createCategory(name);
  }

  // ඕනෑම කෙනෙක්ට (ලොග් නොවී වුණත්) Categories බලන්න පුළුවන්
  @Query(() => [DoctorCategoryType])
  async getAllDoctorCategories() {
    return this.categoryService.getAllCategories();
  }
}
