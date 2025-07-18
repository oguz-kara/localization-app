import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'
import {
  TranslationProvider,
  TranslationResult,
  TranslationOptions,
} from '../../domain/interfaces/translation-provider.interface'

@Injectable()
export class OpenAITranslationProvider extends TranslationProvider {
  private readonly logger = new Logger(OpenAITranslationProvider.name)
  private readonly openai: OpenAI

  readonly name = 'openai'
  readonly supportedLanguages = [
    'en',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'ru',
    'ja',
    'ko',
    'zh',
    'ar',
    'hi',
    'tr',
    'pl',
    'nl',
    'sv',
    'no',
    'da',
    'fi',
    'cs',
    'sk',
    'hu',
    'ro',
    'bg',
    'hr',
    'sl',
    'et',
    'lv',
    'lt',
    'mt',
    'ga',
    'cy',
    'is',
    'mk',
    'sq',
    'sr',
    'bs',
    'me',
    'az',
    'kk',
    'ky',
    'tg',
    'tk',
    'uz',
    'mn',
    'my',
    'km',
    'lo',
    'th',
    'vi',
    'id',
    'ms',
    'tl',
    'haw',
    'mg',
    'sm',
    'to',
    'fj',
    'ty',
  ]

  constructor(private readonly configService: ConfigService) {
    super()

    const apiKey = this.configService.get<string>('OPENAI_API_KEY')
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is required for OpenAI translation provider',
      )
    }

    this.openai = new OpenAI({
      apiKey,
      timeout: 30000, // 30 second timeout
      maxRetries: 2,
    })
  }

  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    options?: TranslationOptions,
  ): Promise<TranslationResult> {
    try {
      this.logger.debug(
        `Translating text from ${sourceLanguage} to ${targetLanguage}`,
      )

      if (!this.supportsLanguagePair(sourceLanguage, targetLanguage)) {
        throw new Error(
          `Language pair ${sourceLanguage}->${targetLanguage} not supported`,
        )
      }

      const systemPrompt = this.buildSystemPrompt(
        sourceLanguage,
        targetLanguage,
        options,
      )
      const userPrompt = this.buildUserPrompt(text)

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: Math.min(4000, text.length * 3), // Estimate based on input length
        // timeout: options?.timeout || 25000,
      })

      const translatedText = response.choices[0]?.message?.content?.trim()

      if (!translatedText) {
        throw new Error('Empty response from OpenAI')
      }

      this.logger.debug(`Translation completed successfully`)

      return {
        translatedText,
        confidence: 0.9, // OpenAI doesn't provide confidence scores, so we use a high default
      }
    } catch (error) {
      this.logger.error(`Translation failed: ${error.message}`, error.stack)

      // Determine if error is retryable
      const isRetryable = this.isRetryableError(error)

      throw new Error(
        `Translation failed: ${error.message} (retryable: ${isRetryable})`,
      )
    }
  }

  async translateBatch(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
    options?: TranslationOptions,
  ): Promise<TranslationResult[]> {
    this.logger.debug(`Batch translating ${texts.length} texts`)

    // For now, process sequentially to avoid rate limits
    // In production, consider implementing proper batching with rate limiting
    const results: TranslationResult[] = []

    for (const text of texts) {
      try {
        const result = await this.translate(
          text,
          sourceLanguage,
          targetLanguage,
          options,
        )
        results.push(result)

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        this.logger.warn(`Failed to translate text in batch: ${error.message}`)
        // Continue with other translations, return empty result for failed ones
        results.push({
          translatedText: text, // Fallback to original text
          confidence: 0,
        })
      }
    }

    return results
  }

  supportsLanguagePair(
    sourceLanguage: string,
    targetLanguage: string,
  ): boolean {
    return (
      this.supportedLanguages.includes(sourceLanguage) &&
      this.supportedLanguages.includes(targetLanguage) &&
      sourceLanguage !== targetLanguage
    )
  }

  getEstimatedCost(
    texts: string[],
    // _sourceLanguage: string, // Unused: OpenAI pricing is the same for all language pairs
    // _targetLanguage: string, // Unused: OpenAI pricing is the same for all language pairs
  ): Promise<number> {
    // Rough estimate based on GPT-4o-mini pricing
    const totalTokens = texts.reduce(
      (sum, text) => sum + this.estimateTokens(text),
      0,
    )
    const inputCostPer1kTokens = 0.00015 // $0.15 per 1M tokens
    const outputCostPer1kTokens = 0.0006 // $0.60 per 1M tokens

    // Estimate output tokens as 1.5x input tokens for translation
    const estimatedOutputTokens = totalTokens * 1.5

    return Promise.resolve(
      (totalTokens / 1000) * inputCostPer1kTokens +
        (estimatedOutputTokens / 1000) * outputCostPer1kTokens,
    )
  }

  async healthCheck(): Promise<boolean> {
    try {
      const testResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
        // timeout: 10000,
      })

      return !!testResponse.choices[0]?.message?.content
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`)
      return false
    }
  }

  private buildSystemPrompt(
    sourceLanguage: string,
    targetLanguage: string,
    options?: TranslationOptions,
  ): string {
    let prompt = `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}.`

    if (options?.context) {
      prompt += ` Context: ${options.context}`
    }

    if (options?.formality) {
      prompt += ` Use ${options.formality} tone.`
    }

    prompt +=
      ' Respond only with the translated text, no additional commentary or explanations.'

    return prompt
  }

  private buildUserPrompt(text: string): string {
    return text
  }

  private isRetryableError(error: any): boolean {
    // Rate limit errors
    if (error.status === 429) return true

    // Server errors
    if (error.status >= 500) return true

    // Timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout'))
      return true

    // Network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNRESET') return true

    return false
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English
    // This is a simplification, real tokenization is more complex
    return Math.ceil(text.length / 4)
  }
}
