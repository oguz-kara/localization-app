export interface TranslationResult {
  translatedText: string;
  confidence?: number;
  detectedSourceLanguage?: string;
}

export interface TranslationError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface TranslationOptions {
  context?: string;
  formality?: 'formal' | 'informal';
  maxRetries?: number;
  timeout?: number;
}

export abstract class TranslationProvider {
  abstract readonly name: string;
  abstract readonly supportedLanguages: string[];
  
  /**
   * Translate text from source language to target language
   */
  abstract translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    options?: TranslationOptions,
  ): Promise<TranslationResult>;

  /**
   * Batch translate multiple texts
   */
  abstract translateBatch(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
    options?: TranslationOptions,
  ): Promise<TranslationResult[]>;

  /**
   * Check if the provider supports the given language pair
   */
  abstract supportsLanguagePair(sourceLanguage: string, targetLanguage: string): boolean;

  /**
   * Get the provider's estimated cost for translation (optional)
   */
  abstract getEstimatedCost?(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<number>;

  /**
   * Health check for the provider
   */
  abstract healthCheck(): Promise<boolean>;
}