'use client'

import { useParams } from 'next/navigation'
import { TranslationGrid } from '@/components/projects/translation-grid'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
  useGetProjectQuery,
  useGetProjectTranslationsQuery,
} from '@/graphql/generated/hooks'

// Define the interface that matches what TranslationGrid expects
interface Translation {
  id?: string
  value: string
  status: 'UNTRANSLATED' | 'MACHINE_TRANSLATED' | 'IN_REVIEW' | 'APPROVED'
  machineTranslated: boolean
  translationKeyId: string
  languageId: string
}

interface TranslationKey {
  id: string
  key: string
  description?: string | null
  context?: string | null
  isActive: boolean
  projectId: string
  createdAt: string
  updatedAt: string
  translations?: Record<string, Translation>
}

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useGetProjectQuery({
    variables: { id: projectId },
    skip: !projectId,
  })

  const {
    data: translationsData,
    loading: translationsLoading,
    error: translationsError,
  } = useGetProjectTranslationsQuery({
    variables: { projectId },
    skip: !projectId,
  })

  if (projectLoading || translationsLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading project...</p>
        </div>
      </div>
    )
  }

  if (projectError || translationsError) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500">
            Error loading project. Please try again.
          </p>
        </div>
      </div>
    )
  }

  const project = projectData?.project
  const translationKeyEntities = translationsData?.translationKeys || []

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found.</p>
        </div>
      </div>
    )
  }

  // Transform TranslationKeyEntity to TranslationKey format
  const translationKeys: TranslationKey[] = translationKeyEntities.map(
    (entity) => {
      // Parse the translations JSON from the TranslationsResponse
      let translations: Record<string, Translation> = {}

      if (entity.translations?.translations) {
        try {
          const parsedTranslations =
            typeof entity.translations.translations === 'string'
              ? JSON.parse(entity.translations.translations)
              : entity.translations.translations

          // Convert the parsed translations to the expected format
          if (parsedTranslations && typeof parsedTranslations === 'object') {
            Object.entries(parsedTranslations).forEach(
              ([language, translationData]: [string, any]) => {
                if (translationData && typeof translationData === 'object') {
                  translations[language] = {
                    id: translationData.id,
                    value: translationData.value || '',
                    status: translationData.status || 'UNTRANSLATED',
                    machineTranslated:
                      translationData.machineTranslated || false,
                    translationKeyId: entity.id,
                    languageId: language,
                  }
                }
              },
            )
          }
        } catch (error) {
          console.error('Error parsing translations:', error)
        }
      }

      return {
        id: entity.id,
        key: entity.key,
        description: entity.description,
        context: entity.context,
        isActive: entity.isActive,
        projectId: entity.projectId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        translations,
      }
    },
  )

  return (
    <div className="p-6">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 mt-1">{project.description}</p>
            )}
          </div>
          <Badge variant={project.isActive ? 'default' : 'secondary'}>
            {project.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          Updated{' '}
          {formatDistanceToNow(new Date(project.updatedAt), {
            addSuffix: true,
          })}
        </div>
      </div>

      <TranslationGrid
        projectId={projectId}
        translationKeys={translationKeys}
      />
    </div>
  )
}
