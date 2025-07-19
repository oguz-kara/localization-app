'use client'

import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  MoreHorizontal,
  Info,
  Plus,
  Save,
  X,
  Zap,
  Edit2,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { KeyDetailsPanel } from './key-details-panel'
import { CreateTranslationKeyModal } from './create-translation-key-modal'
import {
  useSyncTranslationsMutation,
  useCreateTranslationMutation,
  useUpdateTranslationMutation,
  useDeleteTranslationMutation,
  useUpdateTranslationKeyMutation,
  useDeleteTranslationKeyMutation,
  GetProjectTranslationsDocument,
  useGetProjectTranslationsQuery,
} from '@/graphql/generated/hooks'
import React from 'react'

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

interface TranslationGridProps {
  projectId: string
  translationKeys: TranslationKey[]
}

interface EditingCell {
  keyId: string
  language: string
  value: string
}

export function TranslationGrid({
  projectId,
  translationKeys,
}: TranslationGridProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apolloClient = useApolloClient()

  // Read from Apollo cache to get real-time updates
  const { data: translationKeysData } = useGetProjectTranslationsQuery({
    variables: { projectId },
  })

  // Transform TranslationKeyEntity to TranslationKey format
  const transformedTranslationKeys: TranslationKey[] = React.useMemo(() => {
    if (!translationKeysData?.translationKeys) return translationKeys // fallback to props

    return translationKeysData.translationKeys.map((entity: any) => {
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
    })
  }, [translationKeysData, translationKeys])

  // Use transformed data from cache, fallback to props
  const displayTranslationKeys =
    transformedTranslationKeys.length > 0
      ? transformedTranslationKeys
      : translationKeys

  // Cache manipulation functions
  const updateTranslationInCache = (
    translationKeyId: string,
    language: string,
    translation: any,
  ) => {
    try {
      const existingData = apolloClient.readQuery({
        query: GetProjectTranslationsDocument,
        variables: { projectId },
      })

      if (existingData?.translationKeys) {
        const updatedTranslationKeys = existingData.translationKeys.map(
          (key: any) => {
            if (key.id === translationKeyId) {
              const currentTranslations = key.translations?.translations || '{}'
              const parsedTranslations =
                typeof currentTranslations === 'string'
                  ? JSON.parse(currentTranslations)
                  : currentTranslations

              const updatedParsedTranslations = { ...parsedTranslations }
              updatedParsedTranslations[language] = translation

              return {
                ...key,
                translations: {
                  ...key.translations,
                  translations: JSON.stringify(updatedParsedTranslations),
                },
              }
            }
            return key
          },
        )

        apolloClient.writeQuery({
          query: GetProjectTranslationsDocument,
          variables: { projectId },
          data: {
            translationKeys: updatedTranslationKeys,
          },
        })
      }
    } catch (error) {
      console.error('Error updating translation in cache:', error)
    }
  }

  const removeTranslationFromCache = (
    translationKeyId: string,
    language: string,
  ) => {
    try {
      const existingData = apolloClient.readQuery({
        query: GetProjectTranslationsDocument,
        variables: { projectId },
      })

      if (existingData?.translationKeys) {
        const updatedTranslationKeys = existingData.translationKeys.map(
          (key: any) => {
            if (key.id === translationKeyId) {
              // The translations are stored in a nested structure
              const currentTranslations = key.translations?.translations || {}
              const parsedTranslations = typeof currentTranslations === 'string' 
                ? JSON.parse(currentTranslations) 
                : currentTranslations
              
              // Remove the specific language translation
              const updatedParsedTranslations = { ...parsedTranslations }
              delete updatedParsedTranslations[language]
              
              return {
                ...key,
                translations: {
                  ...key.translations,
                  translations: JSON.stringify(updatedParsedTranslations)
                }
              }
            }
            return key
          },
        )

        apolloClient.writeQuery({
          query: GetProjectTranslationsDocument,
          variables: { projectId },
          data: {
            translationKeys: updatedTranslationKeys,
          },
        })
      }
    } catch (error) {
      console.error('Error removing translation from cache:', error)
    }
  }

  const updateTranslationKeyInCache = (
    translationKeyId: string,
    updates: any,
  ) => {
    try {
      const existingData = apolloClient.readQuery({
        query: GetProjectTranslationsDocument,
        variables: { projectId },
      })

      if (existingData?.translationKeys) {
        const updatedTranslationKeys = existingData.translationKeys.map(
          (key: any) => {
            if (key.id === translationKeyId) {
              return { ...key, ...updates }
            }
            return key
          },
        )

        apolloClient.writeQuery({
          query: GetProjectTranslationsDocument,
          variables: { projectId },
          data: {
            translationKeys: updatedTranslationKeys,
          },
        })
      }
    } catch (error) {
      console.error('Error updating translation key in cache:', error)
    }
  }

  const removeTranslationKeyFromCache = (translationKeyId: string) => {
    try {
      const existingData = apolloClient.readQuery({
        query: GetProjectTranslationsDocument,
        variables: { projectId },
      })

      if (existingData?.translationKeys) {
        const updatedTranslationKeys = existingData.translationKeys.filter(
          (key: any) => key.id !== translationKeyId,
        )

        apolloClient.writeQuery({
          query: GetProjectTranslationsDocument,
          variables: { projectId },
          data: {
            translationKeys: updatedTranslationKeys,
          },
        })
      }
    } catch (error) {
      console.error('Error removing translation key from cache:', error)
    }
  }

  const [syncTranslations] = useSyncTranslationsMutation({
    onCompleted: (data) => {
      console.log('Translation sync started:', data.syncTranslations)
      // Could show toast notification with job ID
    },
    onError: (error) => {
      console.error('Failed to sync translations:', error)
    },
  })

  const [createTranslation] = useCreateTranslationMutation({
    onError: (error) => {
      setError('Failed to create translation: ' + error.message)
      console.error('Failed to create translation:', error)
    },
  })

  const [updateTranslation] = useUpdateTranslationMutation({
    onError: (error) => {
      setError('Failed to update translation: ' + error.message)
      console.error('Failed to update translation:', error)
    },
  })

  const [deleteTranslation] = useDeleteTranslationMutation({
    onError: (error) => {
      setError('Failed to delete translation: ' + error.message)
      console.error('Failed to delete translation:', error)
    },
  })

  const [updateTranslationKey] = useUpdateTranslationKeyMutation({
    onCompleted: (data) => {
      setError(null)
      console.log('Translation key updated successfully')
      // Update cache with the updated translation key
      const updatedKey = data.updateTranslationKey
      updateTranslationKeyInCache(updatedKey.id, {
        key: updatedKey.key,
        description: updatedKey.description,
        context: updatedKey.context,
        isActive: updatedKey.isActive,
        updatedAt: updatedKey.updatedAt,
      })
    },
    onError: (error) => {
      setError('Failed to update translation key: ' + error.message)
      console.error('Failed to update translation key:', error)
    },
  })

  const [deleteTranslationKey] = useDeleteTranslationKeyMutation({
    onCompleted: (data) => {
      setError(null)
      console.log('Translation key deleted successfully')
      // Remove translation key from cache
      const deletedKey = data.deleteTranslationKey
      removeTranslationKeyFromCache(deletedKey.id)
    },
    onError: (error) => {
      setError('Failed to delete translation key: ' + error.message)
      console.error('Failed to delete translation key:', error)
    },
  })

  // For now, we'll use mock languages since we don't have them in the current queries
  const languages = ['en', 'es', 'fr', 'de']

  const handleCellClick = (
    keyId: string,
    language: string,
    currentValue: string = '',
  ) => {
    setEditingCell({ keyId, language, value: currentValue })
  }

  const handleSave = async (keyId: string, language: string, value: string) => {
    if (!value.trim()) {
      setEditingCell(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const translationKey = displayTranslationKeys.find(
        (key) => key.id === keyId,
      )
      const existingTranslation = translationKey?.translations?.[language]

      if (existingTranslation?.id) {
        // Update existing translation
        const { data } = await updateTranslation({
          variables: {
            input: {
              id: existingTranslation.id,
              value: value,
              status: 'IN_REVIEW',
            },
          },
        })
        if (data) {
          updateTranslationInCache(keyId, language, {
            ...existingTranslation,
            value,
            status: 'IN_REVIEW',
          })
        }
      } else {
        // Create new translation
        const { data } = await createTranslation({
          variables: {
            input: {
              translationKeyId: keyId,
              language: language,
              value: value,
              status: 'IN_REVIEW',
            },
          },
        })
        if (data && data.createTranslation) {
          updateTranslationInCache(keyId, language, {
            id: data.createTranslation.id,
            value: data.createTranslation.value,
            status: data.createTranslation.status,
            machineTranslated: data.createTranslation.machineTranslated,
            translationKeyId: keyId,
            languageId: language,
          })
        }
      }
      setEditingCell(null)
    } catch (error) {
      console.error('Failed to save translation:', error)
      setError('Failed to save translation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingCell(null)
  }

  const handleOpenDetails = (keyId: string) => {
    setSelectedKeyId(keyId)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setSelectedKeyId(null)
  }

  const handleEditTranslationKey = async (keyId: string) => {
    // For simplicity, we'll just toggle the active state for now
    // In a real implementation, you'd open an edit modal
    const translationKey = displayTranslationKeys.find(
      (key) => key.id === keyId,
    )
    if (translationKey) {
      try {
        await updateTranslationKey({
          variables: {
            input: {
              id: keyId,
              isActive: !translationKey.isActive,
            },
          },
        })
      } catch (error) {
        console.error('Failed to edit translation key:', error)
      }
    }
  }

  const handleDeleteTranslationKey = async (keyId: string) => {
    if (confirm('Are you sure you want to delete this translation key?')) {
      try {
        await deleteTranslationKey({
          variables: {
            id: keyId,
          },
        })
      } catch (error) {
        console.error('Failed to delete translation key:', error)
      }
    }
  }

  const handleDeleteTranslation = async (keyId: string, language: string) => {
    const translationKey = displayTranslationKeys.find(
      (key) => key.id === keyId,
    )
    const translation = translationKey?.translations?.[language]

    if (
      translation?.id &&
      confirm('Are you sure you want to delete this translation?')
    ) {
      try {
        const { data } = await deleteTranslation({
          variables: {
            id: translation.id,
          },
        })
        if (data) {
          removeTranslationFromCache(keyId, language)
        }
      } catch (error) {
        console.error('Failed to delete translation:', error)
        setError('Failed to delete translation. Please try again.')
      }
    }
  }

  const isEditing = (keyId: string, language: string) => {
    return editingCell?.keyId === keyId && editingCell?.language === language
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Translation Keys</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={loading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Key
          </Button>
          <Button size="sm" variant="outline" disabled={loading}>
            <Zap className="mr-2 h-4 w-4" />
            Sync All
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setError(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-semibold">Key</TableHead>
              <TableHead className="w-[150px] font-semibold">
                Description
              </TableHead>
              {languages.map((lang) => (
                <TableHead key={lang} className="min-w-[200px] font-semibold">
                  {lang.toUpperCase()}
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTranslationKeys.map((translationKey) => (
              <TableRow key={translationKey.id} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center space-x-2">
                    <span>{translationKey.key}</span>
                    {!translationKey.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-600">
                  {translationKey.description || '-'}
                </TableCell>

                {languages.map((language) => {
                  const cellKey = `${translationKey.id}-${language}`
                  const isCurrentlyEditing = isEditing(
                    translationKey.id,
                    language,
                  )
                  const translation = translationKey.translations?.[language]
                  const translationValue = translation?.value || ''

                  return (
                    <TableCell key={language} className="relative">
                      {isCurrentlyEditing ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editingCell?.value || ''}
                            onChange={(e) =>
                              setEditingCell((prev) =>
                                prev
                                  ? { ...prev, value: e.target.value }
                                  : null,
                              )
                            }
                            className="text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSave(
                                  translationKey.id,
                                  language,
                                  editingCell?.value || '',
                                )
                              }
                              if (e.key === 'Escape') {
                                handleCancel()
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={loading}
                            onClick={() =>
                              handleSave(
                                translationKey.id,
                                language,
                                editingCell?.value || '',
                              )
                            }
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancel}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="min-h-[2rem] p-2 rounded cursor-text hover:bg-gray-100 text-sm flex items-center justify-between"
                          onClick={() =>
                            handleCellClick(
                              translationKey.id,
                              language,
                              translationValue,
                            )
                          }
                        >
                          {translationValue ? (
                            <div className="flex items-center justify-between w-full group">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-900">
                                  {translationValue}
                                </span>
                                {translation?.machineTranslated && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Zap className="mr-1 h-3 w-3" />
                                    AI
                                  </Badge>
                                )}
                                {translation?.status && (
                                  <Badge
                                    variant={
                                      translation.status === 'APPROVED'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {translation.status}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTranslation(
                                    translationKey.id,
                                    language,
                                  )
                                }}
                              >
                                <X className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">
                              Click to add translation
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                  )
                })}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleOpenDetails(translationKey.id)}
                      >
                        <Info className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleEditTranslationKey(translationKey.id)
                        }
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Toggle Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleDeleteTranslationKey(translationKey.id)
                        }
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!displayTranslationKeys.length && (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">
            No translation keys found. Add your first key to get started.
          </p>
        </div>
      )}

      <KeyDetailsPanel
        translationKeyId={selectedKeyId}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      <CreateTranslationKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
      />
    </div>
  )
}
