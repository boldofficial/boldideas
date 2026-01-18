'use client';

import { useEffect, useState } from 'react';
import { getStaffTasks } from '@/actions/staff';
import { updateTaskStatus, getTaskComments, updateProjectTask } from '@/actions/pm';
import { getStaffStats } from '@/actions/staff';
import { getTotalTaskTime } from '@/actions/time';
import { useAuthStore } from '@/store/authStore';
import Timer from '@/components/staff/Timer';
import CommentSystem from '@/components/shared/CommentSystem';
import { CheckCircle, Circle, Clock, PlayCircle, X, FileText, Calendar, Flag, Folder, Target, TrendingUp, AlertTriangle, FolderKanban } from 'lucide-react';

interface StaffStats {
    tasksDueToday: number;
    completedThisWeek: number;
    activeProjects: number;
    pendingTasks: number;
    overdueTasks: number;
}

export default function StaffDashboard() {
    const { user } = useAuthStore();
    const [tasks, setTasks] = useState<any[]>([]);
    const [stats, setStats] = useState<StaffStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [updatingTask, setUpdatingTask] = useState<string | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                setLoading(true);
                const [tasksResult, statsResult] = await Promise.all([
                    getStaffTasks(user.id),
                    getStaffStats(user.id)
                ]);
                setTasks(tasksResult.data || []);
                setStats(statsResult.data || null);
                setLoading(false);
            };
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        const fetchComments = async () => {
            if (selectedTask) {
                setCommentLoading(true);
                const { data } = await getTaskComments(selectedTask.id);
                setComments(data || []);
                setCommentLoading(false);

                // Fetch time logs summary
                const { totalSeconds } = await getTotalTaskTime(selectedTask.id);
                setTotalSeconds(totalSeconds || 0);
            }
        };
        fetchComments();
    }, [selectedTask]);

    const handleQuickStatusChange = async (taskId: string, projectId: string, status: any) => {
        setUpdatingTask(taskId);
        const result = await updateTaskStatus(taskId, status, projectId);
        if (result.success) {
            // Update local state
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
            if (selectedTask?.id === taskId) {
                setSelectedTask((prev: any) => ({ ...prev, status }));
            }
            // Refresh stats
            if (user) {
                const statsResult = await getStaffStats(user.id);
                setStats(statsResult.data || null);
            }
        }
        setUpdatingTask(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'in_progress': return <PlayCircle className="w-5 h-5 text-blue-500" />;
            case 'review': return <Clock className="w-5 h-5 text-amber-500" />;
            default: return <Circle className="w-5 h-5 text-slate-300" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'bg-green-50 text-green-700 border-green-200';
            case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'review': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-600 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-[#D4AF37] text-white';
            default: return 'bg-slate-400 text-white';
        }
    };

    const getStatusOptions = (currentStatus: string) => {
        const allStatuses = ['todo', 'in_progress', 'review', 'done'];
        return allStatuses.filter(s => s !== currentStatus);
    };

    const handlePostComment = async (e: React.FormEvent<HTMLFormElement>) => {
        // Redundant - Handled by CommentSystem
    };

    if (loading) return <div className="p-8">Loading your tasks...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Due Today', value: stats?.tasksDueToday || 0, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Completed', value: stats?.completedThisWeek || 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Active Projects', value: stats?.activeProjects || 0, icon: FolderKanban, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending', value: stats?.pendingTasks || 0, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assigned Tasks</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your workload and project assignments</p>
                </div>
                <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold text-xs border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    {tasks.length} Active Tasks
                </div>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-brand-gold hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">{getStatusIcon(task.status)}</div>
                                <div>
                                    <h2 className={`text-lg font-bold text-slate-800 ${task.status === 'done' ? 'line-through text-slate-400 font-medium' : ''}`}>
                                        {task.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] font-bold uppercase tracking-wider">
                                        <span className={`${task.priority === 'urgent' ? 'text-red-500' : 'text-slate-500'}`}>{task.priority}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-500 italic lowercase font-medium">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</span>
                                        {task.projectTitle && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-brand-navy bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{task.projectTitle}</span>
                                            </>
                                        )}
                                    </div>
                                    {task.description && (
                                        <p className="text-xs text-slate-500 mt-2 max-w-2xl line-clamp-1 italic opacity-70">
                                            {task.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getStatusColor(task.status)} shadow-sm`}>
                                    {task.status.replace('_', ' ')}
                                </span>

                                <div className="relative group/dropdown">
                                    <button
                                        className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors border border-slate-100"
                                        disabled={updatingTask === task.id}
                                    >
                                        <X className="w-4 h-4 rotate-45" />
                                    </button>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-50 p-2 space-y-1 translate-y-2 group-hover/dropdown:translate-y-0">
                                        {getStatusOptions(task.status).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleQuickStatusChange(task.id, task.projectId, status)}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                                            >
                                                {getStatusIcon(status)}
                                                <span className="capitalize">{status.replace('_', ' ')}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
                        {/* Modal Header */}
                        <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-200">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getPriorityColor(selectedTask.priority)}`}>
                                        {selectedTask.priority}
                                    </span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200 bg-white text-slate-500">
                                        {selectedTask.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedTask.title}</h2>
                                {selectedTask.projectTitle && (
                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                        <Folder className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-medium">{selectedTask.projectTitle}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="text-slate-400 hover:text-slate-600 p-2 transition-all hover:bg-slate-100 rounded-lg border border-slate-200 shadow-sm bg-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        Broadway

                        {/* Modal Content Split */}
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                            {/* Left Scrollable Area */}
                            <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-hide">
                                <div className="max-w-xl space-y-8">
                                    {/* Quick Info Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Due Date', value: selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Open', icon: Calendar },
                                            { label: 'Status', value: selectedTask.status, icon: Target },
                                            { label: 'Est. Mins', value: selectedTask.estimatedMinutes > 0 ? `${selectedTask.estimatedMinutes}m` : '0', icon: Clock },
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-2">
                                                <stat.icon className="w-4 h-4 text-slate-400" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                                    <p className="text-xs font-bold text-slate-800 capitalize">{stat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            Description
                                        </h3>
                                        <div className="p-5 bg-white rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium">
                                            {selectedTask.description || 'No description provided.'}
                                        </div>
                                    </div>

                                    {/* Checklist */}
                                    {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                Checklist
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {selectedTask.subtasks.map((sub: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        onClick={async () => {
                                                            const newSubtasks = [...selectedTask.subtasks];
                                                            newSubtasks[idx].completed = !newSubtasks[idx].completed;
                                                            const formData = new FormData();
                                                            formData.append('taskId', selectedTask.id);
                                                            formData.append('projectId', selectedTask.projectId);
                                                            formData.append('subtasks', JSON.stringify(newSubtasks));
                                                            const res = await updateProjectTask(formData);
                                                            if (res.success) {
                                                                setSelectedTask({ ...selectedTask, subtasks: newSubtasks });
                                                                setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, subtasks: newSubtasks } : t));
                                                            }
                                                        }}
                                                        className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer group shadow-sm"
                                                    >
                                                        {sub.completed ? (
                                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-slate-200 group-hover:text-emerald-300" />
                                                        )}
                                                        <span className={`text-sm font-bold ${sub.completed ? 'text-slate-400 line-through decoration-emerald-500/30' : 'text-slate-700'}`}>
                                                            {sub.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Attachments */}
                                    {selectedTask.attachmentUrl && (
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Attachments</h3>
                                            <a
                                                href={selectedTask.attachmentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm group-hover:text-brand-navy">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-bold">Download Attachment</span>
                                                </div>
                                                <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-90" />
                                            </a>
                                        </div>
                                    )}

                                    {/* Timer Section */}
                                    <div className="pt-6 border-t border-slate-100 space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                                            <span>Task Timer</span>
                                            <span className="text-brand-navy bg-slate-100 px-2 py-0.5 rounded">LOGGED: {Math.floor(totalSeconds / 3600)}H {Math.floor((totalSeconds % 3600) / 60)}M</span>
                                        </div>
                                        {user && <Timer taskId={selectedTask.id} userId={user.id} />}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="pt-6 border-t border-slate-100 space-y-3">
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Update Status</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['todo', 'in_progress', 'review', 'done'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleQuickStatusChange(selectedTask.id, selectedTask.projectId, status)}
                                                    disabled={updatingTask === selectedTask.id || selectedTask.status === status}
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

                            {/* Right Communication Bar */}
                            <div className="w-full lg:w-[400px] border-l border-slate-100 flex flex-col bg-slate-50/30 overflow-hidden">
                                {user && (
                                    <CommentSystem
                                        key={selectedTask.id}
                                        taskId={selectedTask.id}
                                        projectId={selectedTask.projectId}
                                        userId={user.id}
                                        initialComments={comments}
                                        title="Team Communication"
                                        className="h-full border-none rounded-none shadow-none"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end px-6">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-10 py-3 bg-brand-navy text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-black active:scale-95 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
