import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslationProviderService } from './application/services/translation-provider.service';
import { OpenAITranslationProvider } from './infrastructure/providers/openai.provider';

describe('TranslationProviderService Integration', () => {
  let service: TranslationProviderService;
  let openaiProvider: OpenAITranslationProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        OpenAITranslationProvider,
        {
          provide: 'TRANSLATION_PROVIDERS',
          useFactory: (openaiProvider: OpenAITranslationProvider) => [openaiProvider],
          inject: [OpenAITranslationProvider],
        },
        TranslationProviderService,
      ],
    }).compile();

    service = module.get<TranslationProviderService>(TranslationProviderService);
    openaiProvider = module.get<OpenAITranslationProvider>(OpenAITranslationProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(openaiProvider).toBeDefined();
  });

  it('should find provider for supported language pair', () => {
    const provider = service.getProviderForLanguagePair('en', 'es');
    expect(provider).toBeDefined();
    expect(provider?.name).toBe('openai');
  });

  it('should return null for unsupported language pair', () => {
    const provider = service.getProviderForLanguagePair('xyz', 'abc');
    expect(provider).toBeNull();
  });

  it('should support common language pairs', () => {
    const commonPairs = [
      ['en', 'es'],
      ['en', 'fr'],
      ['en', 'de'],
      ['es', 'en'],
      ['fr', 'en'],
    ];

    for (const [source, target] of commonPairs) {
      const provider = service.getProviderForLanguagePair(source, target);
      expect(provider).toBeDefined();
      expect(provider?.name).toBe('openai');
    }
  });

  it('should get supported language pairs', () => {
    const languagePairs = service.getSupportedLanguagePairs();
    expect(languagePairs).toBeDefined();
    expect(languagePairs.length).toBeGreaterThan(0);
    
    // Check that English to Spanish is supported
    const enToEs = languagePairs.find(pair => pair.source === 'en' && pair.target === 'es');
    expect(enToEs).toBeDefined();
    expect(enToEs?.providers).toContain('openai');
  });

  // Note: This test requires a valid OpenAI API key
  // Remove .skip to run with actual API
  it.skip('should translate text using OpenAI provider', async () => {
    const result = await service.translate('Hello, world!', 'en', 'es');
    expect(result).toBeDefined();
    expect(result.translatedText).toBeDefined();
    expect(result.translatedText).not.toBe('Hello, world!');
    expect(result.confidence).toBeGreaterThan(0);
  }, 30000);
});