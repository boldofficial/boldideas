
import { getProjects } from "@/actions/projects";
import Link from "next/link";
import { Briefcase, MapPin, Sparkles } from "lucide-react";
import ProjectsPage from "@/components/ProjectsPage";
import DemoSeeder from "@/components/DemoSeeder";

const baseUrl = "https://getboldideas.com";

export const metadata = {
    title: "Mission Logs (Case Studies) | Bold Ideas",
    description: "Real-world AI and automation deployments for Illinois and Wisconsin small businesses. See how we helped local companies build better websites and workflows.",
};

export default async function Page() {
    const { data: projects } = await getProjects();

    return (
        <main>
            {/* ═══════════════════════════════════════════════════════
                PAGE HEADER — Blog Archive Style
               ═══════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-brand-navy pt-24 pb-12 md:pb-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.15),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.15),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

                <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
                    <nav
                        className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/60"
                        aria-label="Breadcrumb"
                    >
                        <Link href="/" className="transition hover:text-brand-gold">Home</Link>
                        <span aria-hidden="true">/</span>
                        <span className="text-brand-gold" aria-current="page">Projects</span>
                    </nav>

                    <div className="max-w-4xl">
                        <div className="mb-6 inline-flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                                <Briefcase className="h-4 w-4" />
                                Case Studies
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                                <MapPin className="h-4 w-4" />
                                Illinois & Wisconsin
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                                <Sparkles className="h-4 w-4" />
                                Real Results
                            </span>
                        </div>

                        <h1
                            className={`max-w-3xl text-3xl font-extrabold text-white md:text-4xl lg:text-5xl`}
                        >
                            Real deployments{" "}
                            <span className="text-brand-gold">for real businesses</span>.
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                            Browse completed projects and outcome analysis for Illinois and Wisconsin
                            small businesses that leveled up their digital infrastructure.
                        </p>
                    </div>
                </div>
            </section>

            <DemoSeeder />
            <ProjectsPage projects={projects || []} />
        </main>
    );
}
