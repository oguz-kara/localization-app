import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator'
import { GraphQLJSON } from 'graphql-type-json'

export enum ImportExportFormat {
  JSON = 'JSON',
  YAML = 'YAML',
}

registerEnumType(ImportExportFormat, {
  name: 'ImportExportFormat',
})

@ObjectType()
export class ImportResult {
  @Field(() => ID)
  jobId: string

  @Field()
  message: string

  @Field()
  totalKeys: number

  @Field()
  status: string
}

@ObjectType()
export class ExportResult {
  @Field(() => ID)
  jobId: string

  @Field()
  message: string

  @Field()
  status: string

  @Field({ nullable: true })
  downloadUrl?: string
}

@InputType()
export class ImportTranslationsInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  projectId: string

  @Field()
  @IsString()
  @IsNotEmpty()
  languageCode: string

  @Field(() => GraphQLJSON)
  translations: Record<string, string>

  @Field(() => ImportExportFormat)
  @IsEnum(ImportExportFormat)
  format: ImportExportFormat

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string
}

@InputType()
export class ExportTranslationsInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  projectId: string

  @Field()
  @IsString()
  @IsNotEmpty()
  languageCode: string

  @Field(() => ImportExportFormat)
  @IsEnum(ImportExportFormat)
  format: ImportExportFormat

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string
}