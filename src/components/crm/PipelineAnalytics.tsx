'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Users, DollarSign, Activity } from 'lucide-react';

interface AnalyticsData {
    total: number;
    active: number;
    won: number;
    lost: number;
    winRate: number;
    totalPipelineValue: number;
    pipeline: { status: string; label: string; count: number; value: number }[];
    monthlyTrend: { month: string; created: number; won: number }[];
    bySource: { source: string; count: number }[];
}

interface Props {
    data: AnalyticsData;
    onClose?: () => void;
}

export default function PipelineAnalytics({ data, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<'funnel' | 'trends' | 'sources'>('funnel');

    const maxPipelineCount = Math.max(...data.pipeline.map(p => p.count), 1);
    const maxTrendCount = Math.max(...data.monthlyTrend.flatMap(m => [m.created, m.won]), 1);

    const statusColors: Record<string, string> = {
        new: 'bg-blue-500',
        contacted: 'bg-yellow-500',
        qualified: 'bg-indigo-500',
        proposal: 'bg-purple-500',
        won: 'bg-green-500',
        lost: 'bg-rose-400',
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-brand-gold" />
                    <h2 className="text-lg font-black text-brand-navy uppercase tracking-tight">Pipeline Analytics</h2>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    {(['funnel', 'trends', 'sources'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                activeTab === tab ? 'bg-white shadow text-brand-navy' : 'text-slate-500 hover:text-brand-navy'
                            }`}
                        >
                            {tab === 'funnel' ? 'Funnel' : tab === 'trends' ? 'Trends' : 'Sources'}
                        </button>
                    ))}
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-slate-100">
                <SummaryCard icon={<Users className="w-4 h-4" />} label="Total Leads" value={data.total} color="text-brand-navy" />
                <SummaryCard icon={<Activity className="w-4 h-4" />} label="Active" value={data.active} color="text-indigo-600" />
                <SummaryCard icon={<TrendingUp className="w-4 h-4" />} label="Win Rate" value={`${data.winRate}%`} color="text-green-600" />
                <SummaryCard icon={<Target className="w-4 h-4" />} label="Won" value={data.won} color="text-green-600" />
                <SummaryCard icon={<DollarSign className="w-4 h-4" />} label="Pipeline Value" value={`$${(data.totalPipelineValue).toLocaleString()}`} color="text-brand-gold" />
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'funnel' && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Conversion Funnel</h3>
                        {data.pipeline.filter(p => p.status !== 'lost').map((stage, i) => {
                            const barWidth = maxPipelineCount > 0 ? (stage.count / maxPipelineCount) * 100 : 0;
                            return (
                                <div key={stage.status} className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-700">{stage.label}</span>
                                        <span className="font-mono font-bold text-slate-500">
                                            {stage.count} leads · ${stage.value.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-500 ${statusColors[stage.status] || 'bg-slate-400'}`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                        <div className="absolute inset-0 flex items-center px-3">
                                            {i > 0 && stage.count > 0 && data.pipeline[i - 1].count > 0 && (
                                                <span className="text-[10px] font-bold text-white/80 mr-2">
                                                    {Math.round((stage.count / data.pipeline[i - 1].count) * 100)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'trends' && (
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Monthly Trend (6 months)</h3>
                        <div className="flex items-end gap-3 h-48">
                            {data.monthlyTrend.map(m => {
                                const createdHeight = maxTrendCount > 0 ? (m.created / maxTrendCount) * 100 : 0;
                                const wonHeight = maxTrendCount > 0 ? (m.won / maxTrendCount) * 100 : 0;
                                return (
                                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                        <span className="text-[9px] font-bold text-green-600">{m.won || ''}</span>
                                        <div className="w-full flex flex-col items-center gap-0.5" style={{ height: `${Math.max(createdHeight, 4)}%` }}>
                                            <div
                                                className="w-4/5 bg-brand-gold/40 rounded-t"
                                                style={{ height: `${wonHeight}%`, minHeight: m.won > 0 ? '4px' : '0' }}
                                                title={`Won: ${m.won}`}
                                            />
                                            <div
                                                className="w-full bg-brand-navy/60 rounded-t"
                                                style={{ height: `${createdHeight}%`, minHeight: m.created > 0 ? '4px' : '0' }}
                                                title={`Created: ${m.created}`}
                                            />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 mt-1 rotate-[-45deg] origin-left whitespace-nowrap">
                                            {m.month}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-brand-navy/60" /> Created
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-brand-gold/40" /> Won
                            </span>
                        </div>
                    </div>
                )}

                {activeTab === 'sources' && (
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Leads by Source</h3>
                        {data.bySource.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">No source data available</p>
                        ) : (
                            <div className="space-y-3">
                                {data.bySource.sort((a, b) => b.count - a.count).map(src => {
                                    const pct = data.total > 0 ? Math.round((src.count / data.total) * 100) : 0;
                                    return (
                                        <div key={src.source} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-bold text-slate-700 capitalize">{src.source.replace(/_/g, ' ')}</span>
                                                <span className="font-mono text-slate-500">{src.count} ({pct}%)</span>
                                            </div>
                                            <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-navy rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
    return (
        <div className="bg-white p-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-slate-400">{icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
        </div>
    );
}
