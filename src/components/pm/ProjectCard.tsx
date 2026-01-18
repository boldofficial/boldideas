'use client';

import Link from 'next/link';
import { deleteProject } from '@/actions/pm';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
    project: any;
};

export default function ProjectCard({ project }: Props) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        const formData = new FormData();
        formData.append('projectId', project.id);
        startTransition(async () => {
            await deleteProject(formData);
            router.refresh();
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-brand-gold/50 transition-all flex flex-col h-full group relative">
            {/* Delete Button (Absolute) */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete Project"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>

            <Link href={`/admin/projects/${project.id}`} className="flex-1">
                <div className="flex justify-between items-start mb-4 pr-8"> {/* Padding right for delete button */}
                    <h3 className="font-bold text-lg text-brand-navy group-hover:text-brand-gold transition-colors">{project.title}</h3>
                </div>
                <div className="mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {project.status}
                    </span>
                    <span className="ml-2 text-xs text-slate-400 uppercase">• {project.type || 'internal'}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description || 'No description provided.'}</p>
                <div className="flex items-center text-xs text-slate-400 mt-auto">
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
            </Link>
        </div>
    );
}
