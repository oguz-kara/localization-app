import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResourceFlexible } from 'src/common/decorators/protect-resource-flexible.decorator'
import { ProtectResourceRoles } from 'src/common/decorators/protect-resource-roles.decorator'
import { TranslationService } from 'src/modules/project/application/services/translation.service'
import { TranslationsResponse } from '../entities/translations-response.entity'
import { ImportTranslationsInput, ExportTranslationsInput, ImportResult, ExportResult } from '../entities/import-export.entity'
import { UserRole } from '@prisma/client'

@Resolver(() => TranslationsResponse)
export class TranslationResolver {
  constructor(private readonly translationService: TranslationService) {}

  @Query(() => TranslationsResponse, { name: 'getTranslations' })
  @ProtectResourceFlexible() // Allow both JWT and API key authentication
  async getTranslations(
    @Ctx() ctx: RequestContext,
    @Args('projectId') projectId: string,
    @Args('language') language: string,
  ): Promise<TranslationsResponse> {
    return this.translationService.getTranslations(ctx, projectId, language)
  }

  @Mutation(() => ImportResult, { name: 'importTranslations' })
  @ProtectResourceRoles(UserRole.ADMIN, UserRole.TRANSLATOR)
  async importTranslations(
    @Ctx() ctx: RequestContext,
    @Args('input') input: ImportTranslationsInput,
  ): Promise<ImportResult> {
    return this.translationService.importTranslations(ctx, input)
  }

  @Mutation(() => ExportResult, { name: 'exportTranslations' })
  @ProtectResourceRoles(UserRole.ADMIN, UserRole.TRANSLATOR, UserRole.REVIEWER)
  async exportTranslations(
    @Ctx() ctx: RequestContext,
    @Args('input') input: ExportTranslationsInput,
  ): Promise<ExportResult> {
    return this.translationService.exportTranslations(ctx, input)
  }
}