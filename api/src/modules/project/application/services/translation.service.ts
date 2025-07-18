import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { ProjectService } from './project.service'
import { TranslationsResponse } from '../../api/graphql/entities/translations-response.entity'
import { EntityNotFoundException } from 'src/common/exceptions'

@Injectable()
export class TranslationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectService: ProjectService,
  ) {}

  async getTranslations(
    ctx: RequestContext,
    projectId: string,
    languageCode: string,
  ): Promise<TranslationsResponse> {
    // Verify project access and that it belongs to the user's channel
    await this.projectService.verifyProjectAccess(ctx, projectId)

    // Verify language exists
    const language = await this.prisma.language.findUnique({
      where: { code: languageCode },
    })

    if (!language) {
      throw new EntityNotFoundException('Language', languageCode)
    }

    // Get all translation keys for the project
    const translationKeys = await this.prisma.translationKey.findMany({
      where: {
        projectId,
        isActive: true,
      },
      include: {
        translations: {
          where: {
            languageId: language.id,
          },
        },
      },
    })

    // Build the flat key-value object
    const translations: Record<string, string> = {}
    let translatedKeys = 0

    for (const key of translationKeys) {
      const translation = key.translations[0] // Should be 0 or 1 due to unique constraint
      if (translation) {
        translations[key.key] = translation.value
        translatedKeys++
      } else {
        // Include untranslated keys with empty string or the key itself
        translations[key.key] = ''
      }
    }

    return {
      translations,
      projectId,
      language: languageCode,
      totalKeys: translationKeys.length,
      translatedKeys,
    }
  }
}