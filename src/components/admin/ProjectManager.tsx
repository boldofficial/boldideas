
"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createProject, deleteProject, updateProject } from "@/actions/projects";
import { Trash2, Edit2, Plus, X } from "lucide-react";

interface Project {
    id: string;
    title: string;
    problem: string;
    solution: string;
    result: string;
    tags: string[] | null;
    imageUrl: string | null;
}

const ProjectManager = ({ initialProjects }: { initialProjects: any[] }) => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', currentProject.title || '');
        formData.append('problem', currentProject.problem || '');
        formData.append('solution', currentProject.solution || '');
        formData.append('result', currentProject.result || '');
        formData.append('imageUrl', currentProject.imageUrl || '');
        formData.append('tags', currentProject.tags?.join(', ') || '');

        let res;
        if (currentProject.id) {
            res = await updateProject(currentProject.id, formData);
        } else {
            res = await createProject(formData);
        }

        if (res.success) {
            setIsEditing(false);
            setCurrentProject({});
            router.refresh(); // Refresh server data
            // Optimistic update omitted for brevity, full refresh ensures sync
            window.location.reload();
        } else {
            alert('Error saving project');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
        router.refresh();
    };

    return (
        <>
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold/5 -skew-x-12 transform translate-x-8 -translate-y-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold text-brand-navy flex items-center">
                            <span className="w-2 h-2 bg-brand-gold mr-3"></span>
                            Case Studies
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Manage your portfolio projects
                        </p>
                    </div>
                    <button
                        onClick={() => { setCurrentProject({}); setIsEditing(true); }}
                        className="bg-brand-navy text-white px-6 py-3 rounded text-sm font-medium hover:bg-brand-gold hover:text-brand-navy transition-all flex items-center border border-transparent hover:border-brand-navy/20 shadow-lg"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Project
                    </button>
                </div>



                <div className="space-y-4">
                    {projects.map(project => (
                        <div key={project.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white border border-slate-200 hover:border-brand-gold transition-all group shadow-sm hover:shadow-md">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-brand-navy">{project.title}</h4>
                                    <div className="flex gap-1">
                                        {project.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-slate-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 truncate max-w-lg opacity-70">
                                    &gt; {project.problem}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                                <button onClick={() => { setCurrentProject(project); setIsEditing(true); }} className="p-2 text-slate-300 hover:text-brand-navy transition-colors border border-transparent hover:border-slate-200 rounded-sm">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors border border-transparent hover:border-red-100 rounded-sm">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isEditing && mounted && createPortal(
                <div className="fixed inset-0 bg-brand-navy/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-50 rounded-sm p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-gold relative">

                        {/* Modal Header */}
                        <div className="bg-brand-navy p-6 flex justify-between items-center sticky top-0 z-10 border-b border-brand-gold/20">
                            <div>
                                <h3 className="text-lg font-bold text-white">{currentProject.id ? 'Edit Project' : 'New Project'}</h3>
                                <p className="text-xs text-brand-gold/60">Project details form</p>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-2">Title (Client Name)</label>
                                <input
                                    className="w-full p-3 bg-white border border-slate-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none rounded text-sm text-brand-navy placeholder:text-slate-300"
                                    value={currentProject.title || ''}
                                    onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    placeholder="e.g. GLOBAL LOGISTICS CORP"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2">Tags (Comma Separated)</label>
                                    <input
                                        className="w-full p-3 bg-white border border-slate-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none rounded text-sm text-brand-navy placeholder:text-slate-300"
                                        value={currentProject.tags?.join(', ') || ''}
                                        onChange={e => setCurrentProject({ ...currentProject, tags: e.target.value.split(', ') })}
                                        placeholder="AI, AUTOMATION, API"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2">Image URL</label>
                                    <input
                                        className="w-full p-3 bg-white border border-slate-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none rounded text-sm text-brand-navy placeholder:text-slate-300"
                                        value={currentProject.imageUrl || ''}
                                        onChange={e => setCurrentProject({ ...currentProject, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white border border-slate-100 relative group focus-within:border-red-400/50 transition-colors">
                                    <label className="block text-xs font-medium text-red-500 mb-2 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-red-500 mr-2 rounded-full"></span>
                                        The Problem
                                    </label>
                                    <textarea
                                        className="w-full p-0 bg-transparent border-none focus:ring-0 text-sm text-slate-600 leading-relaxed resize-none h-20"
                                        value={currentProject.problem || ''}
                                        onChange={e => setCurrentProject({ ...currentProject, problem: e.target.value })}
                                        placeholder="Describe the inefficiency..."
                                        required
                                    />
                                </div>

                                <div className="p-4 bg-white border border-slate-100 relative group focus-within:border-blue-400/50 transition-colors">
                                    <label className="block text-xs font-medium text-blue-500 mb-2 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-blue-500 mr-2 rounded-full"></span>
                                        The Solution
                                    </label>
                                    <textarea
                                        className="w-full p-0 bg-transparent border-none focus:ring-0 text-sm text-slate-600 leading-relaxed resize-none h-20"
                                        value={currentProject.solution || ''}
                                        onChange={e => setCurrentProject({ ...currentProject, solution: e.target.value })}
                                        placeholder="Describe the technical implementation..."
                                        required
                                    />
                                </div>

                                <div className="p-4 bg-white border border-slate-100 relative group focus-within:border-emerald-400/50 transition-colors">
                                    <label className="block text-xs font-medium text-emerald-500 mb-2 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 mr-2 rounded-full"></span>
                                        The Result
                                    </label>
                                    <textarea
                                        className="w-full p-0 bg-transparent border-none focus:ring-0 text-sm text-slate-600 leading-relaxed resize-none h-20"
                                        value={currentProject.result || ''}
                                        onChange={e => setCurrentProject({ ...currentProject, result: e.target.value })}
                                        placeholder="Quantify the impact..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-slate-50 pb-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-6 py-4 bg-slate-200 text-slate-500 font-medium text-sm hover:bg-slate-300 transition-colors rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-brand-gold text-brand-navy font-medium py-4 hover:bg-brand-navy hover:text-white transition-all text-sm rounded shadow-lg"
                                >
                                    Save Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ProjectManager;
