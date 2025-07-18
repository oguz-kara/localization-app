export interface SyncProjectTranslationsJobData {
  projectId: string;
  sourceLanguage: string;
  targetLanguages: string[];
  channelToken: string;
  userId: string;
}

export interface SyncSingleTranslationJobData {
  translationKeyId: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  channelToken: string;
  userId: string;
}