import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import {
  TRANSLATION_QUEUE,
  TranslationJobType,
} from '../../domain/constants/queue.constants'
import {
  SyncProjectTranslationsJobData,
  SyncSingleTranslationJobData,
} from '../../domain/interfaces/translation-job.interface'
import { TranslationProviderService } from '../../../translation/application/services/translation-provider.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
// import { RequestContext } from 'src/common/request-context/request-context'
import { TranslationStatus } from '@prisma/client'

@Processor(TRANSLATION_QUEUE)
export class TranslationJobProcessor {
  private readonly logger = new Logger(TranslationJobProcessor.name)

  constructor(
    private readonly translationProviderService: TranslationProviderService,
    private readonly prisma: PrismaService,
  ) {}

  @Process(TranslationJobType.SYNC_PROJECT_TRANSLATIONS)
  async handleSyncProjectTranslations(
    job: Job<SyncProjectTranslationsJobData>,
  ) {
    const {
      projectId,
      sourceLanguage,
      targetLanguages /* channelToken, userId */,
    } = job.data

    this.logger.log(
      `Processing sync project translations job for project ${projectId}`,
    )

    try {
      // Create request context for the job
      // const requestContext = new RequestContext({
      //   channel: {
      //     token: channelToken,
      //   },
      //   user: {
      //     id: userId,
      //   },
      // })

      // Get all translation keys for the project that need translation
      const translationKeys = await this.prisma.translationKey.findMany({
        where: { projectId },
        include: {
          translations: {
            where: { language: { code: sourceLanguage } },
          },
        },
      })

      let processedCount = 0
      const totalKeys = translationKeys.length

      for (const translationKey of translationKeys) {
        const sourceTranslation = translationKey.translations[0]
        if (!sourceTranslation?.value) {
          this.logger.warn(
            `No source translation found for key ${translationKey.key} in language ${sourceLanguage}`,
          )
          continue
        }

        // Process each target language
        for (const targetLanguage of targetLanguages) {
          if (targetLanguage === sourceLanguage) continue

          try {
            // Check if translation already exists and is approved
            const existingTranslation = await this.prisma.translation.findFirst(
              {
                where: {
                  translationKeyId: translationKey.id,
                  language: { code: targetLanguage },
                },
              },
            )

            // Skip if translation exists and is approved
            if (existingTranslation?.status === TranslationStatus.APPROVED) {
              this.logger.debug(
                `Skipping approved translation for ${translationKey.key} in ${targetLanguage}`,
              )
              continue
            }

            // Translate the text
            const translationResult =
              await this.translationProviderService.translate(
                sourceTranslation.value,
                sourceLanguage,
                targetLanguage,
                {
                  context: translationKey.description || undefined,
                  timeout: 30000,
                },
              )

            // Update or create the translation
            await this.prisma.translation.upsert({
              where: {
                translationKeyId_languageId: {
                  translationKeyId: translationKey.id,
                  languageId: targetLanguage,
                },
              },
              create: {
                translationKeyId: translationKey.id,
                languageId: targetLanguage,
                value: translationResult.translatedText,
                status: TranslationStatus.MACHINE_TRANSLATED,
              },
              update: {
                value: translationResult.translatedText,
                status: TranslationStatus.MACHINE_TRANSLATED,
              },
            })

            this.logger.debug(
              `Translated ${translationKey.key} to ${targetLanguage}`,
            )

            // Update job progress
            processedCount++
            await job.progress(
              Math.round(
                (processedCount / (totalKeys * targetLanguages.length)) * 100,
              ),
            )
          } catch (error) {
            this.logger.error(
              `Failed to translate ${translationKey.key} to ${targetLanguage}: ${error.message}`,
            )
            // Continue with other translations instead of failing the entire job
          }
        }
      }

      this.logger.log(
        `Completed sync project translations job for project ${projectId}. Processed ${processedCount} translations.`,
      )

      return {
        success: true,
        processedCount,
        totalKeys,
        targetLanguages: targetLanguages.length,
      }
    } catch (error) {
      this.logger.error(
        `Sync project translations job failed: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  @Process(TranslationJobType.SYNC_SINGLE_TRANSLATION)
  async handleSyncSingleTranslation(job: Job<SyncSingleTranslationJobData>) {
    const {
      translationKeyId,
      sourceLanguage,
      targetLanguage,
      sourceText,
      // channelToken,
      // userId,
    } = job.data

    this.logger.log(
      `Processing single translation job for key ${translationKeyId}`,
    )

    try {
      // Create request context for the job
      // const requestContext = new RequestContext({
      //   channel: {
      //     token: channelToken,
      //   },
      //   user: {
      //     id: userId,
      //   },
      // })

      // Get the translation key for context
      const translationKey = await this.prisma.translationKey.findUnique({
        where: { id: translationKeyId },
      })

      if (!translationKey) {
        throw new Error(`Translation key ${translationKeyId} not found`)
      }

      // Translate the text
      const translationResult = await this.translationProviderService.translate(
        sourceText,
        sourceLanguage,
        targetLanguage,
        {
          context: translationKey.description || undefined,
          timeout: 30000,
        },
      )

      // Update or create the translation
      await this.prisma.translation.upsert({
        where: {
          translationKeyId_languageId: {
            translationKeyId,
            languageId: targetLanguage,
          },
        },
        create: {
          translationKeyId,
          languageId: targetLanguage,
          value: translationResult.translatedText,
          status: TranslationStatus.MACHINE_TRANSLATED,
        },
        update: {
          value: translationResult.translatedText,
          status: TranslationStatus.MACHINE_TRANSLATED,
        },
      })

      this.logger.log(
        `Completed single translation job for key ${translationKeyId}`,
      )

      return {
        success: true,
        translationKeyId,
        sourceLanguage,
        targetLanguage,
        translatedText: translationResult.translatedText,
        confidence: translationResult.confidence,
      }
    } catch (error) {
      this.logger.error(
        `Single translation job failed: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`)
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} completed successfully`, result)
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`, error.stack)

    // Log job details for debugging
    this.logger.error(`Job data: ${JSON.stringify(job.data)}`)
    this.logger.error(`Job attempts: ${job.attemptsMade}/${job.opts.attempts}`)

    // If this is the final attempt, the job will be moved to failed state
    if (job.attemptsMade >= (job.opts?.attempts || 0)) {
      this.logger.error(
        `Job ${job.id} exhausted all retry attempts and will be moved to failed queue`,
      )
    }
  }
}
