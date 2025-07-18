export const TRANSLATION_QUEUE = 'translation-queue';
export const DEAD_LETTER_QUEUE = 'translation-dead-letter-queue';

export enum TranslationJobType {
  SYNC_PROJECT_TRANSLATIONS = 'sync-project-translations',
  SYNC_SINGLE_TRANSLATION = 'sync-single-translation',
}