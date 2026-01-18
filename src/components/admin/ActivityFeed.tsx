'use client';

import React from 'react';
import { Clock, CheckCircle, MessageSquare, AlertCircle, PlusCircle, Activity } from 'lucide-react';

interface ActivityItem {
    id: string;
    userName: string | null;
    userAvatar: string | null;
    action: string;
    details: any;
    createdAt: Date | null;
}

export default function ActivityFeed({ activities }: { activities: any[] }) {
    const getActionIcon = (action: string) => {
        switch (action) {
            case 'task_completed': return <CheckCircle className="w-3 h-3 text-green-500" />;
            case 'task_comment_posted':
            case 'project_comment_posted': return <MessageSquare className="w-3 h-3 text-blue-500" />;
            case 'project_updated': return <Activity className="w-3 h-3 text-purple-500" />;
            case 'task_created': return <PlusCircle className="w-3 h-3 text-brand-gold" />;
            default: return <Clock className="w-3 h-3 text-slate-400" />;
        }
    };

    const getActionText = (activity: ActivityItem) => {
        const name = activity.userName || 'System';
        switch (activity.action) {
            case 'task_completed': return <span><b className="text-slate-700">{name}</b> completed task <b className="text-[#0A1128]">{activity.details.title || 'Untitled'}</b></span>;
            case 'task_comment_posted': return <span><b className="text-slate-700">{name}</b> commented on task <b className="text-[#0A1128]">{activity.details.preview ? `"${activity.details.preview}..."` : 'Task'}</b></span>;
            case 'project_updated': return <span><b className="text-slate-700">{name}</b> updated project <b className="text-[#0A1128]">{activity.details.title}</b></span>;
            case 'task_created': return <span><b className="text-slate-700">{name}</b> created new task: <b className="text-[#0A1128]">{activity.details.title}</b></span>;
            default: return <span><b className="text-slate-700">{name}</b> performed activity: {activity.action}</span>;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-xs font-medium text-brand-navy flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-gold" />
                    Activity Feed
                </h3>
                <span className="text-xs text-slate-400">Live updates</span>
            </div>

            <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic text-sm">No recent activity.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {activities.map((activity) => (
                            <div key={activity.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                                        {activity.userAvatar ? (
                                            <img src={activity.userAvatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-medium text-slate-400">{activity.userName?.[0] || 'S'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] leading-relaxed text-slate-600">
                                            {getActionText(activity)}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getActionIcon(activity.action)}
                                            <span className="text-xs text-slate-400">
                                                {activity.createdAt ? new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                <button className="text-xs font-medium text-brand-navy hover:text-brand-gold transition-colors">
                    View All Activity
                </button>
            </div>
        </div>
    );
}
