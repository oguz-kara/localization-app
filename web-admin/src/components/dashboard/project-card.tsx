import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Project {
  id: string
  name: string
  description?: string | null
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate">
            {project.name}
          </CardTitle>
          <Badge variant={project.isActive ? "default" : "secondary"}>
            {project.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">Slug:</span> {project.slug}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/projects/${project.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}