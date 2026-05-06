import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AuditLogType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  userEmail: string;

  @Field()
  action: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  ipAddress: string;

  @Field({ nullable: true })
  target: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;
}
