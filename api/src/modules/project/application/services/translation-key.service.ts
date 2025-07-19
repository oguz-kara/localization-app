import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateTranslationKeyInput } from '../../api/graphql/dto/create-translation-key.input'
import { UpdateTranslationKeyInput } from '../../api/graphql/dto/update-translation-key.input'
import { TranslationKeyEntity } from '../../api/graphql/entities/translation-key.entity'
import { ProjectService } from './project.service'
import {
  UniqueConstraintViolationException,
  EntityNotFoundException,
} from 'src/common/exceptions'

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
      description: translationKey.description ?? undefined,
      context: translationKey.context ?? undefined,
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

    return translationKeys.map((key) => ({
      id: key.id,
      key: key.key,
      description: key.description ?? undefined,
      context: key.context ?? undefined,
      isActive: key.isActive,
      projectId: key.projectId,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    }))
  }

  async updateTranslationKey(
    ctx: RequestContext,
    input: UpdateTranslationKeyInput,
  ): Promise<TranslationKeyEntity> {
    // Find the translation key and verify access
    const existingKey = await this.prisma.translationKey.findUnique({
      where: { id: input.id },
      include: { project: true },
    })

    if (!existingKey) {
      throw new EntityNotFoundException('TranslationKey', input.id)
    }

    // Verify project access
    await this.projectService.verifyProjectAccess(ctx, existingKey.projectId)

    // Check if new key name conflicts (if key is being updated)
    if (input.key && input.key !== existingKey.key) {
      const conflictingKey = await this.prisma.translationKey.findUnique({
        where: {
          key_projectId: {
            key: input.key,
            projectId: existingKey.projectId,
          },
        },
      })

      if (conflictingKey) {
        throw new UniqueConstraintViolationException('key')
      }
    }

    const updatedKey = await this.prisma.translationKey.update({
      where: { id: input.id },
      data: {
        ...(input.key && { key: input.key }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.context !== undefined && { context: input.context }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    })

    return {
      id: updatedKey.id,
      key: updatedKey.key,
      description: updatedKey.description ?? undefined,
      context: updatedKey.context ?? undefined,
      isActive: updatedKey.isActive,
      projectId: updatedKey.projectId,
      createdAt: updatedKey.createdAt,
      updatedAt: updatedKey.updatedAt,
    }
  }

  async deleteTranslationKey(
    ctx: RequestContext,
    id: string,
  ): Promise<TranslationKeyEntity> {
    // Find the translation key and verify access
    const existingKey = await this.prisma.translationKey.findUnique({
      where: { id },
      include: { project: true },
    })

    if (!existingKey) {
      throw new EntityNotFoundException('TranslationKey', id)
    }

    // Verify project access
    await this.projectService.verifyProjectAccess(ctx, existingKey.projectId)

    // Soft delete by setting isActive to false
    const deletedKey = await this.prisma.translationKey.update({
      where: { id },
      data: { isActive: false },
    })

    return {
      id: deletedKey.id,
      key: deletedKey.key,
      description: deletedKey.description ?? undefined,
      context: deletedKey.context ?? undefined,
      isActive: deletedKey.isActive,
      projectId: deletedKey.projectId,
      createdAt: deletedKey.createdAt,
      updatedAt: deletedKey.updatedAt,
    }
  }
}
