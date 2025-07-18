import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateTranslationKeyInput } from '../../api/graphql/dto/create-translation-key.input'
import { TranslationKeyEntity } from '../../api/graphql/entities/translation-key.entity'
import { ProjectService } from './project.service'
import { UniqueConstraintViolationException } from 'src/common/exceptions'

@Injectable()
export class TranslationKeyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectService: ProjectService,
  ) {}

  async createTranslationKey(
    ctx: RequestContext,
    input: CreateTranslationKeyInput,
  ): Promise<TranslationKeyEntity> {
    // Verify project access and that it belongs to the user's channel
    await this.projectService.verifyProjectAccess(ctx, input.projectId)

    // Check if translation key already exists in this project
    const existingKey = await this.prisma.translationKey.findUnique({
      where: {
        key_projectId: {
          key: input.key,
          projectId: input.projectId,
        },
      },
    })

    if (existingKey) {
      throw new UniqueConstraintViolationException('key')
    }

    const translationKey = await this.prisma.translationKey.create({
      data: {
        key: input.key,
        description: input.description,
        context: input.context,
        projectId: input.projectId,
      },
    })

    return {
      id: translationKey.id,
      key: translationKey.key,
      description: translationKey.description,
      context: translationKey.context,
      isActive: translationKey.isActive,
      projectId: translationKey.projectId,
      createdAt: translationKey.createdAt,
      updatedAt: translationKey.updatedAt,
    }
  }

  async getTranslationKeys(
    ctx: RequestContext,
    projectId: string,
  ): Promise<TranslationKeyEntity[]> {
    // Verify project access
    await this.projectService.verifyProjectAccess(ctx, projectId)

    const translationKeys = await this.prisma.translationKey.findMany({
      where: {
        projectId,
        isActive: true,
      },
      orderBy: {
        key: 'asc',
      },
    })

    return translationKeys.map(key => ({
      id: key.id,
      key: key.key,
      description: key.description,
      context: key.context,
      isActive: key.isActive,
      projectId: key.projectId,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    }))
  }
}