import ProjectCard from '@/components/pm/ProjectCard';
import { getInternalProjects } from '@/actions/agency';
import CreateProjectModal from '@/components/pm/CreateProjectModal';

export default async function ProjectsPage() {
    const { data: projects } = await getInternalProjects();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
                <CreateProjectModal />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
                {(!projects || projects.length === 0) && (
                    <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded border border-dashed border-slate-300">
                        No active projects. Start new work above.
                    </div>
                )}
            </div>
        </div>
    );
}
