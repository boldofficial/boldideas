'use client';

import { useMemo, useState, useTransition, useCallback } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { updateLeadStatus, bulkUpdateLeads, bulkDeleteLeads } from '@/actions/crm';
import PipelineAnalytics from './PipelineAnalytics';
import {
    ArrowRight,
    BarChart3,
    CalendarClock,
    CheckSquare,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Filter,
    LayoutGrid,
    ListChecks,
    Plus,
    RefreshCw,
    Search,
    Square,
    Trash2,
    UserRound,
    X,
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
    assignedToName?: string | null;
    assignedToEmail?: string | null;
    createdAt: Date | string | null;
    phone: string | null;
    notes: string | null;
};

type Staff = {
    id: string;
    name: string | null;
    email: string;
    role: string | null;
};

type AnalyticsData = {
    total: number;
    active: number;
    won: number;
    lost: number;
    winRate: number;
    totalPipelineValue: number;
    pipeline: { status: string; label: string; count: number; value: number }[];
    monthlyTrend: { month: string; created: number; won: number }[];
    bySource: { source: string; count: number }[];
};

type Props = {
    leads: Lead[];
    staff: Staff[];
    analyticsData?: AnalyticsData | null;
    createLeadAction: (formData: FormData) => Promise<void>;
};

const columns = [
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'proposal', label: 'Proposal' },
    { id: 'won', label: 'Won' },
    { id: 'lost', label: 'Lost' },
];

const columnStyles: Record<string, string> = {
    new: 'border-slate-200 bg-slate-50',
    contacted: 'border-amber-200 bg-amber-50/55',
    qualified: 'border-blue-200 bg-blue-50/55',
    proposal: 'border-brand-gold/40 bg-brand-gold/10',
    won: 'border-emerald-200 bg-emerald-50/55',
    lost: 'border-rose-200 bg-rose-50/55',
};

export default function CRMClient({ leads, analyticsData, staff, createLeadAction }: Props) {
    const [view, setView] = useState<'pipeline' | 'list' | 'followups' | 'quotes' | 'analytics'>('pipeline');
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState(leads);
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [filters, setFilters] = useState({ source: '', priority: '', owner: '', followUp: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [collapsedCols, setCollapsedCols] = useState<Set<string>>(new Set(['won', 'lost']));
    const [showCreate, setShowCreate] = useState(false);

    const filteredLeads = useMemo(() => {
        return items.filter((lead) => {
            const term = searchTerm.toLowerCase();
            if (term) {
                const haystack = [
                    lead.firstName,
                    lead.lastName,
                    lead.company,
                    lead.email,
                    lead.phone,
                    lead.serviceInterest,
                    lead.notes,
                ].filter(Boolean).join(' ').toLowerCase();
                if (!haystack.includes(term)) return false;
            }

            if (filters.source && lead.source !== filters.source) return false;
            if (filters.priority && lead.priority !== filters.priority) return false;
            if (filters.owner && (filters.owner === 'unassigned' ? lead.assignedTo : lead.assignedTo !== filters.owner)) return false;
            if (filters.followUp && getFollowUpState(lead) !== filters.followUp) return false;

            return true;
        });
    }, [items, searchTerm, filters]);

    const metrics = useMemo(() => {
        const open = items.filter((lead) => !['won', 'lost'].includes(lead.status || '')).length;
        const pipelineValue = items
            .filter((lead) => lead.status !== 'lost')
            .reduce((total, lead) => total + Number(lead.value || 0), 0);
        const overdue = items.filter((lead) => getFollowUpState(lead) === 'overdue').length;
        const quotes = items.filter(isQuoteLead).length;
        const unassigned = items.filter((lead) => !lead.assignedTo).length;
        return { open, pipelineValue, overdue, quotes, unassigned };
    }, [items]);

    const visibleLeads = useMemo(() => {
        if (view === 'followups') {
            return filteredLeads
                .filter((lead) => ['overdue', 'today', 'week', 'unset'].includes(getFollowUpState(lead)))
                .sort((a, b) => followUpSortValue(a) - followUpSortValue(b));
        }
        if (view === 'quotes') return filteredLeads.filter(isQuoteLead);
        return filteredLeads;
    }, [filteredLeads, view]);

    const clearFilters = useCallback(() => {
        setFilters({ source: '', priority: '', owner: '', followUp: '' });
        setSearchTerm('');
    }, []);

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedIds.size === visibleLeads.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(visibleLeads.map((lead) => lead.id)));
    }, [selectedIds, visibleLeads]);

    const executeBulkAction = useCallback(async (action: string) => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        startTransition(async () => {
            if (action === 'delete') {
                await bulkDeleteLeads(ids);
                setItems((prev) => prev.filter((lead) => !ids.includes(lead.id)));
            } else {
                await bulkUpdateLeads(ids, { status: action });
                setItems((prev) => prev.map((lead) => ids.includes(lead.id) ? { ...lead, status: action } : lead));
            }
            setSelectedIds(new Set());
        });
    }, [selectedIds]);

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

    const hasActiveFilters = Boolean(filters.source || filters.priority || filters.owner || filters.followUp || searchTerm);

    return (
        <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-5">
                <MetricCard label="Open Deals" value={String(metrics.open)} />
                <MetricCard label="Pipeline Value" value={`$${metrics.pipelineValue.toLocaleString()}`} />
                <MetricCard label="Overdue" value={String(metrics.overdue)} tone={metrics.overdue > 0 ? 'urgent' : 'default'} />
                <MetricCard label="Quote Requests" value={String(metrics.quotes)} />
                <MetricCard label="Unassigned" value={String(metrics.unassigned)} tone={metrics.unassigned > 0 ? 'watch' : 'default'} />
            </div>

            <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <ViewButton active={view === 'pipeline'} icon={<LayoutGrid className="h-4 w-4" />} label="Pipeline" onClick={() => setView('pipeline')} />
                        <ViewButton active={view === 'list'} icon={<ListChecks className="h-4 w-4" />} label="List" onClick={() => setView('list')} />
                        <ViewButton active={view === 'followups'} icon={<CalendarClock className="h-4 w-4" />} label="Follow-ups" onClick={() => setView('followups')} />
                        <ViewButton active={view === 'quotes'} icon={<ClipboardList className="h-4 w-4" />} label="Quotes" onClick={() => setView('quotes')} />
                        <ViewButton active={view === 'analytics'} icon={<BarChart3 className="h-4 w-4" />} label="Analytics" onClick={() => setView('analytics')} />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search name, company, phone, notes"
                                className="h-10 w-full rounded-sm border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-700 outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 sm:w-80"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                            {searchTerm && (
                                <button type="button" onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex h-10 items-center justify-center gap-2 rounded-sm border px-3 text-xs font-black uppercase tracking-[0.14em] transition ${hasActiveFilters ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-brand-navy px-4 text-xs font-black uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-brand-gold hover:text-brand-navy"
                        >
                            <Plus className="h-4 w-4" />
                            Add Lead
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="border-b border-slate-200 bg-slate-50 p-4">
                        <div className="grid gap-3 md:grid-cols-5">
                            <Select value={filters.source} onChange={(value) => setFilters((current) => ({ ...current, source: value }))}>
                                <option value="">All sources</option>
                                <option value="website">Website</option>
                                <option value="website_contact_form">Website contact</option>
                                <option value="referral">Referral</option>
                                <option value="ads">Ads</option>
                                <option value="campaign">Campaign</option>
                                <option value="manual">Manual</option>
                            </Select>
                            <Select value={filters.priority} onChange={(value) => setFilters((current) => ({ ...current, priority: value }))}>
                                <option value="">All priorities</option>
                                <option value="high">High priority</option>
                                <option value="medium">Medium priority</option>
                                <option value="low">Low priority</option>
                            </Select>
                            <Select value={filters.owner} onChange={(value) => setFilters((current) => ({ ...current, owner: value }))}>
                                <option value="">All owners</option>
                                <option value="unassigned">Unassigned</option>
                                {staff.map((person) => (
                                    <option key={person.id} value={person.id}>{person.name || person.email}</option>
                                ))}
                            </Select>
                            <Select value={filters.followUp} onChange={(value) => setFilters((current) => ({ ...current, followUp: value }))}>
                                <option value="">Any follow-up</option>
                                <option value="overdue">Overdue</option>
                                <option value="today">Due today</option>
                                <option value="week">This week</option>
                                <option value="future">Future</option>
                                <option value="unset">No follow-up</option>
                            </Select>
                            <button type="button" onClick={clearFilters} className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:border-rose-200 hover:text-rose-600">
                                <RefreshCw className="h-4 w-4" />
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                {selectedIds.size > 0 && (
                    <div className="flex flex-col justify-between gap-3 border-b border-brand-navy/10 bg-brand-navy px-4 py-3 text-white sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold">{selectedIds.size} selected</span>
                            <button type="button" onClick={() => setSelectedIds(new Set())} className="text-xs font-bold text-white/65 hover:text-white">Clear</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value=""
                                onChange={(event) => { if (event.target.value) executeBulkAction(event.target.value); }}
                                className="h-9 rounded-sm border border-white/20 bg-white/10 px-3 text-xs font-bold text-white [&>option]:text-slate-800"
                            >
                                <option value="" disabled>Change status</option>
                                {columns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
                            </select>
                            <button type="button" onClick={() => executeBulkAction('delete')} className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-rose-300/30 bg-rose-500/20 px-3 text-xs font-bold text-rose-100 hover:bg-rose-500/30">
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-4">
                    {view === 'analytics' ? (
                        analyticsData ? <PipelineAnalytics data={analyticsData} /> : <EmptyState title="Analytics unavailable" body="Pipeline analytics will appear once lead data is available." />
                    ) : view === 'pipeline' ? (
                        <PipelineBoard
                            leads={visibleLeads}
                            collapsedCols={collapsedCols}
                            selectedIds={selectedIds}
                            isPending={isPending}
                            onDrop={handleDrop}
                            onToggleCollapse={(id) => setCollapsedCols((current) => {
                                const next = new Set(current);
                                if (next.has(id)) next.delete(id);
                                else next.add(id);
                                return next;
                            })}
                            onToggleSelect={toggleSelect}
                            onDragStart={setDraggedLeadId}
                            onDragEnd={() => setDraggedLeadId(null)}
                        />
                    ) : (
                        <LeadTable
                            leads={visibleLeads}
                            view={view}
                            selectedIds={selectedIds}
                            onToggleSelect={toggleSelect}
                            onToggleSelectAll={toggleSelectAll}
                            onStatusChange={handleStatusChange}
                        />
                    )}
                </div>
            </div>

            {showCreate && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-sm">
                    <button type="button" aria-label="Close add lead panel" className="absolute inset-0" onClick={() => setShowCreate(false)} />
                    <div className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">New opportunity</p>
                                <h2 className="text-xl font-black text-brand-navy">Add lead</h2>
                            </div>
                            <button type="button" onClick={() => setShowCreate(false)} className="rounded-sm border border-slate-200 p-2 text-slate-500 hover:text-brand-navy">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form action={createLeadAction} className="grid gap-4 p-6 md:grid-cols-2">
                            <Field label="First name" name="firstName" required />
                            <Field label="Last name" name="lastName" />
                            <Field label="Email" name="email" type="email" required />
                            <Field label="Phone" name="phone" />
                            <Field label="Company" name="company" />
                            <Field label="Estimated value" name="value" />
                            <Field label="Service interest" name="serviceInterest" className="md:col-span-2" />
                            <SelectField label="Source" name="source" defaultValue="manual">
                                <option value="manual">Manual</option>
                                <option value="website">Website</option>
                                <option value="referral">Referral</option>
                                <option value="ads">Ads</option>
                                <option value="campaign">Campaign</option>
                            </SelectField>
                            <SelectField label="Priority" name="priority" defaultValue="medium">
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </SelectField>
                            <SelectField label="Owner" name="assignedTo" defaultValue="">
                                <option value="">Assign to me</option>
                                {staff.map((person) => <option key={person.id} value={person.id}>{person.name || person.email}</option>)}
                            </SelectField>
                            <Field label="Next follow-up" name="nextFollowUpAt" type="datetime-local" />
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Notes</label>
                                <textarea name="notes" rows={5} className="mt-1.5 w-full rounded-sm border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10" />
                            </div>
                            <button className="md:col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-brand-navy px-4 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-brand-gold hover:text-brand-navy">
                                Add Lead
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function PipelineBoard({
    leads,
    collapsedCols,
    selectedIds,
    isPending,
    onDrop,
    onToggleCollapse,
    onToggleSelect,
    onDragStart,
    onDragEnd,
}: {
    leads: Lead[];
    collapsedCols: Set<string>;
    selectedIds: Set<string>;
    isPending: boolean;
    onDrop: (status: string) => void;
    onToggleCollapse: (status: string) => void;
    onToggleSelect: (id: string) => void;
    onDragStart: (id: string) => void;
    onDragEnd: () => void;
}) {
    return (
        <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
                {columns.map((column) => {
                    const colLeads = leads.filter((lead) => lead.status === column.id);
                    const value = colLeads.reduce((total, lead) => total + Number(lead.value || 0), 0);
                    const isCollapsed = collapsedCols.has(column.id);

                    return (
                        <div
                            key={column.id}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => onDrop(column.id)}
                            className={`w-72 rounded-sm border ${columnStyles[column.id]} ${isPending ? 'opacity-80' : ''}`}
                        >
                            <button type="button" onClick={() => onToggleCollapse(column.id)} className="flex w-full items-center justify-between border-b border-black/5 px-4 py-3 text-left">
                                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-700">
                                    {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                    {column.label}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500">{colLeads.length} / ${value.toLocaleString()}</span>
                            </button>

                            {!isCollapsed && (
                                <div className="space-y-3 p-3">
                                    {colLeads.map((lead) => (
                                        <LeadCard
                                            key={lead.id}
                                            lead={lead}
                                            selected={selectedIds.has(lead.id)}
                                            onToggleSelect={onToggleSelect}
                                            onDragStart={onDragStart}
                                            onDragEnd={onDragEnd}
                                        />
                                    ))}
                                    {colLeads.length === 0 && (
                                        <div className="border border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center text-xs font-bold text-slate-400">Drop leads here</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function LeadCard({ lead, selected, onToggleSelect, onDragStart, onDragEnd }: {
    lead: Lead;
    selected: boolean;
    onToggleSelect: (id: string) => void;
    onDragStart: (id: string) => void;
    onDragEnd: () => void;
}) {
    const followUpState = getFollowUpState(lead);

    return (
        <div className="group relative">
            <button type="button" onClick={() => onToggleSelect(lead.id)} className="absolute -left-1 -top-1 z-10 bg-white text-slate-400 opacity-0 shadow-sm transition group-hover:opacity-100">
                {selected ? <CheckSquare className="h-4 w-4 text-brand-navy" /> : <Square className="h-4 w-4" />}
            </button>
            {selected && (
                <button type="button" onClick={() => onToggleSelect(lead.id)} className="absolute -left-1 -top-1 z-10 bg-white shadow-sm">
                    <CheckSquare className="h-4 w-4 text-brand-navy" />
                </button>
            )}
            <Link href={`/admin/crm/${lead.id}`} draggable onDragStart={() => onDragStart(lead.id)} onDragEnd={onDragEnd} className="block">
                <div className={`border bg-white p-4 shadow-sm transition hover:border-brand-navy/25 hover:shadow-md ${selected ? 'border-brand-navy ring-2 ring-brand-navy/15' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-black text-brand-navy">{lead.firstName} {lead.lastName}</h3>
                            <p className="mt-1 truncate text-xs font-medium text-slate-500">{lead.company || lead.email}</p>
                        </div>
                        <p className="shrink-0 font-mono text-xs font-black text-slate-700">${Number(lead.value || 0).toLocaleString()}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        <Badge>{formatLabel(lead.source || 'unknown')}</Badge>
                        <Badge tone={lead.priority === 'high' ? 'urgent' : 'default'}>{lead.priority || 'medium'}</Badge>
                        {isQuoteLead(lead) && <Badge tone="gold">quote</Badge>}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                        <span className={`text-[11px] font-bold ${followUpState === 'overdue' ? 'text-rose-600' : followUpState === 'today' ? 'text-amber-700' : 'text-slate-500'}`}>
                            {followUpLabel(lead)}
                        </span>
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[10px] font-black uppercase text-slate-500">
                            {ownerInitial(lead)}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

function LeadTable({ leads, view, selectedIds, onToggleSelect, onToggleSelectAll, onStatusChange }: {
    leads: Lead[];
    view: string;
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onStatusChange: (id: string, status: string) => void;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    <tr>
                        <th className="w-10 p-3">
                            <button type="button" onClick={onToggleSelectAll} className="text-slate-400 hover:text-brand-navy">
                                {selectedIds.size === leads.length && leads.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                            </button>
                        </th>
                        <th className="p-3">Lead</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Owner</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Value</th>
                        <th className="p-3">{view === 'quotes' ? 'Request' : 'Follow-up'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                        <tr key={lead.id} className={selectedIds.has(lead.id) ? 'bg-brand-navy/5' : 'bg-white hover:bg-slate-50'}>
                            <td className="p-3">
                                <button type="button" onClick={() => onToggleSelect(lead.id)} className="text-slate-400 hover:text-brand-navy">
                                    {selectedIds.has(lead.id) ? <CheckSquare className="h-4 w-4 text-brand-navy" /> : <Square className="h-4 w-4" />}
                                </button>
                            </td>
                            <td className="p-3">
                                <Link href={`/admin/crm/${lead.id}`} className="font-black text-brand-navy hover:underline">{lead.firstName} {lead.lastName}</Link>
                                <p className="mt-0.5 text-xs text-slate-500">{lead.company || lead.email}</p>
                            </td>
                            <td className="p-3"><Badge>{formatLabel(lead.source || 'unknown')}</Badge></td>
                            <td className="p-3 text-xs font-bold text-slate-600">{lead.assignedToName || lead.assignedToEmail || 'Unassigned'}</td>
                            <td className="p-3">
                                <select value={lead.status || 'new'} onChange={(event) => onStatusChange(lead.id, event.target.value)} className="h-8 rounded-sm border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 outline-none focus:border-brand-navy">
                                    {columns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
                                </select>
                            </td>
                            <td className="p-3 font-mono text-xs font-black text-slate-700">${Number(lead.value || 0).toLocaleString()}</td>
                            <td className="max-w-xs p-3 text-xs text-slate-500">
                                {view === 'quotes' ? (lead.serviceInterest || 'Quote request') : followUpLabel(lead)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {leads.length === 0 && <EmptyState title="No matching leads" body="Adjust your filters or add a new lead to start building the pipeline." />}
        </div>
    );
}

function MetricCard({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'urgent' | 'watch' }) {
    const toneClass = tone === 'urgent' ? 'border-rose-200 text-rose-600' : tone === 'watch' ? 'border-amber-200 text-amber-700' : 'border-slate-200 text-brand-navy';
    return (
        <div className={`rounded-sm border bg-white px-4 py-4 shadow-sm ${toneClass}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
        </div>
    );
}

function ViewButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className={`inline-flex h-10 items-center gap-2 rounded-sm px-3 text-xs font-black uppercase tracking-[0.14em] transition ${active ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-brand-navy'}`}>
            {icon}
            {label}
        </button>
    );
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
    return (
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10">
            {children}
        </select>
    );
}

function Field({ label, name, type = 'text', required = false, className = '' }: { label: string; name: string; type?: string; required?: boolean; className?: string }) {
    return (
        <div className={className}>
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</label>
            <input name={name} type={type} required={required} className="mt-1.5 h-10 w-full rounded-sm border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10" />
        </div>
    );
}

function SelectField({ label, name, defaultValue, children }: { label: string; name: string; defaultValue?: string; children: ReactNode }) {
    return (
        <div>
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</label>
            <select name={name} defaultValue={defaultValue} className="mt-1.5 h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10">
                {children}
            </select>
        </div>
    );
}

function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'urgent' | 'gold' }) {
    const style = tone === 'urgent'
        ? 'bg-rose-50 text-rose-700 border-rose-100'
        : tone === 'gold'
            ? 'bg-brand-gold/10 text-amber-800 border-brand-gold/20'
            : 'bg-slate-50 text-slate-600 border-slate-200';
    return <span className={`inline-flex rounded-sm border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${style}`}>{children}</span>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
    return (
        <div className="border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-black text-brand-navy">{title}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{body}</p>
        </div>
    );
}

function isQuoteLead(lead: Lead) {
    const text = `${lead.serviceInterest || ''} ${lead.notes || ''}`.toLowerCase();
    return text.includes('quote') || text.includes('requested features') || text.includes('custom website');
}

function getFollowUpState(lead: Lead) {
    if (!lead.nextFollowUpAt) return 'unset';
    const followUp = new Date(lead.nextFollowUpAt);
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    if (followUp < now) return 'overdue';
    if (followUp <= todayEnd) return 'today';
    if (followUp <= weekEnd) return 'week';
    return 'future';
}

function followUpSortValue(lead: Lead) {
    if (!lead.nextFollowUpAt) return Number.MAX_SAFE_INTEGER;
    return new Date(lead.nextFollowUpAt).getTime();
}

function followUpLabel(lead: Lead) {
    const state = getFollowUpState(lead);
    if (state === 'unset') return 'No follow-up set';
    const date = new Date(lead.nextFollowUpAt as string | Date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (state === 'overdue') return `Overdue: ${date}`;
    if (state === 'today') return `Due today: ${date}`;
    if (state === 'week') return `This week: ${date}`;
    return `Follow-up: ${date}`;
}

function ownerInitial(lead: Lead) {
    const name = lead.assignedToName || lead.assignedToEmail || '';
    return name ? name[0].toUpperCase() : <UserRound className="h-3 w-3" />;
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ');
}
