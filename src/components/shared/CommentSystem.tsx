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

export default function CommentSystem({ taskId, projectId, userId, initialComments, title = "Comments", className }: CommentSystemProps) {
    const [comments, setComments] = useState(initialComments);

    // Sync state when initialComments change (loading finished)
    React.useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !selectedFile && !isSubmitting) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content);
        formData.append('userId', userId);
        if (taskId) formData.append('taskId', taskId);
        if (projectId) formData.append('projectId', projectId);
        if (selectedFile) formData.append('file', selectedFile);

        const result = await postProjectComment(formData);
        if (result.success) {
            setContent('');
            setSelectedFile(null);
            // Add Optimistic Update
            const newComment: Comment = {
                id: Math.random().toString(),
                content: content,
                attachmentUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
                createdAt: new Date(),
                userName: 'You', // Placeholder
                userAvatar: null
            };
            setComments([newComment, ...comments]);
        }
        setIsSubmitting(false);
    };

    const formatRelativeTime = (date: Date | null) => {
        if (!date) return 'Just now';
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className={`bg-white flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-gold" />
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Connected</span>
                </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/10">
                {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 py-12">
                        <MessageSquare className="w-10 h-10 mb-2 text-slate-300" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity reported</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="group relative">
                            <div className="flex gap-4">
                                <div className="shrink-0 pt-1">
                                    <div className="w-8 h-8 rounded-lg bg-brand-navy border border-white/10 flex items-center justify-center overflow-hidden shadow-sm">
                                        {comment.userAvatar ? (
                                            <img src={comment.userAvatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4 text-brand-gold" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-brand-navy">
                                            {comment.userName || 'System'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            {formatRelativeTime(comment.createdAt)}
                                        </span>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 shadow-sm leading-relaxed font-medium">
                                        {comment.content}

                                        {comment.attachmentUrl && (
                                            <div className="mt-3 pt-3 border-t border-slate-50">
                                                <a
                                                    href={comment.attachmentUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-[10px] font-bold text-brand-navy hover:bg-slate-100 transition-colors inline-flex uppercase tracking-wider"
                                                >
                                                    <FileText className="w-3 h-3 text-brand-gold" />
                                                    <span>View Asset</span>
                                                </a>
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
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-24 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none resize-none transition-all min-h-[50px] group-focus-within:bg-white"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        {selectedFile && (
                            <span className="text-[8px] font-bold text-brand-gold bg-brand-navy px-1 py-0.5 rounded truncate max-w-[60px]">
                                {selectedFile.name}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 transition-colors ${selectedFile ? 'text-brand-gold' : 'text-slate-400 hover:text-brand-navy'}`}
                        >
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || (!content.trim() && !selectedFile)}
                            className="bg-brand-navy text-brand-gold p-2 rounded shadow-sm hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
