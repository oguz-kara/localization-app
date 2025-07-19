import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { TranslationKeyService } from 'src/modules/project/application/services/translation-key.service'
import { TranslationKeyEntity } from '../entities/translation-key.entity'
import { CreateTranslationKeyInput } from '../dto/create-translation-key.input'
import { UpdateTranslationKeyInput } from '../dto/update-translation-key.input'
import { TranslationService } from 'src/modules/project/application/services/translation.service'
import { TranslationsResponse } from '../entities/translations-response.entity'
import { PrismaService } from 'src/common/services/prisma/prisma.service'

@Resolver(() => TranslationKeyEntity)
export class TranslationKeyResolver {
  constructor(
    private readonly translationKeyService: TranslationKeyService,
    private readonly translationService: TranslationService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [TranslationKeyEntity], { name: 'translationKeys' })
  @ProtectResource()
  async getTranslationKeys(
    @Ctx() ctx: RequestContext,
    @Args('projectId') projectId: string,
  ): Promise<TranslationKeyEntity[]> {
    return this.translationKeyService.getTranslationKeys(ctx, projectId)
  }

  @Mutation(() => TranslationKeyEntity, { name: 'createTranslationKey' })
  @ProtectResource()
  async createTranslationKey(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateTranslationKeyInput,
  ): Promise<TranslationKeyEntity> {
    return this.translationKeyService.createTranslationKey(ctx, input)
  }

  @Mutation(() => TranslationKeyEntity, { name: 'updateTranslationKey' })
  @ProtectResource()
  async updateTranslationKey(
    @Ctx() ctx: RequestContext,
    @Args('input') input: UpdateTranslationKeyInput,
  ): Promise<TranslationKeyEntity> {
    return this.translationKeyService.updateTranslationKey(ctx, input)
  }

  @Mutation(() => TranslationKeyEntity, { name: 'deleteTranslationKey' })
  @ProtectResource()
  async deleteTranslationKey(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
  ): Promise<TranslationKeyEntity> {
    return this.translationKeyService.deleteTranslationKey(ctx, id)
  }

  @ResolveField(() => TranslationsResponse, { name: 'translations' })
  async translations(
    @Ctx() ctx: RequestContext,
    @Parent() translationKey: TranslationKeyEntity,
  ): Promise<TranslationsResponse> {
    // Get all translations for this specific translation key
    const translations = await this.prisma.translation.findMany({
      where: {
        translationKeyId: translationKey.id,
      },
      include: {
        language: true,
      },
    })

    // Build the translations object
    const translationsMap: Record<string, any> = {}
    let translatedKeys = 0

    for (const translation of translations) {
      translationsMap[translation.language.code] = {
        id: translation.id,
        value: translation.value,
        status: translation.status,
        machineTranslated: translation.machineTranslated,
        translationKeyId: translation.translationKeyId,
        languageId: translation.language.code,
      }
      translatedKeys++
    }

    return {
      translations: translationsMap,
      projectId: translationKey.projectId,
      language: 'all', // This represents all languages for this key
      totalKeys: 1, // This is always 1 since we're dealing with one key
      translatedKeys,
    }
  }
}
