import { Resolver, Query, Args } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResourceFlexible } from 'src/common/decorators/protect-resource-flexible.decorator'
import { TranslationService } from 'src/modules/project/application/services/translation.service'
import { TranslationsResponse } from '../entities/translations-response.entity'

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
}