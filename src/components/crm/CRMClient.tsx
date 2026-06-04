'use client';

import { useMemo, useState, useTransition, useCallback } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { updateLeadStatus, bulkUpdateLeads, bulkDeleteLeads, importLeadsFromCsv } from '@/actions/crm';
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
    Upload,
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

type ImportResult = {
    success: boolean;
    created?: number;
    updated?: number;
    skipped?: number;
    errors?: string[];
    error?: string;
};

const columns = [
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'proposal', label: 'Proposal Sent' },
    { id: 'won', label: 'Customer' },
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
    const [view, setView] = useState<'pipeline' | 'list' | 'followups' | 'quotes' | 'analytics'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState(leads);
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [filters, setFilters] = useState({ source: '', priority: '', owner: '', followUp: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [collapsedCols, setCollapsedCols] = useState<Set<string>>(new Set(['won', 'lost']));
    const [showCreate, setShowCreate] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [csvText, setCsvText] = useState('');
    const [importResult, setImportResult] = useState<ImportResult | null>(null);

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

    function handleCsvFile(file: File | null) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setCsvText(String(reader.result || ''));
        reader.readAsText(file);
    }

    function handleImportLeads(formData: FormData) {
        setImportResult(null);
        startTransition(async () => {
            formData.set('csv', csvText);
            const result = await importLeadsFromCsv(formData);
            setImportResult(result);
            if (result.success) {
                setTimeout(() => window.location.reload(), 900);
            }
        });
    }

    const hasActiveFilters = Boolean(filters.source || filters.priority || filters.owner || filters.followUp || searchTerm);

    return (
        <div className="space-y-3 text-[13px]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#1f2937]">Leads</h1>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {columns.filter((column) => column.id !== 'lost').map((column) => (
                            <StatusChip
                                key={column.id}
                                label={column.label}
                                count={items.filter((lead) => lead.status === column.id).length}
                                tone={column.id}
                                active={view === 'list' && filters.followUp === '' && filters.priority === '' && filters.source === ''}
                            />
                        ))}
                        <StatusChip label="Lost Leads - 0.00%" count={items.filter((lead) => lead.status === 'lost').length} tone="lost" />
                    </div>
                </div>
                <div className="rounded-md border border-[#dce3ea] bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-[11px] font-medium text-[#64748b]">Pipeline Value</p>
                    <p className="text-sm font-semibold text-[#334155]">${metrics.pipelineValue.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-[#dde4eb] pb-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowCreate(true)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] bg-[#0f172a] px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1e293b]"
                    >
                        <Plus className="h-4 w-4" />
                        New Lead
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowImport(true)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[13px] font-semibold text-[#475569] shadow-sm transition hover:border-[#b9c6d3] hover:bg-[#f8fafc]"
                    >
                        <Upload className="h-4 w-4" />
                        Import Leads
                    </button>
                    <div className="hidden h-7 w-px bg-[#dce3ea] sm:block" />
                    <ViewButton active={view === 'list'} icon={<ListChecks className="h-4 w-4" />} label="Table" onClick={() => setView('list')} />
                    <ViewButton active={view === 'pipeline'} icon={<LayoutGrid className="h-4 w-4" />} label="Board" onClick={() => setView('pipeline')} />
                    <ViewButton active={view === 'followups'} icon={<CalendarClock className="h-4 w-4" />} label="Follow-ups" onClick={() => setView('followups')} />
                    <ViewButton active={view === 'quotes'} icon={<ClipboardList className="h-4 w-4" />} label="Quotes" onClick={() => setView('quotes')} />
                    <ViewButton active={view === 'analytics'} icon={<BarChart3 className="h-4 w-4" />} label="Stats" onClick={() => setView('analytics')} />
                </div>

                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border px-3 text-[13px] font-medium shadow-sm transition ${hasActiveFilters ? 'border-[#94a3b8] bg-[#e2e8f0] text-[#334155]' : 'border-[#d4dde6] bg-white text-[#475569] hover:bg-[#f8fafc]'}`}
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            <div className="rounded-[4px] border border-[#dce3ea] bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-[#e5eaf0] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <select className="h-9 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[13px] text-[#475569] outline-none">
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                        <button type="button" className="h-9 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[13px] font-medium text-[#475569] hover:bg-[#f8fafc]">
                            Export
                        </button>
                        <button type="button" className="h-9 rounded-[4px] border border-[#d4dde6] bg-white px-3 text-[13px] font-medium text-[#475569] hover:bg-[#f8fafc]">
                            Bulk Actions
                        </button>
                        <button type="button" onClick={() => window.location.reload()} className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#d4dde6] bg-white text-[#64748b] hover:bg-[#f8fafc]">
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-full rounded-[4px] border border-[#d4dde6] bg-white pl-9 pr-8 text-[13px] text-[#475569] outline-none transition focus:border-[#94a3b8] sm:w-80"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        {searchTerm && (
                            <button type="button" onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
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

            {showImport && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-sm">
                    <button type="button" aria-label="Close import panel" className="absolute inset-0" onClick={() => setShowImport(false)} />
                    <div className="relative h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Bulk intake</p>
                                <h2 className="text-xl font-black text-brand-navy">Import leads from CSV</h2>
                            </div>
                            <button type="button" onClick={() => setShowImport(false)} className="rounded-sm border border-slate-200 p-2 text-slate-500 hover:text-brand-navy">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form action={handleImportLeads} className="space-y-5 p-6">
                            <div className="border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-navy">Accepted columns</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Required: <strong>email</strong> and either <strong>first_name</strong> or <strong>name</strong>.
                                    Optional: last_name, phone, company, status, source, priority, value, service_interest,
                                    notes, next_follow_up.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <SelectField label="Default owner" name="assignedTo" defaultValue="">
                                    <option value="">Assign to me</option>
                                    {staff.map((person) => <option key={person.id} value={person.id}>{person.name || person.email}</option>)}
                                </SelectField>
                                <SelectField label="Default source" name="source" defaultValue="csv_import">
                                    <option value="csv_import">CSV import</option>
                                    <option value="website">Website</option>
                                    <option value="referral">Referral</option>
                                    <option value="ads">Ads</option>
                                    <option value="campaign">Campaign</option>
                                    <option value="manual">Manual</option>
                                </SelectField>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Upload CSV file</label>
                                <input
                                    type="file"
                                    accept=".csv,text/csv"
                                    onChange={(event) => handleCsvFile(event.target.files?.[0] || null)}
                                    className="mt-1.5 block w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-sm file:border-0 file:bg-brand-navy file:px-3 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-[0.12em] file:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">CSV content</label>
                                <textarea
                                    value={csvText}
                                    onChange={(event) => setCsvText(event.target.value)}
                                    rows={12}
                                    placeholder={'name,email,phone,company,source,service_interest,value,notes\nJane Doe,jane@example.com,+1 555 0000,Acme,referral,Website redesign,2500,Needs callback'}
                                    className="mt-1.5 w-full rounded-sm border border-slate-200 p-3 font-mono text-xs leading-5 text-slate-700 outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
                                />
                            </div>

                            {importResult && (
                                <div className={`border p-4 text-sm ${importResult.success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                                    {importResult.success ? (
                                        <div>
                                            <p className="font-black">Import complete. Refreshing CRM...</p>
                                            <p className="mt-1">Created {importResult.created || 0}, updated {importResult.updated || 0}, skipped {importResult.skipped || 0}.</p>
                                            {importResult.errors && importResult.errors.length > 0 && (
                                                <p className="mt-2 text-xs">{importResult.errors.join(' | ')}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="font-bold">{importResult.error || 'Import failed'}</p>
                                    )}
                                </div>
                            )}

                            <button
                                disabled={!csvText.trim() || isPending}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-brand-navy px-4 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-brand-gold hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Upload className="h-4 w-4" />
                                {isPending ? 'Importing...' : 'Import Leads'}
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
            <table className="w-full min-w-[980px] border-collapse text-left text-[13px]">
                <thead className="border-b border-[#e5eaf0] bg-[#f7f9fb] text-[12px] font-semibold text-[#475569]">
                    <tr>
                        <th className="w-10 border-r border-[#e5eaf0] px-3 py-3">
                            <button type="button" onClick={onToggleSelectAll} className="text-slate-400 hover:text-brand-navy">
                                {selectedIds.size === leads.length && leads.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                            </button>
                        </th>
                        <th className="w-14 border-r border-[#e5eaf0] px-3 py-3">#</th>
                        <th className="border-r border-[#e5eaf0] px-3 py-3">Name</th>
                        <th className="border-r border-[#e5eaf0] px-3 py-3">Company</th>
                        <th className="border-r border-[#e5eaf0] px-3 py-3">Email</th>
                        <th className="border-r border-[#e5eaf0] px-3 py-3">Phone</th>
                        <th className="border-r border-[#e5eaf0] px-3 py-3">Value</th>
                        <th className="border-r border-[#e5eaf0] px-3 py-3">Tags</th>
                        <th className="border-r border-[#e5eaf0] px-3 py-3">Assigned</th>
                        <th className="px-3 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead, index) => (
                        <tr key={lead.id} className={`border-b border-[#edf1f5] ${selectedIds.has(lead.id) ? 'bg-[#eff6ff]' : 'bg-white hover:bg-[#f8fafc]'}`}>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top">
                                <button type="button" onClick={() => onToggleSelect(lead.id)} className="text-[#b8c2cc] hover:text-[#334155]">
                                    {selectedIds.has(lead.id) ? <CheckSquare className="h-4 w-4 text-brand-navy" /> : <Square className="h-4 w-4" />}
                                </button>
                            </td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top font-medium text-[#475569]">{index + 1}</td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top">
                                <Link href={`/admin/crm/${lead.id}`} className="font-medium text-[#334155] hover:text-[#0f172a] hover:underline">{lead.firstName} {lead.lastName}</Link>
                                {view === 'quotes' && <p className="mt-1 max-w-48 truncate text-[12px] text-[#64748b]">{lead.serviceInterest || 'Quote request'}</p>}
                            </td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top text-[#475569]">{lead.company || '-'}</td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top text-[#475569]">{lead.email}</td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top text-[#475569]">{lead.phone || '-'}</td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top font-medium text-[#475569]">${Number(lead.value || 0).toLocaleString()}</td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top">
                                <div className="flex flex-wrap gap-1">
                                    {lead.source && <Badge>{formatLabel(lead.source)}</Badge>}
                                    {lead.priority && <Badge tone={lead.priority === 'high' ? 'urgent' : 'default'}>{lead.priority}</Badge>}
                                    {isQuoteLead(lead) && <Badge tone="gold">quote</Badge>}
                                </div>
                            </td>
                            <td className="border-r border-[#edf1f5] px-3 py-3 align-top">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#d8e0ea] text-[11px] font-semibold text-white">
                                        {ownerInitial(lead)}
                                    </span>
                                    <span className="max-w-28 truncate text-[12px] text-[#64748b]">{lead.assignedToName || lead.assignedToEmail || 'Unassigned'}</span>
                                </div>
                            </td>
                            <td className="px-3 py-3 align-top">
                                <select value={lead.status || 'new'} onChange={(event) => onStatusChange(lead.id, event.target.value)} className={`h-8 rounded-[4px] border px-2 text-[12px] font-medium outline-none ${statusSelectStyle(lead.status || 'new')}`}>
                                    {columns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {leads.length === 0 && <EmptyState title="No matching leads" body="Adjust your filters or add a new lead to start building the pipeline." />}
        </div>
    );
}

function ViewButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className={`inline-flex h-9 items-center gap-1.5 rounded-[4px] border px-3 text-[13px] font-medium shadow-sm transition ${active ? 'border-[#cbd5e1] bg-[#e9eef4] text-[#334155]' : 'border-[#d4dde6] bg-white text-[#64748b] hover:bg-[#f8fafc] hover:text-[#334155]'}`}>
            {icon}
            {label}
        </button>
    );
}

function StatusChip({
    label,
    count,
    tone,
}: {
    label: string;
    count: number;
    tone: string;
    active?: boolean;
}) {
    const style = statusChipStyle(tone);
    return (
        <button type="button" className={`inline-flex h-7 items-center rounded-[5px] border px-2.5 text-[12px] font-medium shadow-sm ${style}`}>
            <span className="mr-1 font-semibold">{count}</span>
            {label}
        </button>
    );
}

function statusChipStyle(status: string) {
    switch (status) {
        case 'new':
            return 'border-[#d8e0e8] bg-white text-[#475569]';
        case 'contacted':
            return 'border-[#d8e0e8] bg-white text-[#475569]';
        case 'qualified':
            return 'border-[#d8e0e8] bg-white text-[#475569]';
        case 'proposal':
            return 'border-[#d8e0e8] bg-white text-[#475569]';
        case 'won':
            return 'border-[#d8ebc6] bg-[#fbfff6] text-[#65a30d]';
        case 'lost':
            return 'border-[#f5c2c7] bg-[#fff7f7] text-[#dc2626]';
        default:
            return 'border-[#d8e0e8] bg-white text-[#475569]';
    }
}

function statusSelectStyle(status: string) {
    switch (status) {
        case 'won':
            return 'border-[#d8ebc6] bg-[#fbfff6] text-[#65a30d]';
        case 'lost':
            return 'border-[#f5c2c7] bg-[#fff7f7] text-[#dc2626]';
        case 'proposal':
            return 'border-[#d7e3f1] bg-[#f8fbff] text-[#475569]';
        default:
            return 'border-[#d4dde6] bg-white text-[#475569]';
    }
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
        ? 'bg-[#fff1f2] text-[#dc2626] border-[#fecdd3]'
        : tone === 'gold'
            ? 'bg-[#fefce8] text-[#a16207] border-[#fef08a]'
            : 'bg-[#f8fafc] text-[#64748b] border-[#dce3ea]';
    return <span className={`inline-flex rounded-[4px] border px-2 py-0.5 text-[11px] font-medium capitalize ${style}`}>{children}</span>;
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
