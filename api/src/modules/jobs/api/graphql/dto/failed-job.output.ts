import { ObjectType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class FailedJobOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => GraphQLJSON)
  data: any;

  @Field()
  failedReason: string;

  @Field({ nullable: true })
  processedOn?: number;

  @Field({ nullable: true })
  finishedOn?: number;

  @Field()
  attemptsMade: number;

  @Field()
  maxAttempts: number;

  @Field()
  createdAt: Date;

  @Field()
  failedAt: Date;
}

@ObjectType()
export class FailedJobStatsOutput {
  @Field()
  totalFailed: number;

  @Field(() => GraphQLJSON)
  jobsByType: Record<string, number>;

  @Field(() => GraphQLJSON)
  jobsByFailureReason: Record<string, number>;

  @Field({ nullable: true })
  oldestFailedJob?: Date;

  @Field({ nullable: true })
  newestFailedJob?: Date;
}

@ObjectType()
export class RetryJobResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  jobId?: string;
}