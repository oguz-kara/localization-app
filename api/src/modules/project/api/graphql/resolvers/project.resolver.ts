import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { ProjectService } from 'src/modules/project/application/services/project.service'
import { ProjectEntity } from '../entities/project.entity'
import { CreateProjectInput } from '../dto/create-project.input'
import { SyncTranslationsInput } from '../dto/sync-translations.input'
import { SyncTranslationsResult } from '../dto/sync-translations.output'

@Resolver(() => ProjectEntity)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [ProjectEntity], { name: 'projects' })
  @ProtectResource()
  async getProjects(@Ctx() ctx: RequestContext): Promise<ProjectEntity[]> {
    return this.projectService.getProjects(ctx)
  }

  @Query(() => ProjectEntity, { name: 'project', nullable: true })
  @ProtectResource()
  async getProject(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
  ): Promise<ProjectEntity | null> {
    return this.projectService.getProject(ctx, id)
  }

  @Mutation(() => ProjectEntity, { name: 'createProject' })
  @ProtectResource()
  async createProject(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateProjectInput,
  ): Promise<ProjectEntity> {
    return this.projectService.createProject(ctx, input)
  }

  @Mutation(() => SyncTranslationsResult, { name: 'syncTranslations' })
  @ProtectResource()
  async syncTranslations(
    @Ctx() ctx: RequestContext,
    @Args('input') input: SyncTranslationsInput,
  ): Promise<SyncTranslationsResult> {
    return this.projectService.syncTranslations(ctx, input)
  }
}
