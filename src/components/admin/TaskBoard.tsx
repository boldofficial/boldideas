'use client';

import React, { useState } from 'react';
import {
    Plus, Search, Filter, MoreVertical, Edit2, Trash2,
    CheckCircle2, Clock, AlertCircle, User, Calendar,
    LayoutGrid, List, Shield, Terminal, X
} from 'lucide-react';
import { createProjectTask, updateProjectTask, deleteProjectTask, updateTaskStatus } from '@/actions/pm';

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
            case 'urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-all">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-brand-gold outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-1.5 rounded transition-all ${view === 'grid' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-1.5 rounded transition-all ${view === 'list' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-brand-navy text-brand-gold px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-brand-navy/10"
                    >
                        <Plus className="w-4 h-4" />
                        Create Task
                    </button>
                </div>
            </div>

            {/* Task Grid/List */}
            <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className={`bg-white rounded-lg border border-slate-200 group hover:border-brand-gold/50 transition-all hover:shadow-md animate-fade-in ${view === 'list' ? 'p-4 flex items-center justify-between gap-4' : 'flex flex-col p-6'}`}
                    >
                        <div className={`flex gap-4 ${view === 'list' ? 'items-center flex-1' : 'flex-col'}`}>
                            {/* Priority Dot/Tag */}
                            <div className={`${view === 'list' ? 'shrink-0' : 'mb-4 flex justify-between items-start'}`}>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyle(task.priority)}`}>
                                    {task.priority || 'NORMAL'}
                                </span>
                                {view === 'grid' && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingTask(task)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(task.id)} className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-brand-navy truncate group-hover:text-brand-gold transition-colors">
                                    {task.title}
                                </h4>
                                {task.description && view === 'grid' && (
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium">
                                        {task.description}
                                    </p>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className={`flex items-center gap-4 ${view === 'list' ? 'shrink-0' : 'mt-6 pt-4 border-t border-slate-50'}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center">
                                        <User className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-500">
                                        {task.assigneeName || 'UNASSIGNED'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs text-slate-400">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'OPEN_DATE'}
                                    </span>
                                </div>

                                <div className={`px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-xs text-slate-400 capitalize ${view === 'list' ? 'hidden md:block' : ''}`}>
                                    {task.status}
                                </div>
                            </div>
                        </div>

                        {view === 'list' && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                <button onClick={() => setEditingTask(task)} className="p-2 hover:bg-slate-100 rounded-md text-slate-400 hover:text-brand-navy transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors">
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
                                <div className="p-8 bg-brand-navy text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
                                                <Plus className="w-6 h-6 text-brand-navy" />
                                            </div>
                                            <h3 className="text-2xl font-bold">New Task</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1 pl-1">Create a new task</p>
                                    </div>
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                    {/* Decorative background element */}
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl" />
                                </div>

                                {/* Form */}
                                <form onSubmit={handleCreateTask} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-brand-navy transition-colors">
                                                Objective Title
                                            </label>
                                            <input
                                                name="title"
                                                required
                                                className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 text-sm focus:border-brand-gold outline-none transition-all placeholder:text-slate-300"
                                                placeholder="What needs to be done?"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                                Mission Scope & Parameters
                                            </label>
                                            <textarea
                                                name="description"
                                                className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 text-sm focus:border-brand-gold outline-none min-h-[140px] transition-all resize-none"
                                                placeholder="Describe the task details..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 mb-2 block">
                                                    Priority
                                                </label>
                                                <select name="priority" className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-sm focus:border-brand-gold outline-none">
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 mb-2 block">
                                                    Due Date
                                                </label>
                                                <input
                                                    name="dueDate"
                                                    type="date"
                                                    className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-sm focus:border-brand-gold outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-2 block">
                                                Assignee
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <select name="assigneeId" className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 pl-12 pr-4 text-sm focus:border-brand-gold outline-none">
                                                    <option value="unassigned">Unassigned</option>
                                                    {users.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10">
                                        <button
                                            type="submit"
                                            className="w-full bg-brand-navy text-brand-gold py-4 rounded-xl text-sm font-medium shadow-xl hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Shield className="w-5 h-5" />
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
                                <div className="p-8 bg-brand-navy text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
                                                <Edit2 className="w-6 h-6 text-brand-navy" />
                                            </div>
                                            <h3 className="text-2xl font-bold">Edit Task</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1 pl-1">Update task details</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingTask(null)}
                                        className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl" />
                                </div>

                                <form onSubmit={handleUpdateTask} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-xs font-medium text-slate-500 mb-2 block group-focus-within:text-brand-navy transition-colors">
                                                Task Title
                                            </label>
                                            <input
                                                name="title"
                                                required
                                                defaultValue={editingTask.title}
                                                className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 text-sm focus:border-brand-gold outline-none transition-all"
                                                placeholder="What needs to be done?"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                                Mission Scope & Parameters
                                            </label>
                                            <textarea
                                                name="description"
                                                defaultValue={editingTask.description || ''}
                                                className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 text-sm focus:border-brand-gold outline-none min-h-[140px] transition-all resize-none"
                                                placeholder="Describe the task details..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 mb-2 block">
                                                    Priority
                                                </label>
                                                <select name="priority" defaultValue={editingTask.priority || 'medium'} className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-sm focus:border-brand-gold outline-none">
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 mb-2 block">
                                                    Due Date
                                                </label>
                                                <input
                                                    name="dueDate"
                                                    type="date"
                                                    defaultValue={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                                                    className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-sm focus:border-brand-gold outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-2 block">
                                                Assignee
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <select name="assigneeId" defaultValue={editingTask.assigneeId || 'unassigned'} className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 pl-12 pr-4 text-sm focus:border-brand-gold outline-none">
                                                    <option value="unassigned">Unassigned</option>
                                                    {users.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10">
                                        <button
                                            type="submit"
                                            className="w-full bg-brand-navy text-brand-gold py-4 rounded-xl text-sm font-medium shadow-xl hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Shield className="w-5 h-5" />
                                            Update Task
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
