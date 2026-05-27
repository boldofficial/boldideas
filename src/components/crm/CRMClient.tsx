'use client';

import { useMemo, useState, useTransition, useCallback } from 'react';
import Link from 'next/link';
import { updateLeadStatus, bulkUpdateLeads, bulkDeleteLeads } from '@/actions/crm';
import PipelineAnalytics from './PipelineAnalytics';
import {
    Search,
    Filter,
    X,
    ChevronDown,
    ChevronRight,
    CheckSquare,
    Square,
    Trash2,
    BarChart3,
    DollarSign,
    Calendar,
    User,
    RefreshCw,
} from 'lucide-react';

type Lead = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string | null;
    status: string | null;
    value: string | null;
    source: string | null;
    priority: string | null;
    serviceInterest: string | null;
    nextFollowUpAt: Date | string | null;
    assignedTo: string | null;
    createdAt: Date | null;
    phone: string | null;
    notes: string | null;
};

type Props = {
    leads: Lead[];
    analyticsData?: any;
};

const STATUS_COLORS: Record<string, string> = {
    new: 'bg-blue-50 border-blue-200',
    contacted: 'bg-yellow-50 border-yellow-200',
    qualified: 'bg-indigo-50 border-indigo-200',
    proposal: 'bg-purple-50 border-purple-200',
    won: 'bg-green-50 border-green-200',
    lost: 'bg-rose-50 border-rose-200',
};

export default function CRMClient({ leads, analyticsData }: Props) {
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState(leads);
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Advanced filters
    const [filters, setFilters] = useState({
        source: '' as string,
        priority: '' as string,
        dateRange: '' as string,
        assignedTo: '' as string,
    });
    const [showFilters, setShowFilters] = useState(false);

    // Bulk selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Collapsible columns — Won/Lost collapsed by default
    const [collapsedCols, setCollapsedCols] = useState<Set<string>>(new Set(['won', 'lost']));

    const columns = [
        { id: 'new', label: 'New Lead' },
        { id: 'contacted', label: 'Contacted' },
        { id: 'qualified', label: 'Qualified' },
        { id: 'proposal', label: 'Proposal Sent' },
        { id: 'won', label: 'Won' },
        { id: 'lost', label: 'Lost' },
    ];

    const filteredLeads = useMemo(() => {
        return items.filter(l => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (
                    !l.firstName.toLowerCase().includes(term) &&
                    !l.lastName.toLowerCase().includes(term) &&
                    !l.company?.toLowerCase().includes(term) &&
                    !l.email.toLowerCase().includes(term) &&
                    !l.phone?.toLowerCase().includes(term) &&
                    !l.serviceInterest?.toLowerCase().includes(term)
                ) return false;
            }
            if (filters.source && l.source !== filters.source) return false;
            if (filters.priority && l.priority !== filters.priority) return false;
            if (filters.dateRange && l.createdAt) {
                const created = new Date(l.createdAt);
                const now = new Date();
                const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                if (filters.dateRange === 'day' && diffDays > 1) return false;
                if (filters.dateRange === 'week' && diffDays > 7) return false;
                if (filters.dateRange === 'month' && diffDays > 30) return false;
            }
            return true;
        });
    }, [items, searchTerm, filters]);

    const metrics = useMemo(() => {
        const pipelineValue = items
            .filter((lead) => lead.status !== 'lost')
            .reduce((total, lead) => total + Number(lead.value || 0), 0);
        const dueToday = items.filter((lead) => isFollowUpDue(lead.nextFollowUpAt)).length;
        const newThisWeek = items.filter((lead) => {
            if (!lead.createdAt) return false;
            const createdAt = new Date(lead.createdAt);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return createdAt >= sevenDaysAgo;
        }).length;
        return { pipelineValue, dueToday, newThisWeek };
    }, [items]);

    const clearFilters = useCallback(() => {
        setFilters({ source: '', priority: '', dateRange: '', assignedTo: '' });
        setSearchTerm('');
    }, []);

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedIds.size === filteredLeads.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredLeads.map(l => l.id)));
        }
    }, [filteredLeads, selectedIds]);

    const executeBulkAction = useCallback(async (action: string) => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        startTransition(async () => {
            if (action === 'delete') {
                await bulkDeleteLeads(ids);
                setItems(prev => prev.filter(l => !ids.includes(l.id)));
            } else {
                await bulkUpdateLeads(ids, { status: action });
                setItems(prev => prev.map(l => ids.includes(l.id) ? { ...l, status: action } : l));
            }
            setSelectedIds(new Set());
        });
    }, [selectedIds, startTransition]);

    function handleStatusChange(leadId: string, status: string) {
        const previousItems = items;
        setItems((current) => current.map((lead) => lead.id === leadId ? { ...lead, status } : lead));
        startTransition(async () => {
            const result = await updateLeadStatus(leadId, status);
            if (!result.success) setItems(previousItems);
        });
    }

    function handleDrop(status: string) {
        if (!draggedLeadId) return;
        handleStatusChange(draggedLeadId, status);
        setDraggedLeadId(null);
    }

    const toggleCollapse = (colId: string) => {
        setCollapsedCols(prev => {
            const next = new Set(prev);
            if (next.has(colId)) next.delete(colId);
            else next.add(colId);
            return next;
        });
    };

    const hasActiveFilters = filters.source || filters.priority || filters.dateRange || filters.assignedTo;

    return (
        <div className="flex flex-col h-full">
            {/* Metrics Row */}
            <div className="mb-6 grid gap-3 md:grid-cols-3">
                <MetricCard
                    icon={<DollarSign className="w-4 h-4" />}
                    label="Pipeline value"
                    value={`$${metrics.pipelineValue.toLocaleString()}`}
                />
                <MetricCard
                    icon={<User className="w-4 h-4" />}
                    label="New this week"
                    value={String(metrics.newThisWeek)}
                />
                <MetricCard
                    icon={<Calendar className="w-4 h-4" />}
                    label="Follow-ups due"
                    value={String(metrics.dueToday)}
                    tone={metrics.dueToday > 0 ? 'urgent' : 'default'}
                />
            </div>

            {/* Analytics Section */}
            {showAnalytics && analyticsData && (
                <div className="mb-6">
                    <PipelineAnalytics data={analyticsData} onClose={() => setShowAnalytics(false)} />
                </div>
            )}

            {/* Toolbar Row */}
            <div className="space-y-3 mb-6">
                {/* View Toggle + Search + Actions */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setView('kanban')}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${view === 'kanban' ? 'bg-white shadow text-brand-navy' : 'text-slate-500'}`}
                            >
                                Kanban Board
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-brand-navy' : 'text-slate-500'}`}
                            >
                                List View
                            </button>
                        </div>
                        {analyticsData && (
                            <button
                                onClick={() => setShowAnalytics(!showAnalytics)}
                                className={`p-2 rounded-lg text-sm transition-all ${showAnalytics ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                title="Pipeline Analytics"
                            >
                                <BarChart3 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="pl-9 pr-8 py-2 border rounded-lg text-sm bg-white w-56 focus:outline-none focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg text-sm transition-all flex items-center gap-1.5 ${hasActiveFilters ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            title="Advanced Filters"
                        >
                            <Filter className="w-4 h-4" />
                            {hasActiveFilters && <span className="text-[10px] font-bold">{Object.values(filters).filter(Boolean).length}</span>}
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Bar */}
                {showFilters && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Advanced Filters</span>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" /> Clear all
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <select
                                value={filters.source}
                                onChange={(e) => setFilters(f => ({ ...f, source: e.target.value }))}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            >
                                <option value="">All Sources</option>
                                <option value="website">Website</option>
                                <option value="referral">Referral</option>
                                <option value="ads">Ads</option>
                                <option value="campaign">Campaign</option>
                                <option value="manual">Manual</option>
                            </select>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            >
                                <option value="">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters(f => ({ ...f, dateRange: e.target.value }))}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            >
                                <option value="">Any Time</option>
                                <option value="day">Last 24 hours</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                            <span className="text-xs text-slate-400 self-center">
                                {filteredLeads.length} of {items.length} leads
                            </span>
                        </div>
                    </div>
                )}

                {/* Bulk Actions Toolbar */}
                {selectedIds.size > 0 && (
                    <div className="bg-brand-navy text-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold">{selectedIds.size} selected</span>
                            <div className="h-4 w-px bg-white/20" />
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Clear
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value=""
                                onChange={(e) => { if (e.target.value) executeBulkAction(e.target.value); }}
                                className="rounded-lg bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-bold text-white [&>option]:text-slate-800"
                            >
                                <option value="" disabled>Change Status →</option>
                                {columns.map(col => (
                                    <option key={col.id} value={col.id}>{col.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => executeBulkAction('delete')}
                                className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 border border-rose-400/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/30"
                            >
                                <Trash2 className="w-3 h-3" /> Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Kanban Board View */}
            {view === 'kanban' ? (
                <div className="flex-1 overflow-x-auto pb-8">
                    <div className="flex gap-6 min-w-max h-full">
                        {columns.map(col => {
                            const colLeads = filteredLeads.filter(l => l.status === col.id);
                            const isCollapsed = collapsedCols.has(col.id);
                            return (
                                <div
                                    key={col.id}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => handleDrop(col.id)}
                                    className={`w-72 lg:w-80 rounded-xl border flex flex-col ${STATUS_COLORS[col.id] || 'bg-slate-50 border-slate-200'} ${isPending ? 'opacity-80' : ''}`}
                                >
                                    {/* Column Header — Always visible */}
                                    <div
                                        className="p-4 font-bold text-slate-700 uppercase tracking-wide text-xs border-b border-black/5 flex justify-between items-center cursor-pointer select-none"
                                        onClick={() => toggleCollapse(col.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            <span>{col.label}</span>
                                            <span className="bg-white/50 px-2 rounded-full text-[10px]">{colLeads.length}</span>
                                        </div>
                                    </div>

                                    {/* Column Body — Collapsible */}
                                    {!isCollapsed && (
                                        <div className="p-3 flex-1 overflow-y-auto space-y-3">
                                            {/* Bulk select all in column */}
                                            {colLeads.length > 0 && (
                                                <button
                                                    onClick={() => {
                                                        const allSelected = colLeads.every(l => selectedIds.has(l.id));
                                                        setSelectedIds(prev => {
                                                            const next = new Set(prev);
                                                            colLeads.forEach(l => {
                                                                if (allSelected) next.delete(l.id);
                                                                else next.add(l.id);
                                                            });
                                                            return next;
                                                        });
                                                    }}
                                                    className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 w-full"
                                                >
                                                    {colLeads.every(l => selectedIds.has(l.id)) ? (
                                                        <CheckSquare className="w-3 h-3" />
                                                    ) : (
                                                        <Square className="w-3 h-3" />
                                                    )}
                                                    {colLeads.every(l => selectedIds.has(l.id)) ? 'Deselect all' : 'Select all'}
                                                </button>
                                            )}

                                            {colLeads.map(lead => (
                                                <div key={lead.id} className="group relative">
                                                    {/* Selection checkbox */}
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); toggleSelect(lead.id); }}
                                                        className="absolute -left-1 -top-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        {selectedIds.has(lead.id) ? (
                                                            <CheckSquare className="w-4 h-4 text-brand-navy bg-white rounded" />
                                                        ) : (
                                                            <Square className="w-4 h-4 text-slate-400 bg-white rounded" />
                                                        )}
                                                    </button>
                                                    {selectedIds.has(lead.id) && (
                                                        <button
                                                            onClick={() => toggleSelect(lead.id)}
                                                            className="absolute -left-1 -top-1 z-10"
                                                        >
                                                            <CheckSquare className="w-4 h-4 text-brand-navy bg-white rounded" />
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/admin/crm/${lead.id}`}
                                                        draggable
                                                        onDragStart={() => setDraggedLeadId(lead.id)}
                                                        onDragEnd={() => setDraggedLeadId(null)}
                                                        className="block"
                                                    >
                                                        <div className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all ${selectedIds.has(lead.id) ? 'ring-2 ring-brand-navy/30 border-brand-navy/20' : 'border-slate-100'}`}>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-bold text-slate-800 group-hover:text-brand-navy text-sm">{lead.firstName} {lead.lastName}</h4>
                                                                {lead.value && <span className="text-xs font-mono font-bold text-green-600">${lead.value}</span>}
                                                            </div>
                                                            <p className="text-xs text-slate-500 line-clamp-1">{lead.company || lead.email}</p>
                                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                                {lead.source && <MiniBadge>{formatLabel(lead.source)}</MiniBadge>}
                                                                {lead.priority && (
                                                                    <MiniBadge tone={lead.priority === 'high' ? 'urgent' : lead.priority === 'low' ? 'muted' : 'default'}>
                                                                        {lead.priority}
                                                                    </MiniBadge>
                                                                )}
                                                            </div>
                                                            {lead.nextFollowUpAt && (
                                                                <p className={`mt-3 text-[11px] font-bold ${isFollowUpDue(lead.nextFollowUpAt) ? 'text-rose-600' : 'text-slate-500'}`}>
                                                                    {isFollowUpDue(lead.nextFollowUpAt) ? '\u26A0 ' : ''}Follow up {formatDate(lead.nextFollowUpAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                            {colLeads.length === 0 && (
                                                <div className="rounded-lg border border-dashed border-slate-300 bg-white/45 p-4 text-center text-xs font-bold text-slate-400">
                                                    Drop leads here
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 w-10">
                                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-brand-navy">
                                        {selectedIds.size === filteredLeads.length && filteredLeads.length > 0 ? (
                                            <CheckSquare className="w-4 h-4" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                    </button>
                                </th>
                                <th className="p-4 font-semibold text-slate-600">Name</th>
                                <th className="p-4 font-semibold text-slate-600">Company</th>
                                <th className="p-4 font-semibold text-slate-600">Email</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Priority</th>
                                <th className="p-4 font-semibold text-slate-600">Value</th>
                                <th className="p-4 font-semibold text-slate-600">Follow-up</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedIds.has(lead.id) ? 'bg-brand-navy/5' : ''}`}>
                                    <td className="p-4">
                                        <button onClick={() => toggleSelect(lead.id)} className="text-slate-400 hover:text-brand-navy">
                                            {selectedIds.has(lead.id) ? (
                                                <CheckSquare className="w-4 h-4 text-brand-navy" />
                                            ) : (
                                                <Square className="w-4 h-4" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 font-bold text-brand-navy">
                                        <Link href={`/admin/crm/${lead.id}`} className="hover:underline">{lead.firstName} {lead.lastName}</Link>
                                    </td>
                                    <td className="p-4 text-slate-600">{lead.company || <span className="text-slate-300 italic">\u2014</span>}</td>
                                    <td className="p-4 text-slate-500">{lead.email}</td>
                                    <td className="p-4">
                                        <select
                                            value={lead.status || 'new'}
                                            onChange={(event) => handleStatusChange(lead.id, event.target.value)}
                                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                                        >
                                            {columns.map((column) => (
                                                <option key={column.id} value={column.id}>{column.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                            lead.priority === 'high' ? 'bg-rose-50 text-rose-600' :
                                            lead.priority === 'low' ? 'bg-slate-100 text-slate-400' :
                                            'bg-yellow-50 text-yellow-600'
                                        }`}>
                                            {lead.priority || '\u2014'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-slate-600">${lead.value || '0'}</td>
                                    <td className="p-4">
                                        {lead.nextFollowUpAt ? (
                                            <span className={`text-xs ${isFollowUpDue(lead.nextFollowUpAt) ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                                                {formatDate(lead.nextFollowUpAt)}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 italic">\u2014</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-400 italic">No leads match your filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function MetricCard({ icon, label, value, tone = 'default' }: { icon: React.ReactNode; label: string; value: string; tone?: 'default' | 'urgent' }) {
    return (
        <div className={`rounded-xl border bg-white p-4 shadow-sm ${tone === 'urgent' ? 'border-rose-200' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className={tone === 'urgent' ? 'text-rose-400' : 'text-slate-400'}>{icon}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            </div>
            <p className={`mt-1 text-2xl font-black ${tone === 'urgent' ? 'text-rose-600' : 'text-brand-navy'}`}>{value}</p>
        </div>
    );
}

function MiniBadge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'urgent' | 'muted' }) {
    const styles = {
        default: 'bg-slate-100 text-slate-500',
        urgent: 'bg-rose-50 text-rose-600',
        muted: 'bg-slate-50 text-slate-400',
    };
    return (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${styles[tone]}`}>
            {children}
        </span>
    );
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ');
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function isFollowUpDue(value: Date | string | null) {
    if (!value) return false;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
}
