'use client';

import { useState, useTransition } from 'react';
import {
    Mail,
    Send,
    Layers,
    Zap,
    BarChart3,
    Plus,
    Trash2,
    Calendar,
    Users,
    Eye,
    Clock,
    ExternalLink,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import { createCampaign, deleteCampaign, createSequence, createAutomation } from '@/actions/marketing';
import { useRouter } from 'next/navigation';

interface Props {
    campaigns: any[];
    sequences: any[];
    automations: any[];
}

export default function MarketingBoard({ campaigns, sequences, automations }: Props) {
    const [activeTab, setActiveTab] = useState<'campaigns' | 'sequences' | 'automations' | 'analytics'>('campaigns');
    const [isAddingCampaign, setIsAddingCampaign] = useState(false);
    const [isAddingSequence, setIsAddingSequence] = useState(false);
    const [isAddingAutomation, setIsAddingAutomation] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const stats = {
        totalSent: campaigns.filter(c => c.status === 'sent').length,
        avgOpenRate: '24.8%', // Mock
        activeSequences: sequences.filter(s => s.status === 'active').length,
        totalLeads: 0 // Would fetch from leads table
    };

    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
            {/* Cyberpunk Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Sent', value: stats.totalSent, icon: Send, color: 'text-blue-400' },
                    { label: 'Avg Open Rate', value: stats.avgOpenRate, icon: Eye, color: 'text-emerald-400' },
                    { label: 'Active Sequences', value: stats.activeSequences, icon: Layers, color: 'text-purple-400' },
                    { label: 'Automations', value: automations.length, icon: Zap, color: 'text-amber-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-brand-navy p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-brand-gold/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon size={80} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                                <stat.icon size={16} className={`${stat.color} mb-2`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation & Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex gap-8">
                    {[
                        { id: 'campaigns', label: 'Campaigns', icon: Mail },
                        { id: 'sequences', label: 'Sequences', icon: Layers },
                        { id: 'automations', label: 'Automations', icon: Zap },
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${activeTab === tab.id
                                ? 'text-brand-navy opacity-100'
                                : 'text-slate-400 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-gold rounded-full animate-in slide-in-from-left duration-300" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    {activeTab === 'campaigns' && (
                        <button
                            onClick={() => setIsAddingCampaign(true)}
                            className="bg-brand-navy text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-brand-gold hover:text-brand-navy transition-all flex items-center gap-2 shadow-lg shadow-brand-navy/20"
                        >
                            <Plus size={16} /> New Campaign
                        </button>
                    )}
                    {activeTab === 'sequences' && (
                        <button
                            onClick={() => setIsAddingSequence(true)}
                            className="bg-purple-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
                        >
                            <Layers size={16} /> Create Sequence
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-[600px]">
                {activeTab === 'campaigns' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {campaigns.map((camp) => (
                                <div key={camp.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-brand-navy/20 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 h-full w-1 bg-slate-200 group-hover:bg-brand-gold transition-colors" />
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${camp.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                                                    camp.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {camp.status}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">ID://{camp.id.split('-')[0]}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800">{camp.subject}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Authorize deletion?')) {
                                                        startTransition(async () => {
                                                            await deleteCampaign(camp.id);
                                                            router.refresh();
                                                        });
                                                    }
                                                }}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 py-4 border-y border-slate-50">
                                        <div className="text-center">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Recipients</p>
                                            <p className="text-sm font-black text-slate-700">{camp.recipientCount || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Opens</p>
                                            <p className="text-sm font-black text-emerald-600">{camp.openCount || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Clicks</p>
                                            <p className="text-sm font-black text-blue-600">{camp.clickCount || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Audience</p>
                                            <p className="text-[10px] font-black text-slate-700 uppercase">{camp.audience || 'ALL'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {camp.sentAt ? new Date(camp.sentAt).toLocaleString() : 'Pending'}</span>
                                        <button
                                            onClick={() => setPreviewContent(camp.content)}
                                            className="text-brand-navy hover:text-brand-gold font-medium flex items-center gap-1"
                                        >
                                            View Source <ExternalLink size={10} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Insight Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-brand-navy text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-brand-navy/40">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <BarChart3 size={100} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-6">Email Health</h3>
                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                                            <span>Deliverability</span>
                                            <span>99.2%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '99%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                                            <span>Engagement</span>
                                            <span>High</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-gold rounded-full" style={{ width: '75%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sequences' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sequences.map((seq) => (
                            <div key={seq.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-purple-600" />
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">{seq.name}</h4>
                                        <p className="text-xs text-slate-400">{seq.status}</p>
                                    </div>
                                    <Layers className="text-purple-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-4 mb-8">
                                    {seq.steps?.map((step: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-slate-700 truncate">{step.subject}</p>
                                                <p className="text-xs text-slate-400">+ {step.delayDays}d delay</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-all border border-dashed border-slate-200">
                                    Manage_Drip_Nodes
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'automations' && (
                    <div className="space-y-4">
                        {automations.map((auto) => (
                            <div key={auto.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-amber-400/30 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 relative overflow-hidden">
                                        <Zap className="relative z-10" />
                                        <div className="absolute inset-0 bg-amber-200 opacity-0 group-hover:opacity-20 transition-opacity" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{auto.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span className="text-amber-600 font-bold">IF:</span> {auto.triggerType}
                                            <ChevronRight size={10} />
                                            <span className="text-blue-600 font-bold">THEN:</span> {auto.actionType}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${auto.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${auto.isActive ? 'right-1' : 'left-1'}`} />
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Slide-over Flyouts (Simplified placeholders for brevity, would be full forms) */}
            {isAddingCampaign && (
                <div className="fixed inset-0 z-[100] overflow-hidden">
                    <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setIsAddingCampaign(false)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl animate-slide-in-right flex flex-col">
                        <div className="p-8 bg-brand-navy text-white relative">
                            <h2 className="text-3xl font-bold text-white">New Campaign</h2>
                            <p className="text-xs text-slate-400 mt-2">Create a new email campaign</p>
                            <button onClick={() => setIsAddingCampaign(false)} className="absolute top-8 right-8 text-white/50 hover:text-white">
                                <Plus size={32} className="rotate-45" />
                            </button>
                        </div>
                        <form
                            action={async (fd) => {
                                await createCampaign(fd);
                                setIsAddingCampaign(false);
                                router.refresh();
                            }}
                            className="flex-1 overflow-y-auto p-8 space-y-8"
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-2 block">Subject Line</label>
                                    <input name="subject" required className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 text-sm focus:border-brand-gold outline-none transition-all" placeholder="Enter email subject..." />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-2 block">Audience</label>
                                        <select name="audience" className="w-full bg-slate-50 border-b-2 border-slate-100 py-4 px-2 text-sm outline-none">
                                            <option value="all">All Contacts</option>
                                            <option value="leads">Active Leads</option>
                                            <option value="clients">Clients</option>
                                            <option value="staff">Staff</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-2 block">Schedule</label>
                                        <input name="scheduledAt" type="datetime-local" className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 px-2 text-sm outline-none" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col min-h-[400px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-medium text-slate-500 block">HTML Content</label>
                                        <button type="button" onClick={() => window.open('/admin/marketing/preview', '_blank')} className="text-xs font-medium text-brand-navy border border-brand-navy/20 px-2 py-1 rounded hover:bg-slate-50 transition-all">Preview →</button>
                                    </div>
                                    <textarea
                                        name="content"
                                        required
                                        className="flex-1 w-full bg-slate-900 text-emerald-400 font-mono text-xs p-6 rounded-2xl resize-none outline-none border-2 border-slate-800 focus:border-emerald-500/30 transition-all"
                                        placeholder="<html><body>Your email content...</body></html>"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-brand-navy text-brand-gold py-5 rounded-2xl text-sm font-medium shadow-2xl shadow-brand-navy/40 hover:scale-[1.01] transition-all">
                                Save Campaign
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Code Preview Modal */}
            {previewContent && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-brand-navy/90 backdrop-blur-xl" onClick={() => setPreviewContent('')} />
                    <div className="relative w-full max-w-4xl max-h-full bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <span className="text-xs text-emerald-400">Source Preview</span>
                            <button onClick={() => setPreviewContent('')} className="text-white/50 hover:text-white"><Plus size={24} className="rotate-45" /></button>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto">
                            <pre className="text-emerald-300 font-mono text-xs whitespace-pre-wrap">{previewContent}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
