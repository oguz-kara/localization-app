import { Injectable, Inject, Logger } from '@nestjs/common';
import { TranslationProvider, TranslationResult, TranslationOptions } from '../../domain/interfaces/translation-provider.interface';

@Injectable()
export class TranslationProviderService {
  private readonly logger = new Logger(TranslationProviderService.name);

  constructor(
    @Inject('TRANSLATION_PROVIDERS')
    private readonly providers: TranslationProvider[],
  ) {}

  /**
   * Get the best available provider for a language pair
   */
  getProviderForLanguagePair(sourceLanguage: string, targetLanguage: string): TranslationProvider | null {
    const supportedProviders = this.providers.filter(provider => 
      provider.supportsLanguagePair(sourceLanguage, targetLanguage)
    );

    if (supportedProviders.length === 0) {
      this.logger.warn(`No translation provider supports ${sourceLanguage} -> ${targetLanguage}`);
      return null;
    }

    // For now, return the first available provider
    // In the future, could implement provider selection logic based on quality, cost, etc.
    return supportedProviders[0];
  }

  /**
   * Translate text using the best available provider
   */
  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    options?: TranslationOptions,
  ): Promise<TranslationResult> {
    const provider = this.getProviderForLanguagePair(sourceLanguage, targetLanguage);
    
    if (!provider) {
      throw new Error(`No translation provider available for ${sourceLanguage} -> ${targetLanguage}`);
    }

    this.logger.debug(`Using provider ${provider.name} for translation`);
    
    return provider.translate(text, sourceLanguage, targetLanguage, options);
  }

  /**
   * Batch translate texts using the best available provider
   */
  async translateBatch(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
    options?: TranslationOptions,
  ): Promise<TranslationResult[]> {
    const provider = this.getProviderForLanguagePair(sourceLanguage, targetLanguage);
    
    if (!provider) {
      throw new Error(`No translation provider available for ${sourceLanguage} -> ${targetLanguage}`);
    }

    this.logger.debug(`Using provider ${provider.name} for batch translation`);
    
    return provider.translateBatch(texts, sourceLanguage, targetLanguage, options);
  }

  /**
   * Get all supported language pairs
   */
  getSupportedLanguagePairs(): Array<{ source: string; target: string; providers: string[] }> {
    const languagePairs = new Map<string, string[]>();

    for (const provider of this.providers) {
      for (const source of provider.supportedLanguages) {
        for (const target of provider.supportedLanguages) {
          if (source !== target) {
            const key = `${source}->${target}`;
            if (!languagePairs.has(key)) {
              languagePairs.set(key, []);
            }
            languagePairs.get(key)!.push(provider.name);
          }
        }
      }
    }

    return Array.from(languagePairs.entries()).map(([pair, providers]) => {
      const [source, target] = pair.split('->');
      return { source, target, providers };
    });
  }

  /**
   * Health check for all providers
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const provider of this.providers) {
      try {
        results[provider.name] = await provider.healthCheck();
      } catch (error) {
        this.logger.error(`Health check failed for provider ${provider.name}: ${error.message}`);
        results[provider.name] = false;
      }
    }
    
    return results;
  }
}