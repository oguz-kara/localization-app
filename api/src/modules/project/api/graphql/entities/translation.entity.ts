import { Field, ObjectType } from '@nestjs/graphql'
import { registerEnumType } from '@nestjs/graphql'
import { TranslationStatus } from '@prisma/client'

registerEnumType(TranslationStatus, {
  name: 'TranslationStatus',
})

@ObjectType()
export class TranslationEntity {
  @Field()
  id: string

  @Field()
  value: string

  @Field(() => TranslationStatus)
  status: TranslationStatus

  @Field()
  machineTranslated: boolean

  @Field({ nullable: true })
  reviewNotes?: string

  @Field()
  translationKeyId: string

  @Field()
  languageId: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}