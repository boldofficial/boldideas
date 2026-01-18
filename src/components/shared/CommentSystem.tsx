'use client';

import React, { useState } from 'react';
import { Send, Paperclip, MessageSquare, Terminal, ShieldCheck, User, Clock, FileText } from 'lucide-react';
import { postProjectComment } from '@/actions/pm';

interface Comment {
    id: string;
    content: string | null;
    attachmentUrl: string | null;
    createdAt: Date | null;
    userName: string | null;
    userAvatar: string | null;
}

interface CommentSystemProps {
    taskId?: string;
    projectId?: string;
    userId: string;
    initialComments: Comment[];
    title?: string;
    className?: string;
}

export default function CommentSystem({ taskId, projectId, userId, initialComments, title = "Communication Uplink", className }: CommentSystemProps) {
    const [comments, setComments] = useState(initialComments);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !isSubmitting) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content);
        formData.append('userId', userId);
        if (taskId) formData.append('taskId', taskId);
        if (projectId) formData.append('projectId', projectId);

        const result = await postProjectComment(formData);
        if (result.success) {
            setContent('');
            // Add Optimistic Update
            const newComment: Comment = {
                id: Math.random().toString(),
                content: content,
                attachmentUrl: null,
                createdAt: new Date(),
                userName: 'You', // Placeholder
                userAvatar: null
            };
            setComments([newComment, ...comments]);
        }
        setIsSubmitting(false);
    };

    const formatRelativeTime = (date: Date | null) => {
        if (!date) return 'NOW';
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds}S_AGO`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}M_AGO`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}H_AGO`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in ${className || 'h-[600px]'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-brand-navy uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-brand-gold" />
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[8px] font-mono text-slate-400 uppercase">Uplink_Secure</span>
                </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-slate-50/20">
                {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-12">
                        <MessageSquare className="w-12 h-12 mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No signals detected in this sector</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="group relative">
                            <div className="flex gap-4">
                                <div className="shrink-0 pt-1">
                                    <div className="w-8 h-8 rounded bg-brand-navy border border-brand-gold/20 flex items-center justify-center overflow-hidden shadow-sm">
                                        {comment.userAvatar ? (
                                            <img src={comment.userAvatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4 text-brand-gold" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-brand-navy uppercase tracking-tight italic">
                                            {comment.userName || 'OPERATIVE_UNKNOWN'}
                                        </span>
                                        <div className="flex items-center gap-1 text-[8px] font-mono text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {formatRelativeTime(comment.createdAt)}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-slate-200 text-sm text-slate-700 shadow-sm group-hover:border-brand-gold/30 transition-colors">
                                        {comment.content}

                                        {comment.attachmentUrl && (
                                            <div className="mt-2 p-2 bg-slate-50 border border-dashed border-slate-200 rounded flex items-center gap-2 text-[10px] font-bold text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer">
                                                <FileText className="w-3 h-3" />
                                                <span className="truncate">Mission_Asset_Attached</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white shadow-xl relative z-10">
                <form onSubmit={handleSubmit} className="relative group">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type directive or signal..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-24 text-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none resize-none transition-all min-h-[50px] group-focus-within:bg-white"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        <button type="button" className="p-2 text-slate-400 hover:text-brand-navy transition-colors">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="bg-brand-navy text-brand-gold p-2 rounded shadow-sm hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
                <div className="mt-2 flex items-center gap-2 opacity-40">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest italic">Encrypted_Transmission_Mode</span>
                </div>
            </div>
        </div>
    );
}
