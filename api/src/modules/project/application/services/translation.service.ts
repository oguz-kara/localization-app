import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { ProjectService } from './project.service'
import { TranslationsResponse } from '../../api/graphql/entities/translations-response.entity'
import { TranslationEntity } from '../../api/graphql/entities/translation.entity'
import { CreateTranslationInput } from '../../api/graphql/dto/create-translation.input'
import { UpdateTranslationInput } from '../../api/graphql/dto/update-translation.input'
import { EntityNotFoundException } from 'src/common/exceptions'
import { ImportTranslationsInput, ExportTranslationsInput, ImportResult, ExportResult } from '../../api/graphql/entities/import-export.entity'
import { TranslationStatus } from '@prisma/client'

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

  async importTranslations(
    ctx: RequestContext,
    input: ImportTranslationsInput,
  ): Promise<ImportResult> {
    // Verify project access
    await this.projectService.verifyProjectAccess(ctx, input.projectId)

    // Verify language exists
    const language = await this.prisma.language.findUnique({
      where: { code: input.languageCode },
    })

    if (!language) {
      throw new EntityNotFoundException('Language', input.languageCode)
    }

    // Create a job ID for tracking (in real implementation, this would be handled by a job queue)
    const jobId = `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Process translations asynchronously (simplified for now)
    setImmediate(async () => {
      try {
        await this.processImportTranslations(ctx, input, language.id)
      } catch (error) {
        console.error('Import processing failed:', error)
        // In a real implementation, update job status to failed
      }
    })

    return {
      jobId,
      message: 'Import job started successfully',
      totalKeys: Object.keys(input.translations).length,
      status: 'PROCESSING',
    }
  }

  async exportTranslations(
    ctx: RequestContext,
    input: ExportTranslationsInput,
  ): Promise<ExportResult> {
    // Verify project access
    await this.projectService.verifyProjectAccess(ctx, input.projectId)

    // Verify language exists
    const language = await this.prisma.language.findUnique({
      where: { code: input.languageCode },
    })

    if (!language) {
      throw new EntityNotFoundException('Language', input.languageCode)
    }

    // Create a job ID for tracking
    const jobId = `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Process export asynchronously (simplified for now)
    setImmediate(async () => {
      try {
        await this.processExportTranslations(ctx, input, language.id)
      } catch (error) {
        console.error('Export processing failed:', error)
        // In a real implementation, update job status to failed
      }
    })

    return {
      jobId,
      message: 'Export job started successfully',
      status: 'PROCESSING',
    }
  }

  private async processImportTranslations(
    ctx: RequestContext,
    input: ImportTranslationsInput,
    languageId: string,
  ): Promise<void> {
    const { projectId, translations } = input

    for (const [key, value] of Object.entries(translations)) {
      // Find or create translation key
      const translationKey = await this.prisma.translationKey.upsert({
        where: {
          key_projectId: {
            key,
            projectId,
          },
        },
        update: {},
        create: {
          key,
          projectId,
        },
      })

      // Create or update translation
      await this.prisma.translation.upsert({
        where: {
          translationKeyId_languageId: {
            translationKeyId: translationKey.id,
            languageId,
          },
        },
        update: {
          value,
          status: TranslationStatus.IN_REVIEW,
        },
        create: {
          value,
          status: TranslationStatus.IN_REVIEW,
          translationKeyId: translationKey.id,
          languageId,
        },
      })
    }
  }

  private async processExportTranslations(
    ctx: RequestContext,
    input: ExportTranslationsInput,
    languageId: string,
  ): Promise<void> {
    const { projectId, format } = input

    // Get all translations for the project and language
    const translations = await this.getTranslations(ctx, projectId, input.languageCode)

    // Format data based on requested format
    let exportData: string
    switch (format) {
      case 'JSON':
        exportData = JSON.stringify(translations.translations, null, 2)
        break
      case 'YAML':
        // For now, we'll use a simple YAML-like format
        // In a real implementation, use a proper YAML library
        exportData = Object.entries(translations.translations)
          .map(([key, value]) => `${key}: "${value}"`)
          .join('\n')
        break
      default:
        throw new Error(`Unsupported format: ${format}`)
    }

    // In a real implementation, save to file system or cloud storage
    console.log('Export data generated:', exportData.length, 'characters')
  }

  async createTranslation(
    ctx: RequestContext,
    input: CreateTranslationInput,
  ): Promise<TranslationEntity> {
    // Verify the translation key exists and we have access
    const translationKey = await this.prisma.translationKey.findUnique({
      where: { id: input.translationKeyId },
      include: { project: true },
    })

    if (!translationKey) {
      throw new EntityNotFoundException('TranslationKey', input.translationKeyId)
    }

    // Verify project access
    await this.projectService.verifyProjectAccess(ctx, translationKey.projectId)

    // Verify language exists
    const language = await this.prisma.language.findUnique({
      where: { code: input.language },
    })

    if (!language) {
      throw new EntityNotFoundException('Language', input.language)
    }

    // Create the translation
    const translation = await this.prisma.translation.create({
      data: {
        value: input.value,
        status: input.status || TranslationStatus.IN_REVIEW,
        translationKeyId: input.translationKeyId,
        languageId: language.id,
      },
    })

    return {
      id: translation.id,
      value: translation.value,
      status: translation.status,
      machineTranslated: translation.machineTranslated,
      reviewNotes: translation.reviewNotes ?? undefined,
      translationKeyId: translation.translationKeyId,
      languageId: translation.languageId,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    }
  }

  async updateTranslation(
    ctx: RequestContext,
    input: UpdateTranslationInput,
  ): Promise<TranslationEntity> {
    // Find the translation and verify access
    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id: input.id },
      include: { 
        translationKey: { 
          include: { project: true } 
        } 
      },
    })

    if (!existingTranslation) {
      throw new EntityNotFoundException('Translation', input.id)
    }

    // Verify project access
    await this.projectService.verifyProjectAccess(
      ctx, 
      existingTranslation.translationKey.projectId
    )

    // Update the translation
    const updatedTranslation = await this.prisma.translation.update({
      where: { id: input.id },
      data: {
        ...(input.value !== undefined && { value: input.value }),
        ...(input.status !== undefined && { status: input.status }),
      },
    })

    return {
      id: updatedTranslation.id,
      value: updatedTranslation.value,
      status: updatedTranslation.status,
      machineTranslated: updatedTranslation.machineTranslated,
      reviewNotes: updatedTranslation.reviewNotes ?? undefined,
      translationKeyId: updatedTranslation.translationKeyId,
      languageId: updatedTranslation.languageId,
      createdAt: updatedTranslation.createdAt,
      updatedAt: updatedTranslation.updatedAt,
    }
  }

  async deleteTranslation(
    ctx: RequestContext,
    id: string,
  ): Promise<TranslationEntity> {
    // Find the translation and verify access
    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
      include: { 
        translationKey: { 
          include: { project: true } 
        } 
      },
    })

    if (!existingTranslation) {
      throw new EntityNotFoundException('Translation', id)
    }

    // Verify project access
    await this.projectService.verifyProjectAccess(
      ctx, 
      existingTranslation.translationKey.projectId
    )

    // Delete the translation
    const deletedTranslation = await this.prisma.translation.delete({
      where: { id },
    })

    return {
      id: deletedTranslation.id,
      value: deletedTranslation.value,
      status: deletedTranslation.status,
      machineTranslated: deletedTranslation.machineTranslated,
      reviewNotes: deletedTranslation.reviewNotes ?? undefined,
      translationKeyId: deletedTranslation.translationKeyId,
      languageId: deletedTranslation.languageId,
      createdAt: deletedTranslation.createdAt,
      updatedAt: deletedTranslation.updatedAt,
    }
  }
}