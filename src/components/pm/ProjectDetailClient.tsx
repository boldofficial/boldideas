'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createProjectTask, updateTaskStatus, deleteProject, updateProject, addProjectFile, postProjectComment, addProjectMember, removeProjectMember, deleteProjectTask, updateProjectTask } from '@/actions/pm';
import CommentSystem from '@/components/shared/CommentSystem';
import { Edit2, Trash2, X, Plus, Calendar, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type Props = {
    project: any;
    milestones: any[];
    tasks: any[];
    files: any[];
    comments: any[];
    members: any[];
};

import { getUsers } from '@/actions/team';

// ... (Props type)

export default function ProjectDetailClient({ project, milestones: initialMilestones, tasks: initialTasks, files: initialFiles, comments: initialComments, members: initialMembers }: Props) {
    const { user, role } = useAuthStore();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'overview';
    const highlightedTaskId = searchParams.get('task');

    const [activeTab, setActiveTab] = useState(initialTab);
    const [isEditing, setIsEditing] = useState(false);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(highlightedTaskId ? initialTasks.find(t => t.id === highlightedTaskId) : null);
    const [isPending, startTransition] = useTransition();
    const [isEditingTask, setIsEditingTask] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getUsers().then(({ data }) => setUsersList(data || []));
    }, []);

    const handleDeleteProject = () => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        const formData = new FormData();
        formData.append('projectId', project.id);
        startTransition(async () => {
            await deleteProject(formData);
            router.push('/admin/projects');
        });
    };

    // Progress Calculation
    const completedTasks = initialTasks.filter(t => t.status === 'done').length;
    const progress = initialTasks.length > 0 ? Math.round((completedTasks / initialTasks.length) * 100) : 0;

    return (
        <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    {!isEditing ? (
                        <>
                            <h1 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                                {project.title}
                                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-brand-navy p-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span>Started: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
                                <span>•</span>
                                <span className={`uppercase font-bold text-xs px-2 py-0.5 rounded ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>
                                    {project.status}
                                </span>
                                <span>•</span>
                                <span className="uppercase font-bold text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                                    {project.type || 'Internal'}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white p-6 rounded shadow-lg border border-slate-200 absolute z-10 w-full max-w-2xl mt-2">
                            <h3 className="font-bold text-lg mb-4">Edit Project</h3>
                            <form id="edit-project-form" action={async (formData) => {
                                await updateProject(formData);
                                setIsEditing(false);
                            }} className="space-y-4">
                                <input type="hidden" name="projectId" value={project.id} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="title" defaultValue={project.title} placeholder="Project Title" className="p-2 border rounded" required />
                                    <select name="status" defaultValue={project.status || 'active'} className="p-2 border rounded">
                                        <option value="planning">Planning</option>
                                        <option value="active">Active</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <select name="type" defaultValue={project.type || 'internal'} className="p-2 border rounded">
                                        <option value="internal">Internal Project</option>
                                        <option value="client">Client Project</option>
                                    </select>
                                    <select name="managerId" defaultValue={project.managerId || 'unassigned'} className="p-2 border rounded">
                                        <option value="unassigned">Unassigned Manager</option>
                                        {usersList.map((u: any) => (
                                            <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                        ))}
                                    </select>
                                    <input name="budget" defaultValue={project.budget} placeholder="Budget" className="p-2 border rounded" />
                                    <input name="startDate" type="date" defaultValue={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''} className="p-2 border rounded" />
                                    <input name="dueDate" type="date" defaultValue={project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''} className="p-2 border rounded" />
                                    <textarea name="description" defaultValue={project.description} placeholder="Description" className="col-span-2 p-2 border rounded" rows={3}></textarea>
                                </div>
                            </form>

                            <div className="flex justify-between items-center pt-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="text-slate-500 hover:underline text-sm">Cancel</button>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeleteProject}
                                        disabled={isPending}
                                        className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-100 disabled:opacity-50"
                                    >
                                        {isPending ? 'Deleting...' : 'Delete Project'}
                                    </button>
                                    <button form="edit-project-form" type="submit" className="bg-brand-navy text-white px-6 py-2 rounded text-sm font-bold">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase font-bold text-slate-400 mb-1">Progress</div>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-gold" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="text-xs font-mono mt-1 text-slate-600">{progress}% Complete</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
                {['overview', 'tasks', 'team', 'milestones', 'files', 'discussions'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pb-10">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg mb-4 text-slate-800">Project Brief</h3>
                                <p className="text-slate-600 leading-relaxed max-w-none prose prose-sm">{project.description || 'No description provided.'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                    <div className="text-xs text-blue-500 uppercase font-bold">Total Tasks</div>
                                    <div className="text-2xl font-black text-blue-900">{initialTasks.length}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded border border-green-100">
                                    <div className="text-xs text-green-500 uppercase font-bold">Milestones Met</div>
                                    <div className="text-2xl font-black text-green-900">
                                        {initialMilestones.filter(m => m.status === 'completed').length}/{initialMilestones.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded border border-slate-200">
                                <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Meta Data</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Type</span>
                                        <span className="font-bold capitalize">{project.type || 'Internal'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Budget</span>
                                        <span className="font-mono">{project.budget || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Due Date</span>
                                        <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Ongoing'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center flex-wrap gap-4">
                            <h3 className="font-bold text-slate-700">Project Tasks</h3>
                            <div className="w-full">
                                {!isAddingTask ? (
                                    <button
                                        onClick={() => setIsAddingTask(true)}
                                        className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        New Task
                                    </button>
                                ) : (
                                    <form action={async (formData) => {
                                        await createProjectTask(formData);
                                        setIsAddingTask(false);
                                    }} className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-6 animate-in fade-in slide-in-from-top-2">
                                        <input type="hidden" name="projectId" value={project.id} />

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Title</label>
                                            <input name="title" placeholder="What needs to be done?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-navy outline-none transition-all" required />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-2">Assignee</label>
                                                <select name="assigneeId" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-navy outline-none">
                                                    <option value="unassigned">Unassigned</option>
                                                    {usersList.map((u: any) => (
                                                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-2">Due Date</label>
                                                <input type="datetime-local" name="dueDate" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-navy outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-2">Attachment</label>
                                                <input type="file" name="file" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Description</label>
                                            <textarea name="description" placeholder="Additional details..." rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-navy outline-none resize-none"></textarea>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button type="button" onClick={() => setIsAddingTask(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold transition-all">Cancel</button>
                                            <button type="submit" className="bg-brand-navy text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all">Create Task</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {initialTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedTask(task)}
                                    className="p-4 flex flex-col gap-2 hover:bg-slate-50 group border-b last:border-0 border-slate-100 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done', project.id);
                                                }}
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'
                                                    }`}
                                            >
                                                {task.status === 'done' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                            </button>
                                            <div className="flex flex-col">
                                                <span className={`${task.status === 'done' ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>{task.title}</span>
                                                {task.dueDate && <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>{new Date(task.dueDate).toLocaleDateString()}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {task.assigneeName && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{task.assigneeName}</span>}
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${task.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{task.priority}</span>
                                        </div>
                                    </div>

                                    {(task.description || task.attachmentUrl) && (
                                        <div className="pl-8 flex gap-4 text-xs text-slate-400">
                                            {task.description && (
                                                <div className="flex items-start gap-1 max-w-lg">
                                                    <svg className="w-4 h-4 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                                                    <span className="line-clamp-2">{task.description}</span>
                                                </div>
                                            )}
                                            {task.attachmentUrl && (
                                                <div className="flex items-center gap-1 text-blue-500">
                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                    Attachment
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {initialTasks.length === 0 && <div className="p-8 text-center text-slate-400 italic text-sm">No tasks created.</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-700 text-lg">Project Team</h3>
                                <p className="text-sm text-slate-500">Manage staff members assigned to this project.</p>
                            </div>
                            <form action={async (fd) => { await addProjectMember(fd); }} className="flex gap-2 items-center">
                                <input type="hidden" name="projectId" value={project.id} />
                                <select name="userId" className="p-2 border rounded text-sm w-48" required>
                                    <option value="">Select Staff...</option>
                                    {usersList.filter(u => !initialMembers.some(m => m.userId === u.id)).map((u: any) => (
                                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                    ))}
                                </select>
                                <select name="role" className="p-2 border rounded text-sm w-32">
                                    <option value="member">Member</option>
                                    <option value="leader">Leader</option>
                                </select>
                                <button className="bg-brand-navy text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-brand-gold transition-colors">Add Member</button>
                            </form>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {initialMembers.map(member => (
                                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold">
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                member.name ? member.name[0].toUpperCase() : 'U'
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700">{member.name || member.email}</div>
                                            <div className="text-xs text-slate-500 capitalize">{member.role} • Added {new Date(member.addedAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* Manager ID check is strictly on project level, but for now allow removing anyone if you are viewing this page (assuming admin/pm view) */}
                                        <form action={async (fd) => { await removeProjectMember(fd); }}>
                                            <input type="hidden" name="projectId" value={project.id} />
                                            <input type="hidden" name="memberId" value={member.id} />
                                            <button className="text-red-500 hover:text-red-700 text-sm font-bold px-3 py-1 rounded hover:bg-red-50 transition-colors">Remove</button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                            {initialMembers.length === 0 && (
                                <div className="p-12 text-center text-slate-400 italic">
                                    No team members assigned yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'milestones' && (
                    <div className="space-y-4">
                        {initialMilestones.map((ms) => (
                            <div key={ms.id} className="bg-white p-6 rounded shadow-sm border border-slate-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800">{ms.title}</h3>
                                    <p className="text-sm text-slate-500">{ms.dueDate ? new Date(ms.dueDate).toLocaleDateString() : 'No deadline'}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-sm ${ms.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                                    {ms.status}
                                </span>
                            </div>
                        ))}
                        {initialMilestones.length === 0 && <div className="p-8 text-center text-slate-400 italic text-sm border-dashed border-2 rounded">No milestones set.</div>}
                    </div>
                )}

                {activeTab === 'files' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Files & Assets</h3>
                            <form action={async (fd) => { await addProjectFile(fd); }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded border border-slate-100">
                                <input type="hidden" name="projectId" value={project.id} />
                                <input name="name" placeholder="File Name" className="p-2 border rounded text-sm" required />
                                <input name="url" placeholder="URL / Link" className="p-2 border rounded text-sm" required />
                                <button className="bg-brand-navy text-white px-3 py-2 rounded text-sm font-bold uppercase">Add File</button>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {initialFiles.map(file => (
                                    <a href={file.url} target="_blank" key={file.id} className="block group">
                                        <div className="p-4 border rounded hover:border-brand-navy hover:bg-slate-50 transition-all flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-sm truncate text-slate-700 group-hover:text-brand-navy">{file.name}</div>
                                                <div className="text-xs text-slate-400">Link</div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                            {initialFiles.length === 0 && <div className="text-center py-8 text-slate-400 italic text-sm">No files uploaded.</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div className="h-[650px] animate-fade-in">
                        {user && (
                            <CommentSystem
                                projectId={project.id}
                                userId={user.id}
                                initialComments={initialComments.filter(c => !c.taskId)}
                                title="Team Communication"
                                className="h-full"
                            />
                        )}
                    </div>
                )}
            </div>
            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-hidden">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-slide-up">
                        {/* Modal Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTask.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-brand-navy/10 text-brand-navy'}`}>
                                    {selectedTask.status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 border rounded uppercase tracking-wider ${selectedTask.status === 'done' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            {selectedTask.status.replace('_', ' ')}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 border rounded uppercase tracking-wider ${selectedTask.priority === 'urgent' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            {selectedTask.priority}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedTask.title}</h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {role === 'admin' && (
                                    <>
                                        <button
                                            onClick={() => setIsEditingTask(true)}
                                            className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-all"
                                            title="Edit Task"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete this task?')) {
                                                    const fd = new FormData();
                                                    fd.append('taskId', selectedTask.id);
                                                    fd.append('projectId', project.id);
                                                    await deleteProjectTask(fd);
                                                    setSelectedTask(null);
                                                    router.refresh();
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Task"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <div className="w-px h-6 bg-slate-200 mx-2" />
                                    </>
                                )}
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="text-slate-400 hover:text-slate-600 p-2 transition-all hover:bg-slate-100 rounded-lg border border-slate-200 shadow-sm bg-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            {/* Task Content (Left) */}
                            <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r border-slate-100 space-y-8">
                                <section>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Task Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Assignee</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                                                    {selectedTask.assigneeName?.[0] || 'U'}
                                                </div>
                                                <p className="text-xs font-bold text-slate-700">{selectedTask.assigneeName || 'Unassigned'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Due Date</p>
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <p className="text-xs font-bold">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'None'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Description
                                    </h4>
                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm min-h-[120px]">
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {selectedTask.description || 'No specific instructions provided.'}
                                        </p>
                                    </div>
                                </section>

                                {selectedTask.attachmentUrl ? (
                                    <section>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Attachments</h4>
                                        <a href={selectedTask.attachmentUrl} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-brand-navy hover:text-white transition-all shadow-sm group">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5" />
                                                <span className="text-xs font-bold">Download Attachment</span>
                                            </div>
                                            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">VIEW →</span>
                                        </a>
                                    </section>
                                ) : (
                                    <div className="py-10 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                                        <FileText className="w-8 h-8 mb-2 opacity-20" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">No Attachments</span>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-slate-100">
                                    <button
                                        onClick={async () => {
                                            const newStatus = selectedTask.status === 'done' ? 'todo' : 'done';
                                            await updateTaskStatus(selectedTask.id, newStatus, project.id);
                                            setSelectedTask({ ...selectedTask, status: newStatus });
                                            router.refresh();
                                        }}
                                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${selectedTask.status === 'done' ? 'bg-slate-100 text-slate-500' : 'bg-brand-navy text-brand-gold shadow-xl shadow-brand-navy/20 hover:scale-[1.02]'}`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {selectedTask.status === 'done' ? 'Protocol Reactivation' : 'Secure Directive'}
                                    </button>
                                </div>
                            </div>

                            {/* Comms Log (Right) - Unified CommentSystem */}
                            <div className="w-full md:w-1/2 bg-slate-50/50 flex flex-col h-full overflow-hidden">
                                {user && (
                                    <CommentSystem
                                        taskId={selectedTask.id}
                                        projectId={project.id}
                                        userId={user.id}
                                        initialComments={initialComments.filter(c => c.taskId === selectedTask.id)}
                                        title="Team Communication"
                                        className="h-full rounded-none border-0 shadow-none"
                                    />
                                )}
                            </div>
                        </div>
                    </div >
                </div >
            )
            }

            {/* Edit Task Flyout (Admin Only) */}
            {
                isEditingTask && selectedTask && (
                    <div className="fixed inset-0 z-[70] overflow-hidden">
                        <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm transition-opacity" onClick={() => setIsEditingTask(false)} />
                        <div className="fixed inset-y-0 right-0 max-w-full flex">
                            <div className="w-screen max-w-md animate-slide-in-right">
                                <div className="h-full flex flex-col bg-white shadow-2xl border-l border-slate-200">
                                    <div className="p-8 bg-brand-navy text-white relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
                                                    <Edit2 className="w-6 h-6 text-brand-navy" />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Edit Protocal</h3>
                                            </div>
                                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Directive_Modification_Active</p>
                                        </div>
                                        <button onClick={() => setIsEditingTask(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
                                            <X className="w-6 h-6" />
                                        </button>
                                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl" />
                                    </div>
                                    <form
                                        action={async (fd) => {
                                            fd.append('taskId', selectedTask.id);
                                            fd.append('projectId', project.id);
                                            await updateProjectTask(fd);
                                            setIsEditingTask(false);
                                            setSelectedTask(null);
                                            router.refresh();
                                        }}
                                        className="flex-1 overflow-y-auto p-8 space-y-8"
                                    >
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Objective Title</label>
                                                <input name="title" defaultValue={selectedTask.title} required className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 text-sm font-bold focus:border-brand-gold outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                                                <textarea name="description" defaultValue={selectedTask.description || ''} className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 text-sm font-medium focus:border-brand-gold outline-none min-h-[140px] resize-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Priority</label>
                                                    <select name="priority" defaultValue={selectedTask.priority} className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-[10px] font-black uppercase outline-none">
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                        <option value="urgent">Urgent</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Due Date</label>
                                                    <input name="dueDate" type="date" defaultValue={selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : ''} className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-[10px] font-black outline-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assignee</label>
                                                <select name="assigneeId" defaultValue={selectedTask.assigneeId || 'unassigned'} className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-[10px] font-black uppercase outline-none">
                                                    <option value="unassigned">Unassigned</option>
                                                    {usersList.map((u: any) => (
                                                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-brand-navy text-brand-gold py-5 rounded-xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
                                            Update Directive Hub
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

