'use client';

import React, { useState, useTransition } from 'react';
import { addInteraction } from '@/actions/crm';
import { Phone, Mail, Users, StickyNote, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface Interaction {
    id: string;
    type: string;
    notes: string;
    createdAt: Date | string | null;
    createdBy?: string | null;
}

interface Props {
    leadId: string;
    interactions: Interaction[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    call: {
        icon: <Phone className="w-3.5 h-3.5" />,
        color: 'text-green-600',
        bg: 'bg-green-50 border-green-200',
        label: 'Call',
    },
    email: {
        icon: <Mail className="w-3.5 h-3.5" />,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
        label: 'Email',
    },
    meeting: {
        icon: <Users className="w-3.5 h-3.5" />,
        color: 'text-purple-600',
        bg: 'bg-purple-50 border-purple-200',
        label: 'Meeting',
    },
    note: {
        icon: <StickyNote className="w-3.5 h-3.5" />,
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        label: 'Note',
    },
};

export default function ActivityTimeline({ leadId, interactions }: Props) {
    const [items, setItems] = useState<Interaction[]>(interactions);
    const [newType, setNewType] = useState('note');
    const [newNotes, setNewNotes] = useState('');
    const [isPending, startTransition] = useTransition();
    const [showForm, setShowForm] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newNotes.trim()) return;

        const formData = new FormData();
        formData.set('leadId', leadId);
        formData.set('type', newType);
        formData.set('notes', newNotes);

        // Optimistic update
        const optimistic: Interaction = {
            id: `temp-${Date.now()}`,
            type: newType,
            notes: newNotes,
            createdAt: new Date().toISOString(),
        };
        setItems(prev => [optimistic, ...prev]);
        setNewNotes('');
        setShowForm(false);

        startTransition(async () => {
            const result = await addInteraction(formData);
            if (!result.success) {
                setItems(prev => prev.filter(i => i.id !== optimistic.id));
            }
        });
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-gold" />
                    <h2 className="text-sm font-black text-brand-navy uppercase tracking-wider">Activity Timeline</h2>
                    <span className="text-[10px] font-bold text-slate-400 ml-1">({items.length})</span>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                        showForm ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                    {showForm ? 'Cancel' : '+ Log Activity'}
                </button>
            </div>

            {/* Quick Add Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex gap-2 mb-3">
                        {Object.entries(typeConfig).map(([key, cfg]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setNewType(key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    newType === key
                                        ? `${cfg.bg} ${cfg.color}`
                                        : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'
                                }`}
                            >
                                {cfg.icon}
                                {cfg.label}
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        placeholder="Enter details about this activity..."
                        rows={3}
                        className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy resize-none"
                        autoFocus
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!newNotes.trim() || isPending}
                            className="bg-brand-navy text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Saving...' : 'Log Activity'}
                        </button>
                    </div>
                </form>
            )}

            {/* Timeline */}
            <div className="divide-y divide-slate-100">
                {items.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic text-sm">
                        No activity logged yet. Click "Log Activity" above to start tracking interactions.
                    </div>
                ) : (
                    items.map((item, idx) => {
                        const cfg = typeConfig[item.type] || typeConfig.note;
                        const isExpanded = expandedId === item.id;
                        const notes = item.notes || '';
                        const isTruncated = notes.length > 120;

                        return (
                            <div
                                key={item.id}
                                className={`p-4 hover:bg-slate-50/50 transition-colors ${item.id.startsWith('temp-') ? 'opacity-60 animate-pulse' : ''}`}
                            >
                                <div className="flex gap-4 items-start">
                                    {/* Timeline dot + line */}
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.bg} ${cfg.color}`}>
                                            {cfg.icon}
                                        </div>
                                        {idx < items.length - 1 && (
                                            <div className="w-px h-full min-h-[16px] bg-slate-200 mt-1" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {item.createdAt ? formatDateTime(item.createdAt) : 'Just now'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-slate-700 leading-relaxed">
                                            {isTruncated && !isExpanded ? (
                                                <>
                                                    {notes.slice(0, 120)}...
                                                    <button
                                                        onClick={() => setExpandedId(item.id)}
                                                        className="text-brand-navy font-bold text-xs ml-1 hover:underline"
                                                    >
                                                        Read more <ChevronDown className="inline w-3 h-3" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{notes}</div>
                                            )}
                                            {isExpanded && (
                                                <button
                                                    onClick={() => setExpandedId(null)}
                                                    className="block text-brand-navy font-bold text-xs mt-1 hover:underline"
                                                >
                                                    Show less <ChevronUp className="inline w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function formatDateTime(value: Date | string) {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
