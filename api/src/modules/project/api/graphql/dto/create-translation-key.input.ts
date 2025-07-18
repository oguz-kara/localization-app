import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'

@InputType()
export class CreateTranslationKeyInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  key: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  context?: string

  @Field()
  @IsString()
  projectId: string
}