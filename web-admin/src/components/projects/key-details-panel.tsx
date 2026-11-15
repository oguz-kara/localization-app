'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface KeyDetailsPanelProps {
  translationKeyId: string | null
  isOpen: boolean
  onClose: () => void
}

export function KeyDetailsPanel({ translationKeyId, isOpen, onClose }: KeyDetailsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panelRef.current) return

    // For now, we'll use CSS transforms until GSAP is available
    if (isOpen) {
      panelRef.current.style.transform = 'translateX(0%)'
      panelRef.current.style.opacity = '1'
    } else {
      panelRef.current.style.transform = 'translateX(100%)'
      panelRef.current.style.opacity = '0'
    }
  }, [isOpen])

  if (!translationKeyId && !isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 flex flex-col transition-all duration-300 ease-out transform translate-x-full opacity-0"
        style={{ maxWidth: '90vw' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Key Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close key details"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="history" className="h-full flex flex-col">
            <TabsList className="m-6 mb-0">
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="history" className="m-0">
                <HistoryTab translationKeyId={translationKeyId} />
              </TabsContent>
              
              <TabsContent value="notes" className="m-0">
                <NotesTab translationKeyId={translationKeyId} />
              </TabsContent>
              
              <TabsContent value="screenshots" className="m-0">
                <ScreenshotsTab translationKeyId={translationKeyId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}

function HistoryTab({ translationKeyId }: { translationKeyId: string | null }) {
  if (!translationKeyId) return null

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Translation History</h3>
      <div className="space-y-3">
        {/* Mock data for now */}
        <div className="border rounded p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">John Doe</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Changed EN translation from:</span>
            <div className="mt-1 p-2 bg-red-50 rounded text-red-800">&ldquo;Hello World&rdquo;</div>
            <span className="text-gray-600">to:</span>
            <div className="mt-1 p-2 bg-green-50 rounded text-green-800">&ldquo;Hello Universe&rdquo;</div>
          </div>
        </div>
        
        <div className="border rounded p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">AI Translation</span>
            <span className="text-gray-500">1 day ago</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Added ES translation:</span>
            <div className="mt-1 p-2 bg-blue-50 rounded text-blue-800">&ldquo;Hola Mundo&rdquo;</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotesTab({ translationKeyId }: { translationKeyId: string | null }) {
  if (!translationKeyId) return null

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Developer Notes</h3>
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          Context and instructions for translators:
        </div>
        <textarea 
          className="w-full p-3 border rounded-md resize-none h-32"
          placeholder="Add notes about usage context, tone, character limits, etc."
          defaultValue="This text appears on the main welcome screen when users first open the app. Keep it friendly and concise."
        />
        <Button size="sm">Save Notes</Button>
      </div>
    </div>
  )
}

function ScreenshotsTab({ translationKeyId }: { translationKeyId: string | null }) {
  if (!translationKeyId) return null

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Screenshots</h3>
      <div className="text-sm text-gray-600 mb-4">
        Visual context showing where this translation appears in the UI:
      </div>
      
      {/* Mock gallery */}
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
          Screenshot 1
        </div>
        <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
          Screenshot 2
        </div>
      </div>
      
      <Button variant="outline" size="sm">
        Add Screenshot
      </Button>
    </div>
  )
}