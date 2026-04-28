import { Resolver, Mutation, Args, Query, ObjectType, Field } from '@nestjs/graphql'; // Field add kala
import { AuthService } from './auth.service';
import { User } from '../user/user.model';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';

// 1. Type eka class eken eliye thiyenna ona
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
    @Args('role') role: string,
  ) {
    const user = await this.authService.register(email, password, role as any);
    return `User created successfully with ID: ${user.id}`;
  }

  // 2. Return type eka LoginResponse kala
  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // AuthService.login eken den access_token saha user object dekam enawa
    return this.authService.login(user);
  }
}
