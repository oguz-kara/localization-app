import { sdk } from '@/graphql'
import { TranslationGrid } from '@/components/projects/translation-grid'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ProjectPageProps {
  params: {
    projectId: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const api = sdk()
  
  try {
    const [{ project }, { translationKeys }] = await Promise.all([
      api.GetProject({ id: params.projectId }),
      api.GetProjectTranslations({ projectId: params.projectId }),
    ])

    if (!project) {
      return (
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Project not found.</p>
          </div>
        </div>
      )
    }

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
            <Badge variant={project.isActive ? "default" : "secondary"}>
              {project.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </div>
        </div>

        {/* Translation Grid */}
        <TranslationGrid 
          projectId={params.projectId}
          translationKeys={translationKeys || []}
        />
      </div>
    )
  } catch (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500">Error loading project. Please try again.</p>
        </div>
      </div>
    )
  }
}