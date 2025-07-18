import { sdk } from '@/graphql'
import { ProjectCard } from '@/components/dashboard/project-card'

export default async function DashboardPage() {
  const api = sdk()

  try {
    const { projects } = await api.GetProjects()

    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your localization projects</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {!projects?.length && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No projects found. Create your first project to get started.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500">
            Error loading projects. Please try again.
          </p>
        </div>
      </div>
    )
  }
}
