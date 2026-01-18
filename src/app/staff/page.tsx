'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/actions/agency';
import { updateTaskStatus, getTaskComments } from '@/actions/pm';
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
                    getTasks(user.id),
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
        <div>
            {/* ... stats widgets ... */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {/* ... existing stats boxes ... */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-brand-navy">{stats?.tasksDueToday || 0}</p>
                            <p className="text-xs text-slate-400 font-medium">Due Today</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-brand-navy">{stats?.completedThisWeek || 0}</p>
                            <p className="text-xs text-slate-400 font-medium">This Week</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FolderKanban className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-brand-navy">{stats?.activeProjects || 0}</p>
                            <p className="text-xs text-slate-400 font-medium">Projects</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-brand-navy">{stats?.pendingTasks || 0}</p>
                            <p className="text-xs text-slate-400 font-medium">Pending</p>
                        </div>
                    </div>
                </div>
                <div className={`p-4 rounded-lg border shadow-sm ${(stats?.overdueTasks || 0) > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${(stats?.overdueTasks || 0) > 0 ? 'bg-red-100' : 'bg-slate-50'}`}>
                            <AlertTriangle className={`w-5 h-5 ${(stats?.overdueTasks || 0) > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                        </div>
                        <div>
                            <p className={`text-2xl font-black ${(stats?.overdueTasks || 0) > 0 ? 'text-red-600' : 'text-brand-navy'}`}>{stats?.overdueTasks || 0}</p>
                            <p className="text-xs text-slate-400 font-medium">Overdue</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A1128]">My Tasks</h1>
                    <p className="text-slate-500 text-sm mt-1">Your assigned tasks and projects</p>
                </div>
                <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded font-medium text-sm border border-[#D4AF37]/20">
                    {tasks.length} Active Tasks
                </div>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4 flex-1">
                                {getStatusIcon(task.status)}
                                <div>
                                    <h3 className={`font-bold text-slate-800 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide flex gap-2 mt-1">
                                        <span className="text-xs text-slate-500">{task.priority} Priority</span>
                                        <span>•</span>
                                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Limit'}</span>
                                        {task.projectTitle && (
                                            <>
                                                <span>•</span>
                                                <span className="text-[#D4AF37] font-bold">{task.projectTitle}</span>
                                            </>
                                        )}
                                    </p>
                                    {task.description && (
                                        <p className="text-xs text-slate-400 mt-2 max-w-lg truncate italic">
                                            "{task.description}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                                <span className={`px-3 py-1.5 text-xs font-medium rounded border ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>

                                <div className="relative group/dropdown">
                                    <button
                                        className="p-2 text-slate-400 hover:text-[#0A1128] hover:bg-slate-100 rounded transition-colors"
                                        disabled={updatingTask === task.id}
                                    >
                                        {updatingTask === task.id ? (
                                            <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </button>

                                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-50">
                                        <div className="p-1">
                                            {getStatusOptions(task.status).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleQuickStatusChange(task.id, task.projectId, status)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded transition-colors"
                                                >
                                                    {getStatusIcon(status)}
                                                    {status.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTask && (
                <div className="fixed inset-0 bg-[#0A1128]/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-[#D4AF37]/20">
                        {/* Header */}
                        <div className="bg-[#0A1128] p-6 flex justify-between items-start border-b border-[#D4AF37]/20">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(selectedTask.priority)}`}>
                                        {selectedTask.priority} Priority
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]`}>
                                        {selectedTask.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">{selectedTask.title}</h2>
                                {selectedTask.projectTitle && (
                                    <p className="text-xs text-[#D4AF37] mt-1 flex items-center gap-1">
                                        <Folder className="w-3 h-3" />
                                        Project: {selectedTask.projectTitle}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="text-white/50 hover:text-[#D4AF37] p-2 transition-colors bg-white/5 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Split Content */}
                        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                            {/* Left: Task Info */}
                            <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-slate-100">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Deadline</p>
                                            <p className="text-xs font-bold text-[#0A1128]">
                                                {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No Deadline'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <Target className="w-5 h-5 text-[#D4AF37]" />
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Status</p>
                                            <p className="text-xs font-bold text-[#0A1128] capitalize">
                                                {selectedTask.status.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xs font-medium text-[#0A1128] mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#D4AF37]" />
                                        Description
                                    </h3>
                                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 min-h-[120px]">
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {selectedTask.description || 'No direct instructions provided.'}
                                        </p>
                                    </div>
                                </div>

                                {selectedTask.attachmentUrl && (
                                    <div className="mb-8">
                                        <h3 className="text-xs font-medium text-[#0A1128] mb-4">Attachments</h3>
                                        <a
                                            href={selectedTask.attachmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg group hover:bg-[#D4AF37]/10 transition-all"
                                        >
                                            <span className="text-xs font-medium text-[#0A1128]">View Attachment</span>
                                            <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">→</span>
                                        </a>
                                    </div>
                                )}

                                {/* Mission Ops Timer */}
                                <div className="mb-8">
                                    <h3 className="text-xs font-medium text-[#0A1128] mb-4 flex justify-between items-center">
                                        <span>Time Tracking</span>
                                        <span className="text-[#D4AF37]">Total: {Math.floor(totalSeconds / 3600)}h {Math.floor((totalSeconds % 3600) / 60)}m</span>
                                    </h3>
                                    {user && <Timer taskId={selectedTask.id} userId={user.id} />}
                                </div>

                                <div>
                                    <h3 className="text-xs font-medium text-[#0A1128] mb-4">Update Status</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['todo', 'in_progress', 'review', 'done'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleQuickStatusChange(selectedTask.id, selectedTask.projectId, status)}
                                                disabled={updatingTask === selectedTask.id || selectedTask.status === status}
                                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded text-xs font-medium transition-all ${selectedTask.status === status
                                                    ? 'bg-[#0A1128] text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    } disabled:opacity-50`}
                                            >
                                                {getStatusIcon(status)}
                                                {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Communications Hub */}
                            <div className="w-full lg:w-1/2 bg-slate-50/50 p-6 flex flex-col border-t lg:border-t-0 border-slate-100 h-full overflow-hidden">
                                {user && (
                                    <CommentSystem
                                        taskId={selectedTask.id}
                                        projectId={selectedTask.projectId}
                                        userId={user.id}
                                        initialComments={comments}
                                        title="Comments"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center px-6">
                            <div className="text-xs text-slate-400">
                                Task Details
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-8 py-2.5 bg-[#0A1128] text-white rounded font-medium text-sm hover:bg-[#D4AF37] hover:text-[#0A1128] transition-all"
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

