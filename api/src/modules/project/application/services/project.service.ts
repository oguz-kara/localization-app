import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateProjectInput } from '../../api/graphql/dto/create-project.input'
import { ProjectEntity } from '../../api/graphql/entities/project.entity'
import {
  SyncTranslationsInput,
  SyncTranslationsType,
} from '../../api/graphql/dto/sync-translations.input'
import { SyncTranslationsResult } from '../../api/graphql/dto/sync-translations.output'
import { TranslationQueueService } from 'src/modules/jobs/application/services/translation-queue.service'
import {
  EntityNotFoundException,
  UniqueConstraintViolationException,
  AccessDeniedException,
} from 'src/common/exceptions'

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly translationQueueService: TranslationQueueService,
  ) {}

  async createProject(
    ctx: RequestContext,
    input: CreateProjectInput,
  ): Promise<ProjectEntity> {
    // Verify channel access
    if (!ctx.channelToken) {
      throw new AccessDeniedException('Channel token required')
    }

    // Check if project with same slug already exists in this channel
    const existingProject = await this.prisma.project.findUnique({
      where: {
        slug_channelToken: {
          slug: input.slug,
          channelToken: ctx.channelToken,
        },
      },
    })

    if (existingProject) {
      throw new UniqueConstraintViolationException('slug')
    }

    const project = await this.prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        slug: input.slug,
        channelToken: ctx.channelToken,
      },
    })

    return {
      id: project.id,
      name: project.name,
      description: project.description ?? undefined,
      slug: project.slug,
      isActive: project.isActive,
      channelToken: project.channelToken,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }
  }

  async getProject(
    ctx: RequestContext,
    id: string,
  ): Promise<ProjectEntity | null> {
    if (!ctx.channelToken) {
      throw new AccessDeniedException('Channel token required')
    }

    const project = await this.prisma.project.findFirst({
      where: {
        id,
        channelToken: ctx.channelToken,
      },
    })

    if (!project) {
      return null
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description ?? undefined,
      slug: project.slug,
      isActive: project.isActive,
      channelToken: project.channelToken,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }
  }

  async getProjects(ctx: RequestContext): Promise<ProjectEntity[]> {
    if (!ctx.channelToken) {
      throw new AccessDeniedException('Channel token required')
    }

    const projects = await this.prisma.project.findMany({
      where: {
        channelToken: ctx.channelToken,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description ?? undefined,
      slug: project.slug,
      isActive: project.isActive,
      channelToken: project.channelToken,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }))
  }

  async verifyProjectAccess(
    ctx: RequestContext,
    projectId: string,
  ): Promise<void> {
    if (!ctx.channelToken) {
      throw new AccessDeniedException('Channel token required')
    }

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        channelToken: ctx.channelToken,
      },
    })

    if (!project) {
      throw new EntityNotFoundException('Project', projectId)
    }
  }

  async syncTranslations(
    ctx: RequestContext,
    input: SyncTranslationsInput,
  ): Promise<SyncTranslationsResult> {
    if (!ctx.channelToken) {
      throw new AccessDeniedException('Channel token required')
    }

    if (!ctx.user?.id) {
      throw new AccessDeniedException('User ID required')
    }

    if (input.type === SyncTranslationsType.PROJECT) {
      return this.syncProjectTranslations(ctx, input)
    } else if (input.type === SyncTranslationsType.SINGLE_KEY) {
      return this.syncSingleTranslation(ctx, input)
    } else {
      throw new Error('Invalid sync type')
    }
  }

  private async syncProjectTranslations(
    ctx: RequestContext,
    input: SyncTranslationsInput,
  ): Promise<SyncTranslationsResult> {
    if (!input.projectId) {
      throw new Error('Project ID is required for project sync')
    }

    if (!input.targetLanguages || input.targetLanguages.length === 0) {
      throw new Error('Target languages are required for project sync')
    }

    // Verify project access
    await this.verifyProjectAccess(ctx, input.projectId)

    // Count translation keys to estimate duration
    const translationKeysCount = await this.prisma.translationKey.count({
      where: { projectId: input.projectId },
    })

    // Queue the job
    const jobId =
      await this.translationQueueService.queueSyncProjectTranslations({
        projectId: input.projectId,
        sourceLanguage: input.sourceLanguage,
        targetLanguages: input.targetLanguages,
        channelToken: ctx.channel.token!,
        userId: ctx.user?.id || '',
      })

    return {
      success: true,
      jobId,
      message: `Translation sync job queued for project ${input.projectId}`,
      estimatedDuration:
        translationKeysCount * input.targetLanguages.length * 2, // ~2 seconds per translation
      totalKeys: translationKeysCount,
      totalLanguages: input.targetLanguages.length,
    }
  }

  private async syncSingleTranslation(
    ctx: RequestContext,
    input: SyncTranslationsInput,
  ): Promise<SyncTranslationsResult> {
    if (!input.translationKeyId) {
      throw new Error(
        'Translation key ID is required for single translation sync',
      )
    }

    if (!input.targetLanguage) {
      throw new Error('Target language is required for single translation sync')
    }

    if (!input.sourceText) {
      throw new Error('Source text is required for single translation sync')
    }

    // Verify translation key exists and user has access
    const translationKey = await this.prisma.translationKey.findFirst({
      where: {
        id: input.translationKeyId,
        project: {
          channelToken: ctx.channelToken,
        },
      },
    })

    if (!translationKey) {
      throw new EntityNotFoundException(
        'Translation key',
        input.translationKeyId,
      )
    }

    // Queue the job
    const jobId = await this.translationQueueService.queueSyncSingleTranslation(
      {
        translationKeyId: input.translationKeyId,
        sourceLanguage: input.sourceLanguage,
        targetLanguage: input.targetLanguage,
        sourceText: input.sourceText,
        channelToken: ctx.channel.token!,
        userId: ctx.user?.id || '',
      },
    )

    return {
      success: true,
      jobId,
      message: `Single translation sync job queued for key ${input.translationKeyId}`,
      estimatedDuration: 5, // ~5 seconds for single translation
      totalKeys: 1,
      totalLanguages: 1,
    }
  }
}
