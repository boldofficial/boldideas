'use client';

import React, { useState } from 'react';
import {
    Plus, Search, Filter, MoreVertical, Edit2, Trash2,
    CheckCircle2, Clock, AlertCircle, User, Calendar,
    LayoutGrid, List, Shield, Terminal, X, MessageSquare,
    CheckCircle, Circle, PlayCircle, FileText, Flag, Folder
} from 'lucide-react';
import { createProjectTask, updateProjectTask, deleteProjectTask, updateTaskStatus, getTaskComments } from '@/actions/pm';
import { useAuthStore } from '@/store/authStore';
import CommentSystem from '@/components/shared/CommentSystem';
import { useEffect } from 'react';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    dueDate: Date | null;
    assigneeId: string | null;
    assigneeName?: string | null;
    projectId?: string | null;
    estimatedMinutes?: number | null;
    subtasks?: any[] | null;
}

interface TaskBoardProps {
    initialTasks: any[];
    users: any[];
}

export default function TaskBoard({ initialTasks, users }: TaskBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'grid' | 'list'>('list');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchComments = async () => {
            if (selectedTask) {
                setCommentLoading(true);
                const { data } = await getTaskComments(selectedTask.id);
                setComments(data || []);
                setCommentLoading(false);
            }
        };
        fetchComments();
    }, [selectedTask]);

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('projectId', 'null'); // Standalone task

        const result = await createProjectTask(formData);
        if (result.success) {
            setIsCreateModalOpen(false);
            window.location.reload(); // Quickest way to sync for now
        }
    };

    const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTask) return;
        const formData = new FormData(e.currentTarget);
        formData.append('taskId', editingTask.id);
        formData.append('projectId', 'null'); // Standalone

        const result = await updateProjectTask(formData);
        if (result.success) {
            setEditingTask(null);
            window.location.reload();
        }
    };

    const handleDelete = async (taskId: string) => {
        if (!confirm('Authorize task termination?')) return;
        const formData = new FormData();
        formData.append('taskId', taskId);
        formData.append('projectId', 'null');
        const result = await deleteProjectTask(formData);
        if (result.success) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    const getPriorityStyle = (priority: string | null) => {
        switch (priority) {
            case 'urgent': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'high': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'medium': return 'bg-slate-50 text-slate-600 border-slate-200';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-brand-navy outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex p-1 rounded-lg border border-slate-100 bg-white">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-1.5 rounded transition-all ${view === 'grid' ? 'bg-slate-100 text-brand-navy' : 'text-slate-400'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-1.5 rounded transition-all ${view === 'list' ? 'bg-slate-100 text-brand-navy' : 'text-slate-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-brand-navy text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-md"
                    >
                        New Task
                    </button>
                </div>
            </div>

            {/* Task Grid/List */}
            <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className={`bg-white rounded-xl border border-slate-100 group cursor-pointer transition-all hover:border-slate-300 hover:shadow-sm animate-fade-in ${view === 'list' ? 'p-4 flex items-center justify-between gap-4' : 'flex flex-col p-6'}`}
                    >
                        <div className={`flex gap-4 ${view === 'list' ? 'items-center flex-1' : 'flex-col'}`}>
                            {/* Priority */}
                            <div className={`${view === 'list' ? 'shrink-0' : 'mb-3 flex justify-between items-start'}`}>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider uppercase ${getPriorityStyle(task.priority)}`}>
                                    {task.priority || 'Normal'}
                                </span>
                                {view === 'grid' && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); }} className="p-1.5 text-slate-400 hover:text-brand-navy transition-colors">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-700 leading-tight">
                                    {task.title}
                                </h4>
                                {task.description && view === 'grid' && (
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                        {task.description}
                                    </p>
                                )}
                            </div>

                            {/* Meta */}
                            <div className={`flex items-center gap-4 ${view === 'list' ? 'shrink-0' : 'mt-4 pt-4 border-t border-slate-50'}`}>
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <User className="w-3 h-3 opacity-50" />
                                    <span className="text-[11px] font-medium">
                                        {task.assigneeName || 'Unassigned'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="w-3 h-3 opacity-50" />
                                    <span className="text-[11px]">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                    </span>
                                </div>

                                <div className={`px-2 py-0.5 rounded bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-tight ${view === 'list' ? 'hidden md:block' : ''}`}>
                                    {task.status?.replace('_', ' ')}
                                </div>
                            </div>
                        </div>

                        {view === 'list' && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); }} className="p-2 text-slate-300 hover:text-brand-navy transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {filteredTasks.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center animate-fade-in">
                        <Terminal className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-xs font-medium text-slate-400">No tasks found</p>
                    </div>
                )}
            </div>

            {/* Task Creation Flyout */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)} />

                    <div className="fixed inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md animate-slide-in-right">
                            <div className="h-full flex flex-col bg-white shadow-2xl border-l border-slate-200">
                                {/* Header */}
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">New Task</h3>
                                        <p className="text-xs text-slate-500 mt-1">Fill in the details below</p>
                                    </div>
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleCreateTask} encType="multipart/form-data" className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                                Title
                                            </label>
                                            <input
                                                name="title"
                                                required
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm focus:border-brand-navy outline-none transition-all placeholder:text-slate-300"
                                                placeholder="What needs to be done?"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm focus:border-brand-navy outline-none min-h-[140px] transition-all resize-none placeholder:text-slate-300"
                                                placeholder="Add more details about this task..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 mb-2 block text-slate-500">
                                                    Priority
                                                </label>
                                                <select name="priority" className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:border-brand-navy outline-none">
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 mb-2 block text-slate-500">
                                                    Due Date
                                                </label>
                                                <input
                                                    name="dueDate"
                                                    type="date"
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:border-brand-navy outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                                                    Est. Minutes
                                                </label>
                                                <input
                                                    name="estimatedMinutes"
                                                    type="number"
                                                    defaultValue="0"
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:border-brand-navy outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                                                    Attachment
                                                </label>
                                                <input
                                                    name="file"
                                                    type="file"
                                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-2 block text-slate-500">
                                                Steps / Checklist
                                            </label>
                                            <textarea
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n').filter(l => l.trim());
                                                    const subtasks = lines.map(l => ({ title: l, completed: false }));
                                                    const input = e.target.form?.querySelector('input[name="subtasks"]') as HTMLInputElement;
                                                    if (input) input.value = JSON.stringify(subtasks);
                                                }}
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm focus:border-brand-navy outline-none min-h-[80px] transition-all resize-none placeholder:text-slate-300"
                                                placeholder="List steps here..."
                                            />
                                            <input type="hidden" name="subtasks" defaultValue="[]" />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-2 block text-slate-500">
                                                Assignee
                                            </label>
                                            <select name="assigneeId" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm focus:border-brand-navy outline-none">
                                                <option value="unassigned">Unassigned</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            className="w-full bg-brand-navy text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                                        >
                                            Create Task
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Task Edit Flyout */}
            {editingTask && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm transition-opacity" onClick={() => setEditingTask(null)} />

                    <div className="fixed inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md animate-slide-in-right">
                            <div className="h-full flex flex-col bg-white shadow-2xl border-l border-slate-200">
                                {/* Header */}
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Edit Task</h3>
                                        <p className="text-xs text-slate-500 mt-1">Update task parameters</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingTask(null)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateTask} encType="multipart/form-data" className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                                Title
                                            </label>
                                            <input
                                                name="title"
                                                required
                                                defaultValue={editingTask.title}
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm focus:border-brand-navy outline-none transition-all placeholder:text-slate-300"
                                                placeholder="What needs to be done?"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                defaultValue={editingTask.description || ''}
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm focus:border-brand-navy outline-none min-h-[140px] transition-all resize-none placeholder:text-slate-300"
                                                placeholder="Add more details about this task..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                                                    Priority
                                                </label>
                                                <select name="priority" defaultValue={editingTask.priority || 'medium'} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:border-brand-navy outline-none">
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                                                    Due Date
                                                </label>
                                                <input
                                                    name="dueDate"
                                                    type="date"
                                                    defaultValue={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:border-brand-navy outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                                                    Est. Minutes
                                                </label>
                                                <input
                                                    name="estimatedMinutes"
                                                    type="number"
                                                    defaultValue={editingTask.estimatedMinutes || 0}
                                                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:border-brand-navy outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                                                    Assignee
                                                </label>
                                                <select name="assigneeId" defaultValue={editingTask.assigneeId || 'unassigned'} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:border-brand-navy outline-none">
                                                    <option value="unassigned">Unassigned</option>
                                                    {users.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 mb-2 block">
                                                Steps / Checklist
                                            </label>
                                            <textarea
                                                defaultValue={editingTask.subtasks?.map((s: any) => s.title).join('\n') || ''}
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n').filter(l => l.trim());
                                                    const subtasks = lines.map(l => ({ title: l, completed: false }));
                                                    const input = e.target.form?.querySelector('input[name="subtasks"]') as HTMLInputElement;
                                                    if (input) input.value = JSON.stringify(subtasks);
                                                }}
                                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm focus:border-brand-navy outline-none min-h-[80px] transition-all resize-none placeholder:text-slate-300"
                                                placeholder="List steps here..."
                                            />
                                            <input type="hidden" name="subtasks" defaultValue={JSON.stringify(editingTask.subtasks || [])} />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            className="w-full bg-brand-navy text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                                        >
                                            Update Task
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
                        {/* Modal Header */}
                        <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-200">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getPriorityStyle(selectedTask.priority)}`}>
                                        {selectedTask.priority || 'Normal'}
                                    </span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200 bg-white text-slate-500">
                                        {selectedTask.status?.replace('_', ' ') || 'Todo'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedTask.title}</h2>
                                {selectedTask.projectId && selectedTask.projectId !== 'null' && (
                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                        <Folder className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-medium">Assigned to Project</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setEditingTask(selectedTask);
                                        setSelectedTask(null);
                                    }}
                                    className="text-slate-400 hover:text-brand-navy p-2 transition-all hover:bg-slate-100 rounded-lg border border-slate-200 shadow-sm bg-white"
                                    title="Edit Task"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="text-slate-400 hover:text-slate-600 p-2 transition-all hover:bg-slate-100 rounded-lg border border-slate-200 shadow-sm bg-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content Split */}
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                            {/* Left Area - Task Info */}
                            <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-hide">
                                <div className="max-w-xl space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due Date</p>
                                                <p className="text-xs font-bold text-slate-800">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Open Date'}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignee</p>
                                                <p className="text-xs font-bold text-slate-800">{selectedTask.assigneeName || 'Unassigned'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            Description
                                        </h3>
                                        <div className="p-5 bg-white rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
                                            {selectedTask.description || 'No description provided.'}
                                        </div>
                                    </div>

                                    {/* Sub-tasks */}
                                    {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                Checklist
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedTask.subtasks.map((sub: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                        {sub.completed ? (
                                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-slate-200" />
                                                        )}
                                                        <span className={`text-sm font-bold ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                            {sub.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="pt-6 border-t border-slate-100 space-y-3">
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Update Status</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['todo', 'in_progress', 'review', 'done'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={async () => {
                                                        const res = await updateTaskStatus(selectedTask.id, status, selectedTask.projectId || 'null');
                                                        if (res.success) {
                                                            setSelectedTask({ ...selectedTask, status });
                                                            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status } : t));
                                                        }
                                                    }}
                                                    disabled={selectedTask.status === status}
                                                    className={`px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border ${selectedTask.status === status
                                                        ? 'bg-brand-navy text-white border-transparent'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-brand-navy hover:text-brand-navy'
                                                        } disabled:opacity-50`}
                                                >
                                                    {status.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Area - Comments */}
                            <div className="w-full lg:w-[450px] border-l border-slate-100 flex flex-col bg-slate-50/30 overflow-hidden">
                                {user && (
                                    <CommentSystem
                                        key={selectedTask.id}
                                        taskId={selectedTask.id}
                                        projectId={selectedTask.projectId || 'null'}
                                        userId={user.id}
                                        initialComments={comments}
                                        title="Team Communication"
                                        className="h-full rounded-none border-0 shadow-none"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end px-6">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-10 py-3 bg-brand-navy text-brand-gold rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-brand-navy/20 active:scale-95 transition-all"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
