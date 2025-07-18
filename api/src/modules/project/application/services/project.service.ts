import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateProjectInput } from '../../api/graphql/dto/create-project.input'
import { ProjectEntity } from '../../api/graphql/entities/project.entity'
import {
  EntityNotFoundException,
  UniqueConstraintViolationException,
  AccessDeniedException,
} from 'src/common/exceptions'

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

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
}
