import {
  Resolver,
  Mutation,
  Args,
  Query,
  ObjectType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/user.model';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { Role } from '@prisma/client';
import { StaffProfileType } from '../models/staff.model';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
class LoginResponse {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  sayHello(): string {
    return 'Security Guard passed! You are authorized!';
  }

  // --- 1. Basic Register (Admin/Super Admin) ---
  @Mutation(() => String)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args({ name: 'role', type: () => Role }) role: Role,
  ) {
    const user = await this.authService.register(email, password, role);
    return `User created successfully with ID: ${user.id}`;
  }

  // --- 2. Staff Registration (With Profiles) ---
  @Mutation(() => String)
  async registerStaff(
    @Args('email') email: string,
    @Args({ name: 'role', type: () => Role }) role: Role,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('phone') phone: string,
    @Args('designation') designation: string,
    @Args('city') city: string,
    @Args({ name: 'address1', nullable: true }) address1?: string,
    @Args({ name: 'address2', nullable: true }) address2?: string,
  ) {
    // Default password එකක් විදියට 'Staff@123' වගේ එකක් යවමු
    // පස්සේ Staff Member ට ඒක reset කරගන්න පුළුවන්
    const result = await this.authService.registerStaff({
      email,
      password: 'Staff@123',
      role,
      firstName,
      lastName,
      phone,
      designation,
      city,
      address1,
      address2,
    });

    return `Staff Member ${result.profile.firstName} created successfully!`;
  }

  // --- 3. Login ---
  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Query(() => [StaffProfileType]) // Dan meka anduran gannawa!
  async getAllStaff() {
    return this.authService.getAllStaff();
  }

  @Mutation(() => String)
  async updateStaff(
    @Args('id') id: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('phone') phone: string,
    @Args('designation') designation: string,
    @Args('city') city: string,
    @Args({ name: 'address1', nullable: true }) address1?: string,
    @Args({ name: 'address2', nullable: true }) address2?: string,
  ) {
    await this.authService.updateStaff(id, {
      firstName,
      lastName,
      phone,
      designation,
      city,
      address1,
      address2,
    });
    return 'Staff updated successfully!';
  }
}
