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
import { User } from '../models/user.model';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { Role } from '@prisma/client';

// Role Enum එක GraphQL වලට හඳුන්වා දීම
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

  /**
   * Security Guard එක වැඩද කියලා බලන්න පොඩි Query එකක්
   */
  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  sayHello(): string {
    return 'Security Guard passed! You are authorized!';
  }

  /**
   * 1. මූලික ලියාපදිංචිය (Admin/Super Admin සඳහා)
   */
  @Mutation(() => String)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args({ name: 'role', type: () => Role }) role: Role,
  ) {
    const user = await this.authService.register(email, password, role);
    return `User created successfully with ID: ${user.id}`;
  }

  /**
   * 2. Login කිරීම
   * මෙහිදී User ගේ email/password නිවැරදි නම් JWT token එකක් ලබාදෙයි.
   */
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
}
