'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { getStaffProjects } from '@/actions/staff';

interface Project {
    id: string;
    title: string;
    status: string | null;
    type: string | null;
    dueDate: Date | null;
    description: string | null;
    taskCount: number;
    managerName: string | null;
}

export default function StaffProjectsPage() {
    const { user } = useAuthStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (user) {
                const { data } = await getStaffProjects(user.id);
                setProjects(data || []);
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#0A1128] uppercase tracking-tight">My Projects</h1>
                    <p className="text-slate-500 text-sm mt-1">Projects you're assigned to as a team member.</p>
                </div>
                <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded font-bold text-xs uppercase tracking-widest border border-[#D4AF37]/20">
                    {projects.length} Active Projects
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <Link
                        href={`/admin/projects/${project.id}`}
                        key={project.id}
                        className="block group"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 group-hover:border-[#D4AF37] group-hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-[#D4AF37] transition-colors">
                                        {project.title}
                                    </h3>
                                    {project.managerName && (
                                        <p className="text-xs text-slate-400 mt-1">
                                            Manager: {project.managerName}
                                        </p>
                                    )}
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-sm ${project.status === 'active' ? 'bg-green-50 text-green-700' :
                                        project.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                                            project.status === 'on_hold' ? 'bg-yellow-50 text-yellow-700' :
                                                'bg-slate-100 text-slate-600'
                                    }`}>
                                    {project.status?.replace('_', ' ') || 'Unknown'}
                                </span>
                            </div>

                            {project.description && (
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                    {project.description}
                                </p>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        📋 {project.taskCount} Tasks
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${project.type === 'client' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        {project.type || 'Internal'}
                                    </span>
                                </div>
                                {project.dueDate && (
                                    <span className="text-xs text-slate-400">
                                        Due: {new Date(project.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center p-20 bg-white rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📁</div>
                    <h3 className="font-bold text-slate-600 uppercase tracking-widest text-sm">No Projects Yet</h3>
                    <p className="text-xs mt-2">You haven't been assigned to any projects.</p>
                </div>
            )}
        </div>
    );
}
