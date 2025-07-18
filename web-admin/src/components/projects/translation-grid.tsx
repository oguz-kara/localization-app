'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
  Zap
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { KeyDetailsPanel } from './key-details-panel'
import { CreateTranslationKeyModal } from './create-translation-key-modal'
import { useSyncTranslationsMutation, SyncTranslationsType } from '@/graphql/generated/hooks'

interface TranslationKey {
  id: string
  key: string
  description?: string | null
  context?: string | null
  isActive: boolean
  projectId: string
  createdAt: string
  updatedAt: string
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

export function TranslationGrid({ projectId, translationKeys }: TranslationGridProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const [syncTranslations] = useSyncTranslationsMutation({
    onCompleted: (data) => {
      console.log('Translation sync started:', data.syncTranslations)
      // Could show toast notification with job ID
    },
    onError: (error) => {
      console.error('Failed to sync translations:', error)
    }
  })
  
  // For now, we'll use mock languages since we don't have them in the current queries
  const languages = ['en', 'es', 'fr', 'de']
  
  const handleCellClick = (keyId: string, language: string, currentValue: string = '') => {
    setEditingCell({ keyId, language, value: currentValue })
  }

  const handleSave = async (keyId: string, language: string, value: string) => {
    if (!value.trim()) {
      setEditingCell(null)
      return
    }

    try {
      // Use syncTranslations for single key updates
      await syncTranslations({
        variables: {
          input: {
            type: SyncTranslationsType.SingleKey,
            translationKeyId: keyId,
            sourceLanguage: 'en', // Assuming English as source
            targetLanguage: language,
            sourceText: value
          }
        }
      })
      setEditingCell(null)
    } catch (error) {
      console.error('Failed to save translation:', error)
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

  const isEditing = (keyId: string, language: string) => {
    return editingCell?.keyId === keyId && editingCell?.language === language
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Translation Keys</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Key
          </Button>
          <Button size="sm" variant="outline">
            <Zap className="mr-2 h-4 w-4" />
            Sync All
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-semibold">Key</TableHead>
              <TableHead className="w-[150px] font-semibold">Description</TableHead>
              {languages.map((lang) => (
                <TableHead key={lang} className="min-w-[200px] font-semibold">
                  {lang.toUpperCase()}
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {translationKeys.map((translationKey) => (
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
                  const isCurrentlyEditing = isEditing(translationKey.id, language)
                  
                  return (
                    <TableCell key={language} className="relative">
                      {isCurrentlyEditing ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editingCell?.value || ''}
                            onChange={(e) => 
                              setEditingCell(prev => 
                                prev ? { ...prev, value: e.target.value } : null
                              )
                            }
                            className="text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSave(translationKey.id, language, editingCell?.value || '')
                              }
                              if (e.key === 'Escape') {
                                handleCancel()
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleSave(translationKey.id, language, editingCell?.value || '')}
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
                          className="min-h-[2rem] p-2 rounded cursor-text hover:bg-gray-100 text-sm"
                          onClick={() => handleCellClick(translationKey.id, language)}
                        >
                          <span className="text-gray-400 italic">
                            Click to add translation
                          </span>
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
                      <DropdownMenuItem onClick={() => handleOpenDetails(translationKey.id)}>
                        <Info className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!translationKeys.length && (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No translation keys found. Add your first key to get started.</p>
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
        onSuccess={(newKey) => {
          console.log('Created new translation key:', newKey)
          // TODO: Refresh translation keys list
        }}
      />
    </div>
  )
}