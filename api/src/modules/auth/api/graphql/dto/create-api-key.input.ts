import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'

@InputType()
export class CreateApiKeyInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string
}