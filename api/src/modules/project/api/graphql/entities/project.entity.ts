import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ProjectEntity {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug: string

  @Field()
  isActive: boolean

  @Field()
  channelToken: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}