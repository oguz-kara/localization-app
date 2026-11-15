export type TranslationStatus =
  | 'UNTRANSLATED'
  | 'MACHINE_TRANSLATED'
  | 'IN_REVIEW'
  | 'APPROVED'

export type TranslationStatusCounts = Record<TranslationStatus, number>

/** Display order for status summaries: most complete first. */
export const TRANSLATION_STATUS_ORDER: TranslationStatus[] = [
  'APPROVED',
  'IN_REVIEW',
  'MACHINE_TRANSLATED',
  'UNTRANSLATED',
]

export const TRANSLATION_STATUS_LABELS: Record<TranslationStatus, string> = {
  APPROVED: 'Approved',
  IN_REVIEW: 'In review',
  MACHINE_TRANSLATED: 'Machine translated',
  UNTRANSLATED: 'Untranslated',
}

export const TRANSLATION_STATUS_DOT_CLASSES: Record<TranslationStatus, string> =
  {
    APPROVED: 'bg-emerald-500',
    IN_REVIEW: 'bg-amber-500',
    MACHINE_TRANSLATED: 'bg-violet-500',
    UNTRANSLATED: 'bg-gray-300',
  }

interface StatusSource {
  translations?: Record<
    string,
    { value: string; status: TranslationStatus } | undefined
  >
}

/**
 * Counts every key × language cell by workflow status. A cell with no
 * translation, or an empty value, counts as UNTRANSLATED.
 */
export function countTranslationStatuses(
  keys: StatusSource[],
  languages: string[],
): TranslationStatusCounts {
  const counts: TranslationStatusCounts = {
    APPROVED: 0,
    IN_REVIEW: 0,
    MACHINE_TRANSLATED: 0,
    UNTRANSLATED: 0,
  }

  for (const key of keys) {
    for (const language of languages) {
      const translation = key.translations?.[language]
      const status =
        translation?.value && translation.status in counts
          ? translation.status
          : 'UNTRANSLATED'
      counts[status] += 1
    }
  }

  return counts
}
