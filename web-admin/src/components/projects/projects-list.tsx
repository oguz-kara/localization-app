'use client'

import { useState } from 'react'
import { FolderOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { ProjectCard } from '@/components/dashboard/project-card'
import { CreateProjectModal } from './create-project-modal'
import { useGetProjectsQuery } from '@/graphql/generated/hooks'

export function ProjectsList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const { data, loading, error, refetch } = useGetProjectsQuery({
    errorPolicy: 'all'
  })

  const handleProjectCreated = (newProject: any) => {
    console.log('Created new project:', newProject)
    refetch() // Refresh the projects list
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p role="status" className="text-gray-500">
            Loading projects...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p role="alert" className="text-red-500">
            Error loading projects. Please try again.
          </p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const projects = data?.projects || []

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your localization projects</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {!projects.length && (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="A project groups the translation keys and languages for one app or website."
          action={
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first project
            </Button>
          }
        />
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  )
}