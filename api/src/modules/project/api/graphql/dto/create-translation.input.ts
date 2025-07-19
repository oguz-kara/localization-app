import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'
import { TranslationStatus } from '@prisma/client'

@InputType()
export class CreateTranslationInput {
  @Field()
  @IsString()
  translationKeyId: string

  @Field()
  @IsString()
  language: string

  @Field()
  @IsString()
  value: string

  @Field(() => String, { nullable: true })
  @IsEnum(TranslationStatus)
  status?: TranslationStatus
}