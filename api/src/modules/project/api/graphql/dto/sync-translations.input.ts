import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator'

export enum SyncTranslationsType {
  PROJECT = 'PROJECT',
  SINGLE_KEY = 'SINGLE_KEY',
}

registerEnumType(SyncTranslationsType, {
  name: 'SyncTranslationsType',
})

@InputType()
export class SyncTranslationsInput {
  @Field(() => SyncTranslationsType)
  @IsEnum(SyncTranslationsType)
  type: SyncTranslationsType

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  projectId?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  translationKeyId?: string

  @Field()
  @IsString()
  sourceLanguage: string

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetLanguages?: string[]

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  targetLanguage?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sourceText?: string
}
