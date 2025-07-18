import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SyncTranslationsResult {
  @Field()
  success: boolean;

  @Field()
  jobId: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  estimatedDuration?: number;

  @Field({ nullable: true })
  totalKeys?: number;

  @Field({ nullable: true })
  totalLanguages?: number;
}