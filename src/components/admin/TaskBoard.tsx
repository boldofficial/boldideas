'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, MoreVertical, Edit2, Trash2,
    CheckCircle2, Clock, AlertCircle, User, Calendar,
    LayoutGrid, List, Shield, Terminal, X, MessageSquare,
    CheckCircle, Circle, PlayCircle, FileText, Flag, Folder
} from 'lucide-react';
import { createProjectTask, updateProjectTask, deleteProjectTask, updateTaskStatus, getTaskComments } from '@/actions/pm';
import { useAuthStore } from '@/store/authStore';
import CommentSystem from '@/components/shared/CommentSystem';
import TaskDetailModal from './TaskDetailModal';
import TaskEditSheet from './TaskEditSheet';
import TaskFormModal from './TaskFormModal';

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

            {/* Task Creation Modal */}
            <TaskFormModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                users={users}
            />
            {/* Task Edit Sheet */}
            <TaskEditSheet
                task={editingTask}
                onClose={() => setEditingTask(null)}
                users={users}
            />
            {/* Task Detail Modal */}
            <TaskDetailModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onEdit={(task) => {
                    setEditingTask(task);
                    setSelectedTask(null);
                }}
                onStatusChange={(taskId, status) => {
                    setSelectedTask(prev => prev ? { ...prev, status } : null);
                    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
                }}
                userId={user?.id}
                comments={comments}
            />
        </div>
    );
}
