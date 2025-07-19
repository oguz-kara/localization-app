import { Field, ObjectType } from '@nestjs/graphql'
import { TranslationsResponse } from './translations-response.entity'

@ObjectType()
export class TranslationKeyEntity {
  @Field()
  id: string

  @Field()
  key: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  context?: string

  @Field()
  isActive: boolean

  @Field()
  projectId: string

  @Field(() => TranslationsResponse, { nullable: true })
  translations?: TranslationsResponse

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
