import { Field, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class TranslationsResponse {
  @Field(() => GraphQLJSON)
  translations: Record<string, string>

  @Field()
  projectId: string

  @Field()
  language: string

  @Field()
  totalKeys: number

  @Field()
  translatedKeys: number
}
