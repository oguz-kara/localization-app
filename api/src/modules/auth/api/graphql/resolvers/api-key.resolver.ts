import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { ApiKeyService } from 'src/modules/auth/application/services/api-key.service'
import { ApiKeyEntity } from '../entities/api-key.entity'
import { CreateApiKeyInput } from '../dto/create-api-key.input'

@Resolver(() => ApiKeyEntity)
export class ApiKeyResolver {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Query(() => [ApiKeyEntity], { name: 'apiKeys' })
  @ProtectResource()
  async getApiKeys(@Ctx() ctx: RequestContext): Promise<ApiKeyEntity[]> {
    return this.apiKeyService.getApiKeys(ctx)
  }

  @Mutation(() => ApiKeyEntity, { name: 'createApiKey' })
  @ProtectResource()
  async createApiKey(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateApiKeyInput,
  ): Promise<ApiKeyEntity> {
    return this.apiKeyService.createApiKey(ctx, input)
  }

  @Mutation(() => Boolean, { name: 'revokeApiKey' })
  @ProtectResource()
  async revokeApiKey(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.apiKeyService.revokeApiKey(ctx, id)
  }

  @Mutation(() => Boolean, { name: 'deleteApiKey' })
  @ProtectResource()
  async deleteApiKey(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.apiKeyService.deleteApiKey(ctx, id)
  }
}
