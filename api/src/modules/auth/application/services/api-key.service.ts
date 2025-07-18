import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import * as crypto from 'crypto'

export interface CreateApiKeyInput {
  name: string
  description?: string
}

export interface ApiKeyResponse {
  id: string
  name: string
  description?: string
  key: string // Only returned on creation
  isActive: boolean
  createdAt: Date
}

export interface ApiKeyListItem {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
}

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async createApiKey(
    ctx: RequestContext,
    input: CreateApiKeyInput,
  ): Promise<ApiKeyResponse> {
    // Generate a secure random API key
    const apiKey = this.generateApiKey()

    // Hash the API key for storage
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')

    const createdApiKey = await this.prisma.apiKey.create({
      data: {
        name: input.name,
        description: input.description,
        keyHash,
        channelToken: ctx.channelToken!,
      },
    })

    return {
      id: createdApiKey.id,
      name: createdApiKey.name,
      description: createdApiKey.description ?? undefined,
      key: apiKey, // Only return the plain key on creation
      isActive: createdApiKey.isActive,
      createdAt: createdApiKey.createdAt,
    }
  }

  async getApiKeys(ctx: RequestContext): Promise<ApiKeyListItem[]> {
    const apiKeys = await this.prisma.apiKey.findMany({
      where: { channelToken: ctx.channelToken! },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return apiKeys.map((apiKey) => ({
      id: apiKey.id,
      name: apiKey.name,
      description: apiKey.description ?? undefined,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
    }))
  }

  async revokeApiKey(ctx: RequestContext, id: string): Promise<boolean> {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, channelToken: ctx.channelToken! },
    })

    if (!apiKey) {
      return false
    }

    await this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    })

    return true
  }

  async deleteApiKey(ctx: RequestContext, id: string): Promise<boolean> {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, channelToken: ctx.channelToken! },
    })

    if (!apiKey) {
      return false
    }

    await this.prisma.apiKey.delete({
      where: { id },
    })

    return true
  }

  private generateApiKey(): string {
    const randomBytes = crypto.randomBytes(32)
    return `lm_${randomBytes.toString('base64').replace(/[+/]/g, '_').replace(/=/g, '')}`
  }
}
