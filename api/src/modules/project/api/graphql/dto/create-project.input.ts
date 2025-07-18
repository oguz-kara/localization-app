import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator'

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
  slug: string
}