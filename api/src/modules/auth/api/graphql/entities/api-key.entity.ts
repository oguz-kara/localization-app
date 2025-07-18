import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApiKeyEntity {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  key?: string // Only populated on creation

  @Field()
  isActive: boolean

  @Field()
  createdAt: Date
}