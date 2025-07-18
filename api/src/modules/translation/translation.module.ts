import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAITranslationProvider } from './infrastructure/providers/openai.provider';
import { TranslationProviderService } from './application/services/translation-provider.service';

@Module({
  imports: [ConfigModule],
  providers: [
    OpenAITranslationProvider,
    {
      provide: 'TRANSLATION_PROVIDERS',
      useFactory: (openaiProvider: OpenAITranslationProvider) => [openaiProvider],
      inject: [OpenAITranslationProvider],
    },
    TranslationProviderService,
  ],
  exports: [TranslationProviderService],
})
export class TranslationModule {}