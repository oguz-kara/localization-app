import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsEnum } from 'class-validator'
import { TranslationStatus } from '@prisma/client'

@InputType()
export class UpdateTranslationInput {
  @Field()
  @IsString()
  id: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  value?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(TranslationStatus)
  status?: TranslationStatus
}