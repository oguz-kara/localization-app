import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, MinLength, MaxLength, IsBoolean } from 'class-validator'

@InputType()
export class UpdateTranslationKeyInput {
  @Field()
  @IsString()
  id: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  key?: string

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

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}