import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { TranslationKeyService } from 'src/modules/project/application/services/translation-key.service'
import { TranslationKeyEntity } from '../entities/translation-key.entity'
import { CreateTranslationKeyInput } from '../dto/create-translation-key.input'

@Resolver(() => TranslationKeyEntity)
export class TranslationKeyResolver {
  constructor(private readonly translationKeyService: TranslationKeyService) {}

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
}