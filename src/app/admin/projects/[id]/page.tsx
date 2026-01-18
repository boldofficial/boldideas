import { db } from '@/lib/db';
import { internalProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getProjectMilestones, getProjectTasks, getProjectFiles, getProjectComments, getProjectMembers } from '@/actions/pm';
import ProjectDetailClient from '@/components/pm/ProjectDetailClient';

// Next.js 15+ Params type usage
type Props = {
    params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
    const { id } = await params;

    let project;
    try {
        project = await db.query.internalProjects.findFirst({
            where: eq(internalProjects.id, id),
        });
    } catch (error: any) {
        console.error("Project Fetch Error Details:", error);
        console.error("Project ID:", id);
        return <div className="p-8 text-red-500">
            <h1 className="font-bold">Error Loading Project</h1>
            <pre className="mt-4 bg-slate-100 p-4 rounded text-xs overflow-auto">{JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</pre>
        </div>;
    }

    if (!project) return <div>Project not found</div>;

    const { data: milestoneList } = await getProjectMilestones(id);
    const { data: taskList } = await getProjectTasks(id);
    const { data: fileList } = await getProjectFiles(id);
    const { data: commentList } = await getProjectComments(id);
    const { data: memberList } = await getProjectMembers(id);

    return (
        <div className="p-8 h-screen overflow-y-auto">
            <ProjectDetailClient
                project={project}
                milestones={milestoneList || []}
                tasks={taskList || []}
                files={fileList || []}
                comments={commentList || []}
                members={memberList || []}
            />
        </div>
    );
}

