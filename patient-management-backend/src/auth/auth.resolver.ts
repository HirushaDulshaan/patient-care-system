

import {
  Resolver,
  Mutation,
  Args,
  Query,
  ObjectType,
  Field,
  registerEnumType,
  Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { Role } from '@prisma/client';
import { CurrentUser } from './current-user.decorator';

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

  @Mutation(() => String)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args({ name: 'role', type: () => Role }) role: Role,
  ) {
    const user = await this.authService.register(email, password, role);
    return `User created successfully with ID: ${user.id}`;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const ip =
      context.req?.headers['x-forwarded-for'] || context.req?.ip || 'Unknown';

    const user = await this.authService.validateUser(email, password, ip);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user, ip);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: any, @Context() context: any) {
    const ip =
      context.req?.headers['x-forwarded-for'] || context.req?.ip || 'Unknown';

    return this.authService.logout(user.email, ip);
  }
}
