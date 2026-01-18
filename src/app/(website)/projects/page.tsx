
import { getProjects } from "@/actions/projects";
import ProjectsPage from "@/components/ProjectsPage";
import DemoSeeder from "@/components/DemoSeeder";

export const metadata = {
    title: "Mission Logs (Case Studies) | Bold Ideas",
    description: "Declassified operational logs of successful AI and automation deployments.",
};

export default async function Page() {
    const { data: projects } = await getProjects();

    return (
        <main>
            <DemoSeeder />
            <ProjectsPage projects={projects || []} />
        </main>
    );
}
