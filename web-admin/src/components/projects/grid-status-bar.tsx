import { Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TRANSLATION_STATUS_DOT_CLASSES,
  TRANSLATION_STATUS_LABELS,
  TRANSLATION_STATUS_ORDER,
  type TranslationStatusCounts,
} from './translation-status'

const SHORTCUTS = [
  { key: 'Tab', label: 'Next cell' },
  { key: 'Enter', label: 'Edit / save' },
  { key: 'Esc', label: 'Cancel' },
]

interface GridStatusBarProps {
  keyCount: number
  languageCount: number
  counts: TranslationStatusCounts
}

export function GridStatusBar({
  keyCount,
  languageCount,
  counts,
}: GridStatusBarProps) {
  return (
    <section
      aria-label="Translation progress and keyboard shortcuts"
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-lg border bg-gray-50 px-4 py-3 text-sm"
    >
      <ul
        aria-label="Translation status summary"
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600"
      >
        <li className="font-medium text-gray-900">
          {keyCount} {keyCount === 1 ? 'key' : 'keys'} · {languageCount}{' '}
          {languageCount === 1 ? 'language' : 'languages'}
        </li>
        {TRANSLATION_STATUS_ORDER.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn(
                'size-2 rounded-full',
                TRANSLATION_STATUS_DOT_CLASSES[status],
              )}
            />
            <span className="font-medium tabular-nums text-gray-900">
              {counts[status]}
            </span>
            <span>{TRANSLATION_STATUS_LABELS[status]}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 text-gray-600">
        <Keyboard className="size-4 text-gray-400" />
        <dl
          aria-label="Keyboard shortcuts"
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          {SHORTCUTS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <dt>
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-xs">
                  {key}
                </kbd>
              </dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
