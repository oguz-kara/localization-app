import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: React.ReactNode
  action?: React.ReactNode
  /** Heading level that fits the surrounding document outline. */
  titleAs?: 'h2' | 'h3'
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  titleAs: Title = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center',
        className,
      )}
    >
      <Icon className="size-8 text-gray-400" />
      <Title className="text-base font-semibold text-gray-900">{title}</Title>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
